from django.contrib.auth import authenticate, get_user_model
from django.db import IntegrityError
from django.db.models import Count, F
from django.http import Http404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .authentication import JWTAuthentication, encode_jwt
from .models import Comment, CommentLike, Listing
from .serializers import (
    CommentCreateSerializer,
    CommentSerializer,
    ListingResolveSerializer,
    ListingSerializer,
    LoginSerializer,
    RegisterSerializer,
    TokenSerializer,
    UserPublicSerializer,
)
from .utils import fetch_avito_meta


User = get_user_model()


def _parse_limit_offset(request):
    try:
        limit = int(request.query_params.get("limit", 20))
    except Exception:
        limit = 20
    try:
        offset = int(request.query_params.get("offset", 0))
    except Exception:
        offset = 0
    if limit <= 0:
        limit = 20
    if limit > 100:
        limit = 100
    if offset < 0:
        offset = 0
    return limit, offset


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data["username"].strip()
        password = serializer.validated_data["password"]
        try:
            user = User.objects.create_user(username=username, password=password)
        except IntegrityError:
            return Response({"detail": "Username already taken."}, status=400)
        token = encode_jwt({"uid": user.id, "username": user.username})
        data = TokenSerializer({"token": token, "user": user}).data
        return Response(data, status=201)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data["username"].strip()
        password = serializer.validated_data["password"]
        user = authenticate(request, username=username, password=password)
        if not user:
            return Response({"detail": "Invalid credentials."}, status=400)
        token = encode_jwt({"uid": user.id, "username": user.username})
        data = TokenSerializer({"token": token, "user": user}).data
        return Response(data)


class MeView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserPublicSerializer(request.user).data)


class ListingListView(APIView):
    def get(self, request):
        ordering_param = request.query_params.get("ordering", "-view_count")
        allowed = {"-view_count", "created_at", "-created_at"}
        if ordering_param not in allowed:
            ordering_param = "-view_count"
        limit, offset = _parse_limit_offset(request)

        qs = Listing.objects.all().order_by(ordering_param)[offset : offset + limit]
        data = [
            ListingSerializer(
                {
                    "id": obj.id,
                    "url": obj.url,
                    "title": obj.title,
                    "image_url": obj.image_url,
                    "view_count": obj.view_count,
                    "created_at": obj.created_at,
                }
            ).data
            for obj in qs
        ]
        return Response({"results": data, "count": Listing.objects.count()})


class ListingResolveView(APIView):
    def post(self, request):
        serializer = ListingResolveSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        url = serializer.validated_data["url"].strip()

        try:
            listing = Listing.objects.get(url=url)
            created = False
        except Listing.DoesNotExist:
            meta = fetch_avito_meta(url)
            title = (meta.get("title") or "").strip()
            image_url = meta.get("image_url")
            try:
                listing = Listing.objects.create(url=url, title=title, image_url=image_url)
                created = True
            except IntegrityError:
                # race condition: created by another request
                listing = Listing.objects.get(url=url)
                created = False

        data = ListingSerializer(
            {
                "id": listing.id,
                "url": listing.url,
                "title": listing.title,
                "image_url": listing.image_url,
                "view_count": listing.view_count,
                "created_at": listing.created_at,
            }
        ).data
        status_code = 201 if created else 200
        return Response(data, status=status_code)


class ListingDetailView(APIView):
    def get_object(self, id: int) -> Listing:
        try:
            return Listing.objects.get(id=id)
        except Listing.DoesNotExist:
            raise Http404

    def get(self, request, id: int):
        # Increment view_count atomically
        updated = Listing.objects.filter(id=id).update(view_count=F("view_count") + 1)
        if not updated:
            raise Http404
        obj = self.get_object(id)
        data = ListingSerializer(
            {
                "id": obj.id,
                "url": obj.url,
                "title": obj.title,
                "image_url": obj.image_url,
                "view_count": obj.view_count,
                "created_at": obj.created_at,
            }
        ).data
        return Response(data)


class ListingCommentsView(APIView):
    def get_listing(self, id: int) -> Listing:
        try:
            return Listing.objects.get(id=id)
        except Listing.DoesNotExist:
            raise Http404

    def get(self, request, id: int):
        _ = self.get_listing(id)
        ordering_param = request.query_params.get("ordering", "-created_at")
        qs = Comment.objects.filter(listing_id=id, is_approved=True).annotate(
            likes_count=Count("likes")
        )
        if ordering_param == "-likes":
            qs = qs.order_by("-likes_count", "-created_at")
        elif ordering_param == "-created_at":
            qs = qs.order_by("-created_at")
        elif ordering_param == "created_at":
            qs = qs.order_by("created_at")
        else:
            qs = qs.order_by("-created_at")

        data = [
            CommentSerializer(
                {
                    "id": c.id,
                    "user": c.user,
                    "text": c.text,
                    "likes_count": getattr(c, "likes_count", 0),
                    "is_approved": c.is_approved,
                    "created_at": c.created_at,
                }
            ).data
            for c in qs
        ]
        return Response({"results": data, "count": qs.count()})

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, id: int):
        # ensure listing exists
        _ = self.get_listing(id)
        serializer = CommentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        comment = Comment.objects.create(
            listing_id=id,
            user=request.user,
            text=serializer.validated_data["text"],
            is_approved=False,
        )
        read_data = CommentSerializer(
            {
                "id": comment.id,
                "user": comment.user,
                "text": comment.text,
                "likes_count": 0,
                "is_approved": comment.is_approved,
                "created_at": comment.created_at,
            }
        ).data
        return Response({"comment": read_data, "message": "Comment submitted and pending moderation."}, status=201)


class CommentLikeToggleView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, id: int):
        try:
            comment = Comment.objects.get(id=id)
        except Comment.DoesNotExist:
            raise Http404

        like, created = CommentLike.objects.get_or_create(comment=comment, user=request.user)
        if not created:
            # already liked -> unlike
            like.delete()
            liked = False
        else:
            liked = True

        likes_count = CommentLike.objects.filter(comment=comment).count()
        return Response({"liked": liked, "likes_count": likes_count})
