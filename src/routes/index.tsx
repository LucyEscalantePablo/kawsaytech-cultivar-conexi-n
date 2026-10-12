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
  HandCoins,
  Users,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import heroImg from "@/assets/hero-campo.jpg";
import logo from "@/assets/logo_KawsayConnect.png";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductCard } from "@/components/kawsay/ProductCard";
import { useKawsayData } from "@/lib/kawsay/store";
import { inicioSegunRol, useAuth } from "@/lib/kawsay/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KawsayConnect · Plataforma digital para agricultores y compradores" },
      {
        name: "description",
        content:
          "KawsayConnect conecta a productores de papa y palta con compradores verificados: publica tu cosecha, recibe solicitudes y prepárate para módulos de IA agrícola.",
      },
      { property: "og:title", content: "KawsayConnect · Plataforma digital para el agro" },
      {
        property: "og:description",
        content:
          "Un panel para productores y otro para compradores. Comercializa papa y palta sin intermediarios.",
      },
    ],
  }),
  component: Landing,
});

const modulos = [
  { icon: Store, titulo: "Comercialización", detalle: "Publica, vende y gestiona solicitudes de papa y palta.", activo: true },
  { icon: ScanEye, titulo: "Diagnóstico IA", detalle: "Detecta enfermedades desde una fotografía del cultivo." },
  { icon: FlaskConical, titulo: "Fertilizantes", detalle: "Recomendaciones de dosis, frecuencia y época." },
  { icon: Sprout, titulo: "Cuidados del cultivo", detalle: "Calendario de riego, poda y control de plagas." },
  { icon: CloudSun, titulo: "Alertas climáticas", detalle: "Heladas, lluvias, granizo y humedad en tu zona." },
  { icon: BarChart3, titulo: "Estadísticas", detalle: "Precios, ingresos y rendimiento por campaña." },
];

const beneficios = [
  { icon: HandCoins, t: "Precio justo", d: "Negocias directo con el comprador, sin cadena de intermediarios." },
  { icon: ShieldCheck, t: "Compradores verificados", d: "Cada solicitud llega con datos de contacto y reputación." },
  { icon: Smartphone, t: "Hecho para el celular", d: "Publicas tu cosecha en menos de un minuto desde la chacra." },
  { icon: Users, t: "Dos experiencias", d: "Panel del productor y panel del comprador, cada uno con sus herramientas." },
];


