import subprocess
import json
import os

from fastapi import Depends, APIRouter, HTTPException
from pydantic import BaseModel

# from remotion_lambda import RenderParams, RenderProgressParams
# from remotion_lambda import RemotionClient
from sqlalchemy.orm import Session

from db.models import get_db, get_db_context_manager, User, Thumbnail, Render
from worker import q

router = APIRouter()

# REMOTION_APP_REGION = os.getenv("REMOTION_APP_REGION")
# if not REMOTION_APP_REGION:
#     raise Exception("REMOTION_APP_REGION is not set")
# REMOTION_APP_FUNCTION_NAME = os.getenv("REMOTION_APP_FUNCTION_NAME")
# if not REMOTION_APP_FUNCTION_NAME:
#     raise Exception("REMOTION_APP_FUNCTION_NAME is not set")
# REMOTION_APP_SERVE_URL = os.getenv("REMOTION_APP_SERVE_URL")
# if not REMOTION_APP_SERVE_URL:
#     raise Exception("REMOTION_APP_SERVE_URL is not set")

# client = RemotionClient(
#     region=REMOTION_APP_REGION,
#     serve_url=REMOTION_APP_SERVE_URL,
#     function_name=REMOTION_APP_FUNCTION_NAME,
# )


async def render_thumbnail(thumbnail: dict, render_id: str):
    script_dir = os.path.dirname(os.path.realpath(__file__))
    js_file_path = os.path.join(script_dir, "render.js")
    # Define arguments to pass

    print(os.getenv("REMOTION_AWS_ACCESS_KEY_ID"))
    print(os.getenv("REMOTION_AWS_SECRET_ACCESS_KEY"))
    arguments = [
        os.getenv("REMOTION_AWS_ACCESS_KEY_ID"),
        os.getenv("REMOTION_AWS_SECRET_ACCESS_KEY"),
        json.dumps(thumbnail),
    ]

    # Run the JavaScript file with Node.js and pass arguments
    result = subprocess.run(
        ["node", js_file_path] + arguments, capture_output=True, text=True
    )

    with get_db_context_manager() as db:
        render = db.query(Render).filter(Render.id == render_id).first()
        if not render:
            raise Exception("Render not found")

        if result.stdout:
            render.status = "success"
            render.url = result.stdout.replace("\n", "")
            db.add(render)
            db.commit()
            db.refresh(render)
        else:
            print(result.stderr)
            render.status = "failed"
            render.error_message = result.stderr
            db.add(render)
            db.commit()
            db.refresh(render)


class RenderRequest(BaseModel):
    user_id: str
    thumbnail_id: str


@router.post("/v1/render/initiate")
async def initiate_render(render_request: RenderRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == render_request.user_id).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid render")

    thumbnail = (
        db.query(Thumbnail)
        .filter(Thumbnail.id == render_request.thumbnail_id)
        .filter(Thumbnail.user_id == render_request.user_id)
        .first()
    )
    if not thumbnail:
        raise HTTPException(status_code=400, detail="Invalid render")

    # render_params = RenderParams(
    #     composition="ThumbnailComposition",
    #     # Note: In Python, you pass input props using `data`, not `input_props`
    #     data={"thumbnail": json.dumps(thumbnail.thumbnail)},
    # )

    render = Render(
        user_id=render_request.user_id,
        thumbnail_id=render_request.thumbnail_id,
        status="pending",
    )

    db.add(render)
    db.commit()
    db.refresh(render)

    # script_dir = os.path.dirname(os.path.realpath(__file__))
    # js_file_path = os.path.join(script_dir, "render.js")
    # # Define arguments to pass

    # arguments = [
    #     os.getenv("REMOTION_AWS_ACCESS_KEY_ID"),
    #     os.getenv("REMOTION_AWS_SECRET_ACCESS_KEY"),
    #     json.dumps(thumbnail.thumbnail),
    # ]

    # # Run the JavaScript file with Node.js and pass arguments
    # result = subprocess.run(
    #     ["node", js_file_path] + arguments, capture_output=True, text=True
    # )

    # if result.stdout:
    #     render.status = "success"
    #     render.url = result.stdout.replace("\n", "")
    #     db.add(render)
    #     db.commit()
    #     db.refresh(render)
    # else:
    #     print(result.stderr)
    #     render.status = "failed"
    #     render.error_message = result.stderr
    #     db.add(render)
    #     db.commit()
    #     db.refresh(render)

    q.enqueue(render_thumbnail, thumbnail.thumbnail, render.id)

    return render


@router.get("/v1/render/{render_id}")
async def get_render(render_id: str, db: Session = Depends(get_db)):
    render = db.query(Render).filter(Render.id == render_id).first()
    if not render:
        raise HTTPException(status_code=404, detail="Render not found")
    return render
