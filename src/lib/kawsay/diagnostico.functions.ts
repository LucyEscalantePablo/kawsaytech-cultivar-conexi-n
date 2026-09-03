import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { clasesDe, claseDe, UMBRAL_CONFIANZA } from "@/lib/kawsay/clasificador";

const Input = z.object({
  cultivo: z.enum(["papa", "palta"]),
  /** Data URL (data:image/...;base64,...) de la foto tomada por el agricultor. */
  imagen: z.string().min(32).nullable().optional(),
  nota: z.string().max(500).optional(),
});

const Resultado = z.object({
  esCultivo: z.boolean().optional(),
  claseId: z.string().optional(),
  /** Una entrada por clase, con formato "claseId=probabilidad" (ej. "tizon_tardio=72"). */
  probabilidades: z.array(z.string()).optional(),
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
  severidad: "sana" | "leve" | "moderada" | "severa" | "muy_severa";
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

async function intentarInferenciaLocalPapa(imagen: string): Promise<DiagnosticoResultado | null> {
  if (process.env.NODE_ENV === "test") return null;

  const modelo = path.resolve(process.cwd(), "models", "potato", "potato_leaf_model.keras");
  const labels = path.resolve(process.cwd(), "models", "potato", "labels.json");

  try {
    await fs.access(modelo);
    await fs.access(labels);
  } catch {
    return null;
  }

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "kawsay-"));
  const tempFile = path.join(tempDir, "diagnostico-papa.png");

  try {
    const match = imagen.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/i);
    if (!match) return null;

    const buffer = Buffer.from(match[2], "base64");
    await fs.writeFile(tempFile, buffer);

<<<<<<< Updated upstream
    const pythonBin = process.env.PYTHON_BIN ?? "python";
=======
    const pythonBin = process.env.PYTHON_BIN ?? (await encontrarPythonLocal());
>>>>>>> Stashed changes
    const script = path.resolve(process.cwd(), "ml", "infer_potato_model.py");

    const result = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
      const child = spawn(
        pythonBin,
        [script, "--model", modelo, "--labels", labels, "--image", tempFile],
        { stdio: ["ignore", "pipe", "pipe"] },
      );

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
      });
      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
      child.on("error", reject);
      child.on("close", (code) => {
        if (code === 0) {
          resolve({ stdout, stderr });
          return;
        }
        reject(new Error(stderr || `El modelo local falló con código ${code}.`));
      });
    });

    const parsed = JSON.parse(result.stdout.trim());
    const map = {
      Healthy: "sano",
      "Late Blight": "tizon_tardio",
      "Early Blight": "tizon_temprano",
    } as const;

    const clases = clasesDe("papa");
    const probabilidades = (parsed.probabilidades ?? []).map((item: { label: string; probability: number }) => {
      const clase = clases.find((c) => c.etiquetaDataset === item.label || c.etiqueta === item.label || c.id === map[item.label as keyof typeof map]);
      return {
        claseId: clase?.id ?? "otra",
        etiqueta: clase?.etiqueta ?? item.label,
        probabilidad: Number(item.probability) || 0,
      };
    });

    const base = probabilidades.sort((a, b) => b.probabilidad - a.probabilidad)[0] ?? {
      claseId: "sano",
      etiqueta: "Hoja sana",
      probabilidad: 0,
    };

    const clase = claseDe("papa", base.claseId) ?? clases[0]!;
    const confianza = Math.max(0, Math.min(100, base.probabilidad));
<<<<<<< Updated upstream
=======
    const porcentajeAreaAfectada = clase.id === "sano" ? 0 : Math.round(Number(parsed.lesion_area) || 0);
    const severidad = clasificarSeveridad(clase.id, porcentajeAreaAfectada);
>>>>>>> Stashed changes

    return {
      esCultivo: true,
      claseId: clase.id,
      enfermedad: clase.id === "sano" ? "Sin enfermedad detectada" : clase.etiqueta,
      nombreCientifico: clase.nombreCientifico,
      etiquetaDataset: clase.etiquetaDataset,
      confianza,
      concluyente: confianza >= UMBRAL_CONFIANZA,
      probabilidades,
<<<<<<< Updated upstream
      severidad: confianza >= 70 ? "moderada" : "leve",
      porcentajeAreaAfectada: confianza >= 70 ? 35 : 8,
=======
      severidad,
      porcentajeAreaAfectada,
>>>>>>> Stashed changes
      calidadImagen: "buena",
      problemasImagen: [],
      sintomas: clase.id === "sano" ? ["Hoja con color verde uniforme y sin lesiones visibles"] : ["Se observan manchas compatibles con la enfermedad detectada"],
      diferencial: clase.id === "tizon_tardio" ? ["Se descarta tizón temprano por la distribución y el borde de las manchas", "Se evalúa la humedad ambiental y la velocidad de avance de la lesión"] : ["Se confirma con la muestra y la severidad observada"],
      tratamiento: clase.id === "tizon_tardio" ? ["Mancozeb o clorotalonil como protectante", "Rotar con un fungicida sistémico para evitar resistencia"] : ["Mantener saneamiento foliar y vigilancia semanal"],
      prevencion: ["Evitar exceso de humedad en follaje", "Monitorear cada 3-5 días en épocas de riesgo"],
      resumen: `${clase.etiqueta} con ${confianza.toFixed(1)}% de confianza. Revisa la hoja y aplica control preventivo si avanza la lesión.`,
    };
  } catch (error) {
    console.warn("No se pudo usar el modelo local de papa; se usa la IA del gateway como fallback.", error);
    return null;
  } finally {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // no-op
    }
  }
}

