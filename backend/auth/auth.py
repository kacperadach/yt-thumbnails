import os

from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import time
from typing import Dict
import supabase
from supabase import create_client, Client
import jwt
from sqlalchemy.orm import Session

from db.models import get_db, User


JWT_SECRET = os.environ.get("JWT_SECRET")
JWT_ALGORITHM = "HS256"

supabase: Client = create_client(
    os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY")
)


class ValidUserFromJWT:
    def __init__(self):
        pass

    async def __call__(self, request: Request, db: Session = Depends(get_db)):
        credentials: HTTPAuthorizationCredentials = await HTTPBearer()(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(
                    status_code=403, detail="Invalid authentication scheme."
                )
            if not verify_jwt(credentials.credentials):
                raise HTTPException(
                    status_code=403, detail="Invalid token or expired token."
                )
            user = get_user_from_JWT(credentials.credentials, db)
            if not user:
                raise HTTPException(status_code=403, detail="Invalid token")

            return user
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")


def verify_jwt(jwtoken: str) -> bool:
    try:
        return not not decodeJWT(jwtoken)
    except:
        return False


def decodeJWT(token: str) -> Dict:
    try:
        decoded_token = jwt.decode(
            token, JWT_SECRET, algorithms=[JWT_ALGORITHM], options={"verify_aud": False}
        )
        print(f"Decoded token: {decoded_token}")
        return decoded_token if decoded_token["exp"] >= time.time() else None
    except Exception as e:
        print(f"Error decoding token: {e}")
        return {}


def get_user_from_JWT(token: str, db: Session) -> User | None:
    payload = decodeJWT(token)
    if not payload:
        print(f"Could not decode JWT: {token}")
        return None
    user_id = payload["sub"]

    if user_id is None:
        return None

    print(f"Got user_id from JWT: {user_id}")
    try:
        data = supabase.auth.get_user(token)
        if not data:
            print(f"User not found in supabase {user_id}")
            return None

        print(f"User found in supabase {user_id}: {data.user}")

        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            print(f"User not found, creating: {user_id}")

            user = User(
                id=user_id,
                email=data.user.email,
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        return user
    except Exception as e:
        print(f"Error getting user {user_id}: {e}")
        return None
