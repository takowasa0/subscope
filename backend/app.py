import json
import os
import re
import secrets
import time
import urllib.parse
from pathlib import Path

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, redirect, request, send_from_directory, session


BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

DATA_DIR = Path(os.environ.get("DATA_DIR", BASE_DIR / "data"))
DATA_FILE = DATA_DIR / "channels.json"
VIDEOS_FILE = DATA_DIR / "videos.json"
LIKED_VIDEOS_FILE = DATA_DIR / "liked_videos.json"

app = Flask(__name__, static_folder=str(BASE_DIR), static_url_path="")
app.secret_key = os.environ.get("FLASK_SECRET_KEY", secrets.token_hex(32))
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=os.environ.get("APP_BASE_URL", "").startswith("https://"),
)

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo"
YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"
SCOPES = [
    "openid",
    "email",
    "profile",
    "https://www.googleapis.com/auth/youtube.readonly",
]

GENRES = {
    "it": {
        "label": "IT",
        "keywords": ["tech", "technology", "programming", "programmer", "software", "code", "\u30ac\u30b8\u30a7\u30c3\u30c8", "\u958b\u767a", "python", "react", "\u30a8\u30f3\u30b8\u30cb\u30a2", "\u30b3\u30f3\u30d4\u30e5\u30fc\u30bf", "\u30d7\u30ed\u30b0\u30e9\u30df\u30f3\u30b0"],
    },
    "nba": {"label": "NBA", "keywords": ["nba", "basket", "\u30d0\u30b9\u30b1", "lakers", "warriors", "be a baller", "\u30ec\u30a4\u30ab\u30fc\u30ba", "\u30a6\u30a9\u30ea\u30a2\u30fc\u30ba"]},
    "sports": {"label": "\u30b9\u30dd\u30fc\u30c4", "keywords": ["sports", "espn", "\u30b9\u30dd\u30fc\u30c4", "\u91ce\u7403", "\u30b5\u30c3\u30ab\u30fc", "\u30a2\u30b9\u30ea\u30fc\u30c8"]},
    "game": {"label": "\u30b2\u30fc\u30e0", "keywords": ["game", "gaming", "\u30b2\u30fc\u30e0", "dq", "dqx", "\u30c9\u30e9\u30b4\u30f3", "\u5b9f\u6cc1", "riddle", "mkr", "\u30dd\u30b1\u30e2\u30f3", "\u30de\u30ea\u30aa", "\u4efb\u5929\u5802", "nintendo", "apex", "apex legends", "\u30b9\u30fc\u30d1\u30fc\u30de\u30ea\u30aa", "\u30de\u30ea\u30aa\u30e1\u30fc\u30ab\u30fc", "\u30b9\u30fc\u30d1\u30fc\u30de\u30ea\u30aa\u30e1\u30fc\u30ab\u30fc"]},
    "horse": {"label": "\u7af6\u99ac", "keywords": ["\u7af6\u99ac", "\u99ac\u5238", "\u4e88\u60f3", "\u30de\u30a4\u30eb\u30ab\u30c3\u30d7", "nhk\u30de\u30a4\u30eb", "\u30a8\u30eb\u30b3\u30f3\u30c9\u30eb", "\u30c0\u30a4\u30e4\u30e2\u30f3\u30c9\u30ce\u30c3\u30c8", "\u5168\u982d\u8a3a\u65ad"]},
    "diy": {"label": "DIY/\u81ea\u4f5c", "keywords": ["diy", "\u81ea\u4f5c", "\u5de5\u4f5c", "\u7d44\u307f\u7acb\u3066", "\u6539\u9020", "\u5efa\u9020", "\u81ea\u4f5cpc", "pc\u5efa\u9020", "\u30b0\u30e9\u30dc", "rtx", "blackwell"]},
    "manga": {"label": "\u6f2b\u753b/\u30a2\u30cb\u30e1", "keywords": ["\u6f2b\u753b", "\u30de\u30f3\u30ac", "\u30a2\u30cb\u30e1", "\u30ca\u30eb\u30c8", "naruto", "\u30b8\u30e3\u30f3\u30d7", "\u30ef\u30f3\u30d4\u30fc\u30b9", "\u9b3c\u6ec5", "\u30d2\u30ed\u30a2\u30ab"]},
    "law": {"label": "\u6cd5\u5f8b", "keywords": ["\u6cd5\u5f8b", "\u5f01\u8b77\u58eb", "\u52b4\u50cd\u6cd5", "\u88c1\u5224", "\u6cd5\u5ef7", "\u4e8b\u4ef6"]},
    "medical": {"label": "\u533b\u7642/\u7f8e\u5bb9", "keywords": ["\u533b\u7642", "\u533b\u5b66", "\u533b\u5e2b", "\u30af\u30ea\u30cb\u30c3\u30af", "\u7f8e\u5bb9", "\u7f8e\u4eba", "\u6574\u5f62", "\u9f3b\u6574\u5f62", "\u9f3b", "\u8f2a\u90ed", "\u9ad8\u9808", "\u5065\u5eb7", "\u4e88\u9632"]},
    "restaurant": {"label": "\u98f2\u98df\u5e97", "keywords": ["\u98f2\u98df\u5e97", "\u30e9\u30fc\u30e1\u30f3", "\u30b0\u30eb\u30e1", "\u3046\u307e\u3044", "\u30a6\u30de\u3044", "\u8d85\u7d76\u30a6\u30de\u3044", "\u98df\u3079\u6b69\u304d", "\u5c45\u9152\u5c4b", "\u30ab\u30d5\u30a7"]},
    "trivia": {"label": "\u96d1\u5b66", "keywords": ["\u96d1\u5b66", "\u8c46\u77e5\u8b58", "\u8ab0\u304b\u306b\u8a71\u3057\u305f\u304f\u306a\u308b", "\u5f79\u7acb\u3064\u96d1\u5b66", "\u604b\u611b\u96d1\u5b66"]},
    "board": {"label": "2\u3061\u3083\u3093\u306d\u308b", "keywords": ["2ch", "2\u3061\u3083\u3093", "2\u3061\u3083\u3093\u306d\u308b", "\u30b9\u30ec", "\u9762\u767d\u3044\u30b9\u30ec", "\u306a\u3093g", "\u306a\u3093j", "\u304a\u3093j"]},
    "quote": {"label": "\u540d\u8a00", "keywords": ["\u540d\u8a00", "\u540d\u8a00\u96c6", "\u8a00\u8449\u306e\u30c1\u30ab\u30e9", "\u52c7\u6c17\u3092\u304f\u308c\u308b", "\u30de\u30c4\u30b3", "\u81ea\u4fe1", "\u5f53\u305f\u308a\u524d"]},
    "entertainment": {"label": "\u30a8\u30f3\u30bf\u30e1", "keywords": ["\u30a8\u30f3\u30bf\u30e1", "\u304a\u7b11\u3044", "\u82b8\u4eba", "\u30c6\u30ec\u30d3", "nobrock", "\u6771\u6d77\u30aa\u30f3\u30a8\u30a2", "\u4f50\u4e45\u9593", "\u5207\u308a\u629c\u304d", "vtuber", "\u30a2\u30cb\u30e1"]},
    "science": {"label": "\u79d1\u5b66", "keywords": ["\u79d1\u5b66", "\u7269\u7406", "\u6570\u5b66", "\u7d71\u8a08\u5b66", "\u5de5\u5b66", "\u7406\u7cfb", "\u30c7\u30fc\u30bf\u30b5\u30a4\u30a8\u30f3\u30b9", "\u5927\u5b66\u306e\u6570\u5b66", "\u3086\u3063\u304f\u308a\u79d1\u5b66", "yobinori"]},
    "business": {"label": "\u30d3\u30b8\u30cd\u30b9", "keywords": ["\u30d3\u30b8\u30cd\u30b9", "\u5e74\u53ce", "\u7d4c\u6e08", "\u6295\u8cc7", "\u30de\u30fc\u30b1\u30c3\u30c8", "\u30ad\u30e3\u30ea\u30a2", "\u4ed5\u4e8b"]},
    "music": {"label": "\u97f3\u697d", "keywords": ["music", "bgm", "ost", "soundtrack", "playlist", "piano", "guitar", "cover", "lofi", "\u97f3\u697d", "\u6b4c", "dtm", "beats", "\u30b5\u30f3\u30c8\u30e9", "\u4f5c\u696d\u7528", "\u97f3\u697d\u96c6", "\u697d\u66f2"]},
    "study": {"label": "\u5b66\u7fd2", "keywords": ["study", "english", "\u82f1\u8a9e", "\u82f1\u4f1a\u8a71", "\u5927\u5b66", "\u52c9\u5f37", "\u89e3\u8aac", "\u8b1b\u5ea7", "\u8cc7\u683c", "\u8a66\u9a13", "\u8a00\u8a9e\u5b66", "\u6388\u696d"]},
    "cooking": {"label": "\u6599\u7406", "keywords": ["cook", "recipe", "\u6599\u7406", "\u3054\u306f\u3093", "\u30ad\u30c3\u30c1\u30f3", "\u30ec\u30b7\u30d4"]},
    "news": {"label": "\u30cb\u30e5\u30fc\u30b9", "keywords": ["news", "\u30cb\u30e5\u30fc\u30b9", "\u653f\u6cbb", "\u901f\u5831"]},
    "life": {"label": "\u66ae\u3089\u3057", "keywords": ["vlog", "\u66ae\u3089\u3057", "\u65c5\u884c", "\u751f\u6d3b", "\u8cb7\u3063\u3066\u3088\u304b\u3063\u305f", "\u30ab\u30d5\u30a7"]},
    "unknown": {"label": "\u672a\u5206\u985e", "keywords": []},
}

