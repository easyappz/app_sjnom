import base64
import hashlib
import hmac
import json
import time
from typing import Any, Dict, Optional, Tuple

from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed


def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _b64url_decode(data: str) -> bytes:
    padding = '=' * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def encode_jwt(payload: Dict[str, Any], exp_minutes: int = 60 * 24 * 7) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    payload = dict(payload)
    payload["exp"] = int(time.time()) + int(exp_minutes * 60)

    header_b64 = _b64url_encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    payload_b64 = _b64url_encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signing_input = f"{header_b64}.{payload_b64}".encode("ascii")
    signature = hmac.new(settings.SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
    signature_b64 = _b64url_encode(signature)
    return f"{header_b64}.{payload_b64}.{signature_b64}"


def decode_jwt(token: str) -> Dict[str, Any]:
    try:
        header_b64, payload_b64, signature_b64 = token.split(".")
    except ValueError:
        raise AuthenticationFailed("Invalid token format.")

    signing_input = f"{header_b64}.{payload_b64}".encode("ascii")
    expected_sig = hmac.new(settings.SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
    try:
        provided_sig = _b64url_decode(signature_b64)
    except Exception:
        raise AuthenticationFailed("Invalid token signature.")

    if not hmac.compare_digest(expected_sig, provided_sig):
        raise AuthenticationFailed("Invalid token signature.")

    try:
        payload = json.loads(_b64url_decode(payload_b64).decode("utf-8"))
    except Exception:
        raise AuthenticationFailed("Invalid token payload.")

    exp = payload.get("exp")
    if not isinstance(exp, int) or time.time() >= exp:
        raise AuthenticationFailed("Token has expired.")

    return payload


class JWTAuthentication(BaseAuthentication):
    keyword = "Bearer"

    def authenticate(self, request) -> Optional[Tuple[Any, str]]:
        auth_header = request.META.get("HTTP_AUTHORIZATION", "").strip()
        if not auth_header:
            return None

        parts = auth_header.split()
        if len(parts) != 2 or parts[0] != self.keyword:
            raise AuthenticationFailed("Invalid Authorization header.")

        token = parts[1]
        payload = decode_jwt(token)
        uid = payload.get("uid")
        if not uid:
            raise AuthenticationFailed("Invalid token payload.")

        User = get_user_model()
        try:
            user = User.objects.get(id=uid)
        except User.DoesNotExist:
            raise AuthenticationFailed("User not found.")

        return (user, token)
