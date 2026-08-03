import { createFileRoute } from "@tanstack/react-router";
import { CloudSun } from "lucide-react";
import { ComingSoon } from "@/components/kawsay/ComingSoon";

export const Route = createFileRoute("/alertas")({
  head: () => ({
    meta: [
      { title: "Alertas climáticas · KawsayTech" },
      { name: "description", content: "Módulo futuro: pronóstico, heladas, lluvias, granizo, temperatura y humedad para tu parcela." },
      { property: "og:title", content: "Alertas climáticas · KawsayTech" },
      { property: "og:description", content: "Avisos tempranos de helada, lluvia y granizo por zona." },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Alertas climáticas"
      subtitle="Módulo en diseño"
      icon={CloudSun}
      descripcion="Alertas georreferenciadas de helada, lluvia intensa y granizo, con pronóstico de temperatura y humedad para la ubicación de cada parcela."
      pantallas={[
        { nombre: "Pronóstico 7 días", detalle: "Tarjetas grandes con íconos y temperatura." },
        { nombre: "Alerta de helada", detalle: "Aviso urgente con medidas de protección." },
        { nombre: "Mapa de la parcela", detalle: "Ubicación con Google Maps y radar de lluvia." },
      ]}
    />
  ),
});
