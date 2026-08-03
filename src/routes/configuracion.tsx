import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/kawsay/AppShell";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/configuracion")({
  head: () => ({
    meta: [
      { title: "Configuración · KawsayTech" },
      { name: "description", content: "Configura notificaciones, idioma, moneda y preferencias de la plataforma KawsayTech." },
      { property: "og:title", content: "Configuración · KawsayTech" },
      { property: "og:description", content: "Notificaciones, idioma y preferencias de cuenta." },
    ],
  }),
  component: Configuracion,
});

const opciones = [
  { id: "sol", label: "Avisarme cuando reciba una solicitud", def: true },
  { id: "precio", label: "Avisarme si el precio de mi cultivo cambia", def: true },
  { id: "clima", label: "Alertas de clima (cuando esté disponible)", def: false },
  { id: "wsp", label: "Recibir avisos por WhatsApp", def: true },
];

function Configuracion() {
  return (
    <AppShell title="Configuración" subtitle="Ajusta la plataforma a tu manera de trabajar">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="gap-5 rounded-3xl p-6 shadow-soft">
          <h3 className="font-display text-lg font-bold">Notificaciones</h3>
          {opciones.map((o, i) => (
            <div key={o.id}>
              <div className="flex items-center justify-between gap-4 py-1">
                <Label htmlFor={o.id} className="text-base font-normal">{o.label}</Label>
                <Switch id={o.id} defaultChecked={o.def} />
              </div>
              {i < opciones.length - 1 && <Separator className="mt-3" />}
            </div>
          ))}
        </Card>

        <Card className="gap-5 rounded-3xl p-6 shadow-soft">
          <h3 className="font-display text-lg font-bold">Preferencias</h3>
          <div className="space-y-2">
            <Label>Idioma</Label>
            <Select defaultValue="es">
              <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="qu">Quechua</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Moneda</Label>
            <Select defaultValue="pen">
              <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pen">Soles (S/)</SelectItem>
                <SelectItem value="usd">Dólares (US$)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Unidad preferida</Label>
            <Select defaultValue="kg">
              <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["kg", "arroba", "saco", "tonelada"].map((u) => (
                  <SelectItem key={u} value={u}>{u}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="texto" className="text-base font-normal">Texto más grande</Label>
            <Switch id="texto" />
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
