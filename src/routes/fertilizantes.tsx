import { createFileRoute } from "@tanstack/react-router";
import { FlaskConical } from "lucide-react";
import { ComingSoon } from "@/components/kawsay/ComingSoon";

export const Route = createFileRoute("/fertilizantes")({
  head: () => ({
    meta: [
      { title: "Fertilizantes recomendados · KawsayTech" },
      { name: "description", content: "Módulo futuro: recomendaciones personalizadas de fertilización con cantidad, frecuencia y época de aplicación." },
      { property: "og:title", content: "Fertilizantes recomendados · KawsayTech" },
      { property: "og:description", content: "Planes de fertilización por cultivo, suelo y etapa fenológica." },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Fertilizantes"
      subtitle="Módulo en diseño"
      icon={FlaskConical}
      descripcion="A partir del cultivo, la etapa fenológica y el análisis de suelo, la plataforma calculará la dosis exacta, la frecuencia y la mejor época de aplicación."
      pantallas={[
        { nombre: "Datos de la parcela", detalle: "Cultivo, área, tipo de suelo y análisis disponible." },
        { nombre: "Plan de fertilización", detalle: "Producto, cantidad por hectárea y frecuencia." },
        { nombre: "Calendario de aplicación", detalle: "Época recomendada y recordatorios." },
      ]}
    />
  ),
});
