import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Float, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))

    filename: Mapped[str] = mapped_column(String, nullable=False)
    original_filename: Mapped[str] = mapped_column(String, nullable=False)
    image_url: Mapped[str] = mapped_column(String, nullable=False)

    disease: Mapped[str] = mapped_column(String, nullable=False)
    confidence: Mapped[float] = mapped_column(Float, nullable=False)
    probabilities: Mapped[dict] = mapped_column(JSON, nullable=False)

    heatmap: Mapped[str] = mapped_column(Text, nullable=True)

    report_findings: Mapped[str] = mapped_column(Text, nullable=True)
    report_risk_level: Mapped[str] = mapped_column(String, nullable=True)
    report_recommendation: Mapped[str] = mapped_column(Text, nullable=True)
    report_full_text: Mapped[str] = mapped_column(Text, nullable=True)

    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )