import type { CultivoId } from "./types";

/**
 * Taxonomía de clases usada por el clasificador de hoja de papa.
 * Alineada con los datasets públicos de referencia:
 * - nirmalsankalana/potato-leaf-healthy-and-late-blight (Healthy / Late Blight)
 * - kevinvichicela/potado-lead-dataset (Healthy / Early Blight / Late Blight)
 */
export interface ClaseEnfermedad {
  id: string;
  etiqueta: string;
  etiquetaDataset: string;
  nombreCientifico: string;
  descripcion: string;
}

export const CLASES_PAPA: ClaseEnfermedad[] = [
  {
    id: "sano",
    etiqueta: "Hoja sana",
    etiquetaDataset: "Healthy",
    nombreCientifico: "",
    descripcion:
      "Lámina verde uniforme, sin lesiones necróticas, sin halos cloróticos ni esporulación en el envés.",
  },
  {
    id: "tizon_tardio",
    etiqueta: "Tizón tardío (rancha)",
    etiquetaDataset: "Late Blight",
    nombreCientifico: "Phytophthora infestans",
    descripcion:
      "Manchas acuosas verde-oliva a marrón oscuro de borde difuso, que avanzan desde el borde o la punta; en el envés, moho blanquecino con humedad alta; los tejidos se ven húmedos y quebradizos.",
  },
  {
    id: "tizon_temprano",
    etiqueta: "Tizón temprano",
    etiquetaDataset: "Early Blight",
    nombreCientifico: "Alternaria solani",
    descripcion:
      "Manchas marrones secas, angulares y bien delimitadas, con anillos concéntricos (aspecto de diana) y halo amarillo; empieza en hojas bajeras.",
  },
  {
    id: "otra",
    etiqueta: "Otra condición",
    etiquetaDataset: "Out of distribution",
    nombreCientifico: "",
    descripcion:
      "Daño que no corresponde a las clases anteriores: deficiencias nutricionales, daño por heladas, fitotoxicidad, virosis, ácaros o insectos.",
  },
];

export const CLASES_PALTA: ClaseEnfermedad[] = [
  {
    id: "sano",
    etiqueta: "Planta sana",
    etiquetaDataset: "Healthy",
    nombreCientifico: "",
    descripcion: "Follaje y fruto sin lesiones, sin manchas ni deformaciones.",
  },
  {
    id: "antracnosis",
    etiqueta: "Antracnosis",
    etiquetaDataset: "Anthracnose",
    nombreCientifico: "Colletotrichum gloeosporioides",
    descripcion: "Manchas circulares deprimidas y oscuras en fruto, que se hunden al madurar.",
  },
  {
    id: "roña",
    etiqueta: "Roña o sarna",
    etiquetaDataset: "Scab",
    nombreCientifico: "Sphaceloma perseae",
    descripcion: "Lesiones corchosas, rugosas y superficiales en la cáscara del fruto.",
  },
  {
    id: "otra",
    etiqueta: "Otra condición",
    etiquetaDataset: "Out of distribution",
    nombreCientifico: "",
    descripcion: "Deficiencias nutricionales, daño por sales, ácaros, trips o daño mecánico.",
  },
];

export function clasesDe(cultivo: CultivoId): ClaseEnfermedad[] {
  return cultivo === "papa" ? CLASES_PAPA : CLASES_PALTA;
}

export function claseDe(cultivo: CultivoId, id: string): ClaseEnfermedad | undefined {
  return clasesDe(cultivo).find((c) => c.id === id);
}

/** Umbral por debajo del cual el resultado se marca como no concluyente. */
export const UMBRAL_CONFIANZA = 55;

export const DATASETS_REFERENCIA = [
  {
    nombre: "Potato Leaf: Healthy & Late Blight",
    autor: "nirmalsankalana",
    clases: "Healthy · Late Blight",
    url: "https://www.kaggle.com/datasets/nirmalsankalana/potato-leaf-healthy-and-late-blight",
  },
  {
    nombre: "Potato Leaf Dataset",
    autor: "kevinvichicela",
    clases: "Healthy · Early Blight · Late Blight",
    url: "https://www.kaggle.com/datasets/kevinvichicela/potado-lead-dataset",
  },
];
