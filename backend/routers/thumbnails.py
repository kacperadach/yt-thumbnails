from typing import Optional

from fastapi import Depends, APIRouter, HTTPException, Query
from sqlalchemy.orm import Session
from db.models import get_db, User, Thumbnail
from auth.auth import ValidUserFromJWT
from slack_bot.slack import send_slack_message

from pydantic import BaseModel

router = APIRouter()


class ThumbnailCreate(BaseModel):
    thumbnail: dict
    template_id: Optional[str] = None


@router.post("/v1/thumbnail")
async def create_thumbnail(
    thumbnail_create: ThumbnailCreate,
    db: Session = Depends(get_db),
    user: User = Depends(ValidUserFromJWT()),
):
    thumbnail = Thumbnail(
        user_id=user.id,
        thumbnail=thumbnail_create.thumbnail,
        template_id=thumbnail_create.template_id,
    )
    db.add(thumbnail)
    db.commit()
    db.refresh(thumbnail)
    send_slack_message(f"User {user.email} created thumbnail {thumbnail.id}")
    return thumbnail


@router.get("/v1/thumbnail")
async def get_user_thumbnails(
    thumbnail_id: list[str] = Query(None),
    db: Session = Depends(get_db),
    user: User = Depends(ValidUserFromJWT()),
):
    query = db.query(Thumbnail).filter(Thumbnail.user_id == user.id)

    if thumbnail_id and len(thumbnail_id) > 0:
        query = query.filter(Thumbnail.id.in_(thumbnail_id))

    return query.order_by(Thumbnail.created_at.desc()).all()


@router.put("/v1/thumbnail/{thumbnail_id}")
async def update_thumbnail(
    thumbnail_id: str,
    thumbnail_create: ThumbnailCreate,
    db: Session = Depends(get_db),
    user: User = Depends(ValidUserFromJWT()),
):
    thumbnail = (
        db.query(Thumbnail)
        .filter(Thumbnail.id == thumbnail_id)
        .filter(Thumbnail.user_id == user.id)
        .first()
    )
    if not thumbnail:
        raise HTTPException(status_code=404, detail="Thumbnail not found")

    thumbnail.thumbnail = thumbnail_create.thumbnail
    db.commit()
    db.refresh(thumbnail)
    return thumbnail
