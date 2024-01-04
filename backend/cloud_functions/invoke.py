import threading

import requests
import google.auth.transport.requests
from google.oauth2 import id_token


REMOVE_BACKGROUND_FUNCTION_URL = (
    "https://us-east1-simplethumbnail.cloudfunctions.net/SimpleThumbnail-remove-bg"
)
DOWNLOAD_VIDEO_FUNCTION_URL = (
    "https://us-east1-simplethumbnail.cloudfunctions.net/SimpleThumbnail-download-video"
)


def _invoke_function(url: str, data: dict):
    # Generate the identity token
    auth_req = google.auth.transport.requests.Request()
    token = id_token.fetch_id_token(auth_req, url)

    # Headers for the HTTP request
    headers = {"Authorization": f"Bearer {token}"}

    # Make the HTTP request
    response = requests.post(url, json=data, headers=headers)

    # Check the response
    print(response.text)


def invoke_function(url: str, data: dict):
    thread = threading.Thread(target=_invoke_function, args=(url, data))
    thread.start()


def invoke_remove_background(image_id: str):
    invoke_function(
        REMOVE_BACKGROUND_FUNCTION_URL,
        {"image_id": image_id},
    )


def invoke_download_video(url: str, video_id: str):
    invoke_function(
        DOWNLOAD_VIDEO_FUNCTION_URL,
        {"url": url, "video_id": video_id},
    )
