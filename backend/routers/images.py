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

from s3 import upload_file_to_s3, upload_file_obj_to_s3
from db.models import get_db, get_db_context_manager, User, Image
from task_queue import enqueue_task
from cloud_functions.invoke import invoke_remove_background
from auth.auth import ValidUserFromJWT
from subscription.utils import check_limits
from slack_bot.slack import send_slack_message

router = APIRouter()


@router.post("/v1/image")
async def upload_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(ValidUserFromJWT()),
):
    check_limits(Image, user, db)
    image_id = str(uuid4())

    image = Image(id=image_id, user_id=user.id)
    db.add(image)
    db.commit()
    db.refresh(image)

    file_name = f"{image_id}.{file.filename.split('.')[-1]}"
    s3_url = await upload_file_obj_to_s3(file.file, f"images/{file_name}")
    image.updated_at = time()
    image.url = s3_url
    db.commit()
    db.refresh(image)

    # invoke_remove_background(image_id)
    send_slack_message(f"User {user.email} uploaded image {image_id}")

    return image


@router.put("/v1/image/{image_id}/transparent")
async def upload_image_transparent(
    image_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(ValidUserFromJWT()),
):
    image = (
        db.query(Image).filter(Image.id == image_id).filter(Image.user_id == user.id).first()
    )
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    file_name = f"{image_id}_transparent.{file.filename.split('.')[-1]}"
    s3_url = await upload_file_obj_to_s3(file.file, f"images/{file_name}")
    image.updated_at = time()
    image.url_transparent = s3_url
    db.commit()
    db.refresh(image)
    return image


@router.get("/v1/image")
async def get_user_images(
    image_id: list[str] = Query(None),
    db: Session = Depends(get_db),
    user: User = Depends(ValidUserFromJWT()),
):
    query = db.query(Image).filter(Image.user_id == user.id).order_by(Image.created_at.desc())
    if image_id and len(image_id) > 0:
        query = query.filter(Image.id.in_(image_id))
    return query.all()


@router.get("/v1/image/{image_id}")
async def get_image(
    image_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(ValidUserFromJWT()),
):
    image = (
        db.query(Image).filter(Image.id == image_id).filter(Image.user_id == user.id).first()
    )
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    return image
