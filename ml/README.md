# Entrenamiento del modelo para diagnóstico de papa

Este módulo prepara un pipeline de machine learning para reconocer hojas sanas y con tizón tardío a partir del dataset público:

- Potato Leaf: Healthy and Late Blight
- https://www.kaggle.com/datasets/nirmalsankalana/potato-leaf-healthy-and-late-blight

## Estructura esperada del dataset

Descarga el dataset en una carpeta local y deja la estructura así:

```text
data/
  Potato___Healthy/
    image1.jpg
    image2.jpg
    ...
  Potato___Late_blight/
    image1.jpg
    image2.jpg
    ...
```

## Instalación

<<<<<<< Updated upstream
Importante: el entrenamiento real requiere Python 3.12.x. TensorFlow 2.16 no soporta Python 3.14 en Windows.
=======
Importante: el entrenamiento real requiere Python 3.12.x. TensorFlow 2.16/2.17 no soporta Python 3.14 en Windows.
>>>>>>> Stashed changes

```bash
cd ml
python3.12 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

<<<<<<< Updated upstream
Si no tienes Python 3.12 instalado, instálalo desde python.org o con un gestor como pyenv. En Windows, el intérprete 3.14 del entorno actual no es compatible con TensorFlow 2.16.
=======
Si no tienes Python 3.12 instalado, instálalo desde python.org o con un gestor como pyenv. En Windows, el intérprete 3.14 del entorno actual no es compatible con TensorFlow.
>>>>>>> Stashed changes

## Entrenamiento

```bash
python train_potato_model.py --data-dir ../data --output-dir ../models/potato
```

Esto generará:

- modelo Keras en formato .keras
- labels.json con la correspondencia de clases
- métricas del entrenamiento en la consola

## Modelo

El pipeline usa una arquitectura basada en MobileNetV2 con fine-tuning para clasificación binaria:

- Healthy
- Late Blight

## Importante

El entrenamiento real requiere que el dataset esté descargado localmente y que la máquina tenga suficiente VRAM o al menos RAM para procesar lotes de imágenes.
