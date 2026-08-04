import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { AppShell } from "@/components/kawsay/AppShell";
import { ProductCard } from "@/components/kawsay/ProductCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useKawsayData } from "@/lib/kawsay/store";
import { useAuth } from "@/lib/kawsay/auth";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Mis favoritos · KawsayTech" },
      { name: "description", content: "Productos agrícolas que guardaste para revisar o negociar más tarde." },
      { property: "og:title", content: "Mis favoritos · KawsayTech" },
      { property: "og:description", content: "Tus publicaciones de papa y palta guardadas." },
    ],
  }),
  component: Favoritos,
});

function Favoritos() {
  const { publicaciones } = useKawsayData();
  const { favoritos } = useAuth();
  const guardados = publicaciones.filter((p) => favoritos.includes(p.id));

  return (
    <AppShell title="Mis favoritos" subtitle={`${guardados.length} productos guardados`} roles={["COMPRADOR"]}>
      {guardados.length === 0 ? (
        <Card className="items-center gap-3 rounded-3xl p-12 text-center shadow-none">
          <Heart className="size-10 text-muted-foreground" />
          <p className="font-display text-lg font-bold">Todavía no guardas productos</p>
          <p className="text-sm text-muted-foreground">
            Usa el corazón en el detalle de una publicación para guardarla aquí.
          </p>
          <Button asChild className="rounded-xl">
            <Link to="/marketplace">Explorar marketplace</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {guardados.map((p) => (
            <ProductCard key={p.id} pub={p} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
