import os
import shutil

SHARED_DIR = "/usr/src/app/shared"
TMP_DIR = os.path.join(SHARED_DIR, "tmp")
os.makedirs(TMP_DIR, exist_ok=True)


def write_file(file_location, file):
    file_path = os.path.join(TMP_DIR, file_location)
    with open(file_path, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
    return file_path

