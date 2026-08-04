import { createFileRoute, Link } from "@tanstack/react-router";
import { Sprout, Plus, Package, HandCoins } from "lucide-react";
import { AppShell } from "@/components/kawsay/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CULTIVOS, IMAGENES, soles, useKawsayData } from "@/lib/kawsay/store";
import { useAuth } from "@/lib/kawsay/auth";
import type { CultivoId } from "@/lib/kawsay/types";

export const Route = createFileRoute("/mis-cultivos")({
  head: () => ({
    meta: [
      { title: "Mis cultivos · KawsayTech" },
      { name: "description", content: "Resumen de tus cultivos de papa y palta: variedades sembradas, volumen publicado y valor estimado." },
      { property: "og:title", content: "Mis cultivos · KawsayTech" },
      { property: "og:description", content: "Controla tus variedades, volúmenes y campañas activas." },
    ],
  }),
  component: MisCultivos,
});

function MisCultivos() {
  const { publicaciones } = useKawsayData();
  const { usuario } = useAuth();
  const agId = usuario?.agricultorId ?? "ag-1";
  const mias = publicaciones.filter((p) => p.agricultorId === agId);

  return (
    <AppShell
      title="Mis cultivos"
      subtitle="Papa y palta de tu campaña 2026"
      roles={["PRODUCTOR"]}
      action={
        <Button asChild size="lg" className="rounded-xl">
          <Link to="/publicar">
            <Plus className="mr-1 size-5" /> Publicar
          </Link>
        </Button>
      }
    >
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          {(Object.keys(CULTIVOS) as CultivoId[]).map((c) => {
            const delCultivo = mias.filter((p) => p.cultivo === c);
            const volumen = delCultivo.reduce((a, p) => a + p.cantidad, 0);
            const valor = delCultivo.reduce((a, p) => a + p.cantidad * p.precio, 0);
            return (
              <Card key={c} className="gap-0 overflow-hidden rounded-3xl p-0 shadow-soft">
                <img
                  src={IMAGENES[c][0]}
                  alt={`Cultivo de ${CULTIVOS[c].nombre}`}
                  loading="lazy"
                  width={900}
                  height={500}
                  className="aspect-[16/7] w-full object-cover"
                />
                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2 font-display text-xl font-extrabold">
                      <Sprout className="size-5 text-primary" /> {CULTIVOS[c].nombre}
                    </h2>
                    <Badge className="rounded-full bg-primary-soft text-primary">
                      {delCultivo.length} publicaciones
                    </Badge>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground">
                        <Package className="size-3" /> Volumen publicado
                      </p>
                      <p className="font-display text-lg font-bold">{volumen.toLocaleString("es-PE")}</p>
                    </div>
                    <div>
                      <p className="flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground">
                        <HandCoins className="size-3" /> Valor estimado
                      </p>
                      <p className="font-display text-lg font-bold text-primary">{soles(valor)}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {CULTIVOS[c].variedades.map((v) => (
                      <Badge
                        key={v}
                        variant="outline"
                        className={`rounded-full ${delCultivo.some((p) => p.variedad === v) ? "border-primary text-primary" : ""}`}
                      >
                        {v}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="gap-3 rounded-3xl border-dashed p-6 shadow-none">
          <h2 className="font-display text-lg font-bold">Próximamente en Mis cultivos</h2>
          <p className="text-sm text-muted-foreground">
            Registro de parcelas con hectáreas, fechas de siembra y cosecha, y conexión con los
            módulos de diagnóstico IA, fertilizantes y alertas climáticas.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary" className="rounded-xl">
              <Link to="/diagnostico">Diagnóstico IA</Link>
            </Button>
            <Button asChild variant="secondary" className="rounded-xl">
              <Link to="/fertilizantes">Fertilizantes</Link>
            </Button>
            <Button asChild variant="secondary" className="rounded-xl">
              <Link to="/alertas">Alertas climáticas</Link>
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
