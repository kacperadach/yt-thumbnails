from time import time
import asyncio
import os
import shutil
from uuid import uuid4
from pathlib import Path

from fastapi import (
    Depends,
    APIRouter,
    HTTPException,
    File,
    UploadFile,
    BackgroundTasks,
    Query,
)
from sqlalchemy.orm import Session
from pydantic import BaseModel
from transparent_background import Remover
from PIL import Image as PILImage

from s3 import upload_file_to_s3
from db.models import get_db, get_db_context_manager, User, Image
from worker import q
from files import write_file


router = APIRouter()

remover = Remover()  # default setting


def make_background_transparent(image_path):
    path = Path(image_path)
    new_file_name = f"{path.stem}_transparent.png"
    new_path = path.with_name(new_file_name)

    img = PILImage.open(image_path).convert("RGB")
    out = remover.process(img)  # default setting - transparent background
    out.save(new_path)

    return new_path


async def process_image_and_upload(file_location: str, image_id: str):
    output_path = None
    try:
        print(f"Processing image: {file_location}")
        output_path = make_background_transparent(file_location)
        print(f"Finished processing image: {file_location}, output path: {output_path}")

        original_upload = upload_file_to_s3(
            file_location, object_name=f"images/{os.path.basename(file_location)}"
        )
        transparent_upload = upload_file_to_s3(
            output_path, object_name=f"images/{os.path.basename(output_path)}"
        )
        original_url, processed_url = await asyncio.gather(
            original_upload, transparent_upload
        )

        print("Finished uploading to S3: {file_location}/{image_id}")

        with get_db_context_manager() as db:
            image = db.query(Image).filter(Image.id == image_id).first()
            if not image:
                raise Exception(status_code=404, detail="Image not found")

            image.updated_at = time()
            image.url = original_url
            image.url_transparent = processed_url
            image.status = "success"
            db.commit()

        print("Finished updating image: {file_location}/{image_id}")

    except Exception as e:
        with get_db_context_manager() as db:
            image = db.query(Image).filter(Image.id == image_id).first()
            if image:
                image.updated_at = time()
                image.status = "failed"
                db.commit()
        print(e)
    finally:
        if os.path.exists(file_location):
            os.remove(file_location)
        if output_path and os.path.exists(output_path):
            os.remove(output_path)


@router.post("/v1/image")
async def upload_image(
    background_tasks: BackgroundTasks,
    user_id: str = Query(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required")

    image_id = str(uuid4())

    file_path = write_file(f"{image_id}.{file.filename.split('.')[-1]}", file)

    # os.makedirs("tmp", exist_ok=True)
    # file_location = f"tmp/{image_id}.{file.filename.split('.')[-1]}"
    # with open(file_location, "wb+") as file_object:
    #     shutil.copyfileobj(file.file, file_object)

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = User(id=user_id)
        db.add(user)
        db.commit()
        db.refresh(user)

    image = Image(id=image_id, user_id=user_id, status="pending")
    db.add(image)
    db.commit()
    db.refresh(image)

    # background_tasks.add_task(process_image_and_upload, file_location, image_id)
    job = q.enqueue(process_image_and_upload, file_path, image_id)
    print(f"Job enqueued with id: {job.id}")

    return image


@router.get("/v1/image/by-user/{user_id}")
async def get_user_images(user_id: str, db: Session = Depends(get_db)):
    images = (
        db.query(Image)
        .filter(Image.user_id == user_id)
        .order_by(Image.created_at.desc())
        .all()
    )
    return images


@router.get("/v1/image/{image_id}")
async def get_image(image_id: str, db: Session = Depends(get_db)):
    image = db.query(Image).filter(Image.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    return image
