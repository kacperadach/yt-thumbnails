import os
import re
import asyncio
from time import time
import requests
from fastapi import HTTPException

from io import BytesIO

from s3 import upload_file_obj_to_s3, upload_file_to_s3
from db.models import get_db_context_manager, Video
import functions_framework
from download import (
    download_twitch_vod,
    download_youtube_vod,
    download_twitch_stream_info,
    download_youtube_info,
)


twitch_pattern = re.compile(r"https?://www\.twitch\.tv/videos/\d+")
youtube_pattern = re.compile(r"https?://www\.youtube\.com/watch\?v=[\w-]+")

TMP_DIR = "/tmp"


def download_image(image_url):
    response = requests.get(image_url)
    if response.status_code != 200:
        print(f"Failed to download image. Status code: {response.status_code}")
        return None

    image_data = BytesIO(response.content)
    print("Image successfully downloaded")
    return image_data


async def _download_video(request):
    try:
        request_json = request.get_json(silent=True)
        if (
            not request_json
            or "video_id" not in request_json
            or "url" not in request_json
        ):
            raise HTTPException(status_code=400, detail="Invalid request")

        url = request_json["url"]
        video_id = request_json["video_id"]

        print(f"Downloading info {video_id}: {url}")
        if twitch_pattern.match(url):
            info = download_twitch_stream_info(url)
        elif youtube_pattern.match(url):
            info = download_youtube_info(url)
        else:
            raise HTTPException(
                status_code=400, detail="Video URL must be from Twitch or YouTube"
            )

        print(f"Finished downloading info {video_id}: {url}")

        thumbnail = info.get("thumbnail")
        if thumbnail:
            print(f"Downloading thumbnail {video_id}: {thumbnail}")
            image_data = download_image(thumbnail)
            if image_data:
                print(f"Uploading thumbnail {video_id}: {thumbnail}")
                thumbnail_s3_url = await upload_file_obj_to_s3(
                    image_data,
                    object_name=f"videos/thumbnails/{video_id}_thumbnail.jpg",
                )
                print(f"Finished uploading thumbnail {video_id}: {thumbnail}")
                with get_db_context_manager() as db:
                    video = db.query(Video).filter(Video.id == video_id).first()
                    if not video:
                        raise Exception("Video not found")

                    video.updated_at = time()
                    video.thumbnail_url = thumbnail_s3_url
                    db.commit()

        print(f"Downloading video {video_id}: {url}")
        if twitch_pattern.match(url):
            filepath = download_twitch_vod(url, info=info)
        elif youtube_pattern.match(url):
            filepath = download_youtube_vod(url, info=info)
        else:
            raise Exception("Video URL must be from Twitch or YouTube")

        print(f"Uploading video {video_id}: {url}")
        s3_url = await upload_file_to_s3(
            filepath,
            object_name=f"videos/{video_id}.{os.path.basename(filepath).split('.')[1]}",
        )
        print(f"Finished uploading video {video_id}: {url}")
        with get_db_context_manager() as db:
            video = db.query(Video).filter(Video.id == video_id).first()
            if not video:
                raise Exception("Video not found")

            video.updated_at = time()
            video.url = s3_url
            video.status = "success"
            db.commit()

    except Exception:
        with get_db_context_manager() as db:
            video = db.query(Video).filter(Video.id == video_id).first()
            if video:
                video.updated_at = time()
                video.status = "failed"
                db.commit()


@functions_framework.http
def download_video(request):
    asyncio.run(_download_video(request))
    return "OK"