OVERRIDE_RULES = [
    ("NBA", "nba"),
    ("Be a baller", "nba"),
    ("\u30cf\u30ec\u30eb\u30e4", "nba"),
    ("Dallas Mavericks", "nba"),
    ("Mavericks", "nba"),
    ("ESPN", "sports"),
    ("MKR", "game"),
    ("\u30de\u30ea\u30aa", "game"),
    ("\u4efb\u5929\u5802", "game"),
    ("Nintendo", "game"),
    ("APEX", "game"),
    ("Apex Legends", "game"),
    ("\u30b9\u30fc\u30d1\u30fc\u30de\u30ea\u30aa\u30e1\u30fc\u30ab\u30fc", "game"),
    ("\u30de\u30ea\u30aa\u30e1\u30fc\u30ab\u30fc", "game"),
    ("\u7af6\u99ac", "horse"),
    ("\u99ac\u5238", "horse"),
    ("NHK\u30de\u30a4\u30eb", "horse"),
    ("\u30de\u30a4\u30eb\u30ab\u30c3\u30d7", "horse"),
    ("\u81ea\u4f5cPC", "diy"),
    ("PC\u5efa\u9020", "diy"),
    ("\u30b0\u30e9\u30dc", "diy"),
    ("RTX", "diy"),
    ("Blackwell", "diy"),
    ("\u30ca\u30eb\u30c8", "manga"),
    ("NARUTO", "manga"),
    ("\u6f2b\u753b", "manga"),
    ("\u7f8e\u5bb9", "medical"),
    ("\u7f8e\u4eba", "medical"),
    ("\u6574\u5f62", "medical"),
    ("\u9f3b\u6574\u5f62", "medical"),
    ("\u30e9\u30fc\u30e1\u30f3", "restaurant"),
    ("\u30b0\u30eb\u30e1", "restaurant"),
    ("\u98f2\u98df\u5e97", "restaurant"),
    ("\u98df\u3079\u6b69\u304d", "restaurant"),
    ("\u96d1\u5b66", "trivia"),
    ("\u8ab0\u304b\u306b\u8a71\u3057\u305f\u304f\u306a\u308b", "trivia"),
    ("2ch", "board"),
    ("2\u3061\u3083\u3093", "board"),
    ("\u30b9\u30ec", "board"),
    ("\u306a\u3093G", "board"),
    ("\u540d\u8a00", "quote"),
    ("\u540d\u8a00\u96c6", "quote"),
    ("\u8a00\u8449\u306e\u30c1\u30ab\u30e9", "quote"),
    ("AppleWatch", "it"),
    ("Apple Watch", "it"),
    ("iPod", "it"),
    ("\u30ac\u30b8\u30a7\u30c3\u30c8", "it"),
    ("\u30ec\u30c8\u30eb\u30c8", "game"),
    ("\u30ad\u30e8", "game"),
    ("\u30b9\u30af\u30a6\u30a7\u30a2", "game"),
    ("\u30b9\u30af\u30a8\u30cb", "game"),
    ("Ado", "music"),
    ("MAISONdes", "music"),
    ("BGM", "music"),
    ("OST", "music"),
    ("soundtrack", "music"),
    ("\u30b5\u30f3\u30c8\u30e9", "music"),
    ("\u4f5c\u696d\u7528", "music"),
    ("\u30d4\u30a2\u30ce", "music"),
    ("\u82f1\u4f1a\u8a71", "study"),
    ("\u8a66\u9a13", "study"),
    ("\u57fa\u672c\u60c5\u5831", "study"),
    ("\u6599\u7406", "cooking"),
    ("\u6771\u6d77\u30aa\u30f3\u30a8\u30a2", "entertainment"),
    ("NOBROCK", "entertainment"),
    ("\u4f50\u4e45\u9593", "entertainment"),
    ("\u52a0\u85e4\u7d14\u4e00", "entertainment"),
    ("\u5207\u308a\u629c\u304d", "entertainment"),
    ("\u30d2\u30ab\u30ad\u30f3", "entertainment"),
    ("\u3072\u308d\u3086\u304d", "business"),
    ("\u5e74\u53ce", "business"),
    ("\u9ad8\u9808", "medical"),
    ("\u30af\u30ea\u30cb\u30c3\u30af", "medical"),
    ("\u5f01\u8b77\u58eb", "law"),
    ("\u52b4\u50cd\u6cd5", "law"),
    ("\u3086\u308b\u8a00\u8a9e\u5b66", "study"),
    ("\u3086\u308b\u30b3\u30f3\u30d4\u30e5\u30fc\u30bf", "science"),
    ("\u3086\u3063\u304f\u308a\u79d1\u5b66", "science"),
    ("yobinori", "science"),
    ("\u30c6\u30eb\u30bf", "science"),
]


