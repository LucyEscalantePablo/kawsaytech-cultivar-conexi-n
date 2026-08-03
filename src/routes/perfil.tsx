import { createFileRoute } from "@tanstack/react-router";
import { Star, MapPin, Phone, BadgeCheck, Package } from "lucide-react";
import { AppShell } from "@/components/kawsay/AppShell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductCard } from "@/components/kawsay/ProductCard";
import { AGRICULTOR_ACTUAL, getAgricultor, useKawsayData } from "@/lib/kawsay/store";

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
  const ag = getAgricultor(AGRICULTOR_ACTUAL);
  const { publicaciones } = useKawsayData();
  const mias = publicaciones.filter((p) => p.agricultorId === AGRICULTOR_ACTUAL && p.estado === "activa");

  return (
    <AppShell title="Mi perfil" subtitle="Agricultor verificado">
      <div className="space-y-8">
        <Card className="gap-6 rounded-3xl p-6 shadow-soft md:p-8">
          <div className="flex flex-wrap items-center gap-5">
            <Avatar className="size-20">
              <AvatarFallback className="bg-primary text-2xl text-primary-foreground">JQ</AvatarFallback>
            </Avatar>
            <div className="min-w-[14rem] flex-1">
              <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold">
                {ag.nombre} <BadgeCheck className="size-5 text-primary" />
              </h2>
              <p className="flex flex-wrap items-center gap-x-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="size-4" /> {ag.region}</span>
                <span className="flex items-center gap-1"><Phone className="size-4" /> {ag.telefono}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="outline" className="rounded-full">
                  <Star className="mr-1 size-3 fill-harvest text-harvest" /> {ag.calificacion}
                </Badge>
                <Badge variant="outline" className="rounded-full">
                  <Package className="mr-1 size-3" /> {ag.ventas} ventas
                </Badge>
                <Badge className="rounded-full bg-primary-soft text-primary">Papa · Palta</Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input id="nombre" defaultValue={ag.nombre} className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tel">Teléfono</Label>
              <Input id="tel" defaultValue={ag.telefono} className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg">Región</Label>
              <Input id="reg" defaultValue={ag.region} className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Área cultivada (ha)</Label>
              <Input id="area" type="number" defaultValue={3.5} className="h-12 rounded-xl" />
            </div>
          </div>
          <Button size="lg" className="w-fit rounded-2xl">Guardar cambios</Button>
        </Card>

        <section className="space-y-4">
          <h3 className="font-display text-xl font-extrabold">Mis productos activos</h3>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {mias.map((p) => (
              <ProductCard key={p.id} pub={p} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
