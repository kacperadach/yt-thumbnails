import boto3
import os
from botocore.exceptions import NoCredentialsError


def create_s3_client():
    return boto3.client(
        "s3",
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        region_name=os.getenv("AWS_REGION"),
    )


async def upload_file_to_s3(file_name, object_name=None):
    aws_region = os.getenv("AWS_REGION")
    s3_bucket = os.getenv("AWS_BUCKET_NAME")

    if object_name is None:
        object_name = file_name

    s3_client = create_s3_client()
    try:
        s3_client.upload_file(file_name, s3_bucket, object_name)
        file_url = f"https://{s3_bucket}.s3.{aws_region}.amazonaws.com/{object_name}"
        return file_url
    except NoCredentialsError:
        print("Credentials not available")
        return None
