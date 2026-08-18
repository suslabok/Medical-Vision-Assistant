from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.database import get_db
from app.models.analysis import Analysis
from app.schemas.analysis import AnalysisOut, AnalysisListOut
from fastapi.responses import Response
from app.core.pdf_report import generate_pdf_report
router = APIRouter(tags=["history"])


@router.get("/history", response_model=list[AnalysisListOut])
def get_history(
    db: Session = Depends(get_db),
    disease: Optional[str] = Query(None, description="Filter by predicted disease, e.g. PNEUMONIA"),
    search: Optional[str] = Query(None, description="Search by original filename"),
    limit: int = Query(50, le=200),
    offset: int = Query(0, ge=0),
):
    query = db.query(Analysis)

    if disease:
        query = query.filter(Analysis.disease == disease.upper())
    if search:
        query = query.filter(Analysis.original_filename.ilike(f"%{search}%"))

    query = query.order_by(desc(Analysis.created_at)).offset(offset).limit(limit)
    return query.all()


@router.get("/analysis/{analysis_id}", response_model=AnalysisOut)
def get_analysis(analysis_id: str, db: Session = Depends(get_db)):
    record = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis not found.")
    return record


@router.delete("/analysis/{analysis_id}")
def delete_analysis(analysis_id: str, db: Session = Depends(get_db)):
    record = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis not found.")
    db.delete(record)
    db.commit()
    return {"message": "Analysis deleted successfully."}
@router.get("/analysis/{analysis_id}/pdf")
def download_analysis_pdf(analysis_id: str, db: Session = Depends(get_db)):
    record = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis not found.")

    pdf_bytes = generate_pdf_report(record)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="report_{analysis_id[:8]}.pdf"'
        },
    )