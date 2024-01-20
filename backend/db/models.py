import os
from contextlib import contextmanager
import enum

from time import time
from uuid import uuid4
from sqlalchemy import create_engine, Column, String, Float, JSON, Enum, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLALCHEMY_DATABASE_URL = "sqlite:///./yt-thumbnails.db"

engine = create_engine(os.environ.get("POSTGRES_CONNECTION_STRING"))
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


@contextmanager
def get_db_context_manager():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class BaseTable:
    id: String = Column(String, primary_key=True, index=True, default=lambda: str(uuid4()))
    created_at: float = Column(Float, default=time)
    updated_at: float = Column(Float, default=time)
    deleted_at: float = Column(Float, default=time)


class SubscriptionTier(enum.Enum):
    FREE = "free"
    STARTER_MONTHLY = "starter_monthly"
    STARTER_YEARLY = "starter_yearly"
    PRO_MONTHLY = "pro_monthly"
    PRO_YEARLY = "pro_yearly"
    PREMIUM_MONTHLY = "premium_monthly"
    PREMIUM_YEARLY = "premium_yearly"


class SubscriptionStatus(enum.Enum):
    ACTIVE = "active"
    PAYMENT_FAILED = "payment_failed"
    INACTIVE = "inactive"


class User(Base, BaseTable):
    __tablename__ = "users"

    email: str = Column(String, index=True)
    stripe_customer_id: str = Column(String)
    subscription_tier: str = Column(String, default=SubscriptionTier.FREE.value)
    subscription_status: str = Column(String, default=SubscriptionStatus.INACTIVE.value)
    subscription_id: str = Column(String)
    subscription_payment_at: float = Column(Float, default=0)


class Thumbnail(Base, BaseTable):
    __tablename__ = "thumbnails"

    user_id: String = Column(String, index=True)
    thumbnail = Column(JSON)
    template_id: String = Column(String, index=True)


class ImageProcessStatus(enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    DONE = "done"
    FAILED = "failed"


class Image(Base, BaseTable):
    __tablename__ = "images"

    user_id: String = Column(String, index=True)
    url: String = Column(String)
    url_transparent: String = Column(String)


class AIImage(Base, BaseTable):
    __tablename__ = "ai_images"

    user_id: String = Column(String, index=True)
    url: String = Column(String)
    url_transparent: String = Column(String)

    status: String = Column(String)
    runpod_id: String = Column(String, index=True)
    prompt: String = Column(String)
    negative_prompt: String = Column(String)
    width: int = Column(Integer)
    height: int = Column(Integer)
    execution_time: float = Column(Integer)
    delay_time: float = Column(Integer)


class Video(Base, BaseTable):
    __tablename__ = "videos"

    user_id: String = Column(String, index=True)
    url: String = Column(String)
    original_url: String = Column(String)
    platform: String = Column(String, index=True)
    thumbnail_url: String = Column(String)
    status: String = Column(String)


class Render(Base, BaseTable):
    __tablename__ = "renders"

    user_id: String = Column(String, index=True)
    thumbnail_id: String = Column(String, index=True)
    url: String = Column(String)
    status: String = Column(String)
    error_message: String = Column(String)


class Template(Base, BaseTable):
    __tablename__ = "templates"

    user_id: String = Column(String, index=True)
    name: String = Column(String)
    template = Column(JSON)
