from django.urls import path

from .views import (
    CommentLikeToggleView,
    ListingCommentsView,
    ListingDetailView,
    ListingListView,
    ListingResolveView,
    LoginView,
    MeView,
    RegisterView,
)

urlpatterns = [
    # Auth
    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/me/", MeView.as_view(), name="auth-me"),

    # Listings
    path("listings/", ListingListView.as_view(), name="listing-list"),
    path("listings/resolve/", ListingResolveView.as_view(), name="listing-resolve"),
    path("listings/<int:id>/", ListingDetailView.as_view(), name="listing-detail"),

    # Comments
    path("listings/<int:id>/comments/", ListingCommentsView.as_view(), name="listing-comments"),
    path("comments/<int:id>/like/", CommentLikeToggleView.as_view(), name="comment-like-toggle"),
]
