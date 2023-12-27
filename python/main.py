from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from db.models import Base, engine
from contextlib import asynccontextmanager

from routers.thumbnails import router as thumbnail_router
from routers.images import router as image_router
from routers.videos import router as video_router
from routers.render import router as render_router


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


app.include_router(thumbnail_router, prefix="/api")
app.include_router(image_router, prefix="/api")
app.include_router(video_router, prefix="/api")
app.include_router(render_router, prefix="/api")

# app.mount(
#     "/",
#     StaticFiles(directory="build", html=True),
#     name="static",
# )
