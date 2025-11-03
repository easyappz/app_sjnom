from django.contrib import admin

from .models import Comment, CommentLike, Listing


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "url", "view_count", "created_at")
    search_fields = ("title", "url")
    list_filter = ("created_at",)
    ordering = ("-created_at",)


@admin.action(description="Approve selected comments")
def approve_comments(modeladmin, request, queryset):
    queryset.update(is_approved=True)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "listing", "user", "is_approved", "created_at")
    list_filter = ("is_approved", "created_at", "listing")
    search_fields = ("text",)
    actions = [approve_comments]
    ordering = ("-created_at",)


@admin.register(CommentLike)
class CommentLikeAdmin(admin.ModelAdmin):
    list_display = ("id", "comment", "user")
    search_fields = ("comment__text", "user__username")
    list_filter = ("comment__listing",)
