from django.contrib.auth.models import User
from rest_framework import serializers


class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class ListingSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    url = serializers.URLField()
    title = serializers.CharField(allow_blank=True, required=False)
    image_url = serializers.URLField(allow_null=True, required=False)
    view_count = serializers.IntegerField(read_only=True)
    created_at = serializers.DateTimeField()


class ListingResolveSerializer(serializers.Serializer):
    url = serializers.URLField()


class CommentSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    user = UserPublicSerializer(read_only=True)
    text = serializers.CharField()
    likes_count = serializers.IntegerField(read_only=True, default=0)
    is_approved = serializers.BooleanField(read_only=True)
    created_at = serializers.DateTimeField()


class CommentCreateSerializer(serializers.Serializer):
    text = serializers.CharField()

    def validate_text(self, value: str) -> str:
        if not value or not value.strip():
            raise serializers.ValidationError("Text must not be empty.")
        return value.strip()


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate_username(self, value: str) -> str:
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Username must not be empty.")
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken.")
        return value

    def validate_password(self, value: str) -> str:
        if not value:
            raise serializers.ValidationError("Password must not be empty.")
        if len(value) < 4:
            raise serializers.ValidationError("Password is too short.")
        return value


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class TokenSerializer(serializers.Serializer):
    token = serializers.CharField()
    user = UserPublicSerializer()
