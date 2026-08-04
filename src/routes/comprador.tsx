import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Inbox, ShoppingBag, Store, Search, TrendingDown } from "lucide-react";
import { AppShell } from "@/components/kawsay/AppShell";
import { ProductCard } from "@/components/kawsay/ProductCard";
import { StatCard } from "@/components/kawsay/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CULTIVOS, getPublicacion, soles, useKawsayData } from "@/lib/kawsay/store";
import { useAuth } from "@/lib/kawsay/auth";

export const Route = createFileRoute("/comprador")({
  head: () => ({
    meta: [
      { title: "Panel del comprador · KawsayTech" },
      {
        name: "description",
        content:
          "Busca papa y palta de productores verificados, revisa tus solicitudes enviadas, favoritos y compras realizadas.",
      },
      { property: "og:title", content: "Panel del comprador · KawsayTech" },
      { property: "og:description", content: "Tu centro de compras agrícolas en KawsayTech." },
    ],
  }),
  component: PanelComprador,
});

function PanelComprador() {
  const { publicaciones, solicitudes, ventas } = useKawsayData();
  const { usuario, favoritos } = useAuth();
  const email = usuario?.email;
  const mis = solicitudes.filter((s) => s.compradorEmail === email);
  const compras = ventas.filter((v) => v.compradorEmail === email);
  const gasto = compras.reduce((a, v) => a + v.cantidad * v.precio, 0);
  const activas = publicaciones.filter((p) => p.estado === "activa");
  const recientes = activas.slice(0, 3);
  const menorPrecio = activas.length ? Math.min(...activas.map((p) => p.precio)) : 0;

  return (
    <AppShell
      title={`Hola, ${usuario?.nombre ?? "comprador"}`}
      subtitle="Panel del comprador · Papa y Palta"
      roles={["COMPRADOR"]}
      action={
        <Button asChild size="lg" className="rounded-xl">
          <Link to="/marketplace">
            <Search className="mr-1 size-5" /> Buscar productos
          </Link>
        </Button>
      }
    >
      <div className="space-y-8">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Store} label="Publicaciones disponibles" value={String(activas.length)} hint="Papa y palta activas" />
          <StatCard icon={Inbox} label="Mis solicitudes" value={String(mis.length)} tone="harvest" hint={`${mis.filter((s) => s.estado === "pendiente").length} pendientes`} />
          <StatCard icon={ShoppingBag} label="Compras realizadas" value={soles(gasto)} tone="success" hint={`${compras.length} operaciones`} />
          <StatCard icon={Heart} label="Favoritos" value={String(favoritos.length)} tone="earth" hint="Productos guardados" />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            { to: "/marketplace", icon: Store, t: "Explorar marketplace", d: "Filtra por región, calidad y precio" },
            { to: "/favoritos", icon: Heart, t: "Mis favoritos", d: "Vuelve a los productos guardados" },
            { to: "/mis-solicitudes", icon: Inbox, t: "Mis solicitudes", d: "Sigue el estado de tus ofertas" },
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
            <h2 className="font-display text-lg font-bold">Últimas solicitudes enviadas</h2>
            <div className="space-y-3">
              {mis.slice(0, 4).map((s) => {
                const pub = getPublicacion(s.publicacionId);
                return (
                  <div key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-muted/60 p-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {pub ? `${CULTIVOS[pub.cultivo].nombre} ${pub.variedad}` : "Publicación eliminada"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {s.cantidad.toLocaleString("es-PE")} {pub?.unidad} · {s.creada}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-primary">{soles(s.precioOfrecido)}</p>
                      <Badge variant="outline" className="rounded-full capitalize">{s.estado}</Badge>
                    </div>
                  </div>
                );
              })}
              {mis.length === 0 && (
                <p className="text-sm text-muted-foreground">Aún no has enviado solicitudes de compra.</p>
              )}
            </div>
            <Button asChild variant="secondary" className="mt-2 rounded-xl">
              <Link to="/mis-solicitudes">Ver todas</Link>
            </Button>
          </Card>

          <Card className="gap-3 rounded-3xl p-6 shadow-soft">
            <h2 className="font-display text-lg font-bold">Referencia de mercado</h2>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingDown className="size-4 text-primary" /> Precio más bajo publicado hoy
            </p>
            <p className="font-display text-4xl font-extrabold text-primary">{soles(menorPrecio)}</p>
            <p className="text-sm text-muted-foreground">
              Compara precios por región y calidad antes de enviar tu oferta.
            </p>
            <Button asChild className="mt-2 w-fit rounded-xl">
              <Link to="/marketplace">Comparar publicaciones</Link>
            </Button>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl font-extrabold">Nuevas publicaciones</h2>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {recientes.map((p) => (
              <ProductCard key={p.id} pub={p} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
