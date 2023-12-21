## Create Virtual Env

python3 -m venv venv

## Activate Virual Env

.\venv\Scripts\activate

## run app

uvicorn main:app --reload --workers 4
