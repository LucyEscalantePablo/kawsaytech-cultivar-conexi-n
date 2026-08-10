import type { CultivoId } from "./types";

export type SueloId = "arenoso" | "franco" | "arcilloso";

export const SUELOS: Record<SueloId, { nombre: string; factor: number; nota: string }> = {
  arenoso: {
    nombre: "Arenoso",
    factor: 1.15,
    nota: "Retiene poco nutriente: fraccionar más las aplicaciones y regar seguido.",
  },
  franco: {
    nombre: "Franco",
    factor: 1,
    nota: "Suelo equilibrado: dosis estándar y buena respuesta a la fertilización.",
  },
  arcilloso: {
    nombre: "Arcilloso",
    factor: 0.9,
    nota: "Retiene humedad y nutrientes: evitar exceso de riego y de nitrógeno.",
  },
};

/** Extracción de nutrientes por tonelada de cosecha (kg de N, P2O5, K2O). */
const EXTRACCION: Record<CultivoId, { n: number; p: number; k: number; rendRef: number }> = {
  papa: { n: 4.2, p: 1.6, k: 6.5, rendRef: 22 },
  palta: { n: 5.5, p: 1.2, k: 7.2, rendRef: 12 },
};

export interface Aplicacion {
  etapa: string;
  momento: string;
  n: number;
  p: number;
  k: number;
  nota: string;
}

export interface PlanFertilizacion {
  n: number;
  p: number;
  k: number;
  urea: number;
  fosfato: number;
  cloruro: number;
  aplicaciones: Aplicacion[];
  nota: string;
}

const FRACCIONES: Record<CultivoId, { etapa: string; momento: string; n: number; p: number; k: number; nota: string }[]> = {
  papa: [
    { etapa: "Siembra", momento: "Día 0", n: 0.3, p: 1, k: 0.4, nota: "Aplicar al fondo del surco y tapar con tierra." },
    { etapa: "Aporque", momento: "35-45 días", n: 0.5, p: 0, k: 0.4, nota: "Aprovechar el aporque para incorporar el fertilizante." },
    { etapa: "Tuberización", momento: "60-75 días", n: 0.2, p: 0, k: 0.2, nota: "Reforzar potasio para el llenado de tubérculos." },
  ],
  palta: [
    { etapa: "Prefloración", momento: "Ago - Set", n: 0.3, p: 0.5, k: 0.2, nota: "Favorece cuajado; acompañar con boro y zinc." },
    { etapa: "Cuajado", momento: "Oct - Nov", n: 0.4, p: 0.3, k: 0.3, nota: "Fraccionar por riego (fertirriego) si es posible." },
    { etapa: "Llenado de fruto", momento: "Dic - Feb", n: 0.2, p: 0.2, k: 0.4, nota: "El potasio define calibre y contenido de aceite." },
    { etapa: "Poscosecha", momento: "Mar - Abr", n: 0.1, p: 0, k: 0.1, nota: "Recuperar la planta después de la cosecha." },
  ],
};

export function calcularPlan({
  cultivo,
  area,
  suelo,
  rendimiento,
}: {
  cultivo: CultivoId;
  area: number;
  suelo: SueloId;
  rendimiento: number;
}): PlanFertilizacion {
  const e = EXTRACCION[cultivo];
  const f = SUELOS[suelo].factor;
  const r = Math.max(1, rendimiento);
  const n = Math.round(e.n * r * f * 1.25);
  const p = Math.round(e.p * r * f * 1.6);
  const k = Math.round(e.k * r * f * 1.2);

  const aplicaciones = FRACCIONES[cultivo].map((fr) => ({
    etapa: fr.etapa,
    momento: fr.momento,
    n: Math.round(n * fr.n),
    p: Math.round(p * fr.p),
    k: Math.round(k * fr.k),
    nota: fr.nota,
  }));

  return {
    n,
    p,
    k,
    // Fuentes comerciales: urea 46% N, fosfato diamónico 46% P2O5, cloruro de potasio 60% K2O
    urea: Math.round((n / 0.46) * area),
    fosfato: Math.round((p / 0.46) * area),
    cloruro: Math.round((k / 0.6) * area),
    aplicaciones,
    nota: SUELOS[suelo].nota,
  };
}

