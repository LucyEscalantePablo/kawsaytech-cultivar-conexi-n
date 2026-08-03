import { createFileRoute } from "@tanstack/react-router";
import { Sprout } from "lucide-react";
import { ComingSoon } from "@/components/kawsay/ComingSoon";

export const Route = createFileRoute("/cuidados")({
  head: () => ({
    meta: [
      { title: "Cuidados del cultivo · KawsayTech" },
      { name: "description", content: "Módulo futuro: calendario de riego, poda, control de plagas y buenas prácticas agrícolas." },
      { property: "og:title", content: "Cuidados del cultivo · KawsayTech" },
      { property: "og:description", content: "Un calendario claro para cada labor del cultivo." },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Cuidados del cultivo"
      subtitle="Módulo en diseño"
      icon={Sprout}
      descripcion="Un calendario agrícola simple que le dirá al productor qué hacer cada semana: riego, poda, control de plagas y buenas prácticas."
      pantallas={[
        { nombre: "Calendario del cultivo", detalle: "Labores por semana con íconos grandes." },
        { nombre: "Riego", detalle: "Frecuencia y lámina según clima y etapa." },
        { nombre: "Control de plagas", detalle: "Plagas frecuentes, monitoreo y umbrales." },
        { nombre: "Buenas prácticas", detalle: "Fichas cortas con imágenes y audio." },
      ]}
    />
  ),
});
