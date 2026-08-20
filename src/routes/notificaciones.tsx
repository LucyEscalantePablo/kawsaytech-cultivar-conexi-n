import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, CheckCircle2, XCircle, Clock } from "lucide-react";
import { AppShell } from "@/components/kawsay/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CULTIVOS, getPublicacion, soles, useKawsayData } from "@/lib/kawsay/store";
import { useAuth } from "@/lib/kawsay/auth";

export const Route = createFileRoute("/notificaciones")({
  head: () => ({
    meta: [
      { title: "Notificaciones · KawsayTech" },
      { name: "description", content: "Avisos sobre el estado de tus solicitudes de compra y novedades de los productores que sigues." },
      { property: "og:title", content: "Notificaciones · KawsayTech" },
      { property: "og:description", content: "Respuestas de productores y actualizaciones de tus ofertas." },
    ],
  }),
  component: Notificaciones,
});

const iconos = {
  pendiente: { i: Clock, tono: "bg-harvest/30 text-harvest-foreground", texto: "Solicitud enviada, esperando respuesta" },
  aceptada: { i: CheckCircle2, tono: "bg-success/20 text-success", texto: "El productor aceptó tu solicitud" },
  rechazada: { i: XCircle, tono: "bg-destructive/15 text-destructive", texto: "El productor rechazó tu solicitud" },
  coordinada: { i: CheckCircle2, tono: "bg-primary/15 text-primary", texto: "Entrega coordinada con el productor" },
  completada: { i: CheckCircle2, tono: "bg-success/20 text-success", texto: "Entrega completada" },
  cerrada: { i: CheckCircle2, tono: "bg-muted text-muted-foreground", texto: "Solicitud cerrada" },
} as const;

function Notificaciones() {
  const { solicitudes } = useKawsayData();
  const { usuario } = useAuth();
  const mias = solicitudes.filter((s) => s.compradorEmail === usuario?.email);

  return (
    <AppShell title="Notificaciones" subtitle={`${mias.length} avisos`} roles={["COMPRADOR"]}>
      <div className="space-y-4">
        {mias.map((s) => {
          const pub = getPublicacion(s.publicacionId);
          const meta = iconos[s.estado];
          return (
            <Card key={s.id} className="flex-row items-center gap-4 rounded-3xl p-5 shadow-soft">
              <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${meta.tono}`}>
                <meta.i className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{meta.texto}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {pub ? `${CULTIVOS[pub.cultivo].nombre} ${pub.variedad}` : "Publicación eliminada"} ·{" "}
                  {s.cantidad.toLocaleString("es-PE")} {pub?.unidad} a {soles(s.precioOfrecido)} · {s.creada}
                </p>
              </div>
              <Badge variant="outline" className="rounded-full capitalize">{s.estado}</Badge>
            </Card>
          );
        })}
        {mias.length === 0 && (
          <Card className="items-center gap-3 rounded-3xl p-12 text-center shadow-none">
            <Bell className="size-9 text-muted-foreground" />
            <p className="font-display text-lg font-bold">Sin notificaciones</p>
            <p className="text-sm text-muted-foreground">
              Cuando envíes una solicitud de compra verás aquí la respuesta del productor.
            </p>
            <Button asChild className="rounded-xl">
              <Link to="/marketplace">Explorar marketplace</Link>
            </Button>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
