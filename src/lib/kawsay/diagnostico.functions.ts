import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { clasesDe, claseDe, UMBRAL_CONFIANZA } from "@/lib/kawsay/clasificador";

const Input = z.object({
  cultivo: z.enum(["papa", "palta"]),
  /** Data URL (data:image/...;base64,...) de la foto tomada por el agricultor. */
  imagen: z.string().min(32),
  nota: z.string().max(500).optional(),
});

const Resultado = z.object({
  esCultivo: z.boolean().optional(),
  claseId: z.string().optional(),
  probabilidades: z
    .array(z.object({ claseId: z.string(), probabilidad: z.number() }))
    .optional(),
  severidad: z.string().optional(),
  porcentajeAreaAfectada: z.number().optional(),
  calidadImagen: z.string().optional(),
  problemasImagen: z.array(z.string()).optional(),
  sintomas: z.array(z.string()).optional(),
  diferencial: z.array(z.string()).optional(),
  tratamiento: z.array(z.string()).optional(),
  prevencion: z.array(z.string()).optional(),
  resumen: z.string().optional(),
});

export interface Probabilidad {
  claseId: string;
  etiqueta: string;
  probabilidad: number;
}

export interface DiagnosticoResultado {
  esCultivo: boolean;
  claseId: string;
  enfermedad: string;
  nombreCientifico: string;
  etiquetaDataset: string;
  confianza: number;
  concluyente: boolean;
  probabilidades: Probabilidad[];
  severidad: "leve" | "moderada" | "severa";
  porcentajeAreaAfectada: number;
  calidadImagen: "buena" | "regular" | "mala";
  problemasImagen: string[];
  sintomas: string[];
  diferencial: string[];
  tratamiento: string[];
  prevencion: string[];
  resumen: string;
}

const MODELO = "google/gemini-3.6-flash";

export const analizarCultivo = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }): Promise<DiagnosticoResultado> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Falta la configuración de IA (LOVABLE_API_KEY)");

    const gateway = createLovableAiGatewayProvider(key);
    const clases = clasesDe(data.cultivo);

    const taxonomia = clases
      .map((c) => `- ${c.id} ("${c.etiqueta}", dataset: ${c.etiquetaDataset}): ${c.descripcion}`)
      .join("\n");

    const system =
      "Actúas como un clasificador experto de enfermedades foliares, entrenado con datasets públicos de hoja de papa " +
      "(Healthy / Early Blight / Late Blight) y validado por ingenieros agrónomos peruanos.\n" +
      "Sigue este procedimiento antes de responder:\n" +
      "1) Verifica que la imagen sea realmente del cultivo indicado (hoja, planta o fruto). Si no lo es, esCultivo=false.\n" +
      "2) Evalúa la calidad de la imagen (enfoque, luz, distancia, encuadre) y reporta problemas concretos.\n" +
      "3) Describe las lesiones observadas: color, forma, borde, distribución, presencia de anillos concéntricos, halo clorótico o esporulación.\n" +
      "4) Asigna una probabilidad a CADA clase de la taxonomía; la suma debe ser 100. claseId = clase con mayor probabilidad.\n" +
      "5) Justifica el diagnóstico diferencial: por qué descartas las otras clases (usa los rasgos distintivos, no frases genéricas).\n" +
      "6) Estima el porcentaje de área foliar afectada y deriva la severidad: <10% leve, 10-40% moderada, >40% severa.\n\n" +
      `Taxonomía de clases válidas para ${data.cultivo}:\n${taxonomia}\n\n` +
      "Reglas: responde en español simple para un pequeño productor andino; no inventes lesiones que no se vean; " +
      "si la evidencia es ambigua, reparte la probabilidad y baja la confianza en lugar de forzar una clase; " +
      "menciona productos por ingrediente activo con dosis aproximadas por hectárea (para tizón tardío usa " +
      "mancozeb/clorotalonil como protectantes y cimoxanilo, metalaxil o dimetomorf como sistémicos, rotando modos de acción); " +
      "usa calidadImagen entre 'buena' | 'regular' | 'mala'; devuelve siempre todos los campos con contenido útil.";

    const contenidoUsuario = [
      {
        type: "text" as const,
        text:
          `Cultivo: ${data.cultivo}. ` +
          (data.nota
            ? `Observación del agricultor: ${data.nota}`
            : "Sin observaciones adicionales."),
      },
      { type: "image" as const, image: data.imagen },
    ];

    // Ensamble de dos inferencias (temperaturas distintas) y promedio de probabilidades:
    // reduce la varianza del modelo y evita clasificaciones seguras pero equivocadas.
    const votos = await Promise.all(
      [0.1, 0.6].map(async (temperature) => {
        const r = await generateText({
          model: gateway(MODELO),
          output: Output.object({ schema: Resultado }),
          temperature,
          system,
          messages: [{ role: "user", content: contenidoUsuario }],
        });
        return await r.output;
      }),
    ).catch(async (e) => {
      // Si el ensamble falla (rate limit, etc.), se intenta una sola inferencia.
      const r = await generateText({
        model: gateway(MODELO),
        output: Output.object({ schema: Resultado }),
        system,
        messages: [{ role: "user", content: contenidoUsuario }],
      }).catch(() => {
        throw e instanceof Error ? e : new Error("No se pudo analizar la imagen");
      });
      return [await r.output];
    });

    return combinar(data.cultivo, votos);
  });

