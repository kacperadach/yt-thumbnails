from time import time

from fastapi import Depends, APIRouter, HTTPException, Response
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth.auth import ValidUserFromJWT
from db.models import get_db, Template, User
from subscription.utils import check_limits
from slack_bot.slack import send_slack_message

router = APIRouter()


class TemplateCreateRequest(BaseModel):
    name: str
    template: dict


@router.post("/v1/template")
async def create_template(
    template_create: TemplateCreateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(ValidUserFromJWT()),
):
    check_limits(Template, user, db, is_monthy=False)

    template = Template(
        user_id=user.id,
        name=template_create.name,
        template=template_create.template,
    )
    db.add(template)
    db.commit()
    db.refresh(template)
    send_slack_message(f"User {user.email} created template {template.id}")
    return template


@router.get("/v1/template")
async def get_user_templates(
    db: Session = Depends(get_db),
    user: User = Depends(ValidUserFromJWT()),
):
    return (
        db.query(Template)
        .filter(Template.user_id == user.id)
        .order_by(Template.created_at.desc())
        .all()
    )


@router.put("/v1/template/{template_id}")
async def update_template(
    template_id: str,
    template_create: TemplateCreateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(ValidUserFromJWT()),
):
    template = (
        db.query(Template)
        .filter(Template.id == template_id)
        .filter(Template.user_id == user.id)
        .first()
    )
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    template.name = template_create.name
    template.template = template_create.template
    db.commit()
    db.refresh(template)
    send_slack_message(f"User {user.email} updated template {template_id}")
    return template


@router.delete("/v1/template/{template_id}")
async def delete_template(
    template_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(ValidUserFromJWT()),
):
    template = (
        db.query(Template)
        .filter(Template.id == template_id)
        .filter(Template.user_id == user.id)
        .first()
    )
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    template.deleted_at = time()
    db.commit()
    send_slack_message(f"User {user.email} deleted template {template_id}")
    return Response(status_code=204)
