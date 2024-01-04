import asyncio
from time import time
import requests
from fastapi import HTTPException

from PIL import Image as PILImage
from io import BytesIO

from s3 import upload_file_obj_to_s3
from db.models import get_db_context_manager, Image
import functions_framework
from transparent_background import Remover


async def _remove_background(request):
    try:
        request_json = request.get_json(silent=True)

        if not request_json or "image_id" not in request_json:
            raise HTTPException(status_code=400, detail="Invalid request")

        image_id = request_json["image_id"]
        with get_db_context_manager() as db:
            image: Image = db.query(Image).filter(Image.id == image_id).first()
            if not image:
                raise HTTPException(status_code=404, detail="Image not found")

            if not image.url:
                raise HTTPException(status_code=400, detail="Image URL not found")

        print(f"Downloading image {image_id}: {image.url}")
        response = requests.get(image.url, timeout=30)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Image URL not found")

        print(f"Processing image {image_id}: {image.url}")
        image_buffer = BytesIO(response.content)
        img = PILImage.open(image_buffer).convert("RGB")

        remover = Remover()
        out = remover.process(img)

        output_buffer = BytesIO()
        out.save(output_buffer, format="PNG")
        output_buffer.seek(0)  # Ensure the buffer's start is at the beginning

        print(f"Uploading image {image_id}: {image.url}")
        s3_url = await upload_file_obj_to_s3(
            output_buffer, f"images/{image.id}_transparent.png"
        )

        print(f"Finished uploading image {image_id}: {image.url}")
        with get_db_context_manager() as db:
            image: Image = db.query(Image).filter(Image.id == image_id).first()
            if not image:
                raise HTTPException(status_code=404, detail="Image not found")
            image.url_transparent = s3_url
            image.updated_at = time()
            image.status = "success"
            db.commit()
    except Exception:
        with get_db_context_manager() as db:
            image: Image = db.query(Image).filter(Image.id == image_id).first()
            if image:
                image.status = "failed"
                image.updated_at = time()
                db.commit()


@functions_framework.http
def remove_background(request):
    asyncio.run(_remove_background(request))
    return "OK"
