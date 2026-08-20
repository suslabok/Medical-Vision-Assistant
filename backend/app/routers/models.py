import json
from pathlib import Path
from fastapi import APIRouter

router = APIRouter(prefix="/models", tags=["models"])

COMPARISON_PATH = (
    Path(__file__).resolve().parents[2]
    / "ai-models"
    / "model_comparison.json"
)


@router.get("/comparison")
def get_model_comparison():
    if not COMPARISON_PATH.exists():
        return {
            "error": f"Comparison data not found: {COMPARISON_PATH}"
        }

    with open(COMPARISON_PATH, "r") as f:
        data = json.load(f)

    return data