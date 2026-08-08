import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Plus,
  Store,
  Layers,
  Inbox,
  HandCoins,
  TrendingUp,
  Package,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/lib/kawsay/auth";
import { AppShell } from "@/components/kawsay/AppShell";
import { StatCard } from "@/components/kawsay/StatCard";
import { ProductCard } from "@/components/kawsay/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CULTIVOS,
  IMAGENES,
  getPublicacion,
  soles,
  useKawsayData,
} from "@/lib/kawsay/store";
import type { CultivoId } from "@/lib/kawsay/types";

export const Route = createFileRoute("/comercializar")({
  head: () => ({
    meta: [
      { title: "Comercializar mi producto · KawsayTech" },
      {
        name: "description",
        content:
          "Centro de comercialización del productor: publica tu cosecha, revisa precios de referencia, gestiona publicaciones activas y responde solicitudes de compra.",
      },
      { property: "og:title", content: "Comercializar mi producto · KawsayTech" },
      {
        property: "og:description",
        content: "Publica, negocia y vende tu papa y palta directo al comprador.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Comercializar,
});

function Comercializar() {
  const { publicaciones, solicitudes, ventas } = useKawsayData();
  const { usuario } = useAuth();
  const agId = usuario?.agricultorId ?? "ag-1";

  const mias = publicaciones.filter((p) => p.agricultorId === agId);
  const activas = mias.filter((p) => p.estado === "activa");
  const misIds = new Set(mias.map((p) => p.id));
  const pendientes = solicitudes.filter(
    (s) => misIds.has(s.publicacionId) && s.estado === "pendiente",
  );
  const misVentas = ventas.filter((v) => misIds.has(v.publicacionId));
  const ingresos = misVentas.reduce((a, v) => a + v.cantidad * v.precio, 0);

  const referencia = (Object.keys(CULTIVOS) as CultivoId[]).map((c) => {
    const delMercado = publicaciones.filter((p) => p.cultivo === c && p.estado === "activa");
    const precios = delMercado.map((p) => p.precio);
    const prom = precios.length ? precios.reduce((a, b) => a + b, 0) / precios.length : 0;
    return {
      cultivo: c,
      prom,
      min: precios.length ? Math.min(...precios) : 0,
      max: precios.length ? Math.max(...precios) : 0,
      total: delMercado.length,
    };
  });

  return (
    <AppShell
      roles={["PRODUCTOR"]}
      title="Comercializar mi producto"
      subtitle="Publica tu cosecha, compara precios y cierra ventas"
      action={
        <Button asChild size="lg" className="rounded-xl">
          <Link to="/publicar">
            <Plus className="mr-1 size-5" /> Publicar cosecha
          </Link>
        </Button>
      }
    >
      <div className="space-y-8">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Package} label="Publicaciones activas" value={String(activas.length)} hint={`${mias.length} en total`} />
          <StatCard icon={Inbox} label="Solicitudes por responder" value={String(pendientes.length)} tone="harvest" />
          <StatCard icon={HandCoins} label="Ingresos registrados" value={soles(ingresos)} tone="success" hint={`${misVentas.length} ventas`} />
          <StatCard
            icon={TrendingUp}
            label="Precio promedio propio"
            value={soles(activas.length ? activas.reduce((a, p) => a + p.precio, 0) / activas.length : 0)}
            tone="earth"
          />
        </div>

        <section className="grid gap-6 md:grid-cols-2">
          {referencia.map((r) => (
            <Card key={r.cultivo} className="gap-0 overflow-hidden rounded-3xl p-0 shadow-soft">
              <img
                src={IMAGENES[r.cultivo][0]}
                alt={`Comercialización de ${CULTIVOS[r.cultivo].nombre}`}
                loading="lazy"
                width={900}
                height={500}
                className="aspect-[16/7] w-full object-cover"
              />
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-display text-xl font-extrabold">
                    {CULTIVOS[r.cultivo].nombre}
                  </h2>
                  <Badge className="rounded-full bg-primary-soft text-primary">
                    {r.total} en el mercado
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { l: "Mínimo", v: r.min },
                    { l: "Promedio", v: r.prom },
                    { l: "Máximo", v: r.max },
                  ].map((x) => (
                    <div key={x.l} className="rounded-2xl bg-muted/60 p-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{x.l}</p>
                      <p className="font-display text-lg font-bold text-primary">{soles(x.v)}</p>
                    </div>
                  ))}
                </div>
                <Button asChild variant="secondary" className="w-full rounded-xl">
                  <Link to="/publicar">
                    Publicar {CULTIVOS[r.cultivo].nombre.toLowerCase()} <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {[
            { to: "/mis-publicaciones", icon: Layers, t: "Mis publicaciones", d: "Edita, pausa o marca vendido" },
            { to: "/solicitudes", icon: Inbox, t: "Solicitudes recibidas", d: `${pendientes.length} pendientes` },
            { to: "/marketplace", icon: Store, t: "Ver el marketplace", d: "Compara con otros productores" },
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
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-extrabold">Mis productos en venta</h2>
            <Button asChild variant="secondary" className="rounded-xl">
              <Link to="/mis-publicaciones">Gestionar todas</Link>
            </Button>
          </div>
          {activas.length === 0 ? (
            <Card className="items-center gap-3 rounded-3xl p-12 text-center shadow-none">
              <p className="font-display text-lg font-bold">Aún no tienes productos en venta</p>
              <p className="text-sm text-muted-foreground">
                Publica tu cosecha y los compradores podrán enviarte solicitudes.
              </p>
              <Button asChild size="lg" className="rounded-xl">
                <Link to="/publicar">Publicar ahora</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {activas.map((p) => (
                <ProductCard key={p.id} pub={p} />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl font-extrabold">Últimas solicitudes de compra</h2>
          <Card className="gap-3 rounded-3xl p-6 shadow-soft">
            {pendientes.slice(0, 5).map((s) => {
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
                    <Badge variant="outline" className="rounded-full">Pendiente</Badge>
                  </div>
                </div>
              );
            })}
            {pendientes.length === 0 && (
              <p className="text-sm text-muted-foreground">No tienes solicitudes pendientes.</p>
            )}
            <Button asChild variant="secondary" className="w-fit rounded-xl">
              <Link to="/solicitudes">Ir a solicitudes</Link>
            </Button>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
