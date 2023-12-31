## Create Virtual Env

python3 -m venv venv

## Activate Virual Env

.\venv\Scripts\activate

## run app

uvicorn main:app --reload --workers 4


## SSL

docker run -it --rm --name certbot \
    -p 80:80 \
    -v "/etc/letsencrypt:/etc/letsencrypt" \
    -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
    certbot/certbot certonly \
    --standalone \
    -d www.simplethumbnail.com -d app.simplethumbnail.com


## Cloud function deploy

gcloud functions deploy SimpleThumbnail-remove-bg --gen2 --runtime=python310 --region=us-east1 --source=cloud_functions/remove-bg --entry-point=remove_background --trigger-http --env-vars-file env_variables.yaml