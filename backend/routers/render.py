import subprocess
import json
import os

from fastapi import Depends, APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from db.models import get_db, get_db_context_manager, User, Thumbnail, Render, User
from task_queue import enqueue_task
from auth.auth import ValidUserFromJWT

router = APIRouter()


class RenderRequest(BaseModel):
    thumbnail_id: str


@router.post("/v1/render/initiate")
async def initiate_render(
    render_request: RenderRequest,
    db: Session = Depends(get_db),
    user: User = Depends(ValidUserFromJWT()),
):
    user = db.query(User).filter(User.id == user.id).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid render")

    thumbnail = (
        db.query(Thumbnail)
        .filter(Thumbnail.id == render_request.thumbnail_id)
        .filter(Thumbnail.user_id == user.id)
        .first()
    )
    if not thumbnail:
        raise HTTPException(status_code=400, detail="Invalid render")

    # renders = (
    #     db.query(Render)
    #     .filter(Render.created_at > user.subscription_payment_at)
    #     .count()
    # )

    render = Render(
        user_id=user.id,
        thumbnail_id=render_request.thumbnail_id,
        status="pending",
    )

    db.add(render)
    db.commit()
    db.refresh(render)

    enqueue_task(
        "api/v1/tasks/thumbnail/render",
        {"render_id": render.id, "thumbnail": thumbnail.thumbnail},
    )

    return render


@router.get("/v1/render/{render_id}")
async def get_render(
    render_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(ValidUserFromJWT()),
):
    render = (
        db.query(Render)
        .filter(Render.id == render_id)
        .filter(User.id == user.id)
        .first()
    )
    if not render:
        raise HTTPException(status_code=404, detail="Render not found")
    return render
