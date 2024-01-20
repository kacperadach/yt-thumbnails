import os
from typing import Optional

from pydantic import BaseModel
import requests


RUNPOD_API_KEY = os.environ.get("RUNPOD_API_KEY")
WEBHOOK = os.environ.get("API_BASE_URL") + "/api/v1/ai-image/runpod-webhook"

RUNPOD_URL = "https://api.runpod.ai/v2/sdxl/run"


class RunpodSDInput(BaseModel):
    prompt: str
    negative_prompt: str
    num_inference_steps: int
    refiner_inference_steps: int
    width: int
    height: int
    guidance_scale: float
    strength: float
    seed: Optional[int]
    num_images: int
    image_url: Optional[str]


class RunpodBody(BaseModel):
    input: RunpodSDInput
    webhook: str


# {
#     "id": "a625d9b4-8652-49c2-bdf4-1fc081682376-u1",
#     "status": "IN_QUEUE"
# }


class RunpodResponse(BaseModel):
    id: str
    status: str


# INPUT = {
#     "input": {
#         "prompt": "building 8 stories",
#         "num_inference_steps": 25,
#         "refiner_inference_steps": 50,
#         "width": 1024,
#         "height": 1024,
#         "guidance_scale": 7.5,
#         "strength": 0.3,
#         "seed": null,
#         "num_images": 1,
#         "negative_prompt": "test",
#         "image_url": "t",
#     },
#     "webhook": "test",
# }

MAX_WIDTH = 1280
MAX_HEIGHT = 720

BACKGROUND_WIDTH = 1280
BACKGROUND_HEIGHT = 720


def generate_asset_image_runpod(
    prompt: str, negative_prompt: str, width: int, height: int
) -> RunpodResponse:
    return _generate_image_runpod(
        prompt,
        negative_prompt,
        width,
        height,
    )


def generate_background_image_runpod(prompt: str, negative_prompt: str) -> RunpodResponse:
    return _generate_image_runpod(prompt, negative_prompt, BACKGROUND_WIDTH, BACKGROUND_HEIGHT)


def _generate_image_runpod(
    prompt: str, negative_prompt: str, width: int, height: int, image_url: Optional[str] = None
) -> RunpodResponse:
    return _call_runpod_sd(
        RunpodSDInput(
            prompt=prompt,
            negative_prompt=negative_prompt,
            num_inference_steps=25,
            refiner_inference_steps=50,
            width=min(width, MAX_WIDTH),
            height=min(height, MAX_HEIGHT),
            guidance_scale=7.5,
            strength=0.3,
            seed=None,
            num_images=1,
            image_url=image_url,
        )
    )


def _call_runpod_sd(runpod_input: RunpodSDInput) -> RunpodResponse:
    body = RunpodBody(input=runpod_input, webhook=WEBHOOK)
    response = requests.post(
        RUNPOD_URL,
        json=body.dict(),
        headers={"Authorization": "Bearer " + RUNPOD_API_KEY},
        timeout=10000,
    )
    print(response.json())
    return RunpodResponse(**response.json())