export interface Labor {
  semana: number;
  fecha: string;
  etapa: string;
  labor: string;
  detalle: string;
  tipo: "riego" | "nutricion" | "sanidad" | "manejo" | "cosecha";
}

const PLAN_CUIDADOS: Record<CultivoId, Omit<Labor, "fecha">[]> = {
  papa: [
    { semana: 0, etapa: "Siembra", labor: "Siembra y fertilización de fondo", detalle: "Semilla certificada, 30 cm entre plantas y surcos de 90 cm.", tipo: "manejo" },
    { semana: 2, etapa: "Emergencia", labor: "Primer riego ligero", detalle: "Humedad constante sin encharcar; revisar fallas de emergencia.", tipo: "riego" },
    { semana: 4, etapa: "Desarrollo", labor: "Deshierbo y control de gorgojo", detalle: "Monitorear gorgojo de los Andes y trips en el follaje.", tipo: "sanidad" },
    { semana: 6, etapa: "Aporque", labor: "Aporque y segunda fertilización", detalle: "Cubrir bien el cuello de la planta para más tubérculos.", tipo: "nutricion" },
    { semana: 8, etapa: "Floración", labor: "Prevención de rancha", detalle: "Con lluvia y neblina, aplicar fungicida preventivo cada 7-10 días.", tipo: "sanidad" },
    { semana: 10, etapa: "Tuberización", labor: "Riego crítico", detalle: "Etapa más sensible al estrés hídrico: no dejar secar el suelo.", tipo: "riego" },
    { semana: 13, etapa: "Madurez", labor: "Corte de riego", detalle: "Suspender riego 2 semanas antes de cosechar para curar la piel.", tipo: "manejo" },
    { semana: 15, etapa: "Cosecha", labor: "Cosecha y selección", detalle: "Cosechar en día seco, seleccionar por calibre y calidad.", tipo: "cosecha" },
  ],
  palta: [
    { semana: 0, etapa: "Prefloración", labor: "Poda de formación y sanitaria", detalle: "Retirar ramas secas y mejorar la entrada de luz al centro del árbol.", tipo: "manejo" },
    { semana: 2, etapa: "Prefloración", labor: "Fertilización de arranque", detalle: "Nitrógeno y fósforo + boro y zinc foliar para el cuajado.", tipo: "nutricion" },
    { semana: 5, etapa: "Floración", labor: "Riego moderado y polinización", detalle: "Evitar excesos de agua; favorecer presencia de abejas.", tipo: "riego" },
    { semana: 8, etapa: "Cuajado", labor: "Control de trips y arañita roja", detalle: "Monitoreo semanal de brotes y frutos pequeños.", tipo: "sanidad" },
    { semana: 12, etapa: "Llenado", labor: "Refuerzo de potasio", detalle: "Fertirriego con potasio para calibre y contenido de aceite.", tipo: "nutricion" },
    { semana: 18, etapa: "Llenado", labor: "Riego sostenido", detalle: "Lámina constante; el déficit provoca caída de frutos.", tipo: "riego" },
    { semana: 26, etapa: "Madurez", labor: "Prueba de materia seca", detalle: "Cosechar sobre 22-23% de materia seca en Hass.", tipo: "cosecha" },
    { semana: 30, etapa: "Poscosecha", labor: "Poda y recuperación", detalle: "Fertilización de recuperación y control de hongos de raíz.", tipo: "manejo" },
  ],
};

export function calendarioCuidados(cultivo: CultivoId, inicio: string): Labor[] {
  const base = new Date(inicio + "T12:00:00");
  return PLAN_CUIDADOS[cultivo].map((l) => {
    const d = new Date(base);
    d.setDate(d.getDate() + l.semana * 7);
    return {
      ...l,
      fecha: d.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" }),
    };
  });
}

