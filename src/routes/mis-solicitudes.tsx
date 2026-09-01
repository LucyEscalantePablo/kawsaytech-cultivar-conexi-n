import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Inbox } from "lucide-react";
import { AppShell } from "@/components/kawsay/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CULTIVOS, getPublicacion, soles, useKawsayData } from "@/lib/kawsay/store";
import { useAuth } from "@/lib/kawsay/auth";
import { EntregaPanel, PasosEntrega } from "@/components/kawsay/EntregaPanel";
import type { Solicitud } from "@/lib/kawsay/types";
import { formatDateDDMMYYYY } from "@/lib/utils";

export const Route = createFileRoute("/mis-solicitudes")({
  head: () => ({
    meta: [
      { title: "Mis solicitudes de compra · KawsayTech" },
      { name: "description", content: "Sigue el estado de las ofertas que enviaste a los productores: pendientes, aceptadas y rechazadas." },
      { property: "og:title", content: "Mis solicitudes de compra · KawsayTech" },
      { property: "og:description", content: "Cantidad, precio ofrecido y fecha requerida de cada oferta." },
    ],
  }),
  component: MisSolicitudes,
});

function Fila({ s }: { s: Solicitud }) {
  const pub = getPublicacion(s.publicacionId);
  return (
    <Card className="gap-4 rounded-3xl p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-bold">
            {pub ? `${CULTIVOS[pub.cultivo].nombre} ${pub.variedad}` : "Publicación eliminada"}
          </p>
          <p className="text-sm text-muted-foreground">
            {pub ? `${pub.distrito}, ${pub.region}` : "—"} · enviada el {formatDateDDMMYYYY(s.creada)}
          </p>
        </div>
        <Badge variant="outline" className="rounded-full capitalize">{s.estado}</Badge>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Cantidad</p>
          <p className="font-semibold">{s.cantidad.toLocaleString("es-PE")} {pub?.unidad ?? ""}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Precio ofrecido</p>
          <p className="font-display font-bold text-primary">{soles(s.precioOfrecido)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Fecha requerida</p>
          <p className="flex items-center gap-1 font-semibold"><CalendarDays className="size-4" /> {formatDateDDMMYYYY(s.fechaRequerida)}</p>
        </div>
      </div>
      {s.mensaje && <p className="rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground">“{s.mensaje}”</p>}
      {(s.estado === "aceptada" || s.estado === "coordinada" || s.estado === "completada") && (
        <div className="space-y-4">
          <PasosEntrega estado={s.estado} />
          <EntregaPanel s={s} modo="comprador" />
        </div>
      )}
      {pub && (
        <Button asChild variant="secondary" className="w-fit rounded-xl">
          <Link to="/producto/$id" params={{ id: pub.id }}>Ver publicación</Link>
        </Button>
      )}
    </Card>
  );
}

function MisSolicitudes() {
  const { solicitudes } = useKawsayData();
  const { usuario } = useAuth();
  const mias = solicitudes.filter((s) => s.compradorEmail === usuario?.email);
  const grupos = {
    pendiente: mias.filter((s) => s.estado === "pendiente"),
    aceptada: mias.filter((s) => s.estado === "aceptada" || s.estado === "coordinada"),
    completada: mias.filter((s) => s.estado === "completada"),
    rechazada: mias.filter((s) => s.estado === "rechazada"),
  };

  return (
    <AppShell title="Mis solicitudes" subtitle={`${grupos.pendiente.length} esperando respuesta`} roles={["COMPRADOR"]}>
      <Tabs defaultValue="pendiente">
        <TabsList className="h-12 rounded-2xl">
          <TabsTrigger value="pendiente" className="rounded-xl px-5">Pendientes</TabsTrigger>
          <TabsTrigger value="aceptada" className="rounded-xl px-5">Aceptadas</TabsTrigger>
          <TabsTrigger value="completada" className="rounded-xl px-5">Completadas</TabsTrigger>
          <TabsTrigger value="rechazada" className="rounded-xl px-5">Rechazadas</TabsTrigger>
        </TabsList>
        {(["pendiente", "aceptada", "completada", "rechazada"] as const).map((k) => (
          <TabsContent key={k} value={k} className="mt-6 space-y-5">
            {grupos[k].map((s) => (
              <Fila key={s.id} s={s} />
            ))}
            {grupos[k].length === 0 && (
              <Card className="items-center gap-3 rounded-3xl p-12 text-center shadow-none">
                <Inbox className="size-9 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No hay solicitudes en esta bandeja.</p>
                <Button asChild className="rounded-xl">
                  <Link to="/marketplace">Buscar productos</Link>
                </Button>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </AppShell>
  );
}
