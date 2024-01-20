import os
from time import time
from fastapi import (
    Depends,
    APIRouter,
    HTTPException,
    File,
    UploadFile,
    BackgroundTasks,
    Query,
)
import requests

from pydantic import BaseModel
from sqlalchemy.orm import Session

from remotion_lambda import (
    RenderStillParams,
    Privacy,
    ValidStillImageFormats,
)
from remotion_lambda import RemotionClient

from PIL import Image as PILImage
from io import BytesIO

from s3 import upload_file_obj_to_s3
from db.models import get_db, Image, Render
from slack_bot.slack import send_slack_message


router = APIRouter()


class RemoveBackgroundRequest(BaseModel):
    image_id: str


class RenderThumbnailRequest(BaseModel):
    render_id: str
    thumbnail: dict


@router.post("/v1/tasks/thumbnail/render")
async def render_thumbnail(request: RenderThumbnailRequest, db: Session = Depends(get_db)):
    REMOTION_APP_REGION = os.getenv("REMOTION_APP_REGION")
    if not REMOTION_APP_REGION:
        raise HTTPException(status_code=400, detail="REMOTION_APP_REGION is not set")
    REMOTION_APP_FUNCTION_NAME = os.getenv("REMOTION_APP_FUNCTION_NAME")
    if not REMOTION_APP_FUNCTION_NAME:
        raise HTTPException(status_code=400, detail="REMOTION_APP_FUNCTION_NAME is not set")
    REMOTION_APP_SERVE_URL = os.getenv("REMOTION_APP_SERVE_URL")
    if not REMOTION_APP_SERVE_URL:
        raise HTTPException(status_code=400, detail="REMOTION_APP_SERVE_URL is not set")

    render = db.query(Render).filter(Render.id == request.render_id).first()
    if not render:
        raise HTTPException(status_code=400, detail="Render not found")

    client = RemotionClient(
        region=REMOTION_APP_REGION,
        serve_url=REMOTION_APP_SERVE_URL,
        function_name=REMOTION_APP_FUNCTION_NAME,
    )

    render_params = RenderStillParams(
        composition="ThumbnailComposition",
        privacy=Privacy.PUBLIC,
        image_format=ValidStillImageFormats.JPEG,
        input_props={"thumbnail": request.thumbnail},
        download_behavior={"type": "download", "fileName": "thumbnail.jpeg"},
        log_level="verbose",
    )

    render_response = None
    try:
        render_response = client.render_still_on_lambda(render_params)
    except Exception as e:
        send_slack_message(
            f"Render failed! {e}, user id: {render.user_id}, render id: {render.id}"
        )
        render.status = "failed"
        render.error_message = str(e)
        db.commit()
        raise HTTPException(status_code=400, detail="Render failed")

    if not render_response:
        render.status = "failed"
        db.commit()
        raise HTTPException(status_code=400, detail="Render failed")

    print("Render ID:", render_response.render_id)
    print("Bucket name:", render_response.bucket_name)
    print("Render done! File at ", render_response.url)
    render.status = "success"
    render.url = render_response.url
    db.commit()
    send_slack_message(f"Render success! {render_response.url}, user id: {render.user_id}")
