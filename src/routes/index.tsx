import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Leaf,
  ScanEye,
  Store,
  CloudSun,
  FlaskConical,
  Sprout,
  BarChart3,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import heroImg from "@/assets/hero-campo.jpg";
import { AppShell } from "@/components/kawsay/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KawsayTech · Plataforma digital para agricultores" },
      {
        name: "description",
        content:
          "KawsayTech conecta a pequeños y medianos productores de papa y palta con compradores, y prepara módulos de IA para diagnóstico, fertilización y clima.",
      },
      { property: "og:title", content: "KawsayTech · Plataforma digital para agricultores" },
      {
        property: "og:description",
        content: "Comercializa papa y palta, gestiona solicitudes y prepárate para la agricultura inteligente.",
      },
    ],
  }),
  component: Inicio,
});

const modulos = [
  { icon: Store, titulo: "Comercialización", detalle: "Publica, vende y gestiona solicitudes de papa y palta.", activo: true },
  { icon: ScanEye, titulo: "Diagnóstico IA", detalle: "Detecta enfermedades desde una fotografía del cultivo." },
  { icon: FlaskConical, titulo: "Fertilizantes", detalle: "Recomendaciones de dosis, frecuencia y época." },
  { icon: Sprout, titulo: "Cuidados del cultivo", detalle: "Calendario de riego, poda y control de plagas." },
  { icon: CloudSun, titulo: "Alertas climáticas", detalle: "Heladas, lluvias, granizo y humedad en tu zona." },
  { icon: BarChart3, titulo: "Estadísticas", detalle: "Precios, ingresos y rendimiento por campaña." },
];

function Inicio() {
  return (
    <AppShell
      title="Inicio"
      subtitle="Bienvenido a KawsayTech"
      action={
        <Button asChild size="lg" className="rounded-xl">
          <Link to="/marketplace">Ir al marketplace</Link>
        </Button>
      }
    >
      <div className="space-y-12">
        <section className="overflow-hidden rounded-[2rem] border bg-card shadow-lift">
          <div className="grid lg:grid-cols-2">
            <div className="flex flex-col justify-center gap-6 p-8 md:p-12">
              <Badge className="w-fit rounded-full bg-primary-soft text-primary">
                <Leaf className="mr-1 size-3" /> MVP: papa y palta
              </Badge>
              <h2 className="font-display text-4xl font-extrabold leading-[1.05] md:text-5xl">
                Vende tu cosecha a un precio justo, sin intermediarios
              </h2>
              <p className="max-w-xl text-lg text-muted-foreground">
                KawsayTech es la plataforma integral para el agricultor: hoy comercializa tu papa y
                palta con compradores verificados; mañana, diagnostica enfermedades y recibe alertas
                de clima con inteligencia artificial.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="h-14 rounded-2xl px-8 text-base">
                  <Link to="/publicar">
                    Publicar mi producto <ArrowRight className="ml-2 size-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="h-14 rounded-2xl px-8 text-base">
                  <Link to="/dashboard">Ver mi panel</Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-6 pt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" /> Compradores verificados
                </span>
                <span className="flex items-center gap-2">
                  <Smartphone className="size-4 text-primary" /> Fácil desde el celular
                </span>
              </div>
            </div>
            <div className="relative min-h-[18rem]">
              <img
                src={heroImg}
                alt="Agricultor andino usando una tablet en su campo de papa al amanecer"
                width={1600}
                height={912}
                className="size-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h3 className="font-display text-2xl font-extrabold">Módulos de la plataforma</h3>
              <p className="text-muted-foreground">
                Arquitectura modular: cada módulo crece sin tocar el resto del sistema.
              </p>
            </div>
            <Button asChild variant="ghost" className="rounded-xl">
              <Link to="/arquitectura">Ver arquitectura</Link>
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {modulos.map((m) => (
              <Card key={m.titulo} className="gap-3 rounded-3xl p-6 shadow-soft">
                <div className="flex items-center justify-between">
                  <span
                    className={`flex size-12 items-center justify-center rounded-2xl ${m.activo ? "gradient-field text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    <m.icon className="size-6" />
                  </span>
                  <Badge
                    variant={m.activo ? "default" : "outline"}
                    className={m.activo ? "rounded-full" : "rounded-full bg-harvest/30 text-harvest-foreground"}
                  >
                    {m.activo ? "Disponible" : "Próximamente"}
                  </Badge>
                </div>
                <h4 className="font-display text-lg font-bold">{m.titulo}</h4>
                <p className="text-sm text-muted-foreground">{m.detalle}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {[
            { n: "1", t: "Registra tu cosecha", d: "Producto, variedad, cantidad, precio y fotos." },
            { n: "2", t: "Recibe solicitudes", d: "Compradores te ofrecen precio y fecha de entrega." },
            { n: "3", t: "Cierra la venta", d: "Acepta la mejor oferta y registra tus ingresos." },
          ].map((s) => (
            <Card key={s.n} className="gap-2 rounded-3xl border-primary/20 bg-accent/40 p-6 shadow-none">
              <span className="font-display text-4xl font-extrabold text-primary">{s.n}</span>
              <h4 className="font-display text-lg font-bold">{s.t}</h4>
              <p className="text-sm text-muted-foreground">{s.d}</p>
            </Card>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
