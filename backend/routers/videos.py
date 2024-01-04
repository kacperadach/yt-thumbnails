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
from cloud_functions.invoke import invoke_download_video

router = APIRouter()

# Regex patterns
twitch_pattern = re.compile(r"https?://www\.twitch\.tv/videos/\d+")
youtube_pattern = re.compile(r"https?://www\.youtube\.com/watch\?v=[\w-]+")


class VideoRequest(BaseModel):
    url: str
    user_id: str


@router.post("/v1/video")
async def process_video(
    video_request: VideoRequest,
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

    invoke_download_video(video_request.url, video.id)

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
