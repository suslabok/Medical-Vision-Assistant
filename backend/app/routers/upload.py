import os
import uuid
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image

router = APIRouter(tags=["upload"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/jpg"}
MAX_FILE_SIZE_MB = 10


@router.post("/upload")
async def upload_xray(file: UploadFile = File(...)):
    # Validate content type
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.content_type}'. Only JPEG/PNG X-ray images are accepted.",
        )

    # Read file into memory to check size
    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"File too large ({size_mb:.1f}MB). Max size is {MAX_FILE_SIZE_MB}MB.",
        )

    # Validate it's actually a readable image (not a renamed .exe etc.)
    import io
    try:
        img = Image.open(io.BytesIO(contents))
        img.verify()
    except Exception:
        raise HTTPException(status_code=400, detail="File is not a valid image.")

    # Generate a unique filename and save
    ext = file.filename.split(".")[-1].lower()
    unique_name = f"{uuid.uuid4()}.{ext}"
    save_path = UPLOAD_DIR / unique_name

    with open(save_path, "wb") as f:
        f.write(contents)

    return {
        "filename": unique_name,
        "original_filename": file.filename,
        "size_mb": round(size_mb, 2),
        "url": f"/uploads/{unique_name}",
        "message": "X-ray uploaded successfully. Ready for analysis (Phase 4).",
    }