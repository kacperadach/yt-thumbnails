import json
from google.cloud import tasks_v2
from google.protobuf import timestamp_pb2
import datetime

TASK_HANDLER_URL = "https://api.simplethumbnail.com"
PROJECT = 'simplethumbnail'
LOCATION = 'us-east1'
QUEUE = 'SimpleThumbnail'

client = tasks_v2.CloudTasksClient()
queue_path = client.queue_path(PROJECT, LOCATION, QUEUE)


def enqueue_task(api_path: str, payload: dict):
    # Set the URL of the handler
    url = f"{TASK_HANDLER_URL}/{api_path}"

    # Construct the request body
    task = {
        'http_request': {  
            'http_method': tasks_v2.HttpMethod.POST,
            'url': url,
            'headers': {"Content-type": "application/json"},
            'body': json.dumps(payload).encode(),
        }
    }
    
    response = client.create_task(request={"parent": queue_path, "task": task})
    print('Task created:', response.name)

