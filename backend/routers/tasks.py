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
    RenderMediaParams,
    RenderProgressParams,
    Privacy,
    ValidStillImageFormats,
)
from remotion_lambda import RemotionClient

from PIL import Image as PILImage
from io import BytesIO

from s3 import upload_file_obj_to_s3
from db.models import get_db, Image, Render


router = APIRouter()


class RemoveBackgroundRequest(BaseModel):
    image_id: str


# @router.post("/v1/tasks/image/remove-background")
# async def remove_background_from_image(
#     request: RemoveBackgroundRequest, db: Session = Depends(get_db)
# ):
#     image: Image = db.query(Image).filter(Image.id == request.image_id).first()
#     if not image:
#         raise HTTPException(status_code=404, detail="Image not found")

#     if not image.url:
#         image.status = "failed"
#         db.commit()
#         raise HTTPException(status_code=400, detail="Image URL not found")

#     response = requests.get(image.url)
#     if response.status_code != 200:
#         image.status = "failed"
#         db.commit()
#         raise HTTPException(status_code=400, detail="Image URL not found")

#     image_buffer = BytesIO(response.content)
#     img = PILImage.open(image_buffer).convert("RGB")

#     if not remover:
#     from transparent_background import Remover

#     remover = Remover()

#     out = remover.process(img)

#     output_buffer = BytesIO()
#     out.save(output_buffer, format="PNG")
#     output_buffer.seek(0)  # Ensure the buffer's start is at the beginning
#     s3_url = await upload_file_obj_to_s3(
#         output_buffer, f"images/{image.id}_transparent.png"
#     )

#     image.url_transparent = s3_url
#     image.updated_at = time()
#     image.status = "success"
#     db.commit()


class RenderThumbnailRequest(BaseModel):
    render_id: str
    thumbnail: dict


@router.post("/v1/tasks/thumbnail/render")
async def render_thumbnail(
    request: RenderThumbnailRequest, db: Session = Depends(get_db)
):
    REMOTION_APP_REGION = os.getenv("REMOTION_APP_REGION")
    if not REMOTION_APP_REGION:
        raise HTTPException(status_code=400, detail="REMOTION_APP_REGION is not set")
    REMOTION_APP_FUNCTION_NAME = os.getenv("REMOTION_APP_FUNCTION_NAME")
    if not REMOTION_APP_FUNCTION_NAME:
        raise HTTPException(
            status_code=400, detail="REMOTION_APP_FUNCTION_NAME is not set"
        )
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

    render_params = RenderMediaParams(
        composition="ThumbnailComposition",
        privacy=Privacy.PUBLIC,
        image_format=ValidStillImageFormats.JPEG,
        input_props={"thumbnail": request.thumbnail},
    )

    render_response = client.render_still_on_lambda(render_params)
    if not render_response:
        render.status = "failed"
        render.error_message = render_response.error_message
        db.commit()
        raise HTTPException(status_code=400, detail="Render failed")

    print("Render ID:", render_response.render_id)
    print("Bucket name:", render_response.bucket_name)
    print("Render done! File at ", render_response.url)
    render.status = "success"
    render.url = render_response.url
    db.commit()