@app.after_request
def add_dev_cors_headers(response):
    origin = request.headers.get("Origin")
    allowed_origins = {
        "http://127.0.0.1:5000",
        "http://127.0.0.1:5173",
        "http://localhost:5000",
        "http://localhost:5173",
    }
    if origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,PATCH,OPTIONS"
    return response


def redirect_uri():
    return os.environ.get("GOOGLE_REDIRECT_URI", "http://127.0.0.1:5000/auth/callback")


def require_config():
    missing = [
        key
        for key in ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"]
        if not os.environ.get(key)
    ]
    return missing


def token_is_expired():
    return not session.get("access_token") or time.time() > session.get("expires_at", 0) - 60


def refresh_access_token():
    refresh_token = session.get("refresh_token")
    if not refresh_token:
        return False

    response = requests.post(
        GOOGLE_TOKEN_URL,
        data={
            "client_id": os.environ["GOOGLE_CLIENT_ID"],
            "client_secret": os.environ["GOOGLE_CLIENT_SECRET"],
            "refresh_token": refresh_token,
            "grant_type": "refresh_token",
        },
        timeout=20,
    )
    if not response.ok:
        return False

    payload = response.json()
    session["access_token"] = payload["access_token"]
    session["expires_at"] = time.time() + payload.get("expires_in", 3600)
    return True


