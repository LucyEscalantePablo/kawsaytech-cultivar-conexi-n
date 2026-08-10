import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  CloudSun,
  CloudRain,
  Snowflake,
  Wind,
  Sun,
  Thermometer,
  Droplets,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { AppShell } from "@/components/kawsay/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { REGIONES } from "@/lib/kawsay/store";
import { generarAlertas, obtenerClima, type AlertaClima, type DiaClima } from "@/lib/kawsay/agro";

export const Route = createFileRoute("/alertas")({
  head: () => ({
    meta: [
      { title: "Alertas climáticas · KawsayTech" },
      {
        name: "description",
        content:
          "Pronóstico de 7 días y alertas de helada, lluvia intensa, granizo y viento para tu región agrícola en Perú.",
      },
      { property: "og:title", content: "Alertas climáticas · KawsayTech" },
      { property: "og:description", content: "Avisos tempranos de helada, lluvia y granizo por región." },
    ],
  }),
  component: AlertasPage,
});

const iconoAlerta: Record<AlertaClima["tipo"], typeof Snowflake> = {
  helada: Snowflake,
  lluvia: CloudRain,
  granizo: CloudRain,
  viento: Wind,
  calor: Sun,
};

function iconoDia(d: DiaClima) {
  if ([95, 96, 99].includes(d.code)) return CloudRain;
  if (d.lluvia >= 1) return CloudRain;
  if (d.code === 0) return Sun;
  return CloudSun;
}

function AlertasPage() {
  const [region, setRegion] = useState(REGIONES[0]!);
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["clima", region],
    queryFn: () => obtenerClima(region),
    staleTime: 15 * 60 * 1000,
  });

  const alertas = data ? generarAlertas(data) : [];

  return (
    <AppShell
      title="Alertas climáticas"
      subtitle="Pronóstico real de 7 días y avisos para proteger tu cultivo"
      action={
        <Button variant="outline" className="h-9 rounded-xl" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`} /> Actualizar
        </Button>
      }
    >
      <div className="space-y-6">
        <Card className="gap-3 rounded-3xl p-6 shadow-soft sm:max-w-sm">
          <Label>Región de tu parcela</Label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REGIONES.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        {isLoading && (
          <Card className="flex-row items-center gap-3 rounded-3xl p-6 shadow-soft">
            <Loader2 className="size-5 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Consultando el pronóstico para {region}…</p>
          </Card>
        )}

        {isError && (
          <Card className="gap-2 rounded-3xl p-6 shadow-soft">
            <p className="font-display font-bold">No se pudo obtener el pronóstico</p>
            <p className="text-sm text-muted-foreground">Revisa tu conexión y vuelve a intentar.</p>
            <Button className="mt-2 h-10 w-fit rounded-xl" onClick={() => refetch()}>
              Reintentar
            </Button>
          </Card>
        )}

        {data && (
          <>
            <section className="space-y-3">
              <h2 className="font-display text-lg font-bold">Avisos para los próximos 7 días</h2>
              {alertas.length === 0 ? (
                <Card className="flex-row items-center gap-3 rounded-2xl p-5 shadow-soft">
                  <Sun className="size-6 text-harvest-foreground" />
                  <p className="text-sm">
                    Sin alertas relevantes en {region}. Condiciones estables para labores de campo.
                  </p>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {alertas.map((a, i) => {
                    const Icono = iconoAlerta[a.tipo];
                    return (
                      <Card
                        key={`${a.tipo}-${a.fecha}-${i}`}
                        className={`flex-row items-start gap-4 rounded-2xl p-5 shadow-soft ${
                          a.nivel === "alta" ? "border-destructive/50 bg-destructive/5" : "bg-harvest/20"
                        }`}
                      >
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-background">
                          <Icono className="size-5 text-foreground" />
                        </span>
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-display font-bold">{a.titulo}</p>
                            <Badge
                              variant={a.nivel === "alta" ? "destructive" : "outline"}
                              className="rounded-full text-[0.65rem]"
                            >
                              {a.nivel === "alta" ? "Urgente" : "Atención"}
                            </Badge>
                          </div>
                          <p className="text-xs capitalize text-muted-foreground">{a.fecha}</p>
                          <p className="flex gap-2 text-sm text-muted-foreground">
                            <AlertTriangle className="mt-0.5 size-4 shrink-0" /> {a.accion}
                          </p>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg font-bold">Pronóstico de {region}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {data.map((d) => {
                  const Icono = iconoDia(d);
                  const fecha = new Date(d.fecha + "T12:00:00");
                  return (
                    <Card key={d.fecha} className="gap-2 rounded-2xl p-5 shadow-soft">
                      <p className="text-sm font-semibold capitalize">
                        {fecha.toLocaleDateString("es-PE", { weekday: "long" })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {fecha.toLocaleDateString("es-PE", { day: "2-digit", month: "short" })}
                      </p>
                      <Icono className="my-1 size-9 text-primary" />
                      <p className="font-display text-2xl font-extrabold">{Math.round(d.tmax)}°</p>
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Thermometer className="size-4" /> mín {Math.round(d.tmin)}°
                      </p>
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Droplets className="size-4" /> {d.lluvia.toFixed(1)} mm · {Math.round(d.probLluvia)}%
                      </p>
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Wind className="size-4" /> {Math.round(d.viento)} km/h
                      </p>
                    </Card>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                Datos meteorológicos de Open-Meteo para la capital de la región seleccionada.
              </p>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}
