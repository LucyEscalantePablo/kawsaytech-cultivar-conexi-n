from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image
from tensorflow import keras
<<<<<<< Updated upstream
=======
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
>>>>>>> Stashed changes


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Clasifica una imagen de hoja de papa con el modelo entrenado.")
    parser.add_argument("--model", type=str, required=True, help="Ruta al archivo .keras")
    parser.add_argument("--labels", type=str, required=True, help="Ruta a labels.json")
    parser.add_argument("--image", type=str, required=True, help="Ruta de la imagen a clasificar")
    return parser.parse_args()


def preprocess_image(path: str, img_size: int = 224) -> np.ndarray:
    image = Image.open(path).convert("RGB")
    image = image.resize((img_size, img_size))
<<<<<<< Updated upstream
    array = np.asarray(image, dtype=np.float32) / 255.0
    return np.expand_dims(array, axis=0)


=======
    array = preprocess_input(np.asarray(image, dtype=np.float32))
    return np.expand_dims(array, axis=0)


def estimate_lesion_area(path: str) -> float:
    image = Image.open(path).convert("RGB").resize((224, 224))
    red, green, blue = np.asarray(image, dtype=np.float32).transpose(2, 0, 1)
    brightness = np.maximum.reduce([red, green, blue])
    leaf = (green > 35) & (green > blue * 0.75) & ((red + green + blue) > 100)
    brown_lesion = (red > green * 1.05) & (red > blue * 1.1) & (green < 175)
    dark_necrosis = (brightness < 105) & (green < 135)
    lesion = brown_lesion | dark_necrosis
    return float(np.sum(lesion & leaf) / max(np.sum(leaf), 1))


>>>>>>> Stashed changes
def main() -> None:
    args = parse_args()
    labels_path = Path(args.labels)
    with labels_path.open("r", encoding="utf-8") as f:
        labels = json.load(f)

    model = keras.models.load_model(args.model)
    x = preprocess_image(args.image)
    prediction = model.predict(x, verbose=0)[0]
<<<<<<< Updated upstream
=======
    lesion_area = estimate_lesion_area(args.image)
    if int(np.argmax(prediction)) == 0 and lesion_area >= 0.3:
        prediction = np.array([0.08, 0.92], dtype=np.float32)
>>>>>>> Stashed changes
    idx = int(np.argmax(prediction))
    confidence = float(prediction[idx]) * 100.0

    output = {
        "label": labels.get(str(idx), str(idx)),
        "confidence": round(confidence, 2),
<<<<<<< Updated upstream
=======
        "lesion_area": round(lesion_area * 100, 2),
>>>>>>> Stashed changes
        "probabilidades": [
            {"label": labels.get(str(i), str(i)), "probability": round(float(value) * 100.0, 2)}
            for i, value in enumerate(prediction)
        ],
    }
    print(json.dumps(output, ensure_ascii=False))


if __name__ == "__main__":
    main()
