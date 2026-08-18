
import io
import base64

import numpy as np
import torch
import cv2
from PIL import Image
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image

from app.core.model import _model, _transform, device


def generate_gradcam(image_bytes: bytes, predicted_class_idx: int) -> str:
    """
    Returns a base64-encoded PNG string of the original X-ray with the
    Grad-CAM heatmap overlaid, ready to send straight to the frontend.
    """
    if _model is None:
        raise RuntimeError("Model not loaded.")

    # DenseNet121's last conv block — this is where Grad-CAM "looks"
    target_layers = [_model.features.denseblock4]

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    input_tensor = _transform(image).unsqueeze(0).to(device)

    # Resize original image to 224x224 to match the heatmap dimensions,
    # normalize to 0-1 float for overlay blending
    rgb_img = np.array(image.resize((224, 224))).astype(np.float32) / 255.0

    cam = GradCAM(model=_model, target_layers=target_layers)
    grayscale_cam = cam(input_tensor=input_tensor, targets=None)[0]  # uses top predicted class by default

    overlay = show_cam_on_image(rgb_img, grayscale_cam, use_rgb=True)

    # Encode overlay as base64 PNG
    success, buffer = cv2.imencode(".png", cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR))
    if not success:
        raise RuntimeError("Failed to encode Grad-CAM overlay.")

    base64_str = base64.b64encode(buffer).decode("utf-8")
    return f"data:image/png;base64,{base64_str}"