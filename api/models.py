from django.conf import settings
from django.db import models


class Listing(models.Model):
    url = models.URLField(max_length=1000, unique=True)
    title = models.CharField(max_length=500, blank=True, default="")
    image_url = models.URLField(max_length=1000, blank=True, null=True)
    view_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"Listing #{self.pk}: {self.title or self.url}"


class Comment(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comments")
    text = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"Comment #{self.pk} on Listing #{self.listing_id} by {self.user_id}"


class CommentLike(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name="likes")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comment_likes")

    class Meta:
        unique_together = ("comment", "user")

    def __str__(self) -> str:
        return f"Like by {self.user_id} on Comment #{self.comment_id}"
