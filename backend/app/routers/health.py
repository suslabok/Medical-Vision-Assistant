
from fastapi import APIRouter

from app.core.database import check_db_connection
from app.core.config import settings

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check():
    db_ok = check_db_connection()
    return {
        "status": "ok" if db_ok else "degraded",
        "app": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "database_connected": db_ok,
    }
