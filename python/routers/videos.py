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


from s3 import upload_file_to_s3
from db.models import get_db, get_db_context_manager, User, Video
from download import download_twitch_vod, download_youtube_vod

router = APIRouter()

# Regex patterns
twitch_pattern = re.compile(r"https?://www\.twitch\.tv/videos/\d+")
youtube_pattern = re.compile(r"https?://www\.youtube\.com/watch\?v=[\w-]+")


async def download_video_and_upload(video_id: str, url: str):
    if twitch_pattern.match(url):
        filepath = download_twitch_vod(url)
    elif youtube_pattern.match(url):
        filepath = download_youtube_vod(url)
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
            db.commit()
    except Exception as exc:
        print(exc)
    finally:
        os.remove(filepath)


class VideoRequest(BaseModel):
    url: str


@router.post("/v1/video")
async def process_video(
    video_request: VideoRequest,
    background_tasks: BackgroundTasks,
    user_id: str = Query(...),
    db: Session = Depends(get_db),
):
    if not user_id:
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

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = User(id=user_id)
        db.add(user)
        db.commit()
        db.refresh(user)

    video = Video(platform=platform, original_url=video_request.url)
    db.add(video)
    db.commit()
    db.refresh(video)

    background_tasks.add_task(download_video_and_upload, video.id, video_request.url)

    return video


@router.get("/v1/video/by-user/{user_id}")
async def get_user_videos(user_id: str, db: Session = Depends(get_db)):
    videos = (
        db.query(Video)
        .filter(Video.user_id == user_id)
        .order_by(Video.created_at.desc())
        .all()
    )
    return videos


@router.get("/v1/video/{video_id}")
async def get_video(video_id: str, db: Session = Depends(get_db)):
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video
