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
  esCultivo: z.boolean(),
  enfermedad: z.string(),
  nombreCientifico: z.string(),
  confianza: z.number().min(0).max(100),
  severidad: z.enum(["leve", "moderada", "severa"]),
  sintomas: z.array(z.string()).max(5),
  tratamiento: z.array(z.string()).max(5),
  prevencion: z.array(z.string()).max(5),
  resumen: z.string(),
});

export type DiagnosticoResultado = z.infer<typeof Resultado>;

export const analizarCultivo = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
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
        "Menciona productos por ingrediente activo y dosis aproximadas por hectárea.",
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

    return await result.output;
  });
