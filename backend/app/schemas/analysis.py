from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class AnalysisOut(BaseModel):
    id: str
    filename: str
    original_filename: str
    image_url: str
    disease: str
    confidence: float
    probabilities: dict
    heatmap: Optional[str] = None
    report_findings: Optional[str] = None
    report_risk_level: Optional[str] = None
    report_recommendation: Optional[str] = None
    report_full_text: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AnalysisListOut(BaseModel):
    """Lighter version for the history list view — no heatmap/full report to keep it fast."""
    id: str
    filename: str
    original_filename: str
    image_url: str
    disease: str
    confidence: float
    report_risk_level: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True