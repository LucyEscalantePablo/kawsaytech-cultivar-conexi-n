from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image
from tensorflow import keras


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Clasifica una imagen de hoja de papa con el modelo entrenado.")
    parser.add_argument("--model", type=str, required=True, help="Ruta al archivo .keras")
    parser.add_argument("--labels", type=str, required=True, help="Ruta a labels.json")
    parser.add_argument("--image", type=str, required=True, help="Ruta de la imagen a clasificar")
    return parser.parse_args()


def preprocess_image(path: str, img_size: int = 224) -> np.ndarray:
    image = Image.open(path).convert("RGB")
    image = image.resize((img_size, img_size))
    array = np.asarray(image, dtype=np.float32) / 255.0
    return np.expand_dims(array, axis=0)


def main() -> None:
    args = parse_args()
    labels_path = Path(args.labels)
    with labels_path.open("r", encoding="utf-8") as f:
        labels = json.load(f)

    model = keras.models.load_model(args.model)
    x = preprocess_image(args.image)
    prediction = model.predict(x, verbose=0)[0]
    idx = int(np.argmax(prediction))
    confidence = float(prediction[idx]) * 100.0

    output = {
        "label": labels.get(str(idx), str(idx)),
        "confidence": round(confidence, 2),
        "probabilidades": [
            {"label": labels.get(str(i), str(i)), "probability": round(float(value) * 100.0, 2)}
            for i, value in enumerate(prediction)
        ],
    }
    print(json.dumps(output, ensure_ascii=False))


if __name__ == "__main__":
    main()
