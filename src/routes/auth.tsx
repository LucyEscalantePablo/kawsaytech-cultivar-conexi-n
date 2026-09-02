import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Leaf, Sprout, ShoppingCart, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { iniciarSesion, inicioSegunRol, registrar, useAuth, type Rol } from "@/lib/kawsay/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión o crear cuenta · KawsayTech" },
      {
        name: "description",
        content:
          "Accede a KawsayTech como productor agrícola o comprador y gestiona la comercialización de papa y palta desde tu propio panel.",
      },
      { property: "og:title", content: "Iniciar sesión o crear cuenta · KawsayTech" },
      { property: "og:description", content: "Un panel distinto para productores y compradores." },
    ],
  }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const { rol } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rNombre, setRNombre] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rPassword, setRPassword] = useState("");
  const [rRol, setRRol] = useState<Rol | "">("");

  useEffect(() => {
    if (rol) navigate({ to: inicioSegunRol(rol), replace: true });
  }, [rol, navigate]);

  const login = () => {
    const res = iniciarSesion(email, password);
    if (!res.ok) {
      toast.error(res.error ?? "No pudimos iniciar sesión");
      return;
    }
    toast.success("Bienvenido a KawsayTech");
    navigate({ to: inicioSegunRol(res.rol!), replace: true });
  };

  const signup = () => {
    if (!/^\S+@\S+\.\S+$/.test(rEmail.trim())) {
      toast.error("Ingresa un correo válido");
      return;
    }
    if (rPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (!rRol) {
      toast.error("Selecciona qué tipo de usuario eres");
      return;
    }
    const nombre = rNombre.trim();
    if (!nombre) {
      toast.error("Ingresa tu nombre completo");
      return;
    }
    const res = registrar({ nombre, email: rEmail, password: rPassword, rol: rRol });
    if (!res.ok) {
      toast.error(res.error ?? "No pudimos crear la cuenta");
      return;
    }
    toast.success("Cuenta creada correctamente");
    navigate({ to: inicioSegunRol(res.rol!), replace: true });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <aside className="gradient-field hidden flex-col justify-between p-12 text-primary-foreground lg:flex">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary-foreground/15">
            <Leaf className="size-6" />
          </span>
          <span className="font-display text-xl font-extrabold">KawsayTech</span>
        </Link>
        <div className="space-y-5">
          <h2 className="font-display text-4xl font-extrabold leading-tight">
            Un panel distinto para cada rol del agro
          </h2>
          <p className="max-w-md text-primary-foreground/85">
            Los productores publican y administran su cosecha. Los compradores buscan, guardan
            favoritos y envían solicitudes. Todo en la misma plataforma.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/75">
          Cuentas de demostración: productor@kawsaytech.pe · comprador@kawsaytech.pe · contraseña
          kawsay123
        </p>
      </aside>

      <main className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md gap-6 rounded-3xl p-7 shadow-lift md:p-9">
          <div className="space-y-1">
            <h1 className="font-display text-2xl font-extrabold">Accede a KawsayTech</h1>
            <p className="text-sm text-muted-foreground">
              Inicia sesión o crea tu cuenta para entrar a tu panel.
            </p>
          </div>

          <Tabs defaultValue="login">
            <TabsList className="h-12 w-full rounded-2xl">
              <TabsTrigger value="login" className="flex-1 rounded-xl">Iniciar sesión</TabsTrigger>
              <TabsTrigger value="registro" className="flex-1 rounded-xl">Crear cuenta</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-xl" placeholder="tucorreo@ejemplo.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pass">Contraseña</Label>
                <Input id="pass" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-xl" />
              </div>
              <Button size="lg" className="h-14 w-full rounded-2xl text-base" onClick={login}>
                Iniciar sesión <ArrowRight className="ml-2 size-5" />
              </Button>
            </TabsContent>

            <TabsContent value="registro" className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rnombre">Nombre completo</Label>
                <Input id="rnombre" type="text" autoComplete="name" value={rNombre} onChange={(e) => setRNombre(e.target.value)} className="h-12 rounded-xl" placeholder="Tu nombre" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remail">Correo electrónico</Label>
                <Input id="remail" type="email" autoComplete="email" value={rEmail} onChange={(e) => setREmail(e.target.value)} className="h-12 rounded-xl" placeholder="tucorreo@ejemplo.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rpass">Contraseña</Label>
                <Input id="rpass" type="password" autoComplete="new-password" value={rPassword} onChange={(e) => setRPassword(e.target.value)} className="h-12 rounded-xl" placeholder="Mínimo 6 caracteres" />
              </div>
              <div className="space-y-3">
                <Label>¿Qué tipo de usuario eres? *</Label>
                <RadioGroup value={rRol} onValueChange={(v) => setRRol(v as Rol)} className="gap-3">
                  {[
                    { v: "PRODUCTOR", t: "Productor Agrícola", d: "Publico y vendo mi cosecha", i: Sprout },
                    { v: "COMPRADOR", t: "Comprador", d: "Busco y compro productos", i: ShoppingCart },
                  ].map((o) => (
                    <Label
                      key={o.v}
                      htmlFor={o.v}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition-colors ${rRol === o.v ? "border-primary bg-primary-soft/60" : "border-border"}`}
                    >
                      <RadioGroupItem value={o.v} id={o.v} />
                      <o.i className="size-5 text-primary" />
                      <span className="grid">
                        <span className="font-semibold">{o.t}</span>
                        <span className="text-xs font-normal text-muted-foreground">{o.d}</span>
                      </span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
              <Button size="lg" className="h-14 w-full rounded-2xl text-base" onClick={signup}>
                Crear cuenta <ArrowRight className="ml-2 size-5" />
              </Button>
            </TabsContent>
          </Tabs>

          <Button asChild variant="ghost" className="rounded-xl">
            <Link to="/">Volver al inicio</Link>
          </Button>
        </Card>
      </main>
    </div>
  );
}
