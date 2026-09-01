import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Star,
  CalendarDays,
  Package,
  BadgeCheck,
  Pencil,
  BarChart3,
  Inbox,
  PauseCircle,
  CheckCircle2,
  Trash2,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/kawsay/AppShell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CULTIVOS,
  actualizarEstado,
  crearSolicitud,
  eliminarPublicacion,
  getAgricultor,
  soles,
  useKawsayData,
} from "@/lib/kawsay/store";
import { alternarFavorito, useAuth } from "@/lib/kawsay/auth";
import { formatDateDDMMYYYY } from "@/lib/utils";


export const Route = createFileRoute("/producto/$id")({
  head: () => ({
    meta: [
      { title: "Detalle del producto · KawsayTech" },
      { name: "description", content: "Galería, precio, disponibilidad, ubicación y datos del agricultor para solicitar una compra directa." },
      { property: "og:title", content: "Detalle del producto · KawsayTech" },
      { property: "og:description", content: "Contacta al agricultor y envía tu solicitud de compra con precio y fecha." },
    ],
  }),
  component: DetalleProducto,
});

function DetalleProducto() {
  const { id } = useParams({ from: "/producto/$id" });
  const { publicaciones, solicitudes } = useKawsayData();
  const { usuario, rol, favoritos } = useAuth();
  const navigate = useNavigate();
  const pub = publicaciones.find((p) => p.id === id);
  const [img, setImg] = useState(0);
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [fecha, setFecha] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [open, setOpen] = useState(false);

  if (!pub) {
    return (
      <AppShell title="Producto no encontrado">
        <Button asChild variant="secondary" className="rounded-xl">
          <Link to="/marketplace">Volver al marketplace</Link>
        </Button>
      </AppShell>
    );
  }

  const ag = getAgricultor(pub.agricultorId);
  const esPropietario =
    rol !== "COMPRADOR" && !!usuario?.agricultorId && usuario.agricultorId === pub.agricultorId;
  const solicitudesPub = solicitudes.filter((s) => s.publicacionId === pub.id);
  const esFavorito = favoritos.includes(pub.id);

  const enviar = () => {
    const cant = Number(cantidad);
    const prec = Number(precio);
    if (!cant || cant <= 0 || cant > pub.cantidad) {
      toast.error("Ingresa una cantidad válida");
      return;
    }
    if (!prec || prec <= 0) {
      toast.error("Ingresa el precio ofrecido");
      return;
    }
    crearSolicitud({
      publicacionId: pub.id,
      comprador: usuario?.nombre ?? "Comprador",
      compradorEmail: usuario?.email ?? "",
      cantidad: cant,
      precioOfrecido: prec,
      mensaje: mensaje.slice(0, 500),
      fechaRequerida: fecha || new Date().toISOString().slice(0, 10),
    });
    setOpen(false);
    setCantidad("");
    setPrecio("");
    setMensaje("");
    toast.success("Solicitud enviada al agricultor");
  };


  return (
    <AppShell title={`${CULTIVOS[pub.cultivo].nombre} ${pub.variedad}`} subtitle={`${pub.distrito}, ${pub.region}`}>
      <div className="space-y-6">
        <Button asChild variant="ghost" className="rounded-xl">
          <Link to="/marketplace">
            <ArrowLeft className="mr-1 size-4" /> Volver
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl border shadow-soft">
              <img
                src={pub.imagenes[img]}
                alt={`${CULTIVOS[pub.cultivo].nombre} ${pub.variedad}`}
                width={900}
                height={700}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="flex gap-3">
              {pub.imagenes.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setImg(i)}
                  className={`overflow-hidden rounded-2xl border-2 transition-colors ${i === img ? "border-primary" : "border-transparent"}`}
                  aria-label={`Ver imagen ${i + 1}`}
                >
                  <img src={src} alt="" loading="lazy" width={160} height={120} className="size-24 object-cover" />
                </button>
              ))}
            </div>

            <Card className="gap-3 rounded-3xl p-6 shadow-soft">
              <h3 className="font-display text-lg font-bold">Descripción</h3>
              <p className="text-muted-foreground">{pub.descripcion}</p>
              <div className="grid gap-4 pt-2 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Calidad</p>
                  <p className="font-semibold">{pub.calidad}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Cosecha</p>
                  <p className="font-semibold">{formatDateDDMMYYYY(pub.fechaCosecha)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Estado</p>
                  <p className="font-semibold capitalize">{pub.estado}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="gap-4 rounded-3xl p-6 shadow-lift">
              <p className="font-display text-4xl font-extrabold text-primary">
                {soles(pub.precio)}
                <span className="text-base font-medium text-muted-foreground">/{pub.unidad}</span>
              </p>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Package className="size-4 text-primary" /> Disponible: {pub.cantidad.toLocaleString("es-PE")} {pub.unidad}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="size-4 text-primary" /> {pub.distrito}, {pub.region}
                </p>
                <p className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-primary" /> Publicado el {formatDateDDMMYYYY(pub.creada)}
                </p>
              </div>

              {esPropietario ? (
                <div className="grid gap-3">
                  <Button asChild size="lg" className="h-14 w-full rounded-2xl text-base">
                    <Link to="/mis-publicaciones">
                      <Pencil className="mr-2 size-5" /> Editar publicación
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary" className="h-12 w-full rounded-2xl">
                    <Link to="/estadisticas">
                      <BarChart3 className="mr-2 size-5" /> Ver estadísticas
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary" className="h-12 w-full rounded-2xl">
                    <Link to="/solicitudes">
                      <Inbox className="mr-2 size-5" /> Solicitudes recibidas ({solicitudesPub.length})
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="h-12 w-full rounded-2xl"
                    onClick={() => {
                      const nuevo = pub.estado === "pausada" ? "activa" : "pausada";
                      actualizarEstado(pub.id, nuevo);
                      toast.success(nuevo === "activa" ? "Publicación activada" : "Publicación pausada");
                    }}
                  >
                    <PauseCircle className="mr-2 size-5" />
                    {pub.estado === "pausada" ? "Activar publicación" : "Pausar publicación"}
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="h-12 w-full rounded-2xl"
                    onClick={() => {
                      actualizarEstado(pub.id, "vendida");
                      toast.success("Producto marcado como vendido");
                    }}
                  >
                    <CheckCircle2 className="mr-2 size-5" /> Marcar como vendido
                  </Button>
                  <Button
                    size="lg"
                    variant="destructive"
                    className="h-12 w-full rounded-2xl"
                    onClick={() => {
                      eliminarPublicacion(pub.id);
                      toast.success("Publicación eliminada");
                      navigate({ to: "/mis-publicaciones" });
                    }}
                  >
                    <Trash2 className="mr-2 size-5" /> Eliminar publicación
                  </Button>
                </div>
              ) : (
                <>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="h-14 w-full rounded-2xl text-base">Solicitar compra</Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl">
                      <DialogHeader>
                        <DialogTitle>Solicitud de compra</DialogTitle>
                        <DialogDescription>
                          El agricultor recibirá tu oferta y podrá aceptarla o rechazarla.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cant">Cantidad ({pub.unidad})</Label>
                          <Input id="cant" type="number" min={1} max={pub.cantidad} value={cantidad} onChange={(e) => setCantidad(e.target.value)} className="h-12 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="prec">Precio ofrecido por {pub.unidad} (S/)</Label>
                          <Input id="prec" type="number" min={0} step="0.1" value={precio} onChange={(e) => setPrecio(e.target.value)} className="h-12 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fec">Fecha requerida</Label>
                          <Input id="fec" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="h-12 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="msj">Mensaje</Label>
                          <Textarea id="msj" maxLength={500} value={mensaje} onChange={(e) => setMensaje(e.target.value)} className="rounded-xl" placeholder="Cuéntale al agricultor cómo será el recojo o el pago" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button size="lg" className="rounded-xl" onClick={enviar}>Enviar solicitud</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="h-14 w-full rounded-2xl text-base"
                    onClick={() => toast.success(`Puedes llamar al ${ag.telefono}`)}
                  >
                    <Phone className="mr-2 size-5" /> Contactar productor
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 w-full rounded-2xl"
                    onClick={() => {
                      const activo = alternarFavorito(pub.id);
                      toast.success(activo ? "Agregado a favoritos" : "Quitado de favoritos");
                    }}
                  >
                    <Heart className={`mr-2 size-5 ${esFavorito ? "fill-destructive text-destructive" : ""}`} />
                    {esFavorito ? "En favoritos" : "Agregar a Favoritos"}
                  </Button>
                </>
              )}
            </Card>


            <Card className="gap-4 rounded-3xl p-6 shadow-soft">
              <h3 className="font-display text-lg font-bold">El agricultor</h3>
              <div className="flex items-center gap-4">
                <Avatar className="size-14">
                  <AvatarFallback className={`${ag.avatarColor} text-primary-foreground`}>
                    {ag.nombre.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="flex items-center gap-1 font-semibold">
                    {ag.nombre} <BadgeCheck className="size-4 text-primary" />
                  </p>
                  <p className="text-sm text-muted-foreground">{ag.region} · {ag.ventas} ventas</p>
                </div>
              </div>
              <Badge variant="outline" className="w-fit rounded-full">
                <Star className="mr-1 size-3 fill-harvest text-harvest" /> {ag.calificacion} de calificación
              </Badge>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
