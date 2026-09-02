import { createFileRoute } from "@tanstack/react-router";
import { Star, MapPin, Phone, BadgeCheck, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth, actualizarPerfil } from "@/lib/kawsay/auth";
import { AppShell } from "@/components/kawsay/AppShell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductCard } from "@/components/kawsay/ProductCard";
import { actualizarAgricultorPerfil, getAgricultor, useKawsayData } from "@/lib/kawsay/store";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Mi perfil de productor · KawsayTech" },
      { name: "description", content: "Administra tus datos de productor, zona de cultivo, contacto y reputación en KawsayTech." },
      { property: "og:title", content: "Mi perfil de productor · KawsayTech" },
      { property: "og:description", content: "Tu identidad como agricultor verificado en la plataforma." },
    ],
  }),
  component: Perfil,
});

function Perfil() {
  const { usuario, rol } = useAuth();
  const agId = usuario?.agricultorId ?? "ag-1";
  const ag = getAgricultor(agId);
  const { publicaciones } = useKawsayData();
  const mias = publicaciones.filter((p) => p.agricultorId === agId && p.estado === "activa");
  const [form, setForm] = useState({
    nombre: usuario?.nombre ?? ag.nombre,
    telefono: usuario?.telefono ?? ag.telefono,
    region: usuario?.region ?? ag.region,
    areaCultivada: usuario?.areaCultivada ?? 3.5,
  });

  useEffect(() => {
    setForm({
      nombre: usuario?.nombre ?? ag.nombre,
      telefono: usuario?.telefono ?? ag.telefono,
      region: usuario?.region ?? ag.region,
      areaCultivada: usuario?.areaCultivada ?? 3.5,
    });
  }, [usuario, ag]);

  const guardarPerfil = () => {
    if (!usuario) return;
    const nombre = form.nombre.trim();
    if (!nombre) {
      toast.error("El nombre es obligatorio");
      return;
    }

    actualizarPerfil({
      id: usuario.id,
      nombre,
      telefono: form.telefono,
      region: form.region,
      areaCultivada: rol === "PRODUCTOR" ? Number(form.areaCultivada) || 0 : undefined,
    });

    if (rol === "PRODUCTOR") {
      actualizarAgricultorPerfil(agId, {
        nombre,
        region: form.region,
        telefono: form.telefono,
      });
    }

    toast.success("Cambios guardados correctamente");
  };

  const subtitle = rol === "COMPRADOR" ? "Comprador verificado" : "Agricultor verificado";

  return (
    <AppShell title="Mi perfil" subtitle={subtitle}>
      <div className="space-y-8">
        <Card className="gap-6 rounded-[28px] border border-[#dfe5dc] bg-[#f7f7f5] p-6 shadow-none md:p-8">
          <div className="flex flex-wrap items-center gap-5">
            <Avatar className="size-20 border-4 border-white shadow-sm">
              <AvatarFallback className="bg-[#1f6b44] text-2xl font-bold text-white">
                {(form.nombre || ag.nombre)
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "KT"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-[14rem] flex-1">
              <h2 className="flex items-center gap-2 font-display text-[2rem] font-extrabold tracking-[-0.04em] text-[#1e2023]">
                {form.nombre || ag.nombre} <BadgeCheck className="size-5 text-[#1f6b44]" />
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#4d5a53]">
                <span className="flex items-center gap-1.5"><MapPin className="size-4" /> {form.region || ag.region}</span>
                <span className="flex items-center gap-1.5"><Phone className="size-4" /> {form.telefono || ag.telefono}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary" className="rounded-full border border-[#dfe5dc] bg-white px-3 py-1 text-sm font-medium text-[#3d4a42]">
                  <Star className="mr-1 size-3 fill-[#f1b81d] text-[#f1b81d]" /> {ag.calificacion}
                </Badge>
                <Badge variant="secondary" className="rounded-full border border-[#dfe5dc] bg-white px-3 py-1 text-sm font-medium text-[#3d4a42]">
                  <Package className="mr-1 size-3" /> {ag.ventas} ventas
                </Badge>
                <Badge className="rounded-full bg-[#dfeee4] px-3 py-1 text-sm font-medium text-[#1f6b44]">Papa · Palta</Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-base font-medium text-[#2c332f]">Nombre completo</Label>
              <Input
                id="nombre"
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                className="h-12 rounded-xl border-[#d8ddd7] bg-white text-base text-[#1e2023] shadow-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tel" className="text-base font-medium text-[#2c332f]">Teléfono</Label>
              <Input
                id="tel"
                value={form.telefono}
                onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                className="h-12 rounded-xl border-[#d8ddd7] bg-white text-base text-[#1e2023] shadow-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg" className="text-base font-medium text-[#2c332f]">Región</Label>
              <Input
                id="reg"
                value={form.region}
                onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                className="h-12 rounded-xl border-[#d8ddd7] bg-white text-base text-[#1e2023] shadow-none"
              />
            </div>
            {rol === "PRODUCTOR" && (
              <div className="space-y-2">
                <Label htmlFor="area" className="text-base font-medium text-[#2c332f]">Área cultivada (ha)</Label>
                <Input
                  id="area"
                  type="number"
                  step="0.1"
                  value={form.areaCultivada}
                  onChange={(e) => setForm((f) => ({ ...f, areaCultivada: Number(e.target.value) }))}
                  className="h-12 rounded-xl border-[#d8ddd7] bg-white text-base text-[#1e2023] shadow-none"
                />
              </div>
            )}
          </div>

          <Button
            size="lg"
            className="h-12 rounded-2xl bg-[#1f6b44] px-6 text-base font-semibold text-white hover:bg-[#1a5b3c]"
            onClick={guardarPerfil}
          >
            Guardar cambios
          </Button>
        </Card>

        {rol === "PRODUCTOR" && (
          <section className="space-y-4">
            <h3 className="font-display text-2xl font-extrabold tracking-[-0.03em] text-[#1f2523]">Mis productos activos</h3>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {mias.map((p) => (
                <ProductCard key={p.id} pub={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
