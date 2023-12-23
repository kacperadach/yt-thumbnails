from contextlib import contextmanager

from time import time
from uuid import uuid4
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import create_engine, Column, Integer, String, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


SQLALCHEMY_DATABASE_URL = "sqlite:///./yt-thumbnails.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
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
    id: String = Column(
        String, primary_key=True, index=True, default=lambda: str(uuid4())
    )
    created_at: float = Column(Float, default=time)
    updated_at: float = Column(Float, default=time)
    deleted_at: float = Column(Float, default=time)


class User(Base, BaseTable):
    __tablename__ = "users"


class Thumbnail(Base, BaseTable):
    __tablename__ = "thumbnails"

    user_id: String = Column(String, index=True)
    thumbnail = Column(JSON, index=False)


class Image(Base, BaseTable):
    __tablename__ = "images"

    user_id: String = Column(String, index=True)
    url: String = Column(String, index=False)
    url_transparent: String = Column(String, index=False)
    status: String = Column(String, index=False)


class Video(Base, BaseTable):
    __tablename__ = "videos"

    user_id: String = Column(String, index=True)
    url: String = Column(String, index=False)
    original_url: String = Column(String, index=False)
    platform: String = Column(String, index=True)
    thumbnail_url: String = Column(String, index=False)
    status: String = Column(String, index=False)


class Render(Base, BaseTable):
    __tablename__ = "renders"

    user_id: String = Column(String, index=True)
    thumbnail_id: String = Column(String, index=True)
    url: String = Column(String, index=False)
    status: String = Column(String, index=False)
    error_message: String = Column(String, index=False)