type Voto = z.infer<typeof Resultado>;

function combinar(cultivo: "papa" | "palta", votos: Voto[]): DiagnosticoResultado {
  const clases = clasesDe(cultivo);
  const validos = votos.filter(Boolean);
  const base = validos[0] ?? {};

  // Promedio de probabilidades normalizadas por clase.
  const acumulado = new Map<string, number>(clases.map((c) => [c.id, 0]));
  let aportes = 0;
  for (const v of validos) {
    const lista = (v.probabilidades ?? []).filter((p) => acumulado.has(p.claseId));
    const total = lista.reduce((s, p) => s + Math.max(0, p.probabilidad), 0);
    if (total <= 0) {
      if (v.claseId && acumulado.has(v.claseId)) {
        acumulado.set(v.claseId, (acumulado.get(v.claseId) ?? 0) + 100);
        aportes += 1;
      }
      continue;
    }
    for (const p of lista) {
      acumulado.set(
        p.claseId,
        (acumulado.get(p.claseId) ?? 0) + (Math.max(0, p.probabilidad) / total) * 100,
      );
    }
    aportes += 1;
  }
  if (aportes === 0) {
    acumulado.set("otra", 100);
    aportes = 1;
  }

  const probabilidades: Probabilidad[] = clases
    .map((c) => ({
      claseId: c.id,
      etiqueta: c.etiqueta,
      probabilidad: Math.round(((acumulado.get(c.id) ?? 0) / aportes) * 10) / 10,
    }))
    .sort((a, b) => b.probabilidad - a.probabilidad);

  const ganadora = probabilidades[0]!;
  const clase = claseDe(cultivo, ganadora.claseId) ?? clases[clases.length - 1]!;

  const area = Math.min(
    100,
    Math.max(
      0,
      promedio(validos.map((v) => v.porcentajeAreaAfectada).filter(esNumero)) ?? 0,
    ),
  );
  const sevTexto = (base.severidad ?? "").toLowerCase();
  const severidad: DiagnosticoResultado["severidad"] =
    clase.id === "sano"
      ? "leve"
      : area > 40 || sevTexto.startsWith("sev")
        ? "severa"
        : area >= 10 || sevTexto.startsWith("mod")
          ? "moderada"
          : "leve";

  const cal = (base.calidadImagen ?? "").toLowerCase();
  const calidadImagen: DiagnosticoResultado["calidadImagen"] = cal.startsWith("mal")
    ? "mala"
    : cal.startsWith("reg")
      ? "regular"
      : "buena";

  return {
    esCultivo: validos.every((v) => v.esCultivo !== false),
    claseId: clase.id,
    enfermedad: clase.id === "sano" ? "Sin enfermedad detectada" : clase.etiqueta,
    nombreCientifico: clase.nombreCientifico,
    etiquetaDataset: clase.etiquetaDataset,
    confianza: ganadora.probabilidad,
    concluyente: ganadora.probabilidad >= UMBRAL_CONFIANZA,
    probabilidades,
    severidad,
    porcentajeAreaAfectada: Math.round(area),
    calidadImagen,
    problemasImagen: unir(validos.map((v) => v.problemasImagen ?? [])).slice(0, 4),
    sintomas: unir(validos.map((v) => v.sintomas ?? [])).slice(0, 5),
    diferencial: unir(validos.map((v) => v.diferencial ?? [])).slice(0, 4),
    tratamiento: (base.tratamiento ?? unir(validos.map((v) => v.tratamiento ?? []))).slice(0, 5),
    prevencion: (base.prevencion ?? unir(validos.map((v) => v.prevencion ?? []))).slice(0, 5),
    resumen: base.resumen ?? "",
  };
}

function esNumero(n: number | undefined): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

function promedio(xs: number[]): number | undefined {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : undefined;
}

function unir(listas: string[][]): string[] {
  const vistos = new Set<string>();
  const salida: string[] = [];
  for (const lista of listas) {
    for (const item of lista) {
      const clave = item.trim().toLowerCase();
      if (!clave || vistos.has(clave)) continue;
      vistos.add(clave);
      salida.push(item.trim());
    }
  }
  return salida;
}
