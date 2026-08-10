import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sprout, Droplets, Bug, Wrench, Wheat, FlaskConical, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/kawsay/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CULTIVOS } from "@/lib/kawsay/store";
import type { CultivoId } from "@/lib/kawsay/types";
import { calendarioCuidados, type Labor } from "@/lib/kawsay/agro";

export const Route = createFileRoute("/cuidados")({
  head: () => ({
    meta: [
      { title: "Cuidados del cultivo · KawsayTech" },
      {
        name: "description",
        content:
          "Calendario agrícola de papa y palta: riego, fertilización, control de plagas y cosecha, calculado desde tu fecha de siembra.",
      },
      { property: "og:title", content: "Cuidados del cultivo · KawsayTech" },
      { property: "og:description", content: "Sabe qué hacer cada semana en tu parcela." },
    ],
  }),
  component: CuidadosPage,
});

const iconos: Record<Labor["tipo"], typeof Droplets> = {
  riego: Droplets,
  nutricion: FlaskConical,
  sanidad: Bug,
  manejo: Wrench,
  cosecha: Wheat,
};

const etiquetas: Record<Labor["tipo"], string> = {
  riego: "Riego",
  nutricion: "Nutrición",
  sanidad: "Sanidad",
  manejo: "Manejo",
  cosecha: "Cosecha",
};

function CuidadosPage() {
  const hoy = new Date().toISOString().slice(0, 10);
  const [cultivo, setCultivo] = useState<CultivoId>("papa");
  const [inicio, setInicio] = useState(hoy);
  const [hechas, setHechas] = useState<string[]>([]);

  const labores = useMemo(() => calendarioCuidados(cultivo, inicio || hoy), [cultivo, inicio, hoy]);
  const semanasTranscurridas = Math.floor(
    (Date.now() - new Date((inicio || hoy) + "T12:00:00").getTime()) / (7 * 24 * 3600 * 1000),
  );
  const avance = Math.round((hechas.length / labores.length) * 100);

  return (
    <AppShell title="Cuidados del cultivo" subtitle="Tu calendario de labores semana por semana">
      <div className="space-y-6">
        <Card className="gap-5 rounded-3xl p-6 shadow-soft">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)]">
            <div className="grid gap-2">
              <Label>Cultivo</Label>
              <Select
                value={cultivo}
                onValueChange={(v) => {
                  setCultivo(v as CultivoId);
                  setHechas([]);
                }}
              >
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CULTIVOS).map(([id, c]) => (
                    <SelectItem key={id} value={id}>
                      {c.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="inicio">
                {cultivo === "papa" ? "Fecha de siembra" : "Inicio de campaña"}
              </Label>
              <Input
                id="inicio"
                type="date"
                value={inicio}
                onChange={(e) => setInicio(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <Label>Avance de labores</Label>
              <div className="rounded-xl bg-accent/60 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {hechas.length} de {labores.length} completadas
                  </span>
                  <span className="font-bold">{avance}%</span>
                </div>
                <Progress value={avance} className="mt-2 h-2" />
              </div>
            </div>
          </div>
        </Card>

        <section className="space-y-4">
          <h2 className="font-display text-lg font-bold">Calendario de {CULTIVOS[cultivo].nombre.toLowerCase()}</h2>
          <div className="space-y-3">
            {labores.map((l) => {
              const Icono = iconos[l.tipo];
              const hecha = hechas.includes(l.labor);
              const actual = semanasTranscurridas >= l.semana && semanasTranscurridas < l.semana + 2;
              return (
                <Card
                  key={l.labor}
                  className={`flex-row items-start gap-4 rounded-2xl p-4 shadow-soft transition-colors ${
                    hecha ? "bg-muted/50" : actual ? "border-primary/60 bg-accent/40" : ""
                  }`}
                >
                  <span className="gradient-field flex size-11 shrink-0 items-center justify-center rounded-2xl">
                    <Icono className="size-5 text-primary-foreground" />
                  </span>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={`font-display font-bold ${hecha ? "line-through opacity-70" : ""}`}>{l.labor}</p>
                      <Badge variant="outline" className="rounded-full text-[0.65rem]">
                        {etiquetas[l.tipo]}
                      </Badge>
                      {actual && !hecha && (
                        <Badge className="rounded-full bg-harvest text-[0.65rem] text-harvest-foreground">
                          Esta semana
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{l.detalle}</p>
                    <p className="text-xs text-muted-foreground">
                      {l.etapa} · Semana {l.semana} · {l.fecha}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={hecha ? "Marcar como pendiente" : "Marcar como hecha"}
                    onClick={() =>
                      setHechas((h) => (h.includes(l.labor) ? h.filter((x) => x !== l.labor) : [...h, l.labor]))
                    }
                    className="shrink-0 rounded-full p-1"
                  >
                    <CheckCircle2 className={`size-7 ${hecha ? "text-success" : "text-muted-foreground/40"}`} />
                  </button>
                </Card>
              );
            })}
          </div>
        </section>

        <Card className="flex-row items-start gap-3 rounded-2xl bg-muted/50 p-4 shadow-none">
          <Sprout className="mt-0.5 size-5 shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">
            Las fechas se calculan a partir de la fecha que ingresaste. Ajusta las labores según el clima real de tu zona
            y revisa las Alertas climáticas antes de aplicar productos.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
