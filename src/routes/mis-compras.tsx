import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag, HandCoins, Package } from "lucide-react";
import { AppShell } from "@/components/kawsay/AppShell";
import { StatCard } from "@/components/kawsay/StatCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CULTIVOS, getAgricultor, getPublicacion, soles, useKawsayData } from "@/lib/kawsay/store";
import { useAuth } from "@/lib/kawsay/auth";

export const Route = createFileRoute("/mis-compras")({
  head: () => ({
    meta: [
      { title: "Mis compras · KawsayTech" },
      { name: "description", content: "Historial de compras agrícolas realizadas en KawsayTech: producto, productor, cantidad y monto." },
      { property: "og:title", content: "Mis compras · KawsayTech" },
      { property: "og:description", content: "Todas tus operaciones cerradas en un solo lugar." },
    ],
  }),
  component: MisCompras,
});

function MisCompras() {
  const { ventas } = useKawsayData();
  const { usuario } = useAuth();
  const compras = ventas.filter((v) => v.compradorEmail === usuario?.email);
  const total = compras.reduce((a, v) => a + v.cantidad * v.precio, 0);
  const volumen = compras.reduce((a, v) => a + v.cantidad, 0);

  return (
    <AppShell title="Mis compras" subtitle={`${compras.length} operaciones cerradas`} roles={["COMPRADOR"]}>
      <div className="space-y-8">
        <div className="grid gap-5 sm:grid-cols-3">
          <StatCard icon={ShoppingBag} label="Compras realizadas" value={String(compras.length)} />
          <StatCard icon={HandCoins} label="Monto total" value={soles(total)} tone="success" />
          <StatCard icon={Package} label="Volumen comprado" value={volumen.toLocaleString("es-PE")} tone="earth" hint="Unidades acumuladas" />
        </div>

        <Card className="overflow-hidden rounded-3xl p-0 shadow-soft">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Productor</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {compras.map((v) => {
                const pub = getPublicacion(v.publicacionId);
                return (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">
                      {pub ? `${CULTIVOS[pub.cultivo].nombre} ${pub.variedad}` : "—"}
                    </TableCell>
                    <TableCell>{pub ? getAgricultor(pub.agricultorId).nombre : "—"}</TableCell>
                    <TableCell>{v.cantidad.toLocaleString("es-PE")} {pub?.unidad}</TableCell>
                    <TableCell>{soles(v.precio)}</TableCell>
                    <TableCell className="text-right font-display font-bold text-success">
                      {soles(v.cantidad * v.precio)}
                    </TableCell>
                    <TableCell>{v.fecha}</TableCell>
                  </TableRow>
                );
              })}
              {compras.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    Aún no registras compras.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        <Button asChild className="w-fit rounded-xl">
          <Link to="/marketplace">Seguir comprando</Link>
        </Button>
      </div>
    </AppShell>
  );
}
