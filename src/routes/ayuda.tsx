import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, MessageCircle, PlayCircle } from "lucide-react";
import { AppShell } from "@/components/kawsay/AppShell";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/ayuda")({
  head: () => ({
    meta: [
      { title: "Centro de ayuda · KawsayTech" },
      { name: "description", content: "Preguntas frecuentes sobre cómo publicar, vender y recibir solicitudes de compra en KawsayTech." },
      { property: "og:title", content: "Centro de ayuda · KawsayTech" },
      { property: "og:description", content: "Guías cortas y soporte directo para agricultores." },
    ],
  }),
  component: Ayuda,
});

const faqs = [
  { q: "¿Cómo publico mi cosecha?", a: "Entra a Publicar producto, elige papa o palta, escribe la cantidad y el precio, sube fotos y presiona el botón verde. Toma menos de un minuto." },
  { q: "¿Cuánto cuesta usar KawsayTech?", a: "Publicar es gratis durante el MVP. No cobramos comisión por las ventas de esta campaña." },
  { q: "¿Cómo recibo el pago?", a: "El acuerdo de pago se hace directamente con el comprador. Recomendamos pago al contado en chacra o transferencia antes del recojo." },
  { q: "¿Puedo pausar una publicación?", a: "Sí. En Mis publicaciones usa el botón Pausar; tu producto deja de mostrarse y puedes activarlo cuando quieras." },
  { q: "¿Cuándo llegan los módulos de IA?", a: "Diagnóstico, fertilizantes, cuidados y alertas climáticas ya están diseñados y se habilitarán en las siguientes versiones." },
];

function Ayuda() {
  return (
    <AppShell title="Ayuda" subtitle="Estamos para acompañarte">
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <Card className="gap-2 rounded-3xl p-6 shadow-soft md:p-8">
          <h3 className="font-display text-lg font-bold">Preguntas frecuentes</h3>
          <Accordion type="single" collapsible>
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        <div className="space-y-5">
          <Card className="gap-3 rounded-3xl bg-accent/50 p-6 shadow-none">
            <h3 className="font-display text-base font-bold">Soporte directo</h3>
            <Button size="lg" className="h-12 w-full rounded-xl">
              <MessageCircle className="mr-2 size-5" /> Escribir por WhatsApp
            </Button>
            <Button size="lg" variant="secondary" className="h-12 w-full rounded-xl">
              <Phone className="mr-2 size-5" /> Llamar al 0800 KAWSAY
            </Button>
          </Card>
          <Card className="gap-3 rounded-3xl p-6 shadow-soft">
            <h3 className="flex items-center gap-2 font-display text-base font-bold">
              <PlayCircle className="size-5 text-primary" /> Guía en video
            </h3>
            <p className="text-sm text-muted-foreground">
              Aprende a publicar tu primera cosecha en 2 minutos.
            </p>
            <Button asChild variant="secondary" className="rounded-xl">
              <Link to="/publicar">Empezar ahora</Link>
            </Button>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
