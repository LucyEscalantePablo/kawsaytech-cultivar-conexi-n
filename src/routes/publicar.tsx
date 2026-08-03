import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ImagePlus, Check } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/kawsay/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CULTIVOS, IMAGENES, REGIONES, crearPublicacion } from "@/lib/kawsay/store";
import type { Calidad, CultivoId, EstadoPublicacion, Publicacion } from "@/lib/kawsay/types";

export const Route = createFileRoute("/publicar")({
  head: () => ({
    meta: [
      { title: "Publicar producto · KawsayTech" },
      { name: "description", content: "Registra tu cosecha de papa o palta: variedad, cantidad, precio, calidad, ubicación y fotografías." },
      { property: "og:title", content: "Publicar producto · KawsayTech" },
      { property: "og:description", content: "Formulario simple y con botones grandes para publicar tu cosecha en minutos." },
    ],
  }),
  component: Publicar,
});

function Publicar() {
  const navigate = useNavigate();
  const [cultivo, setCultivo] = useState<CultivoId>("papa");
  const [variedad, setVariedad] = useState(CULTIVOS.papa.variedades[0]!);
  const [cantidad, setCantidad] = useState("");
  const [unidad, setUnidad] = useState<Publicacion["unidad"]>("kg");
  const [precio, setPrecio] = useState("");
  const [calidad, setCalidad] = useState<Calidad>("Primera");
  const [region, setRegion] = useState(REGIONES[0]!);
  const [distrito, setDistrito] = useState("");
  const [fechaCosecha, setFechaCosecha] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState<EstadoPublicacion>("activa");

  const guardar = () => {
    const cant = Number(cantidad);
    const prec = Number(precio);
    if (!cant || cant <= 0) {
      toast.error("Ingresa la cantidad");
      return;
    }
    if (!prec || prec <= 0) {
      toast.error("Ingresa el precio");
      return;
    }
    if (!distrito.trim()) {
      toast.error("Indica el distrito");
      return;
    }
    crearPublicacion({
      cultivo,
      variedad,
      cantidad: cant,
      unidad,
      precio: prec,
      calidad,
      region,
      distrito: distrito.trim().slice(0, 60),
      fechaCosecha: fechaCosecha || new Date().toISOString().slice(0, 10),
      descripcion: descripcion.trim().slice(0, 600) || "Producto fresco de chacra.",
      estado,
    });
    toast.success("¡Publicación creada!");
    navigate({ to: "/mis-publicaciones" });
  };

  return (
    <AppShell title="Publicar producto" subtitle="Solo 3 pasos: producto, precio y fotos">
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <Card className="gap-6 rounded-3xl p-6 shadow-soft md:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Producto</Label>
              <Select
                value={cultivo}
                onValueChange={(v) => {
                  const c = v as CultivoId;
                  setCultivo(c);
                  setVariedad(CULTIVOS[c].variedades[0]!);
                }}
              >
                <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="papa">Papa</SelectItem>
                  <SelectItem value="palta">Palta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Variedad</Label>
              <Select value={variedad} onValueChange={setVariedad}>
                <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CULTIVOS[cultivo].variedades.map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad</Label>
              <Input id="cantidad" type="number" min={1} value={cantidad} onChange={(e) => setCantidad(e.target.value)} className="h-12 rounded-xl" placeholder="Ej. 1200" />
            </div>
            <div className="space-y-2">
              <Label>Unidad</Label>
              <Select value={unidad} onValueChange={(v) => setUnidad(v as Publicacion["unidad"])}>
                <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["kg", "arroba", "saco", "tonelada"].map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="precio">Precio por {unidad} (S/)</Label>
              <Input id="precio" type="number" min={0} step="0.1" value={precio} onChange={(e) => setPrecio(e.target.value)} className="h-12 rounded-xl" placeholder="Ej. 2.60" />
            </div>
            <div className="space-y-2">
              <Label>Calidad</Label>
              <Select value={calidad} onValueChange={(v) => setCalidad(v as Calidad)}>
                <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Primera", "Segunda", "Exportación", "Orgánica"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Región</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REGIONES.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="distrito">Distrito / ubicación</Label>
              <Input id="distrito" maxLength={60} value={distrito} onChange={(e) => setDistrito(e.target.value)} className="h-12 rounded-xl" placeholder="Ej. Chinchao" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cosecha">Fecha de cosecha</Label>
              <Input id="cosecha" type="date" value={fechaCosecha} onChange={(e) => setFechaCosecha(e.target.value)} className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Estado del producto</Label>
              <Select value={estado} onValueChange={(v) => setEstado(v as EstadoPublicacion)}>
                <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="activa">Activa</SelectItem>
                  <SelectItem value="pausada">Pausada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Descripción</Label>
            <Textarea id="desc" maxLength={600} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="min-h-28 rounded-xl" placeholder="Cuenta cómo cosechaste, el calibre y cómo se puede recoger" />
          </div>

          <div className="space-y-2">
            <Label>Fotografías</Label>
            <div className="flex flex-wrap gap-4">
              {IMAGENES[cultivo].map((src) => (
                <img key={src} src={src} alt="" loading="lazy" width={160} height={120} className="size-28 rounded-2xl object-cover" />
              ))}
              <div className="flex size-28 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed text-muted-foreground">
                <ImagePlus className="size-6" />
                <span className="text-xs">Agregar</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">En producción las imágenes se suben a Cloudinary.</p>
          </div>

          <Button size="lg" className="h-14 rounded-2xl text-base" onClick={guardar}>
            <Check className="mr-2 size-5" /> Publicar producto
          </Button>
        </Card>

        <Card className="h-fit gap-3 rounded-3xl bg-accent/50 p-6 shadow-none">
          <h3 className="font-display text-base font-bold">Consejos rápidos</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>Toma fotos con luz de día y sin bolsas encima.</li>
            <li>Indica el calibre y si el producto está seleccionado.</li>
            <li>Un precio realista recibe más solicitudes.</li>
            <li>Si aún no cosechas, publica como “pausada”.</li>
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}
