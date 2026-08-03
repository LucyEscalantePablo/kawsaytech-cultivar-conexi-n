import { createFileRoute } from "@tanstack/react-router";
import { HandCoins, Package, Inbox, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/kawsay/AppShell";
import { StatCard } from "@/components/kawsay/StatCard";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CULTIVOS, getPublicacion, soles, useKawsayData } from "@/lib/kawsay/store";

export const Route = createFileRoute("/historial")({
  head: () => ({
    meta: [
      { title: "Historial de ventas · KawsayTech" },
      { name: "description", content: "Historial de ventas, solicitudes, productos vendidos e ingresos acumulados por campaña." },
      { property: "og:title", content: "Historial de ventas · KawsayTech" },
      { property: "og:description", content: "Todo lo que vendiste y cuánto ganaste, ordenado por fecha." },
    ],
  }),
  component: Historial,
});

function Historial() {
  const { ventas, solicitudes, publicaciones } = useKawsayData();
  const ingresos = ventas.reduce((a, v) => a + v.cantidad * v.precio, 0);
  const vendidas = publicaciones.filter((p) => p.estado === "vendida");

  return (
    <AppShell title="Historial" subtitle="Campaña 2026">
      <div className="space-y-8">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={HandCoins} label="Ingresos" value={soles(ingresos)} tone="success" />
          <StatCard icon={Package} label="Ventas" value={String(ventas.length)} />
          <StatCard icon={Inbox} label="Solicitudes" value={String(solicitudes.length)} tone="harvest" />
          <StatCard icon={TrendingUp} label="Productos vendidos" value={String(vendidas.length)} tone="earth" />
        </div>

        <Tabs defaultValue="ventas">
          <TabsList className="h-12 rounded-2xl">
            <TabsTrigger value="ventas" className="rounded-xl px-5">Ventas</TabsTrigger>
            <TabsTrigger value="solicitudes" className="rounded-xl px-5">Solicitudes</TabsTrigger>
          </TabsList>

          <TabsContent value="ventas" className="mt-6">
            <Card className="overflow-x-auto rounded-3xl p-2 shadow-soft">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Comprador</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ventas.map((v) => {
                    const pub = getPublicacion(v.publicacionId);
                    return (
                      <TableRow key={v.id}>
                        <TableCell>{v.fecha}</TableCell>
                        <TableCell className="font-medium">
                          {pub ? `${CULTIVOS[pub.cultivo].nombre} ${pub.variedad}` : "—"}
                        </TableCell>
                        <TableCell>{v.comprador}</TableCell>
                        <TableCell className="text-right">
                          {v.cantidad.toLocaleString("es-PE")} {pub?.unidad}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-success">
                          {soles(v.cantidad * v.precio)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="solicitudes" className="mt-6">
            <Card className="overflow-x-auto rounded-3xl p-2 shadow-soft">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Comprador</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Oferta</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {solicitudes.map((s) => {
                    const pub = getPublicacion(s.publicacionId);
                    return (
                      <TableRow key={s.id}>
                        <TableCell>{s.creada}</TableCell>
                        <TableCell className="font-medium">{s.comprador}</TableCell>
                        <TableCell>{pub ? `${CULTIVOS[pub.cultivo].nombre} ${pub.variedad}` : "—"}</TableCell>
                        <TableCell className="text-right">{soles(s.precioOfrecido)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="rounded-full capitalize">{s.estado}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
