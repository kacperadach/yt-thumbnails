from fastapi import FastAPI, Depends, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from db.models import Base, engine, get_db
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from routers.thumbnails import router as thumbnail_router
from routers.images import router as image_router
from routers.videos import router as video_router

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def read_root(db: Session = Depends(get_db)):
    return {"Hello": "World"}


app.include_router(thumbnail_router, prefix="/api")
app.include_router(image_router, prefix="/api")
app.include_router(video_router, prefix="/api")
