from io import BytesIO
from typing import List
from time import time

from fastapi import (
    Depends,
    APIRouter,
    HTTPException,
    File,
    UploadFile,
    BackgroundTasks,
    Query,
    Request,
)
from pydantic import BaseModel
from sqlalchemy.orm import Session
import requests

from db.models import User, AIImage, ImageProcessStatus, get_db
from auth.auth import ValidUserFromJWT
from subscription.utils import check_limits
from slack_bot.slack import send_slack_message
from ai.image_generation import (
    generate_asset_image_runpod,
    generate_background_image_runpod,
    RunpodResponse,
    BACKGROUND_WIDTH,
    BACKGROUND_HEIGHT,
)
from s3 import upload_file_obj_to_s3

router = APIRouter()


class AssetImageGenerateInput(BaseModel):
    prompt: str
    negative_prompt: str
    width: int
    height: int


@router.post("/v1/ai-image/generate")
async def generate_ai_image(
    generate_input: AssetImageGenerateInput,
    db: Session = Depends(get_db),
    user: User = Depends(ValidUserFromJWT()),
):
    check_limits(AIImage, user, db)

    ai_image = AIImage(
        user_id=user.id,
        status=ImageProcessStatus.PENDING.value,
        prompt=generate_input.prompt,
        negative_prompt=generate_input.negative_prompt,
        width=generate_input.width,
        height=generate_input.height,
    )
    db.add(ai_image)
    db.commit()
    db.refresh(ai_image)

    response: RunpodResponse = generate_background_image_runpod(
        generate_input.prompt,
        generate_input.negative_prompt,
    )

    print(response)
    ai_image.runpod_id = response.id
    ai_image.status = ImageProcessStatus.PROCESSING.value
    db.commit()
    db.refresh(ai_image)

    send_slack_message(
        f"User {user.email} generated ai image {ai_image.id}, prompt: {generate_input.prompt}, negative_prompt: {generate_input.negative_prompt}"
    )

    return ai_image


@router.get("/v1/ai-image")
async def get_ai_images(
    image_id: list[str] = Query(None),
    db: Session = Depends(get_db),
    user: User = Depends(ValidUserFromJWT()),
):
    query = db.query(AIImage).filter(AIImage.user_id == user.id)
    if image_id and len(image_id) > 0:
        query = query.filter(AIImage.id.in_(image_id))
    return query.all()


@router.get("/v1/ai-image/{ai_image_id}")
async def get_ai_image(
    ai_image_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(ValidUserFromJWT()),
):
    ai_image = db.query(AIImage).filter(AIImage.id == ai_image_id).first()
    if not ai_image:
        raise HTTPException(status_code=404, detail="AI Image not found")

    return ai_image


class OutputDict(BaseModel):
    image: str
    seed: int


class RunpodWebhookBody(BaseModel):
    delayTime: int
    executionTime: int
    id: str
    input: dict
    output: dict
    status: str


@router.post("/v1/ai-image/runpod-webhook")
async def runpod_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    json_data = await request.json()
    print("Received JSON:", json_data)
    send_slack_message(f"Runpod webhook: {json_data}")

    runpod_webhook_body = None
    try:
        runpod_webhook_body = RunpodWebhookBody(**json_data)
    except Exception as e:
        print("Error in parsing JSON to model:", e)

    if not runpod_webhook_body:
        raise HTTPException(status_code=400, detail="Error in parsing JSON to model")

    ai_image = db.query(AIImage).filter(AIImage.runpod_id == runpod_webhook_body.id).first()
    if not ai_image:
        raise HTTPException(status_code=404, detail="AI Image not found")

    if (
        runpod_webhook_body.status != "COMPLETED"
        or runpod_webhook_body.output is None
        or not runpod_webhook_body.output["image_url"]
    ):
        send_slack_message(
            f"Runpod job {runpod_webhook_body.id} failed: {runpod_webhook_body.status}"
        )
        print(f"Runpod job {runpod_webhook_body.id} failed: {runpod_webhook_body.status}")
        ai_image.status = ImageProcessStatus.FAILED.value
        db.commit()
        return

    image_url = runpod_webhook_body.output["image_url"]

    response = requests.get(image_url, timeout=10000)
    if response.status_code != 200:
        send_slack_message(
            f"Runpod job {runpod_webhook_body.id} could not download image: {image_url}"
        )
        raise HTTPException(status_code=400, detail="Error in downloading image")

    image_content = BytesIO(response.content)

    file_extension = image_url.split("?")[0].split(".")[-1]

    file_name = f"{ai_image.id}.{file_extension}"
    s3_url = await upload_file_obj_to_s3(image_content, f"images/{file_name}")

    ai_image.url = s3_url
    ai_image.status = ImageProcessStatus.DONE.value
    ai_image.execution_time = runpod_webhook_body.executionTime
    ai_image.delay_time = runpod_webhook_body.delayTime
    db.commit()

    send_slack_message(f"Runpod job {runpod_webhook_body.id} completed, url: {s3_url}")


@router.put("/v1/ai-image/{image_id}/transparent")
async def upload_image_transparent(
    image_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(ValidUserFromJWT()),
):
    image = (
        db.query(AIImage)
        .filter(AIImage.id == image_id)
        .filter(AIImage.user_id == user.id)
        .first()
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
