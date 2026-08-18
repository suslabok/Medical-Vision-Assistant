"""
Generates a Grad-CAM heatmap overlay showing which regions of the X-ray
most influenced the model's prediction.
"""
import io
import base64

import numpy as np
import torch
import cv2
from PIL import Image
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image

from app.core import model as model_module


def generate_gradcam(image_bytes: bytes, predicted_class_idx: int) -> str:
    """
    Returns a base64-encoded PNG string of the original X-ray with the
    Grad-CAM heatmap overlaid, ready to send straight to the frontend.
    """
    if model_module._model is None:
        raise RuntimeError("Model not loaded.")

    target_layers = [model_module._model.features.denseblock4]

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    input_tensor = model_module._transform(image).unsqueeze(0).to(model_module.device)

    rgb_img = np.array(image.resize((224, 224))).astype(np.float32) / 255.0

    cam = GradCAM(model=model_module._model, target_layers=target_layers)
    grayscale_cam = cam(input_tensor=input_tensor, targets=None)[0]

    overlay = show_cam_on_image(rgb_img, grayscale_cam, use_rgb=True)

    success, buffer = cv2.imencode(".png", cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR))
    if not success:
        raise RuntimeError("Failed to encode Grad-CAM overlay.")

    base64_str = base64.b64encode(buffer).decode("utf-8")
    return f"data:image/png;base64,{base64_str}"