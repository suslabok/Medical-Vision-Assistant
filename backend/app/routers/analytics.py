
from collections import Counter
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.models.analysis import Analysis

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    total = db.query(func.count(Analysis.id)).scalar() or 0

    if total == 0:
        return {
            "total_analyses": 0,
            "disease_distribution": [],
            "avg_confidence": 0,
            "risk_distribution": [],
            "volume_last_7_days": [],
        }

    # Disease distribution
    disease_rows = db.query(Analysis.disease, func.count(Analysis.id)).group_by(Analysis.disease).all()
    disease_distribution = [{"disease": d, "count": c} for d, c in disease_rows]

    # Average confidence
    avg_confidence = db.query(func.avg(Analysis.confidence)).scalar() or 0

    # Risk level distribution
    risk_rows = db.query(Analysis.report_risk_level, func.count(Analysis.id)).group_by(Analysis.report_risk_level).all()
    risk_distribution = [{"risk_level": r or "Unknown", "count": c} for r, c in risk_rows]

    # Volume over last 7 days
    since = datetime.now(timezone.utc) - timedelta(days=7)
    recent = db.query(Analysis.created_at).filter(Analysis.created_at >= since).all()
    date_counts = Counter(row.created_at.strftime("%Y-%m-%d") for row in recent)

    volume_last_7_days = []
    for i in range(6, -1, -1):
        day = (datetime.now(timezone.utc) - timedelta(days=i)).strftime("%Y-%m-%d")
        volume_last_7_days.append({"date": day, "count": date_counts.get(day, 0)})

    return {
        "total_analyses": total,
        "disease_distribution": disease_distribution,
        "avg_confidence": round(float(avg_confidence), 2),
        "risk_distribution": risk_distribution,
        "volume_last_7_days": volume_last_7_days,
    }