function Landing() {
  const { publicaciones } = useKawsayData();
  const { rol } = useAuth();
  const destacados = publicaciones.filter((p) => p.estado === "activa").slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-primary/10 bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="KawsayConnect" className="h-10 w-40 object-contain object-left" />
            <span className="grid sr-only">
              <span className="font-display text-base font-extrabold leading-none">KawsayConnect</span>
              <span className="text-xs text-muted-foreground">Agro inteligente</span>
            </span>
          </Link>
          <nav className="ml-8 hidden items-center gap-7 text-xs font-semibold text-primary md:flex">
            <a href="#plataforma" className="hover:text-foreground">Plataforma</a>
            <a href="#beneficios" className="hover:text-foreground">Beneficios</a>
            <a href="#como-funciona" className="hover:text-foreground">¿Cómo funciona?</a>
            <a href="#modulos" className="hover:text-foreground">Módulos</a>
            <a href="#contacto" className="hover:text-foreground">Contacto</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {rol ? (
              <Button asChild size="lg" className="rounded-xl">
                <Link to={inicioSegunRol(rol)}>Ir a mi panel</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="rounded-full text-xs font-bold text-primary hover:bg-primary-soft">
                  <Link to="/auth">Iniciar sesión</Link>
                </Button>
                <Button asChild className="rounded-full px-6 text-xs font-bold">
                  <Link to="/auth">Crear cuenta</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-20 px-4 py-6 md:px-8 md:py-8">
        <section className="hero-showcase relative overflow-hidden rounded-[2rem] border border-primary/10 bg-card shadow-lift">
          <div className="grid min-h-[34rem] lg:grid-cols-[0.92fr_1.08fr]">
            <div className="relative z-10 flex flex-col justify-center gap-6 px-7 py-12 md:px-12 lg:py-16">
              <Badge className="w-fit rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
                <Leaf className="mr-1 size-3" /> MVP: papa y palta
              </Badge>
              <h1 className="max-w-xl font-display text-4xl font-extrabold leading-[1.04] text-primary md:text-6xl">
                Vende tu cosecha a un <span className="text-success">precio justo, sin intermediarios</span>
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
                KawsayConnect es la plataforma integral del agricultor peruano: hoy comercializa papa y
                palta con compradores verificados; mañana, diagnostica enfermedades y recibe alertas
                climáticas con inteligencia artificial.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Button asChild size="lg" className="button-primary h-12 rounded-full px-8 text-sm font-bold">
                  <Link to="/auth">
                    Crear cuenta <ArrowRight className="ml-2 size-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-primary px-8 text-sm font-bold text-primary">
                  <Link to="/auth">Iniciar sesión</Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-3 pt-2 text-xs font-medium text-primary">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" /> Compradores verificados
                </span>
                <span className="hidden h-5 w-px bg-primary/25 sm:block" />
                <span className="flex items-center gap-2">
                  <Smartphone className="size-4 text-primary" /> Fácil desde el celular
                </span>
              </div>
            </div>
            <div className="hero-visual relative min-h-[22rem] lg:min-h-full">
              <img
                src={heroImg}
                alt="Agricultor andino usando una tablet en su campo de papa al amanecer"
                width={1600}
                height={912}
                className="size-full object-cover object-center lg:rounded-l-[45%]"
              />
            </div>
          </div>
        </section>

        <section id="plataforma" className="landing-section grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="space-y-4">
            <h2 className="font-display text-3xl font-extrabold">Una plataforma, dos experiencias</h2>
            <p className="text-lg text-muted-foreground">
              KawsayConnect identifica automáticamente tu rol al iniciar sesión y te muestra únicamente
              las herramientas que necesitas.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Card className="landing-card gap-2 rounded-3xl border-primary/25 bg-accent/40 p-6 shadow-none">
              <Sprout className="size-8 text-primary" />
              <h3 className="font-display text-lg font-bold">Productor agrícola</h3>
              <p className="text-sm text-muted-foreground">
                Publica cultivos, administra publicaciones, responde solicitudes, registra ventas y
                revisa estadísticas.
              </p>
            </Card>
            <Card className="landing-card gap-2 rounded-3xl border-primary/25 bg-accent/40 p-6 shadow-none">
              <Store className="size-8 text-primary" />
              <h3 className="font-display text-lg font-bold">Comprador</h3>
              <p className="text-sm text-muted-foreground">
                Busca productos, guarda favoritos, contacta productores, envía solicitudes y sigue
                tus compras.
              </p>
            </Card>
          </div>
        </section>

        <section id="beneficios" className="landing-section space-y-6">
          <h2 className="font-display text-3xl font-extrabold">Beneficios</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {beneficios.map((b) => (
              <Card key={b.t} className="landing-card gap-3 rounded-3xl p-6 shadow-soft">
                <span className="gradient-field flex size-12 items-center justify-center rounded-2xl">
                  <b.icon className="size-6 text-primary-foreground" />
                </span>
                <h3 className="font-display text-lg font-bold">{b.t}</h3>
                <p className="text-sm text-muted-foreground">{b.d}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="como-funciona" className="landing-section space-y-6">
          <h2 className="font-display text-3xl font-extrabold">¿Cómo funciona?</h2>
          <div className="grid gap-5 md:grid-cols-4">
            {[
              { n: "1", t: "Crea tu cuenta", d: "Elige si eres productor agrícola o comprador." },
              { n: "2", t: "Registra o busca", d: "Publica tu cosecha o filtra productos por región y calidad." },
              { n: "3", t: "Negocia", d: "Solicitudes con cantidad, precio ofrecido y fecha de entrega." },
              { n: "4", t: "Cierra la venta", d: "Acepta la mejor oferta y queda registrada en tu historial." },
            ].map((s) => (
              <Card key={s.n} className="landing-card gap-2 rounded-3xl border-primary/20 bg-accent/40 p-6 shadow-none">
                <span className="font-display text-4xl font-extrabold text-primary">{s.n}</span>
                <h3 className="font-display text-lg font-bold">{s.t}</h3>
                <p className="text-sm text-muted-foreground">{s.d}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="font-display text-3xl font-extrabold">Productos destacados</h2>
            <Button asChild variant="ghost" className="rounded-xl">
              <Link to="/auth">Ver todo el marketplace</Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destacados.map((p) => (
              <ProductCard key={p.id} pub={p} />
            ))}
          </div>
        </section>

        <section id="modulos" className="landing-section space-y-6">
          <div>
            <h2 className="font-display text-3xl font-extrabold">Módulos de la plataforma</h2>
            <p className="text-muted-foreground">
              Arquitectura modular: cada módulo crece sin tocar el resto del sistema.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {modulos.map((m) => (
              <Card key={m.titulo} className="landing-card gap-3 rounded-3xl p-6 shadow-soft">
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
                <h3 className="font-display text-lg font-bold">{m.titulo}</h3>
                <p className="text-sm text-muted-foreground">{m.detalle}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="contacto" className="landing-section overflow-hidden rounded-[2rem] border bg-card shadow-lift">
          <div className="grid gap-8 p-8 md:grid-cols-2 md:p-12">
            <div className="space-y-4">
              <h2 className="font-display text-3xl font-extrabold">Contacto</h2>
              <p className="text-muted-foreground">
                ¿Eres cooperativa, exportadora o programa de desarrollo agrario? Conversemos sobre
                cómo integrar KawsayConnect en tu cadena de valor.
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3"><Mail className="size-4 text-primary" /> contacto@kawsaytech.pe</li>
                <li className="flex items-center gap-3"><Phone className="size-4 text-primary" /> +51 900 000 000</li>
                <li className="flex items-center gap-3"><MapPin className="size-4 text-primary" /> Huánuco · Lima · Perú</li>
              </ul>
            </div>
            <Card className="gap-4 rounded-3xl bg-accent/40 p-6 shadow-none">
              <h3 className="font-display text-xl font-bold">Empieza hoy</h3>
              <p className="text-sm text-muted-foreground">
                Crea tu cuenta gratuita y elige tu rol: productor agrícola o comprador.
              </p>
              <Button asChild size="lg" className="h-14 rounded-2xl text-base">
                <Link to="/auth">
                  Crear cuenta <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="h-14 rounded-2xl text-base">
                <Link to="/auth">Iniciar sesión</Link>
              </Button>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t bg-card/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground md:px-8">
          <span>© 2026 KawsayConnect · Plataforma agrícola inteligente</span>
          <Link to="/arquitectura" className="hover:text-foreground">Arquitectura del proyecto</Link>
        </div>
      </footer>
    </div>
  );
}
