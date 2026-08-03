import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Package,
  HandCoins,
  Inbox,
  CheckCircle2,
  TrendingUp,
  Plus,
  Store,
  Layers,
} from "lucide-react";
import { AppShell } from "@/components/kawsay/AppShell";
import { StatCard } from "@/components/kawsay/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AGRICULTOR_ACTUAL, CULTIVOS, getPublicacion, soles, useKawsayData } from "@/lib/kawsay/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard comercial · KawsayTech" },
      { name: "description", content: "Resumen de publicaciones, ventas, solicitudes e ingresos de tu campaña agrícola." },
      { property: "og:title", content: "Dashboard comercial · KawsayTech" },
      { property: "og:description", content: "Publicaciones, ventas, solicitudes y precio promedio en un solo panel." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { publicaciones, solicitudes, ventas } = useKawsayData();
  const mias = publicaciones.filter((p) => p.agricultorId === AGRICULTOR_ACTUAL);
  const misIds = new Set(mias.map((p) => p.id));
  const misSolicitudes = solicitudes.filter((s) => misIds.has(s.publicacionId));
  const misVentas = ventas.filter((v) => misIds.has(v.publicacionId));
  const ingresos = misVentas.reduce((a, v) => a + v.cantidad * v.precio, 0);
  const activas = mias.filter((p) => p.estado === "activa");
  const promedio = activas.length ? activas.reduce((a, p) => a + p.precio, 0) / activas.length : 0;

  return (
    <AppShell
      title="Dashboard comercial"
      subtitle="Campaña 2026 · Papa y Palta"
      action={
        <Button asChild size="lg" className="rounded-xl">
          <Link to="/publicar">
            <Plus className="mr-1 size-5" /> Publicar
          </Link>
        </Button>
      }
    >
      <div className="space-y-8">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard icon={Package} label="Publicaciones activas" value={String(activas.length)} hint={`${mias.length} en total`} />
          <StatCard icon={HandCoins} label="Ingresos registrados" value={soles(ingresos)} tone="success" hint={`${misVentas.length} ventas`} />
          <StatCard icon={Inbox} label="Solicitudes" value={String(misSolicitudes.filter((s) => s.estado === "pendiente").length)} tone="harvest" hint="Pendientes de respuesta" />
          <StatCard icon={CheckCircle2} label="Productos vendidos" value={String(mias.filter((p) => p.estado === "vendida").length)} tone="earth" />
          <StatCard icon={TrendingUp} label="Precio promedio" value={soles(promedio)} hint="Publicaciones activas" />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            { to: "/publicar", icon: Plus, t: "Publicar producto", d: "Sube tu cosecha en 1 minuto" },
            { to: "/marketplace", icon: Store, t: "Explorar marketplace", d: "Mira los precios del mercado" },
            { to: "/mis-publicaciones", icon: Layers, t: "Mis publicaciones", d: "Edita, pausa o marca vendido" },
          ].map((a) => (
            <Card key={a.to} className="gap-2 rounded-3xl p-0 shadow-soft transition-shadow hover:shadow-lift">
              <Link to={a.to} className="flex items-center gap-4 p-6">
                <span className="gradient-field flex size-12 items-center justify-center rounded-2xl">
                  <a.icon className="size-6 text-primary-foreground" />
                </span>
                <span className="grid">
                  <span className="font-display text-base font-bold">{a.t}</span>
                  <span className="text-sm text-muted-foreground">{a.d}</span>
                </span>
              </Link>
            </Card>
          ))}
        </div>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-3xl p-6 shadow-soft">
            <h3 className="font-display text-lg font-bold">Últimas solicitudes</h3>
            <div className="space-y-3">
              {misSolicitudes.slice(0, 4).map((s) => {
                const pub = getPublicacion(s.publicacionId);
                return (
                  <div key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-muted/60 p-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{s.comprador}</p>
                      <p className="text-sm text-muted-foreground">
                        {pub ? `${CULTIVOS[pub.cultivo].nombre} ${pub.variedad}` : "—"} ·{" "}
                        {s.cantidad.toLocaleString("es-PE")} {pub?.unidad}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-primary">{soles(s.precioOfrecido)}</p>
                      <Badge variant="outline" className="rounded-full capitalize">{s.estado}</Badge>
                    </div>
                  </div>
                );
              })}
              {misSolicitudes.length === 0 && <p className="text-sm text-muted-foreground">Aún no tienes solicitudes.</p>}
            </div>
            <Button asChild variant="secondary" className="mt-2 rounded-xl">
              <Link to="/solicitudes">Ver todas</Link>
            </Button>
          </Card>

          <Card className="rounded-3xl p-6 shadow-soft">
            <h3 className="font-display text-lg font-bold">Ventas recientes</h3>
            <div className="space-y-3">
              {misVentas.map((v) => {
                const pub = getPublicacion(v.publicacionId);
                return (
                  <div key={v.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-muted/60 p-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{v.comprador}</p>
                      <p className="text-sm text-muted-foreground">
                        {pub ? `${CULTIVOS[pub.cultivo].nombre} ${pub.variedad}` : "—"} · {v.fecha}
                      </p>
                    </div>
                    <p className="font-display font-bold text-success">{soles(v.cantidad * v.precio)}</p>
                  </div>
                );
              })}
              {misVentas.length === 0 && <p className="text-sm text-muted-foreground">Sin ventas registradas.</p>}
            </div>
            <Button asChild variant="secondary" className="mt-2 rounded-xl">
              <Link to="/historial">Ver historial</Link>
            </Button>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
