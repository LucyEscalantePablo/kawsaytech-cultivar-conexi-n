import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/kawsay/AppShell";
import { ProductCard } from "@/components/kawsay/ProductCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { REGIONES, soles, useKawsayData } from "@/lib/kawsay/store";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace de papa y palta · KawsayTech" },
      { name: "description", content: "Explora publicaciones de papa y palta de productores verificados, con filtros por precio, región, calidad y cantidad." },
      { property: "og:title", content: "Marketplace de papa y palta · KawsayTech" },
      { property: "og:description", content: "Compra directo del agricultor: precio, cantidad, ubicación y calificación en cada publicación." },
    ],
  }),
  component: Marketplace,
});

function Marketplace() {
  const { publicaciones } = useKawsayData();
  const [q, setQ] = useState("");
  const [cultivo, setCultivo] = useState("todos");
  const [region, setRegion] = useState("todas");
  const [calidad, setCalidad] = useState("todas");
  const [precioMax, setPrecioMax] = useState(80);
  const [cantidadMin, setCantidadMin] = useState(0);

  const resultados = useMemo(
    () =>
      publicaciones.filter(
        (p) =>
          p.estado === "activa" &&
          (cultivo === "todos" || p.cultivo === cultivo) &&
          (region === "todas" || p.region === region) &&
          (calidad === "todas" || p.calidad === calidad) &&
          p.precio <= precioMax &&
          p.cantidad >= cantidadMin &&
          `${p.variedad} ${p.region} ${p.distrito}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [publicaciones, cultivo, region, calidad, precioMax, cantidadMin, q],
  );

  return (
    <AppShell title="Marketplace" subtitle={`${resultados.length} publicaciones disponibles`}>
      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <Card className="h-fit gap-5 rounded-3xl p-6 shadow-soft lg:sticky lg:top-24">
          <div className="flex items-center gap-2 font-display font-bold">
            <SlidersHorizontal className="size-5 text-primary" /> Filtros
          </div>
          <div className="space-y-2">
            <Label htmlFor="buscar">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="buscar" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Variedad o zona" className="h-11 rounded-xl pl-9" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Producto</Label>
            <Select value={cultivo} onValueChange={setCultivo}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="papa">Papa</SelectItem>
                <SelectItem value="palta">Palta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Región</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {REGIONES.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Calidad</Label>
            <Select value={calidad} onValueChange={setCalidad}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["todas", "Primera", "Segunda", "Exportación", "Orgánica"].map((c) => (
                  <SelectItem key={c} value={c}>{c === "todas" ? "Todas" : c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label>Precio máximo: {soles(precioMax)}</Label>
            <Slider value={[precioMax]} onValueChange={(v) => setPrecioMax(v[0] ?? 80)} min={1} max={100} step={1} />
          </div>
          <div className="space-y-3">
            <Label>Cantidad mínima: {cantidadMin.toLocaleString("es-PE")}</Label>
            <Slider value={[cantidadMin]} onValueChange={(v) => setCantidadMin(v[0] ?? 0)} min={0} max={6000} step={100} />
          </div>
          <Button
            variant="secondary"
            className="rounded-xl"
            onClick={() => {
              setQ("");
              setCultivo("todos");
              setRegion("todas");
              setCalidad("todas");
              setPrecioMax(80);
              setCantidadMin(0);
            }}
          >
            Limpiar filtros
          </Button>
        </Card>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {resultados.map((p) => (
            <ProductCard key={p.id} pub={p} />
          ))}
          {resultados.length === 0 && (
            <Card className="col-span-full items-center gap-2 rounded-3xl p-12 text-center shadow-none">
              <p className="font-display text-lg font-bold">Sin resultados</p>
              <p className="text-sm text-muted-foreground">Prueba ampliando el precio o cambiando la región.</p>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
