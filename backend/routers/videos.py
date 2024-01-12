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
from auth.auth import ValidUserFromJWT

router = APIRouter()

# Regex patterns
twitch_pattern = re.compile(r"https?://www\.twitch\.tv/videos/\d+")
youtube_pattern = re.compile(r"https?://www\.youtube\.com/watch\?v=[\w-]+")


class VideoRequest(BaseModel):
    url: str


@router.post("/v1/video")
async def process_video(
    video_request: VideoRequest,
    db: Session = Depends(get_db),
    user: User = Depends(ValidUserFromJWT()),
):
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

    video = Video(
        platform=platform,
        original_url=video_request.url,
        user_id=user.id,
        status="pending",
    )
    db.add(video)
    db.commit()
    db.refresh(video)

    invoke_download_video(video_request.url, video.id)

    return video


@router.get("/v1/video")
async def get_user_videos(
    db: Session = Depends(get_db),
    user: User = Depends(ValidUserFromJWT()),
    video_id: list[str] = Query(None),
):
    query = db.query(Video).filter(Video.user_id == user.id)

    if video_id:
        query = query.filter(Video.id.in_(video_id))

    return query.order_by(Video.created_at.desc()).all()


@router.get("/v1/video/{video_id}")
async def get_video(
    video_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(ValidUserFromJWT()),
):
    video = (
        db.query(Video).filter(Video.id == video_id).filter(Video.user_id == user.id).first()
    )
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video
