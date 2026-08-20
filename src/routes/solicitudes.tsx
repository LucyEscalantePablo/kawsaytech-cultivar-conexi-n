import { createFileRoute } from "@tanstack/react-router";
import { Check, X, CalendarDays, User } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/kawsay/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CULTIVOS, getPublicacion, responderSolicitud, soles, useKawsayData } from "@/lib/kawsay/store";
import { EntregaPanel, PasosEntrega } from "@/components/kawsay/EntregaPanel";
import type { Solicitud } from "@/lib/kawsay/types";

export const Route = createFileRoute("/solicitudes")({
  head: () => ({
    meta: [
      { title: "Solicitudes de compra · KawsayTech" },
      { name: "description", content: "Revisa las solicitudes de compra recibidas: cantidad, precio ofrecido, mensaje y fecha requerida." },
      { property: "og:title", content: "Solicitudes de compra · KawsayTech" },
      { property: "og:description", content: "Acepta o rechaza ofertas de compradores en un clic." },
    ],
  }),
  component: Solicitudes,
});

function Fila({ s }: { s: Solicitud }) {
  const pub = getPublicacion(s.publicacionId);
  return (
    <Card className="gap-4 rounded-3xl p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 font-display text-lg font-bold">
            <User className="size-5 text-primary" /> {s.comprador}
          </p>
          <p className="text-sm text-muted-foreground">
            {pub ? `${CULTIVOS[pub.cultivo].nombre} ${pub.variedad}` : "Publicación eliminada"} · solicitado el {s.creada}
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
          <p className="flex items-center gap-1 font-semibold"><CalendarDays className="size-4" /> {s.fechaRequerida}</p>
        </div>
      </div>
      {s.mensaje && <p className="rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground">“{s.mensaje}”</p>}
      {(s.estado === "aceptada" || s.estado === "coordinada" || s.estado === "completada") && (
        <div className="space-y-4">
          <PasosEntrega estado={s.estado} />
          <EntregaPanel s={s} modo="productor" />
        </div>
      )}
      {s.estado === "pendiente" && (
        <div className="flex flex-wrap gap-3">
          <Button size="lg" className="h-12 rounded-xl" onClick={() => { responderSolicitud(s.id, "aceptada"); toast.success("Solicitud aceptada y venta registrada"); }}>
            <Check className="mr-1 size-5" /> Aceptar
          </Button>
          <Button size="lg" variant="secondary" className="h-12 rounded-xl" onClick={() => { responderSolicitud(s.id, "rechazada"); toast("Solicitud rechazada"); }}>
            <X className="mr-1 size-5" /> Rechazar
          </Button>
        </div>
      )}
    </Card>
  );
}

function Solicitudes() {
  const { solicitudes } = useKawsayData();
  const grupos = {
    pendiente: solicitudes.filter((s) => s.estado === "pendiente"),
    aceptada: solicitudes.filter((s) => s.estado === "aceptada" || s.estado === "coordinada"),
    completada: solicitudes.filter((s) => s.estado === "completada"),
    rechazada: solicitudes.filter((s) => s.estado === "rechazada"),
  };

  return (
    <AppShell roles={["PRODUCTOR"]} title="Solicitudes de compra" subtitle={`${grupos.pendiente.length} pendientes de respuesta`}>
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
              <Card className="items-center rounded-3xl p-12 text-center shadow-none">
                <p className="text-sm text-muted-foreground">No hay solicitudes en esta bandeja.</p>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </AppShell>
  );
}
