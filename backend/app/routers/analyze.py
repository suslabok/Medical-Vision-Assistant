from pathlib import Path
from typing import Optional

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.model import predict
from app.core.gradcam import generate_gradcam
from app.core.report import generate_report
from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.analysis import Analysis
from app.models.user import User

router = APIRouter(tags=["analyze"])

UPLOAD_DIR = Path("uploads")
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


def get_current_user_optional(
    token: str = Depends(oauth2_scheme_optional),
    db: Session = Depends(get_db),
) -> Optional[User]:
    if not token:
        return None
    payload = decode_access_token(token)
    if not payload:
        return None
    return db.query(User).filter(User.id == payload.get("sub")).first()


class AnalyzeRequest(BaseModel):
    filename: str
    original_filename: str = ""


@router.post("/analyze")
def analyze_xray(
    request: AnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    file_path = UPLOAD_DIR / request.filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Uploaded file not found. Upload it first.")

    with open(file_path, "rb") as f:
        image_bytes = f.read()

    try:
        result = predict(image_bytes)
        heatmap_base64 = generate_gradcam(image_bytes, result["class_idx"])
        report = generate_report(result["disease"], result["confidence"], result["probabilities"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")

    record = Analysis(
        filename=request.filename,
        original_filename=request.original_filename or request.filename,
        image_url=f"/uploads/{request.filename}",
        disease=result["disease"],
        confidence=result["confidence"],
        probabilities=result["probabilities"],
        heatmap=heatmap_base64,
        report_findings=report["findings"],
        report_risk_level=report["risk_level"],
        report_recommendation=report["recommendation"],
        report_full_text=report["full_report_text"],
        user_id=current_user.id if current_user else None,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "id": record.id,
        "filename": request.filename,
        "disease": result["disease"],
        "confidence": result["confidence"],
        "probabilities": result["probabilities"],
        "heatmap": heatmap_base64,
        "report": report,
        "disclaimer": "Research/educational prediction only. Not a medical diagnosis.",
    }