def authorized_headers():
    if token_is_expired() and not refresh_access_token():
        return None
    return {"Authorization": f"Bearer {session['access_token']}"}


def fetch_google_profile():
    headers = authorized_headers()
    if headers is None:
        return

    response = requests.get(GOOGLE_USERINFO_URL, headers=headers, timeout=20)
    if not response.ok:
        return

    profile = response.json()
    session["user_name"] = profile.get("name") or profile.get("email")
    session["user_email"] = profile.get("email")
    session["user_picture"] = profile.get("picture")


def classify_channel(name, description, tags=None):
    tags = tags or []
    raw_text = " ".join([name, description, *tags])
    text = raw_text.lower()
    name_text = name.lower()

    for needle, genre in OVERRIDE_RULES:
        if needle.lower() in name_text:
            return {"genre": genre, "confidence": 96}

    scores = []
    for key, genre in GENRES.items():
        if key == "unknown":
            continue
        score = 0
        for keyword in genre["keywords"]:
            keyword_lower = keyword.lower()
            if keyword_lower.isascii():
                if re.search(rf"(?<![a-z0-9]){re.escape(keyword_lower)}(?![a-z0-9])", text):
                    score += 3 if len(keyword_lower) >= 4 else 1
            elif keyword_lower in text:
                score += 3
        scores.append((key, score))

    best_key, best_score = max(scores, key=lambda item: item[1])
    if best_score < 3:
        return {"genre": "unknown", "confidence": 38}
    return {"genre": best_key, "confidence": min(96, 58 + best_score * 7)}


def normalize_subscription(item):
    snippet = item.get("snippet", {})
    resource_id = snippet.get("resourceId", {})
    thumbnails = snippet.get("thumbnails", {})
    thumbnail = (
        thumbnails.get("medium")
        or thumbnails.get("default")
        or thumbnails.get("high")
        or {}
    )
    channel_id = resource_id.get("channelId", item.get("id"))
    name = snippet.get("title", "名称未取得")
    description = snippet.get("description", "")
    classification = classify_channel(name, description)
    return {
        "id": channel_id,
        "youtubeChannelId": channel_id,
        "name": name,
        "description": description,
        "thumbnailUrl": thumbnail.get("url"),
        "genre": classification["genre"],
        "confidence": classification["confidence"],
        "tags": [],
        "memo": "",
        "favorite": False,
        "lastViewed": None,
        "clicks": 0,
        "minutes": 0,
    }


