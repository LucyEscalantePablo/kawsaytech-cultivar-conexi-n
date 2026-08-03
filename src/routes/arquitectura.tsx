import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/kawsay/AppShell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/arquitectura")({
  head: () => ({
    meta: [
      { title: "Arquitectura del sistema · KawsayTech" },
      { name: "description", content: "Arquitectura modular de KawsayTech: capas, estructura de carpetas, modelo de base de datos, APIs REST y flujos de usuario." },
      { property: "og:title", content: "Arquitectura del sistema · KawsayTech" },
      { property: "og:description", content: "Documentación técnica: módulos, base de datos, endpoints y buenas prácticas." },
    ],
  }),
  component: Arquitectura,
});

const capas = `Frontend (React + Tailwind + shadcn/ui)
        |
        v
API REST (FastAPI · JWT · Pydantic)
        |
        v
PostgreSQL (Supabase)  <->  Cloudinary (imágenes)
        |
        v
Módulos IA (Python: visión, recomendación, clima)`;

const carpetas = `src/
  components/        # UI reutilizable (AppShell, ProductCard, StatCard)
  layouts/           # Shells y estructuras de página
  services/          # Clientes HTTP por módulo
  hooks/             # useKawsayData, useAuth, useFiltros
  utils/             # formato de moneda, fechas, validación
  types/             # contratos TypeScript compartidos
  routes/            # rutas y páginas
  modules/
    comercializacion/  # MVP funcional
    diagnostico/       # IA (v2)
    fertilizantes/     # IA (v2)
    cuidados/          # v3
    alertas/           # v3
    estadisticas/      # v3
    perfil/
  config/            # constantes, temas, feature flags`;

const modelo = `users(id, nombre, email, password_hash, rol[agricultor|comprador|admin], telefono, created_at)
farmer_profiles(id, user_id FK, region, distrito, area_ha, lat, lng, rating, ventas)
crops(id, slug[papa|palta], nombre, activo)
crop_varieties(id, crop_id FK, nombre)
listings(id, farmer_id FK, crop_id FK, variety_id FK, cantidad, unidad,
         precio, calidad, region, distrito, lat, lng, fecha_cosecha,
         descripcion, estado[activa|pausada|vendida], created_at)
listing_images(id, listing_id FK, cloudinary_public_id, url, orden)
purchase_requests(id, listing_id FK, buyer_id FK, cantidad, precio_ofrecido,
                  mensaje, fecha_requerida, estado[pendiente|aceptada|rechazada|cerrada])
sales(id, listing_id FK, request_id FK, buyer_id FK, cantidad, precio, total, fecha)
notifications(id, user_id FK, tipo, payload jsonb, leido, created_at)
-- v2: diagnoses(id, user_id, crop_id, image_url, enfermedad, confianza, recomendacion)`;

const apis = [
  { m: "POST", p: "/auth/register", d: "Registro de agricultor, comprador o admin" },
  { m: "POST", p: "/auth/login", d: "Devuelve access y refresh token JWT" },
  { m: "GET", p: "/me", d: "Perfil del usuario autenticado" },
  { m: "GET", p: "/crops", d: "Cultivos y variedades habilitadas (papa, palta)" },
  { m: "GET", p: "/listings", d: "Marketplace con filtros: cultivo, precio, región, calidad, cantidad" },
  { m: "POST", p: "/listings", d: "Crear publicación (rol agricultor)" },
  { m: "GET", p: "/listings/{id}", d: "Detalle con galería y datos del productor" },
  { m: "PATCH", p: "/listings/{id}", d: "Editar, pausar, activar o marcar vendido" },
  { m: "POST", p: "/listings/{id}/duplicate", d: "Duplicar publicación" },
  { m: "DELETE", p: "/listings/{id}", d: "Eliminar publicación" },
  { m: "POST", p: "/listings/{id}/images", d: "Subida firmada a Cloudinary" },
  { m: "POST", p: "/requests", d: "Enviar solicitud de compra (rol comprador)" },
  { m: "PATCH", p: "/requests/{id}", d: "Aceptar o rechazar; genera venta al aceptar" },
  { m: "GET", p: "/sales", d: "Historial de ventas e ingresos" },
  { m: "GET", p: "/stats/dashboard", d: "KPIs del dashboard comercial" },
  { m: "GET", p: "/admin/users", d: "Gestión de usuarios (rol admin)" },
  { m: "POST", p: "/ai/diagnose", d: "v2 · análisis de imagen del cultivo" },
];

