import { Link } from "@tanstack/react-router";
import { MapPin, Star, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CULTIVOS, getAgricultor, imagenesDe, soles } from "@/lib/kawsay/store";
import type { Publicacion } from "@/lib/kawsay/types";

export function ProductCard({ pub }: { pub: Publicacion }) {
  const ag = getAgricultor(pub.agricultorId);

  return (
    <Card className="group gap-0 overflow-hidden rounded-3xl border-border/70 p-0 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={pub.imagenes[0] ?? imagenesDe(pub.cultivo)[0]}
          onError={(e) => {
            e.currentTarget.src = imagenesDe(pub.cultivo)[0]!;
          }}
          alt={`${CULTIVOS[pub.cultivo].nombre} ${pub.variedad}`}
          loading="lazy"
          width={900}
          height={700}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge className="absolute left-3 top-3 rounded-full bg-card px-3 py-1 text-card-foreground shadow-soft">
          {CULTIVOS[pub.cultivo].nombre}
        </Badge>
        {pub.estado !== "activa" && (
          <Badge variant="secondary" className="absolute right-3 top-3 rounded-full capitalize">
            {pub.estado}
          </Badge>
        )}
      </div>
      <div className="space-y-3 p-5">
        <div>
          <h3 className="font-display text-lg font-bold leading-tight">{pub.variedad}</h3>
          <p className="text-sm text-muted-foreground">Calidad {pub.calidad}</p>
        </div>
        <div className="flex items-end justify-between">
          <p className="font-display text-2xl font-extrabold text-primary">
            {soles(pub.precio)}
            <span className="text-sm font-medium text-muted-foreground">/{pub.unidad}</span>
          </p>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Package className="size-4" />
            {pub.cantidad.toLocaleString("es-PE")} {pub.unidad}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="size-4" />
            {pub.distrito}, {pub.region}
          </span>
          <span className="flex items-center gap-1">
            <Star className="size-4 fill-harvest text-harvest" />
            {ag.calificacion}
          </span>
        </div>
        <p className="text-sm font-medium">{ag.nombre}</p>
        <Button asChild size="lg" className="w-full rounded-xl">
          <Link to="/producto/$id" params={{ id: pub.id }}>
            Ver detalles
          </Link>
        </Button>
      </div>
    </Card>
  );
}