def save_channels(channels):
    DATA_DIR.mkdir(exist_ok=True)
    DATA_FILE.write_text(
        json.dumps({"channels": channels}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def load_channels():
    if not DATA_FILE.exists():
        return []
    try:
        return json.loads(DATA_FILE.read_text(encoding="utf-8")).get("channels", [])
    except json.JSONDecodeError:
        return []


def save_videos(videos):
    DATA_DIR.mkdir(exist_ok=True)
    VIDEOS_FILE.write_text(
        json.dumps({"videos": videos}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def load_videos():
    if not VIDEOS_FILE.exists():
        return []
    try:
        return json.loads(VIDEOS_FILE.read_text(encoding="utf-8")).get("videos", [])
    except json.JSONDecodeError:
        return []


def save_liked_videos(videos):
    DATA_DIR.mkdir(exist_ok=True)
    LIKED_VIDEOS_FILE.write_text(
        json.dumps({"videos": videos}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def load_liked_videos():
    if not LIKED_VIDEOS_FILE.exists():
        return []
    try:
        return json.loads(LIKED_VIDEOS_FILE.read_text(encoding="utf-8")).get("videos", [])
    except json.JSONDecodeError:
        return []


def chunked(items, size):
    for index in range(0, len(items), size):
        yield items[index:index + size]


def iso_to_timestamp(value):
    if not value:
        return 0
    try:
        return time.mktime(time.strptime(value.replace("Z", "+0000"), "%Y-%m-%dT%H:%M:%S%z"))
    except ValueError:
        return 0


def days_ago(published_at):
    timestamp = iso_to_timestamp(published_at)
    if not timestamp:
        return 999
    return max(0, int((time.time() - timestamp) // 86400))


def fetch_upload_playlist_ids(channels, headers):
    playlist_ids = {}
    channel_ids = [channel.get("youtubeChannelId") or channel.get("id") for channel in channels]
    channel_ids = [channel_id for channel_id in channel_ids if channel_id]

    for batch in chunked(channel_ids, 50):
        response = requests.get(
            f"{YOUTUBE_API_BASE}/channels",
            headers=headers,
            params={
                "part": "contentDetails",
                "id": ",".join(batch),
                "maxResults": "50",
            },
            timeout=20,
        )
        if not response.ok:
            return None, (response.text, response.status_code)

        for item in response.json().get("items", []):
            uploads = (
                item.get("contentDetails", {})
                .get("relatedPlaylists", {})
                .get("uploads")
            )
            if uploads:
                playlist_ids[item["id"]] = uploads

    return playlist_ids, None


def normalize_video(item, channel):
    snippet = item.get("snippet", {})
    content_details = item.get("contentDetails", {})
    thumbnails = snippet.get("thumbnails", {})
    thumbnail = thumbnails.get("medium") or thumbnails.get("default") or thumbnails.get("high") or {}
    video_id = content_details.get("videoId") or snippet.get("resourceId", {}).get("videoId")
    published_at = content_details.get("videoPublishedAt") or snippet.get("publishedAt")

    return {
        "id": video_id,
        "youtubeVideoId": video_id,
        "channelId": channel["id"],
        "title": snippet.get("title", "タイトル未取得"),
        "publishedAt": published_at,
        "updatedAt": published_at,
        "daysAgo": days_ago(published_at),
        "watched": False,
        "score": max(45, 100 - days_ago(published_at) * 6),
        "viewCount": 0,
        "duration": "",
        "durationSeconds": None,
        "kind": "video",
        "thumbnailUrl": thumbnail.get("url"),
        "url": f"https://www.youtube.com/watch?v={video_id}" if video_id else None,
    }


def normalize_liked_video(item):
    snippet = item.get("snippet", {})
    statistics = item.get("statistics", {})
    thumbnails = snippet.get("thumbnails", {})
    thumbnail = (
        thumbnails.get("medium")
        or thumbnails.get("standard")
        or thumbnails.get("high")
        or thumbnails.get("default")
        or {}
    )
    title = snippet.get("title", "タイトル未取得")
    description = snippet.get("description", "")
    tags = snippet.get("tags", [])
    classification = classify_channel(
        " ".join([title, snippet.get("channelTitle", "")]),
        description,
        tags,
    )
    video_id = item.get("id")
    published_at = snippet.get("publishedAt")
    content_details = item.get("contentDetails", {})
    if item.get("liveStreamingDetails"):
        content_details = {**content_details, "liveStreamingDetails": item.get("liveStreamingDetails", {})}
    duration = content_details.get("duration", "")
    duration_seconds = parse_duration_seconds(duration)
    kind = video_kind(snippet, content_details, duration_seconds, title, description)

    return {
        "id": video_id,
        "youtubeVideoId": video_id,
        "channelId": snippet.get("channelId"),
        "channelTitle": snippet.get("channelTitle", "チャンネル不明"),
        "title": title,
        "description": description,
        "publishedAt": published_at,
        "updatedAt": published_at,
        "daysAgo": days_ago(published_at),
        "genre": classification["genre"],
        "confidence": classification["confidence"],
        "kind": kind,
        "duration": duration,
        "durationSeconds": duration_seconds,
        "tags": tags[:8],
        "viewCount": int(statistics.get("viewCount", 0)),
        "likeCount": int(statistics.get("likeCount", 0)),
        "commentCount": int(statistics.get("commentCount", 0)),
        "thumbnailUrl": thumbnail.get("url"),
        "url": f"https://www.youtube.com/watch?v={video_id}" if video_id else None,
    }


def fetch_liked_videos():
    headers = authorized_headers()
    if headers is None:
        return None, ("認証情報の更新に失敗しました。もう一度ログインしてください。", 401)

    videos = []
    page_token = None
    while True:
        params = {
                "part": "snippet,statistics,contentDetails,liveStreamingDetails",
            "myRating": "like",
            "maxResults": "50",
        }
        if page_token:
            params["pageToken"] = page_token

        response = requests.get(
            f"{YOUTUBE_API_BASE}/videos",
            headers=headers,
            params=params,
            timeout=20,
        )
        if not response.ok:
            return None, (response.text, response.status_code)

        payload = response.json()
        videos.extend(normalize_liked_video(item) for item in payload.get("items", []))
        page_token = payload.get("nextPageToken")
        if not page_token:
            break

    videos.sort(key=lambda video: videoViewSortKey(video), reverse=True)
    save_liked_videos(videos)
    return videos, None


def videoViewSortKey(video):
    return int(video.get("viewCount", 0))


def parse_duration_seconds(duration):
    match = re.fullmatch(
        r"P(?:(?P<days>\d+)D)?T?(?:(?P<hours>\d+)H)?(?:(?P<minutes>\d+)M)?(?:(?P<seconds>\d+)S)?",
        duration or "",
    )
    if not match:
        return 999999
    parts = {key: int(value or 0) for key, value in match.groupdict().items()}
    return parts["days"] * 86400 + parts["hours"] * 3600 + parts["minutes"] * 60 + parts["seconds"]


def video_kind(snippet, content_details, duration_seconds, title="", description=""):
    live_details = content_details.get("liveStreamingDetails", {})
    live_state = snippet.get("liveBroadcastContent")
    text = f"{title} {description} {snippet.get('channelTitle', '')}".lower()
    if live_state in {"live", "upcoming"} or live_details.get("actualStartTime") or live_details.get("scheduledStartTime"):
        return "live"
    live_words = ["live", "\u30e9\u30a4\u30d6", "\u751f\u914d\u4fe1", "\u751f\u653e\u9001", "\u914d\u4fe1\u4e2d", "\u914d\u4fe1\u6e08", "\u914d\u4fe1", "\u795d\u52dd\u4f1a"]
    long_stream_words = ["apex", "dqx", "\u30b2\u30fc\u30e0", "\u5b9f\u6cc1", "gw", "\u96d1\u8ac7", "\u4f01\u753b"]
    if any(word in text for word in live_words):
        return "live"
    if duration_seconds >= 3600 and any(word in text for word in long_stream_words):
        return "live"
    if duration_seconds <= 60 or "#shorts" in text:
        return "short"
    return "video"


def fetch_video_statistics(videos, headers):
    video_ids = [video["id"] for video in videos if video.get("id")]
    source_by_id = {video["id"]: video for video in videos if video.get("id")}
    stats_by_id = {}

    for batch in chunked(video_ids, 50):
        response = requests.get(
            f"{YOUTUBE_API_BASE}/videos",
            headers=headers,
            params={
                "part": "statistics,contentDetails,liveStreamingDetails",
                "id": ",".join(batch),
                "maxResults": "50",
            },
            timeout=20,
        )
        if not response.ok:
            continue

        for item in response.json().get("items", []):
            statistics = item.get("statistics", {})
            snippet = item.get("snippet", {})
            content_details = item.get("contentDetails", {})
            if item.get("liveStreamingDetails"):
                content_details = {**content_details, "liveStreamingDetails": item.get("liveStreamingDetails", {})}
            duration = content_details.get("duration", "")
            duration_seconds = parse_duration_seconds(duration)
            source = source_by_id.get(item["id"], {})
            stats_by_id[item["id"]] = {
                "viewCount": int(statistics.get("viewCount", 0)),
                "likeCount": int(statistics.get("likeCount", 0)),
                "commentCount": int(statistics.get("commentCount", 0)),
                "duration": duration,
                "durationSeconds": duration_seconds,
                "kind": video_kind(snippet, content_details, duration_seconds, source.get("title", ""), source.get("description", "")),
            }

    return stats_by_id


def fetch_latest_videos(limit_per_channel=2):
    headers = authorized_headers()
    if headers is None:
        return None, ("認証情報の更新に失敗しました。もう一度ログインしてください。", 401)

    channels = load_channels()
    if not channels:
        channels, error = fetch_subscriptions()
        if error:
            return None, error

    watched_by_id = {video.get("id"): video.get("watched", False) for video in load_videos()}
    playlist_ids, error = fetch_upload_playlist_ids(channels, headers)
    if error:
        return None, error

    videos = []
    for channel in channels:
        playlist_id = playlist_ids.get(channel.get("youtubeChannelId") or channel.get("id"))
        if not playlist_id:
            continue

        response = requests.get(
            f"{YOUTUBE_API_BASE}/playlistItems",
            headers=headers,
            params={
                "part": "snippet,contentDetails",
                "playlistId": playlist_id,
                "maxResults": str(limit_per_channel),
            },
            timeout=20,
        )
        if not response.ok:
            continue

        for item in response.json().get("items", []):
            video = normalize_video(item, channel)
            if video["id"]:
                video["watched"] = watched_by_id.get(video["id"], False)
                videos.append(video)

    stats_by_id = fetch_video_statistics(videos, headers)
    for video in videos:
        video.update(stats_by_id.get(video["id"], {}))

    videos.sort(key=lambda video: iso_to_timestamp(video.get("publishedAt")), reverse=True)
    save_videos(videos)
    return videos, None


def fetch_subscriptions():
    headers = authorized_headers()
    if headers is None:
        return None, ("認証情報の更新に失敗しました。もう一度ログインしてください。", 401)

    channels = []
    page_token = None
    while True:
        params = {
            "part": "snippet,contentDetails",
            "mine": "true",
            "maxResults": "50",
        }
        if page_token:
            params["pageToken"] = page_token

        response = requests.get(
            f"{YOUTUBE_API_BASE}/subscriptions",
            headers=headers,
            params=params,
            timeout=20,
        )
        if not response.ok:
            return None, (response.text, response.status_code)

        payload = response.json()
        channels.extend(normalize_subscription(item) for item in payload.get("items", []))
        page_token = payload.get("nextPageToken")
        if not page_token:
            break

    save_channels(channels)
    return channels, None


@app.route("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/auth/login")
def auth_login():
    missing = require_config()
    if missing:
        return jsonify({"error": "Google OAuth設定が不足しています。", "missing": missing}), 500

    state = secrets.token_urlsafe(32)
    session["oauth_state"] = state
    params = {
        "client_id": os.environ["GOOGLE_CLIENT_ID"],
        "redirect_uri": redirect_uri(),
        "response_type": "code",
        "scope": " ".join(SCOPES),
        "state": state,
        "access_type": "offline",
        "include_granted_scopes": "true",
        "prompt": "consent",
    }
    return redirect(f"{GOOGLE_AUTH_URL}?{urllib.parse.urlencode(params)}")


@app.route("/auth/callback")
def auth_callback():
    if request.args.get("state") != session.get("oauth_state"):
        return "OAuth stateが一致しません。ログインをやり直してください。", 400
    if request.args.get("error"):
        return f"Google認証がキャンセルされました: {request.args['error']}", 400

    code = request.args.get("code")
    response = requests.post(
        GOOGLE_TOKEN_URL,
        data={
            "code": code,
            "client_id": os.environ["GOOGLE_CLIENT_ID"],
            "client_secret": os.environ["GOOGLE_CLIENT_SECRET"],
            "redirect_uri": redirect_uri(),
            "grant_type": "authorization_code",
        },
        timeout=20,
    )
    if not response.ok:
        return response.text, response.status_code

    payload = response.json()
    session["access_token"] = payload["access_token"]
    if payload.get("refresh_token"):
        session["refresh_token"] = payload["refresh_token"]
    session["expires_at"] = time.time() + payload.get("expires_in", 3600)
    session["connected"] = True

    fetch_google_profile()
    fetch_subscriptions()
    return redirect("/")


@app.route("/api/me")
def api_me():
    return jsonify(
        {
            "connected": bool(session.get("connected")),
            "hasRefreshToken": bool(session.get("refresh_token")),
            "channelCount": len(load_channels()),
            "userName": session.get("user_name"),
            "userEmail": session.get("user_email"),
            "userPicture": session.get("user_picture"),
        }
    )


@app.route("/api/channels")
def api_channels():
    saved_channels = load_channels()
    if not session.get("connected") and saved_channels:
        return jsonify({"channels": saved_channels, "source": "local_cache"})

    if not session.get("connected"):
        return jsonify({"error": "YouTubeアカウント未連携です。"}), 401

    refresh = request.args.get("refresh") == "1"
    if refresh or not saved_channels:
        channels, error = fetch_subscriptions()
        if error:
            message, status = error
            return jsonify({"error": message}), status
    else:
        channels = saved_channels

    return jsonify({"channels": channels, "source": "youtube_api" if refresh else "local_cache"})


@app.route("/api/channels/<channel_id>/genre", methods=["PATCH"])
def api_update_genre(channel_id):
    channels = load_channels()
    payload = request.get_json(force=True)
    genre = payload.get("genre")
    if genre not in GENRES:
        return jsonify({"error": "未知のジャンルです。"}), 400

    for channel in channels:
        if channel["id"] == channel_id:
            channel["genre"] = genre
            channel["confidence"] = 100 if genre != "unknown" else 38
            if "手動変更" not in channel["tags"]:
                channel["tags"].append("手動変更")
            save_channels(channels)
            return jsonify({"channel": channel})

    return jsonify({"error": "チャンネルが見つかりません。"}), 404


@app.route("/api/channels/<channel_id>/favorite", methods=["PATCH"])
def api_update_favorite(channel_id):
    channels = load_channels()
    payload = request.get_json(force=True)
    favorite = bool(payload.get("favorite"))

    for channel in channels:
        if channel["id"] == channel_id:
            channel["favorite"] = favorite
            save_channels(channels)
            return jsonify({"channel": channel})

    return jsonify({"error": "チャンネルが見つかりません。"}), 404


@app.route("/api/channels/reclassify", methods=["POST"])
def api_reclassify_channels():
    channels = load_channels()
    for channel in channels:
        if "手動変更" in channel.get("tags", []):
            continue
        classification = classify_channel(
            channel.get("name", ""),
            channel.get("description", ""),
            channel.get("tags", []),
        )
        channel["genre"] = classification["genre"]
        channel["confidence"] = classification["confidence"]
    save_channels(channels)
    return jsonify({"channels": channels})


@app.route("/api/videos")
def api_videos():
    saved_videos = load_videos()
    refresh = request.args.get("refresh") == "1"
    missing_video_details = any(
        "viewCount" not in video
        or not video.get("duration")
        or video.get("durationSeconds") in (None, "")
        for video in saved_videos
    )

    if not session.get("connected") and saved_videos:
        return jsonify({
            "videos": saved_videos,
            "source": "local_cache",
            "needsLoginForDuration": missing_video_details,
        })

    if not session.get("connected"):
        return jsonify({"error": "YouTubeアカウント未連携です。"}), 401

    if refresh or not saved_videos or missing_video_details:
        videos, error = fetch_latest_videos()
        if error:
            message, status = error
            return jsonify({"error": message}), status
    else:
        videos = saved_videos

    return jsonify({"videos": videos, "source": "youtube_api" if refresh else "local_cache"})


@app.route("/api/videos/<video_id>/watched", methods=["PATCH"])
def api_update_video_watched(video_id):
    videos = load_videos()
    payload = request.get_json(force=True)
    watched = bool(payload.get("watched"))

    for video in videos:
        if video.get("id") == video_id:
            video["watched"] = watched
            save_videos(videos)
            return jsonify({"video": video})

    return jsonify({"error": "動画が見つかりません。"}), 404


@app.route("/api/liked-videos")
def api_liked_videos():
    saved_videos = load_liked_videos()
    refresh = request.args.get("refresh") == "1"

    if not session.get("connected") and saved_videos:
        return jsonify({"videos": saved_videos, "source": "local_cache"})

    if not session.get("connected"):
        return jsonify({"error": "YouTubeアカウント未連携です。"}), 401

    missing_video_details = any(
        not video.get("duration")
        or video.get("durationSeconds") in (None, "")
        or not video.get("kind")
        for video in saved_videos
    )
    if refresh or not saved_videos or missing_video_details:
        videos, error = fetch_liked_videos()
        if error:
            message, status = error
            return jsonify({"error": message}), status
    else:
        videos = saved_videos

    return jsonify({"videos": videos, "source": "youtube_api" if refresh else "local_cache"})


@app.route("/api/logout", methods=["POST"])
def api_logout():
    session.clear()
    return jsonify({"ok": True})


@app.route("/api/delete-data", methods=["POST"])
def api_delete_data():
    save_channels([])
    save_videos([])
    save_liked_videos([])
    session.clear()
    return jsonify({"ok": True})


@app.route("/auth/switch")
def auth_switch():
    session.clear()
    return redirect("/auth/login")


if __name__ == "__main__":
    debug = os.environ.get("FLASK_DEBUG") == "1"
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "5000"))
    app.run(host=host, port=port, debug=debug, use_reloader=False)