const flujos = `AGRICULTOR
registro -> perfil -> publicar producto -> recibe solicitud
-> acepta/rechaza -> venta registrada -> historial e ingresos

COMPRADOR
registro -> marketplace -> filtra -> detalle
-> contacta / envía solicitud -> seguimiento de estado

ADMINISTRADOR
login -> panel -> usuarios / publicaciones / categorías -> estadísticas`;

const practicas = [
  "Arquitectura modular por dominio: cada módulo con sus rutas, servicios y tipos.",
  "Feature flags en config/ para habilitar módulos sin tocar la navegación.",
  "Nuevos cultivos se agregan como filas en crops y crop_varieties, sin cambios de código.",
  "Validación doble: Zod en el frontend y Pydantic en FastAPI.",
  "JWT con refresh token; autorización por rol en cada endpoint.",
  "Design tokens semánticos en styles.css; nunca colores literales en componentes.",
  "Componentes reutilizables: AppShell, StatCard, ProductCard, ComingSoon.",
  "Migraciones versionadas (Alembic) y despliegue Vercel + Render + Supabase.",
];

function Bloque({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-2xl bg-muted/70 p-5 text-xs leading-relaxed md:text-sm">
      <code>{children}</code>
    </pre>
  );
}

function Arquitectura() {
  return (
    <AppShell title="Arquitectura del sistema" subtitle="Documentación técnica del MVP y la visión modular">
      <Tabs defaultValue="capas">
        <TabsList className="h-12 flex-wrap rounded-2xl">
          {[
            ["capas", "Capas"],
            ["carpetas", "Carpetas"],
            ["datos", "Base de datos"],
            ["apis", "APIs"],
            ["flujos", "Flujos"],
            ["practicas", "Buenas prácticas"],
          ].map(([v, l]) => (
            <TabsTrigger key={v} value={v!} className="rounded-xl px-5">{l}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="capas" className="mt-6">
          <Card className="gap-4 rounded-3xl p-6 shadow-soft">
            <h3 className="font-display text-lg font-bold">Diagrama de capas</h3>
            <Bloque>{capas}</Bloque>
          </Card>
        </TabsContent>

        <TabsContent value="carpetas" className="mt-6">
          <Card className="gap-4 rounded-3xl p-6 shadow-soft">
            <h3 className="font-display text-lg font-bold">Organización modular</h3>
            <Bloque>{carpetas}</Bloque>
          </Card>
        </TabsContent>

        <TabsContent value="datos" className="mt-6">
          <Card className="gap-4 rounded-3xl p-6 shadow-soft">
            <h3 className="font-display text-lg font-bold">Modelo relacional</h3>
            <Bloque>{modelo}</Bloque>
          </Card>
        </TabsContent>

        <TabsContent value="apis" className="mt-6">
          <Card className="gap-3 rounded-3xl p-6 shadow-soft">
            <h3 className="font-display text-lg font-bold">Endpoints REST (FastAPI)</h3>
            <div className="divide-y">
              {apis.map((a) => (
                <div key={a.p + a.m} className="flex flex-wrap items-center gap-3 py-3">
                  <Badge variant="outline" className="w-16 justify-center rounded-full font-mono text-[0.7rem]">{a.m}</Badge>
                  <code className="text-sm font-semibold">{a.p}</code>
                  <span className="text-sm text-muted-foreground">{a.d}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="flujos" className="mt-6">
          <Card className="gap-4 rounded-3xl p-6 shadow-soft">
            <h3 className="font-display text-lg font-bold">Flujos por tipo de usuario</h3>
            <Bloque>{flujos}</Bloque>
          </Card>
        </TabsContent>

        <TabsContent value="practicas" className="mt-6">
          <Card className="gap-3 rounded-3xl p-6 shadow-soft">
            <h3 className="font-display text-lg font-bold">Buenas prácticas de desarrollo</h3>
            <ul className="space-y-3">
              {practicas.map((p) => (
                <li key={p} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  {p}
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
