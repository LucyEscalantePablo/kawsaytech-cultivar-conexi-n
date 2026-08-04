import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Phone, Star, Package, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/kawsay/AppShell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useKawsayData } from "@/lib/kawsay/store";

export const Route = createFileRoute("/productores")({
  head: () => ({
    meta: [
      { title: "Productores verificados · KawsayTech" },
      { name: "description", content: "Conoce a los productores de papa y palta de KawsayTech: región, calificación, ventas y publicaciones activas." },
      { property: "og:title", content: "Productores verificados · KawsayTech" },
      { property: "og:description", content: "Contacta directamente al agricultor detrás de cada publicación." },
    ],
  }),
  component: Productores,
});

function Productores() {
  const { agricultores, publicaciones } = useKawsayData();

  return (
    <AppShell title="Productores" subtitle={`${agricultores.length} agricultores en la plataforma`} roles={["COMPRADOR"]}>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {agricultores.map((ag) => {
          const activas = publicaciones.filter((p) => p.agricultorId === ag.id && p.estado === "activa");
          return (
            <Card key={ag.id} className="gap-4 rounded-3xl p-6 shadow-soft">
              <div className="flex items-center gap-4">
                <Avatar className="size-14">
                  <AvatarFallback className={`${ag.avatarColor} text-primary-foreground`}>
                    {ag.nombre.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="flex items-center gap-1 font-display font-bold">
                    <span className="truncate">{ag.nombre}</span>
                    <BadgeCheck className="size-4 shrink-0 text-primary" />
                  </p>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="size-4" /> {ag.region}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="rounded-full">
                  <Star className="mr-1 size-3 fill-harvest text-harvest" /> {ag.calificacion}
                </Badge>
                <Badge variant="outline" className="rounded-full">
                  <Package className="mr-1 size-3" /> {ag.ventas} ventas
                </Badge>
                <Badge className="rounded-full bg-primary-soft text-primary">
                  {activas.length} publicaciones activas
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  className="rounded-xl"
                  onClick={() => toast.success(`Puedes llamar al ${ag.telefono}`)}
                >
                  <Phone className="mr-1 size-4" /> Contactar
                </Button>
                {activas[0] && (
                  <Button asChild className="rounded-xl">
                    <Link to="/producto/$id" params={{ id: activas[0].id }}>Ver productos</Link>
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