export const COORDENADAS: Record<string, { lat: number; lon: number }> = {
  Huánuco: { lat: -9.93, lon: -76.24 },
  Junín: { lat: -11.16, lon: -75.99 },
  Cusco: { lat: -13.53, lon: -71.97 },
  Ayacucho: { lat: -13.16, lon: -74.22 },
  "La Libertad": { lat: -8.11, lon: -79.03 },
  Arequipa: { lat: -16.41, lon: -71.54 },
  Lima: { lat: -12.05, lon: -77.04 },
};

export interface DiaClima {
  fecha: string;
  tmax: number;
  tmin: number;
  lluvia: number;
  probLluvia: number;
  viento: number;
  code: number;
}

export async function obtenerClima(region: string): Promise<DiaClima[]> {
  const c = COORDENADAS[region] ?? COORDENADAS["Lima"]!;
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}` +
    "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,weather_code" +
    "&forecast_days=7&timezone=America%2FLima";
  const res = await fetch(url);
  if (!res.ok) throw new Error("No se pudo obtener el pronóstico");
  const json = (await res.json()) as {
    daily: {
      time: string[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
      precipitation_sum: number[];
      precipitation_probability_max: (number | null)[];
      wind_speed_10m_max: number[];
      weather_code: number[];
    };
  };
  const d = json.daily;
  return d.time.map((fecha, i) => ({
    fecha,
    tmax: d.temperature_2m_max[i] ?? 0,
    tmin: d.temperature_2m_min[i] ?? 0,
    lluvia: d.precipitation_sum[i] ?? 0,
    probLluvia: d.precipitation_probability_max[i] ?? 0,
    viento: d.wind_speed_10m_max[i] ?? 0,
    code: d.weather_code[i] ?? 0,
  }));
}

export interface AlertaClima {
  tipo: "helada" | "lluvia" | "granizo" | "viento" | "calor";
  nivel: "alta" | "media";
  titulo: string;
  fecha: string;
  accion: string;
}

export function generarAlertas(dias: DiaClima[]): AlertaClima[] {
  const alertas: AlertaClima[] = [];
  for (const d of dias) {
    const fecha = new Date(d.fecha + "T12:00:00").toLocaleDateString("es-PE", {
      weekday: "long",
      day: "2-digit",
      month: "short",
    });
    if (d.tmin <= 2)
      alertas.push({
        tipo: "helada",
        nivel: d.tmin <= 0 ? "alta" : "media",
        titulo: `Riesgo de helada (${d.tmin.toFixed(0)} °C)`,
        fecha,
        accion: "Riegue por la tarde, cubra plantas jóvenes y evite fertilizar con nitrógeno.",
      });
    if (d.lluvia >= 15)
      alertas.push({
        tipo: "lluvia",
        nivel: d.lluvia >= 30 ? "alta" : "media",
        titulo: `Lluvia intensa (${d.lluvia.toFixed(0)} mm)`,
        fecha,
        accion: "Suspenda aplicaciones, limpie drenajes y refuerce control preventivo de rancha.",
      });
    if ([96, 99].includes(d.code))
      alertas.push({
        tipo: "granizo",
        nivel: "alta",
        titulo: "Posible granizada",
        fecha,
        accion: "Proteja almacenes y cosecha lista; revise mallas y tutores.",
      });
    if (d.viento >= 45)
      alertas.push({
        tipo: "viento",
        nivel: "media",
        titulo: `Viento fuerte (${d.viento.toFixed(0)} km/h)`,
        fecha,
        accion: "Evite pulverizar y asegure tutores y ramas cargadas de fruto.",
      });
    if (d.tmax >= 32)
      alertas.push({
        tipo: "calor",
        nivel: "media",
        titulo: `Calor elevado (${d.tmax.toFixed(0)} °C)`,
        fecha,
        accion: "Riegue temprano o al atardecer para reducir el estrés hídrico.",
      });
  }
  return alertas;
}
