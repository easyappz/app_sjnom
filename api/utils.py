from html.parser import HTMLParser
from typing import Dict, Optional
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


class _OGMetaParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.title: Optional[str] = None
        self.image: Optional[str] = None

    def handle_starttag(self, tag, attrs):
        if tag.lower() != "meta":
            return
        attrs_dict = {k.lower(): v for k, v in attrs}
        key = (attrs_dict.get("property") or attrs_dict.get("name") or "").lower()
        if key == "og:title" and not self.title:
            self.title = attrs_dict.get("content")
        elif key == "og:image" and not self.image:
            self.image = attrs_dict.get("content")


def fetch_avito_meta(url: str) -> Dict[str, Optional[str]]:
    """Fetch og:title and og:image from the given URL.

    Returns dict with keys: title, image_url. Any of them may be None on failure.
    Never raises; swallows network/HTTP errors.
    """
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        )
    }
    req = Request(url, headers=headers, method="GET")
    parser = _OGMetaParser()
    try:
        with urlopen(req, timeout=7) as resp:
            if getattr(resp, "status", 200) != 200:
                return {"title": None, "image_url": None}
            content_type = resp.headers.get("Content-Type", "")
            charset = "utf-8"
            if "charset=" in content_type:
                charset = content_type.split("charset=")[-1].split(";")[0].strip()
            html = resp.read().decode(charset, errors="ignore")
            parser.feed(html)
    except (HTTPError, URLError, TimeoutError, ValueError):
        return {"title": None, "image_url": None}
    except Exception:
        # Never propagate unexpected parsing/network errors
        return {"title": None, "image_url": None}

    return {"title": parser.title, "image_url": parser.image}
