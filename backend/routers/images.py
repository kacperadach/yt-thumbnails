from time import time
import asyncio
import os
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

# from transparent_background import Remover
from PIL import Image as PILImage

from s3 import upload_file_to_s3, upload_file_obj_to_s3
from db.models import get_db, get_db_context_manager, User, Image
from task_queue import enqueue_task
from cloud_functions.invoke import invoke_remove_background

router = APIRouter()


@router.post("/v1/image")
async def upload_image(
    user_id: str = Query(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required")

    image_id = str(uuid4())

   
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

    file_name = f"{image_id}.{file.filename.split('.')[-1]}"
    s3_url = await upload_file_obj_to_s3(file.file, f"images/{file_name}")
    image.updated_at = time()
    image.url = s3_url
    db.commit()

    invoke_remove_background(image_id)

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
