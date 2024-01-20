import subprocess
import json
import os

from fastapi import Depends, APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from db.models import get_db, get_db_context_manager, User, Thumbnail, Render, User
from task_queue import enqueue_task
from auth.auth import ValidUserFromJWT
from subscription.utils import check_limits
from slack_bot.slack import send_slack_message

router = APIRouter()


class RenderRequest(BaseModel):
    thumbnail_id: str


@router.post("/v1/render/initiate")
async def initiate_render(
    render_request: RenderRequest,
    db: Session = Depends(get_db),
    user: User = Depends(ValidUserFromJWT()),
):
    check_limits(Render, user, db)

    thumbnail = (
        db.query(Thumbnail)
        .filter(Thumbnail.id == render_request.thumbnail_id)
        .filter(Thumbnail.user_id == user.id)
        .first()
    )
    if not thumbnail:
        raise HTTPException(status_code=400, detail="Invalid render")

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

    send_slack_message(f"User {user.email} initiated render {render.id}")
    return render


@router.get("/v1/render/{render_id}")
async def get_render(
    render_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(ValidUserFromJWT()),
):
    render = db.query(Render).filter(Render.id == render_id).filter(User.id == user.id).first()
    if not render:
        raise HTTPException(status_code=404, detail="Render not found")
    return render
