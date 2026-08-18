import json
from pathlib import Path
from fastapi import APIRouter

router = APIRouter(prefix="/models", tags=["models"])

COMPARISON_PATH = Path("ai-models/model_comparison.json")


@router.get("/comparison")
def get_model_comparison():
    if not COMPARISON_PATH.exists():
        return {"error": "Comparison data not found. Train and save both models first."}

    with open(COMPARISON_PATH) as f:
        data = json.load(f)

    return data