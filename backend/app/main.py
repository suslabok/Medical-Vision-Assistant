from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.model import load_model
from app.core.database import engine, Base
from app.models import analysis  # noqa: F401 — registers the model with Base
from app.routers import health, upload, analyze, history
from app.models import analysis, user  # noqa: F401
from app.routers import health, upload, analyze, history, auth
from app.routers import health, upload, analyze, history, auth, analytics
from app.routers import health, upload, analyze, history, auth, analytics, models

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix=settings.API_V1_PREFIX)
app.include_router(upload.router, prefix=settings.API_V1_PREFIX)
app.include_router(analyze.router, prefix=settings.API_V1_PREFIX)
app.include_router(history.router, prefix=settings.API_V1_PREFIX)
app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.include_router(analytics.router, prefix=settings.API_V1_PREFIX)
app.include_router(models.router, prefix=settings.API_V1_PREFIX)

@app.on_event("startup")
def startup_event():
    load_model()
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables ready.")


@app.get("/")
def root():
    return {"message": "Medical Vision Assistant API", "docs": "/docs"}