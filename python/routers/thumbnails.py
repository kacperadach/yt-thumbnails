from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session
from db.models import get_db, User, Thumbnail

from pydantic import BaseModel

router = APIRouter()


class ThumbnailCreate(BaseModel):
    user_id: str
    thumbnail: dict


@router.post("/v1/thumbnail")
async def create_thumbnail(
    thumbnail_create: ThumbnailCreate, db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == thumbnail_create.user_id).first()
    if not user:
        user = User(id=thumbnail_create.user_id)
        db.add(user)
        db.commit()
        db.refresh(user)

    thumbnail = Thumbnail(
        user_id=thumbnail_create.user_id, thumbnail=thumbnail_create.thumbnail
    )
    db.add(thumbnail)
    db.commit()
    db.refresh(thumbnail)
    return thumbnail


@router.get("/v1/thumbnail/by-user/{user_id}")
async def get_user_thumbnails(user_id: str, db: Session = Depends(get_db)):
    thumbnails = (
        db.query(Thumbnail)
        .filter(Thumbnail.user_id == user_id)
        .order_by(Thumbnail.created_at.desc())
        .all()
    )
    return thumbnails


@router.put("/v1/thumbnail/{thumbnail_id}")
async def update_thumbnail(
    thumbnail_id: str, thumbnail_create: ThumbnailCreate, db: Session = Depends(get_db)
):
    thumbnail = (
        db.query(Thumbnail)
        .filter(Thumbnail.id == thumbnail_id)
        .filter(Thumbnail.user_id == thumbnail_create.user_id)
        .first()
    )
    if not thumbnail:
        raise HTTPException(status_code=404, detail="Thumbnail not found")

    thumbnail.thumbnail = thumbnail_create.thumbnail
    db.commit()
    db.refresh(thumbnail)
    return thumbnail
