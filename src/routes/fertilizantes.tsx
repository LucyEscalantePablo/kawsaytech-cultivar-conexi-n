import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FlaskConical, Calculator, Info } from "lucide-react";
import { AppShell } from "@/components/kawsay/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CULTIVOS } from "@/lib/kawsay/store";
import type { CultivoId } from "@/lib/kawsay/types";
import { SUELOS, calcularPlan, type SueloId } from "@/lib/kawsay/agro";

export const Route = createFileRoute("/fertilizantes")({
  head: () => ({
    meta: [
      { title: "Calculadora de fertilizantes · KawsayTech" },
      {
        name: "description",
        content:
          "Calcula la dosis de nitrógeno, fósforo y potasio para papa y palta según área, tipo de suelo y rendimiento esperado.",
      },
      { property: "og:title", content: "Calculadora de fertilizantes · KawsayTech" },
      { property: "og:description", content: "Plan de fertilización por etapa con dosis y sacos necesarios." },
    ],
  }),
  component: FertilizantesPage,
});

function FertilizantesPage() {
  const [cultivo, setCultivo] = useState<CultivoId>("papa");
  const [area, setArea] = useState("1");
  const [suelo, setSuelo] = useState<SueloId>("franco");
  const [rendimiento, setRendimiento] = useState("22");
  const [plan, setPlan] = useState<ReturnType<typeof calcularPlan> | null>(null);

  const areaNum = Math.max(0.1, Number(area) || 1);

  return (
    <AppShell title="Fertilizantes" subtitle="Dosis exacta por hectárea según tu parcela y rendimiento esperado">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <Card className="gap-5 rounded-3xl p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="gradient-field flex size-11 items-center justify-center rounded-2xl">
              <FlaskConical className="size-5 text-primary-foreground" />
            </span>
            <p className="font-display text-lg font-bold">Datos de la parcela</p>
          </div>

          <div className="grid gap-2">
            <Label>Cultivo</Label>
            <Select
              value={cultivo}
              onValueChange={(v) => {
                setCultivo(v as CultivoId);
                setRendimiento(v === "papa" ? "22" : "12");
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
            <Label htmlFor="area">Área (hectáreas)</Label>
            <Input
              id="area"
              type="number"
              min="0.1"
              step="0.1"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>

          <div className="grid gap-2">
            <Label>Tipo de suelo</Label>
            <Select value={suelo} onValueChange={(v) => setSuelo(v as SueloId)}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SUELOS).map(([id, s]) => (
                  <SelectItem key={id} value={id}>
                    {s.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rend">Rendimiento esperado (t/ha)</Label>
            <Input
              id="rend"
              type="number"
              min="1"
              value={rendimiento}
              onChange={(e) => setRendimiento(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>

          <Button
            className="h-11 rounded-xl"
            onClick={() =>
              setPlan(
                calcularPlan({
                  cultivo,
                  area: areaNum,
                  suelo,
                  rendimiento: Number(rendimiento) || 1,
                }),
              )
            }
          >
            <Calculator className="mr-2 size-4" /> Calcular plan
          </Button>
        </Card>

        <div className="space-y-6">
          {!plan ? (
            <Card className="gap-2 rounded-3xl border-dashed p-6 shadow-none">
              <p className="font-display font-bold">Completa los datos y calcula</p>
              <p className="text-sm text-muted-foreground">
                Obtendrás la dosis de N, P y K por hectárea, la cantidad de sacos a comprar y el calendario de aplicación por etapa.
              </p>
            </Card>
          ) : (
            <>
              <Card className="gap-4 rounded-3xl p-6 shadow-lift">
                <p className="font-display text-lg font-bold">Dosis recomendada por hectárea</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Dosis label="Nitrógeno (N)" valor={plan.n} />
                  <Dosis label="Fósforo (P₂O₅)" valor={plan.p} />
                  <Dosis label="Potasio (K₂O)" valor={plan.k} />
                </div>
                <p className="flex gap-2 rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">
                  <Info className="mt-0.5 size-4 shrink-0" /> {plan.nota}
                </p>
              </Card>

              <Card className="gap-4 rounded-3xl p-6 shadow-soft">
                <p className="font-display text-lg font-bold">
                  Lo que debes comprar para {areaNum} ha
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Compra label="Urea (46% N)" kg={plan.urea} />
                  <Compra label="Fosfato diamónico" kg={plan.fosfato} />
                  <Compra label="Cloruro de potasio" kg={plan.cloruro} />
                </div>
              </Card>

              <Card className="gap-4 rounded-3xl p-6 shadow-soft">
                <p className="font-display text-lg font-bold">Calendario de aplicación</p>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Etapa</TableHead>
                        <TableHead>Momento</TableHead>
                        <TableHead className="text-right">N</TableHead>
                        <TableHead className="text-right">P</TableHead>
                        <TableHead className="text-right">K</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plan.aplicaciones.map((a) => (
                        <TableRow key={a.etapa}>
                          <TableCell>
                            <p className="font-semibold">{a.etapa}</p>
                            <p className="text-xs text-muted-foreground">{a.nota}</p>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm">{a.momento}</TableCell>
                          <TableCell className="text-right">{a.n}</TableCell>
                          <TableCell className="text-right">{a.p}</TableCell>
                          <TableCell className="text-right">{a.k}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <p className="text-xs text-muted-foreground">Valores en kg por hectárea.</p>
              </Card>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Dosis({ label, valor }: { label: string; valor: number }) {
  return (
    <div className="rounded-2xl bg-accent/60 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-display text-2xl font-extrabold">
        {valor} <span className="text-sm font-bold text-muted-foreground">kg/ha</span>
      </p>
    </div>
  );
}

function Compra({ label, kg }: { label: string; kg: number }) {
  return (
    <div className="rounded-2xl border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-display text-xl font-extrabold">{kg} kg</p>
      <Badge variant="outline" className="mt-1 rounded-full text-[0.65rem]">
        ≈ {Math.ceil(kg / 50)} sacos de 50 kg
      </Badge>
    </div>
  );
}
