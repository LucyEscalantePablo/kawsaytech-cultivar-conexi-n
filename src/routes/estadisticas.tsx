import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BarChart3, TrendingUp, Coins, Scale } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/kawsay/AppShell";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/kawsay/StatCard";
import { CULTIVOS, soles, useKawsayData } from "@/lib/kawsay/store";
import type { CultivoId } from "@/lib/kawsay/types";

export const Route = createFileRoute("/estadisticas")({
  head: () => ({
    meta: [
      { title: "Estadísticas agrícolas · KawsayTech" },
      {
        name: "description",
        content:
          "Evolución de precios de papa y palta, ingresos por mes, volumen vendido y comparativo de precios por región.",
      },
      { property: "og:title", content: "Estadísticas agrícolas · KawsayTech" },
      { property: "og:description", content: "Indicadores de precio, ingreso y volumen de tus ventas." },
    ],
  }),
  component: EstadisticasPage,
});

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "set", "oct", "nov", "dic"];

function EstadisticasPage() {
  const { publicaciones, ventas } = useKawsayData();
  const [cultivo, setCultivo] = useState<CultivoId | "todos">("todos");

  const datos = useMemo(() => {
    const pubDe = (id: string) => publicaciones.find((p) => p.id === id);
    const ventasFiltradas = ventas.filter((v) => {
      if (cultivo === "todos") return true;
      return pubDe(v.publicacionId)?.cultivo === cultivo;
    });
    const pubsFiltradas = publicaciones.filter((p) => cultivo === "todos" || p.cultivo === cultivo);

    const ingresos = ventasFiltradas.reduce((s, v) => s + v.precio * v.cantidad, 0);
    const kilos = ventasFiltradas.reduce((s, v) => s + v.cantidad, 0);
    const precioProm = pubsFiltradas.length
      ? pubsFiltradas.reduce((s, p) => s + p.precio, 0) / pubsFiltradas.length
      : 0;

    const porMes = new Map<string, { mes: string; ingreso: number; kilos: number; precio: number; n: number }>();
    for (const v of ventasFiltradas) {
      const d = new Date(v.fecha + "T12:00:00");
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const row = porMes.get(key) ?? { mes: MESES[d.getMonth()]!, ingreso: 0, kilos: 0, precio: 0, n: 0 };
      row.ingreso += v.precio * v.cantidad;
      row.kilos += v.cantidad;
      row.precio += v.precio;
      row.n += 1;
      porMes.set(key, row);
    }
    const serie = [...porMes.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, r]) => ({ mes: r.mes, ingreso: Math.round(r.ingreso), kilos: r.kilos, precio: +(r.precio / r.n).toFixed(2) }));

    const porRegion = new Map<string, { region: string; total: number; n: number }>();
    for (const p of pubsFiltradas) {
      const row = porRegion.get(p.region) ?? { region: p.region, total: 0, n: 0 };
      row.total += p.precio;
      row.n += 1;
      porRegion.set(p.region, row);
    }
    const regiones = [...porRegion.values()]
      .map((r) => ({ region: r.region, precio: +(r.total / r.n).toFixed(2) }))
      .sort((a, b) => b.precio - a.precio);

    return { ingresos, kilos, precioProm, serie, regiones, transacciones: ventasFiltradas.length };
  }, [publicaciones, ventas, cultivo]);

  return (
    <AppShell title="Estadísticas" subtitle="Precios, ingresos y volumen de tus operaciones">
      <div className="space-y-8">
        <Tabs value={cultivo} onValueChange={(v) => setCultivo(v as CultivoId | "todos")}>
          <TabsList className="rounded-xl">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            {Object.entries(CULTIVOS).map(([id, c]) => (
              <TabsTrigger key={id} value={id}>
                {c.nombre}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Coins} label="Ingresos acumulados" value={soles(datos.ingresos)} />
          <StatCard icon={Scale} label="Kilos vendidos" value={`${datos.kilos.toLocaleString("es-PE")} kg`} />
          <StatCard icon={TrendingUp} label="Precio promedio publicado" value={soles(datos.precioProm)} />
          <StatCard icon={BarChart3} label="Transacciones" value={String(datos.transacciones)} />
        </div>

        {datos.serie.length === 0 ? (
          <Card className="gap-2 rounded-3xl border-dashed p-6 shadow-none">
            <p className="font-display font-bold">Aún no hay ventas registradas</p>
            <p className="text-sm text-muted-foreground">
              Cuando aceptes solicitudes de compra, aquí verás la evolución de tus precios e ingresos.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="gap-4 rounded-3xl p-6 shadow-soft">
              <p className="font-display text-lg font-bold">Evolución del precio (S/ por kg)</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={datos.serie}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "0.75rem",
                      }}
                    />
                    <Line type="monotone" dataKey="precio" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="gap-4 rounded-3xl p-6 shadow-soft">
              <p className="font-display text-lg font-bold">Ingresos por mes (S/)</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datos.serie}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "0.75rem",
                      }}
                    />
                    <Bar dataKey="ingreso" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="gap-4 rounded-3xl p-6 shadow-soft">
              <p className="font-display text-lg font-bold">Kilos vendidos por mes</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datos.serie}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "0.75rem",
                      }}
                    />
                    <Bar dataKey="kilos" fill="var(--harvest)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="gap-4 rounded-3xl p-6 shadow-soft">
              <p className="font-display text-lg font-bold">Precio promedio por región (S/ por kg)</p>
              <div className="space-y-3">
                {datos.regiones.map((r) => {
                  const max = datos.regiones[0]?.precio || 1;
                  return (
                    <div key={r.region} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{r.region}</span>
                        <span className="font-bold">{soles(r.precio)}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${(r.precio / max) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
