import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const Input = z.object({
  cultivo: z.enum(["papa", "palta"]),
  /** Data URL (data:image/...;base64,...) de la foto tomada por el agricultor. */
  imagen: z.string().min(32),
  nota: z.string().max(500).optional(),
});

const Resultado = z.object({
  esCultivo: z.boolean().optional(),
  enfermedad: z.string().optional(),
  nombreCientifico: z.string().optional(),
  confianza: z.number().optional(),
  severidad: z.string().optional(),
  sintomas: z.array(z.string()).optional(),
  tratamiento: z.array(z.string()).optional(),
  prevencion: z.array(z.string()).optional(),
  resumen: z.string().optional(),
});

export interface DiagnosticoResultado {
  esCultivo: boolean;
  enfermedad: string;
  nombreCientifico: string;
  confianza: number;
  severidad: "leve" | "moderada" | "severa";
  sintomas: string[];
  tratamiento: string[];
  prevencion: string[];
  resumen: string;
}

export const analizarCultivo = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }): Promise<DiagnosticoResultado> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Falta la configuración de IA (LOVABLE_API_KEY)");

    const gateway = createLovableAiGatewayProvider(key);
    const result = await generateText({
      model: gateway("google/gemini-3.6-flash"),
      output: Output.object({ schema: Resultado }),
      system:
        "Eres un ingeniero agrónomo peruano especialista en sanidad de papa y palta. " +
        "Analiza la foto y responde en español simple y directo, pensando en un pequeño productor andino. " +
        "Si la imagen no corresponde a una planta o fruto del cultivo indicado, marca esCultivo en false. " +
        "Si la planta está sana, usa enfermedad: 'Sin enfermedad detectada'. " +
        "Menciona productos por ingrediente activo y dosis aproximadas por hectárea. " +
        "Devuelve SIEMPRE todos los campos del esquema con contenido útil: esCultivo (boolean), enfermedad, " +
        "nombreCientifico (o cadena vacía si no aplica), confianza (0-100), severidad ('leve' | 'moderada' | 'severa'), " +
        "sintomas (2-4 frases), tratamiento (2-4 pasos concretos), prevencion (2-4 consejos) y resumen (2 oraciones). " +
        "Nunca dejes arreglos vacíos ni textos en blanco.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                `Cultivo: ${data.cultivo}. ` +
                (data.nota ? `Observación del agricultor: ${data.nota}` : "Sin observaciones adicionales."),
            },
            { type: "image", image: data.imagen },
          ],
        },
      ],
    });

    const r = await result.output;
    const sev = (r.severidad ?? "").toLowerCase();
    const salida: DiagnosticoResultado = {
      esCultivo: r.esCultivo ?? true,
      enfermedad: r.enfermedad ?? "Sin enfermedad detectada",
      nombreCientifico: r.nombreCientifico ?? "",
      confianza: Math.min(100, Math.max(0, r.confianza ?? 0)),
      severidad: sev.startsWith("sev") ? "severa" : sev.startsWith("mod") ? "moderada" : "leve",
      sintomas: (r.sintomas ?? []).slice(0, 5),
      tratamiento: (r.tratamiento ?? []).slice(0, 5),
      prevencion: (r.prevencion ?? []).slice(0, 5),
      resumen: r.resumen ?? "",
    };
    return salida;
  });
