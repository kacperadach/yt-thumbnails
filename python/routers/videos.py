from time import time
import os
from uuid import uuid4
import re

from fastapi import (
    Depends,
    APIRouter,
    HTTPException,
    BackgroundTasks,
    Query,
)
from pydantic import BaseModel
from sqlalchemy.orm import Session
import requests

from s3 import upload_file_to_s3
from db.models import get_db, get_db_context_manager, User, Video
from download import (
    download_twitch_vod,
    download_youtube_vod,
    download_twitch_stream_info,
    download_youtube_info,
)
from worker import q
from files import TMP_DIR

router = APIRouter()

# Regex patterns
twitch_pattern = re.compile(r"https?://www\.twitch\.tv/videos/\d+")
youtube_pattern = re.compile(r"https?://www\.youtube\.com/watch\?v=[\w-]+")


def download_image(image_url, file_path):
    response = requests.get(image_url)

    if response.status_code == 200:
        with open(file_path, "wb") as file:
            file.write(response.content)
        print(f"Image successfully downloaded: {file_path}")
    else:
        print(f"Failed to download image. Status code: {response.status_code}")


async def download_video_and_upload(video_id: str, url: str):
    if twitch_pattern.match(url):
        info = download_twitch_stream_info(url)
    elif youtube_pattern.match(url):
        info = download_youtube_info(url)
    else:
        raise Exception("Video URL must be from Twitch or YouTube")

    thumbnail = info.get("thumbnail")

    if thumbnail:
        thumbnail_path = os.path.join(TMP_DIR, f"{video_id}_thumbnail.jpg")
        download_image(thumbnail, thumbnail_path)
        if os.path.exists(thumbnail_path):
            thumbnail_s3_url = await upload_file_to_s3(
                thumbnail_path,
                object_name=f"videos/thumbnails/{video_id}_thumbnail.{os.path.basename(thumbnail_path).split('.')[1]}",
            )
            with get_db_context_manager() as db:
                video = db.query(Video).filter(Video.id == video_id).first()
                if not video:
                    raise Exception("Video not found")

                video.updated_at = time()
                video.thumbnail_url = thumbnail_s3_url
                db.commit()
                os.remove(thumbnail_path)

    if twitch_pattern.match(url):
        filepath = download_twitch_vod(url, info=info)
    elif youtube_pattern.match(url):
        filepath = download_youtube_vod(url, info=info)
    else:
        raise Exception("Video URL must be from Twitch or YouTube")

    print(f"Download finished at {filepath}")

    try:
        s3_url = await upload_file_to_s3(
            filepath,
            object_name=f"videos/{video_id}.{os.path.basename(filepath).split('.')[1]}",
        )
        with get_db_context_manager() as db:
            video = db.query(Video).filter(Video.id == video_id).first()
            if not video:
                raise Exception("Video not found")

            video.updated_at = time()
            video.url = s3_url
            video.status = "success"
            db.commit()
    except Exception as exc:
        with get_db_context_manager() as db:
            video = db.query(Video).filter(Video.id == video_id).first()
            if video:
                video.updated_at = time()
                video.status = "failed"
                db.commit()
        print(exc)
    finally:
        os.remove(filepath)


class VideoRequest(BaseModel):
    url: str
    user_id: str


@router.post("/v1/video")
async def process_video(
    video_request: VideoRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    if not video_request.user_id:
        raise HTTPException(status_code=400, detail="User ID is required")

    platform = None
    if twitch_pattern.match(video_request.url):
        platform = "twitch"
    elif youtube_pattern.match(video_request.url):
        platform = "youtube"
    else:
        raise HTTPException(
            status_code=400,
            detail="Video URL must be from Twitch or YouTube",
        )

    user = db.query(User).filter(User.id == video_request.user_id).first()
    if not user:
        user = User(id=video_request.user_id)
        db.add(user)
        db.commit()
        db.refresh(user)

    video = Video(
        platform=platform,
        original_url=video_request.url,
        user_id=video_request.user_id,
        status="pending",
    )
    db.add(video)
    db.commit()
    db.refresh(video)

    # background_tasks.add_task(download_video_and_upload, video.id, video_request.url)
    q.enqueue(download_video_and_upload, video.id, video_request.url)

    return video


@router.get("/v1/video/by-user/{user_id}")
async def get_user_videos(
    user_id: str,
    db: Session = Depends(get_db),
    video_id: list[str] = Query(None),
):
    query = db.query(Video).filter(Video.user_id == user_id)

    if video_id:
        query = query.filter(Video.id.in_(video_id))

    videos = query.order_by(Video.created_at.desc()).all()
    return videos


@router.get("/v1/video/{video_id}")
async def get_video(video_id: str, db: Session = Depends(get_db)):
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video
