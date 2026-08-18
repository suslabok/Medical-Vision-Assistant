"""
Loads the trained DenseNet121 checkpoint once at startup and exposes a
single `predict()` function used by the /analyze endpoint.
"""
import io
from pathlib import Path

import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image

MODEL_PATH = Path("ai-models/checkpoints/densenet121_chest_xray.pt")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

_model = None
_classes = None


def load_model():
    """Loads the checkpoint into memory. Called once on app startup."""
    global _model, _classes

    checkpoint = torch.load(MODEL_PATH, map_location=device)
    _classes = checkpoint["classes"]

    model = models.densenet121(weights=None)
    model.classifier = nn.Linear(model.classifier.in_features, len(_classes))
    model.load_state_dict(checkpoint["model_state_dict"])
    model.to(device)
    model.eval()

    _model = model
    print(f"✅ Model loaded. Classes: {_classes}, device: {device}")


def predict(image_bytes: bytes) -> dict:
    """Runs inference on raw image bytes and returns disease + confidence + full probability distribution."""
    if _model is None:
        raise RuntimeError("Model not loaded. Call load_model() on startup.")

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    tensor = _transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = _model(tensor)
        probs = torch.softmax(outputs, dim=1)[0]

    predicted_idx = int(torch.argmax(probs))
    predicted_class = _classes[predicted_idx]
    confidence = float(probs[predicted_idx]) * 100

    all_probs = {
        _classes[i]: round(float(probs[i]) * 100, 2)
        for i in range(len(_classes))
    }

    return {
        "disease": predicted_class,
        "confidence": round(confidence, 2),
        "probabilities": all_probs,
        "class_idx": predicted_idx,
    }