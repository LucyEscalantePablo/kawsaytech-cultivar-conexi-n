import { createFileRoute } from "@tanstack/react-router";
import { ScanEye } from "lucide-react";
import { ComingSoon } from "@/components/kawsay/ComingSoon";

export const Route = createFileRoute("/diagnostico")({
  head: () => ({
    meta: [
      { title: "Diagnóstico con IA · KawsayTech" },
      { name: "description", content: "Módulo futuro: sube una fotografía del cultivo y detecta enfermedades con inteligencia artificial." },
      { property: "og:title", content: "Diagnóstico con IA · KawsayTech" },
      { property: "og:description", content: "Análisis de enfermedades por imagen, historial y recomendaciones." },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Diagnóstico con IA"
      subtitle="Módulo en diseño"
      icon={ScanEye}
      descripcion="El agricultor tomará una foto de la hoja o del tubérculo y un modelo de visión por computadora identificará la enfermedad, su severidad y las acciones recomendadas."
      pantallas={[
        { nombre: "Subir fotografía", detalle: "Cámara o galería, con guía de encuadre y ejemplos." },
        { nombre: "Resultado del análisis", detalle: "Enfermedad detectada, nivel de confianza y severidad." },
        { nombre: "Recomendaciones", detalle: "Tratamiento sugerido, dosis y buenas prácticas." },
        { nombre: "Historial de diagnósticos", detalle: "Lista por cultivo y parcela con evolución." },
      ]}
    />
  ),
});
