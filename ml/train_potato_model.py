from __future__ import annotations

import argparse
import json
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import tensorflow as tf
from keras import layers, models
<<<<<<< Updated upstream
from keras.src.applications import MobileNetV2
from sklearn.metrics import classification_report, confusion_matrix
from tensorflow.keras import callbacks as kcallbacks
from tensorflow.keras.preprocessing import image_dataset
=======
from tensorflow.keras.applications import MobileNetV2
from sklearn.metrics import classification_report, confusion_matrix
from tensorflow.keras import callbacks as kcallbacks
>>>>>>> Stashed changes

CLASS_NAMES = ["Healthy", "Late Blight"]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Entrena un modelo CNN para detectar papa sana vs tizón tardío.")
    parser.add_argument("--data-dir", type=str, required=True, help="Carpeta con el dataset Kaggle.")
    parser.add_argument("--output-dir", type=str, default="../models/potato", help="Destino del modelo y etiquetas.")
    parser.add_argument("--img-size", type=int, default=224, help="Tamaño de entrada de la imagen.")
    parser.add_argument("--batch-size", type=int, default=32, help="Tamaño del batch.")
    parser.add_argument("--epochs", type=int, default=12, help="Número de épocas.")
    return parser.parse_args()


def build_model(input_shape: tuple[int, int, int] = (224, 224, 3), num_classes: int = 2) -> models.Model:
    base_model = MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights="imagenet",
        pooling="avg",
    )
    base_model.trainable = False

    inputs = layers.Input(shape=input_shape, name="image")
    x = tf.keras.applications.mobilenet_v2.preprocess_input(inputs)
    x = base_model(x, training=False)
    x = layers.Dropout(0.3)(x)
    x = layers.Dense(128, activation="relu")(x)
    x = layers.Dropout(0.2)(x)
    outputs = layers.Dense(num_classes, activation="softmax", name="predictions")(x)

    model = models.Model(inputs, outputs)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model


def prepare_datasets(data_dir: str, img_size: int, batch_size: int):
    data_path = Path(data_dir)
    if not data_path.exists():
        raise FileNotFoundError(f"No se encontró la carpeta del dataset: {data_path}")

<<<<<<< Updated upstream
    train_ds = image_dataset.image_dataset_from_directory(
=======
    train_ds = tf.keras.utils.image_dataset_from_directory(
>>>>>>> Stashed changes
        data_path,
        validation_split=0.2,
        subset="training",
        seed=42,
        image_size=(img_size, img_size),
        batch_size=batch_size,
        label_mode="int",
        color_mode="rgb",
    )
<<<<<<< Updated upstream
    val_ds = image_dataset.image_dataset_from_directory(
=======
    val_ds = tf.keras.utils.image_dataset_from_directory(
>>>>>>> Stashed changes
        data_path,
        validation_split=0.2,
        subset="validation",
        seed=42,
        image_size=(img_size, img_size),
        batch_size=batch_size,
        label_mode="int",
        color_mode="rgb",
    )

    train_ds = train_ds.prefetch(buffer_size=tf.data.AUTOTUNE)
    val_ds = val_ds.prefetch(buffer_size=tf.data.AUTOTUNE)

    return train_ds, val_ds


def save_confusion_matrix(model: models.Model, val_ds, path: Path) -> None:
    y_true = []
    y_pred = []

    for images, labels in val_ds:
        logits = model.predict(images, verbose=0)
        y_true.extend(labels.numpy().tolist())
        y_pred.extend(np.argmax(logits, axis=1).tolist())

    cm = confusion_matrix(y_true, y_pred)
    fig, ax = plt.subplots(figsize=(6, 6))
    im = ax.imshow(cm, cmap="Blues")
    ax.set_xticks(range(len(CLASS_NAMES)))
    ax.set_yticks(range(len(CLASS_NAMES)))
    ax.set_xticklabels(CLASS_NAMES)
    ax.set_yticklabels(CLASS_NAMES)
    ax.set_xlabel("Predicción")
    ax.set_ylabel("Real")
    fig.colorbar(im, ax=ax)

    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            ax.text(j, i, cm[i, j], ha="center", va="center", color="black")

    fig.tight_layout()
    fig.savefig(path, dpi=180)
    plt.close(fig)


def main() -> None:
    args = parse_args()
    img_size = args.img_size
    batch_size = args.batch_size
    epochs = args.epochs

    train_ds, val_ds = prepare_datasets(args.data_dir, img_size=img_size, batch_size=batch_size)
    model = build_model(input_shape=(img_size, img_size, 3), num_classes=2)

    callbacks = [
        kcallbacks.EarlyStopping(monitor="val_accuracy", patience=3, restore_best_weights=True),
        kcallbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=2, min_lr=1e-6),
        kcallbacks.ModelCheckpoint(
            str(Path(args.output_dir) / "potato_leaf_model.keras"),
            monitor="val_accuracy",
            save_best_only=True,
        ),
    ]

    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=epochs,
        callbacks=callbacks,
    )

    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    model.save(output_dir / "potato_leaf_model.keras")

    labels = {index: name for index, name in enumerate(CLASS_NAMES)}
    with open(output_dir / "labels.json", "w", encoding="utf-8") as f:
        json.dump(labels, f, ensure_ascii=False, indent=2)

    metrics = {
        "train_accuracy": round(float(history.history["accuracy"][-1]), 4),
        "val_accuracy": round(float(history.history["val_accuracy"][-1]), 4),
        "train_loss": round(float(history.history["loss"][-1]), 4),
        "val_loss": round(float(history.history["val_loss"][-1]), 4),
    }
    with open(output_dir / "training_metrics.json", "w", encoding="utf-8") as f:
        json.dump(metrics, f, ensure_ascii=False, indent=2)

    save_confusion_matrix(model, val_ds, output_dir / "confusion_matrix.png")

    y_true = []
    y_pred = []
    for images, labels_batch in val_ds:
        predictions = model.predict(images, verbose=0)
        y_true.extend(labels_batch.numpy().tolist())
        y_pred.extend(np.argmax(predictions, axis=1).tolist())

    print(classification_report(y_true, y_pred, target_names=CLASS_NAMES))
    print("Métricas finales:")
    print(json.dumps(metrics, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