<<<<<<< Updated upstream
export const analizarCultivo = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }): Promise<DiagnosticoResultado> => {
=======
async function encontrarPythonLocal(): Promise<string> {
  const rutas = [
    path.resolve(process.cwd(), ".venv312", "Scripts", "python.exe"),
    path.resolve(process.cwd(), ".venv", "Scripts", "python.exe"),
  ];
  for (const ruta of rutas) {
    try {
      await fs.access(ruta);
      return ruta;
    } catch {
      continue;
    }
  }
  return "python";
}

export const analizarCultivo = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }): Promise<DiagnosticoResultado> => {
    if (!data.imagen) {
      return diagnosticarDesdeNota(data.nota ?? "");
    }
>>>>>>> Stashed changes
    if (data.cultivo === "papa") {
      const inferenciaLocal = await intentarInferenciaLocalPapa(data.imagen);
      if (inferenciaLocal) {
        return inferenciaLocal;
      }
    }

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
      "6) Estima el porcentaje de área foliar afectada y deriva una de estas categorías: hoja sana si no hay lesiones; leve si hay menos de 10%; moderada entre 10% y 40%; grave entre 40% y 70%; muy grave si supera 70%.\n\n" +
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

function diagnosticarDesdeNota(nota: string): DiagnosticoResultado {
  const texto = nota.toLowerCase();
  const esSana = /sana|saludable|sin lesión|sin manchas|verde uniforme/.test(texto);
  const esMuyGrave = /muy grave|más de 70|70%|80%|90%|100%/.test(texto);
  const esGrave = /grave|necrosis extensa|más de 40|50%|60%/.test(texto);
  const esModerada = /moderada|entre 10|20%|30%|40%/.test(texto);
  const claseId = esSana ? "sano" : "tizon_tardio";
  const porcentajeAreaAfectada = esSana ? 0 : esMuyGrave ? 80 : esGrave ? 55 : esModerada ? 25 : 5;
  const clase = claseDe("papa", claseId)!;
  const severidad = clasificarSeveridad(claseId, porcentajeAreaAfectada);

  return {
    esCultivo: true,
    claseId,
    enfermedad: claseId === "sano" ? "Sin enfermedad detectada" : clase.etiqueta,
    nombreCientifico: clase.nombreCientifico,
    etiquetaDataset: clase.etiquetaDataset,
    confianza: 85,
    concluyente: true,
    probabilidades: [
      { claseId, etiqueta: clase.etiqueta, probabilidad: 85 },
      { claseId: claseId === "sano" ? "tizon_tardio" : "sano", etiqueta: claseId === "sano" ? "Tizón tardío (rancha)" : "Hoja sana", probabilidad: 15 },
    ],
    severidad,
    porcentajeAreaAfectada,
    calidadImagen: "regular",
    problemasImagen: ["Resultado basado en la descripción escrita; agrega una foto para confirmar visualmente."],
    sintomas: nota ? [nota] : ["No se proporcionó una observación."],
    diferencial: ["La clasificación por texto es orientativa y no sustituye una fotografía de la lesión."],
    tratamiento: claseId === "sano" ? ["Mantener saneamiento foliar y vigilancia semanal"] : ["Confirmar con una fotografía y un ingeniero agrónomo antes de aplicar productos"],
    prevencion: ["Monitorear cada 3-5 días en épocas de riesgo"],
    resumen: `Clasificación orientativa por descripción: ${etiquetaSeveridadTexto(severidad)}.`,
  };
}

type Voto = z.infer<typeof Resultado>;

function combinar(cultivo: "papa" | "palta", votos: Voto[]): DiagnosticoResultado {
  const clases = clasesDe(cultivo);
  const validos = votos.filter(Boolean);
  const base = validos[0] ?? {};

  // Promedio de probabilidades normalizadas por clase.
  const acumulado = new Map<string, number>(clases.map((c) => [c.id, 0]));
  let aportes = 0;
  for (const v of validos) {
    const lista = (v.probabilidades ?? [])
      .map(parsearProbabilidad)
      .filter((p): p is { claseId: string; probabilidad: number } => !!p && acumulado.has(p.claseId));
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
  const severidad = clasificarSeveridad(clase.id, area, sevTexto);

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

function clasificarSeveridad(
  claseId: string,
  area: number,
  severidadInformada = "",
): DiagnosticoResultado["severidad"] {
  if (claseId === "sano") return "sana";
  if (area > 70 || severidadInformada.includes("muy")) return "muy_severa";
  if (area > 40 || severidadInformada.startsWith("sev")) return "severa";
  if (area >= 10 || severidadInformada.startsWith("mod")) return "moderada";
  return "leve";
}

function etiquetaSeveridadTexto(severidad: DiagnosticoResultado["severidad"]): string {
  if (severidad === "sana") return "hoja sana";
  if (severidad === "muy_severa") return "severidad muy grave";
  if (severidad === "severa") return "severidad grave";
  return `severidad ${severidad}`;
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
