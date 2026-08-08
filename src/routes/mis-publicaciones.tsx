import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy, Pause, Play, Pencil, Trash2, CheckCircle2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/kawsay/auth";
import { AppShell } from "@/components/kawsay/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CULTIVOS,
  actualizarEstado,
  duplicarPublicacion,
  eliminarPublicacion,
  imagenesDe,
  soles,
  useKawsayData,
} from "@/lib/kawsay/store";

export const Route = createFileRoute("/mis-publicaciones")({
  head: () => ({
    meta: [
      { title: "Mis publicaciones · KawsayTech" },
      { name: "description", content: "Gestiona tus publicaciones de papa y palta: editar, pausar, duplicar, marcar vendido o eliminar." },
      { property: "og:title", content: "Mis publicaciones · KawsayTech" },
      { property: "og:description", content: "Control total de tus publicaciones agrícolas en un solo lugar." },
    ],
  }),
  component: MisPublicaciones,
});

function MisPublicaciones() {
  const { publicaciones } = useKawsayData();
  const { usuario } = useAuth();
  const agId = usuario?.agricultorId ?? "ag-1";
  const mias = publicaciones.filter((p) => p.agricultorId === agId);

  return (
    <AppShell
      title="Mis publicaciones"
      subtitle={`${mias.length} publicaciones`}
      roles={["PRODUCTOR"]}
      action={
        <Button asChild size="lg" className="rounded-xl">
          <Link to="/publicar"><Plus className="mr-1 size-5" /> Nueva</Link>
        </Button>
      }
    >
      <div className="space-y-5">
        {mias.map((p) => (
          <Card key={p.id} className="gap-0 overflow-hidden rounded-3xl p-0 shadow-soft">
            <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center">
              <img src={p.imagenes[0] ?? imagenesDe(p.cultivo)[0]} onError={(e) => { e.currentTarget.src = imagenesDe(p.cultivo)[0]!; }} alt={`${CULTIVOS[p.cultivo].nombre} ${p.variedad}`} loading="lazy" width={200} height={160} className="h-32 w-full rounded-2xl object-cover md:w-44" />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-lg font-bold">
                    {CULTIVOS[p.cultivo].nombre} {p.variedad}
                  </h3>
                  <Badge
                    variant={p.estado === "activa" ? "default" : "outline"}
                    className="rounded-full capitalize"
                  >
                    {p.estado}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {p.cantidad.toLocaleString("es-PE")} {p.unidad} · {p.calidad} · {p.distrito}, {p.region}
                </p>
                <p className="font-display text-xl font-extrabold text-primary">
                  {soles(p.precio)}<span className="text-sm font-medium text-muted-foreground">/{p.unidad}</span>
                </p>
              </div>
              <div className="grid w-full grid-cols-2 gap-2 md:w-auto md:grid-cols-3">
                <Button asChild variant="secondary" className="rounded-xl">
                  <Link to="/producto/$id" params={{ id: p.id }}><Pencil className="mr-1 size-4" /> Ver / Editar</Link>
                </Button>
                {p.estado === "pausada" ? (
                  <Button variant="secondary" className="rounded-xl" onClick={() => { actualizarEstado(p.id, "activa"); toast.success("Publicación activada"); }}>
                    <Play className="mr-1 size-4" /> Activar
                  </Button>
                ) : (
                  <Button variant="secondary" className="rounded-xl" onClick={() => { actualizarEstado(p.id, "pausada"); toast.success("Publicación pausada"); }}>
                    <Pause className="mr-1 size-4" /> Pausar
                  </Button>
                )}
                <Button variant="secondary" className="rounded-xl" onClick={() => { actualizarEstado(p.id, "vendida"); toast.success("Marcada como vendida"); }}>
                  <CheckCircle2 className="mr-1 size-4" /> Vendido
                </Button>
                <Button variant="secondary" className="rounded-xl" onClick={() => { duplicarPublicacion(p.id); toast.success("Publicación duplicada"); }}>
                  <Copy className="mr-1 size-4" /> Duplicar
                </Button>
                <Button variant="ghost" className="rounded-xl text-destructive" onClick={() => { eliminarPublicacion(p.id); toast.success("Publicación eliminada"); }}>
                  <Trash2 className="mr-1 size-4" /> Eliminar
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {mias.length === 0 && (
          <Card className="items-center gap-3 rounded-3xl p-12 text-center shadow-none">
            <p className="font-display text-lg font-bold">Todavía no publicas nada</p>
            <Button asChild size="lg" className="rounded-xl"><Link to="/publicar">Publicar mi primer producto</Link></Button>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
