import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { ComingSoon } from "@/components/kawsay/ComingSoon";

export const Route = createFileRoute("/estadisticas")({
  head: () => ({
    meta: [
      { title: "Estadísticas agrícolas · KawsayTech" },
      { name: "description", content: "Módulo futuro: evolución de precios, ingresos, rendimiento por hectárea y comparativo entre campañas." },
      { property: "og:title", content: "Estadísticas agrícolas · KawsayTech" },
      { property: "og:description", content: "Indicadores de precio, ingreso y rendimiento por campaña." },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Estadísticas"
      subtitle="Módulo en diseño"
      icon={BarChart3}
      descripcion="Panel analítico con evolución de precios de papa y palta, ingresos por campaña, rendimiento por hectárea y comparativo regional."
      pantallas={[
        { nombre: "Evolución de precios", detalle: "Serie mensual por cultivo y región." },
        { nombre: "Ingresos por campaña", detalle: "Comparativo entre campañas y cultivos." },
        { nombre: "Rendimiento", detalle: "Kg por hectárea frente al promedio regional." },
      ]}
    />
  ),
});
