import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Leaf, Bell, LogOut } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { navPorRol, type NavItem } from "@/lib/kawsay/nav";
import { cerrarSesion, inicioSegunRol, rolLabel, useAuth, type Rol } from "@/lib/kawsay/auth";

function NavSection({ label, items }: { label: string; items: NavItem[] }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[0.7rem] font-semibold uppercase tracking-widest">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                tooltip={item.title}
                className="h-11 rounded-xl text-[0.95rem]"
              >
                <Link to={item.url} className="flex items-center gap-3">
                  <item.icon className="size-5 shrink-0" />
                  <span className="flex-1 truncate">{item.title}</span>
                  {item.proximamente && (
                    <Badge variant="outline" className="border-harvest bg-harvest/30 text-[0.6rem] text-harvest-foreground">
                      Pronto
                    </Badge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function KawsaySidebar() {
  const { usuario, rol } = useAuth();
  const navigate = useNavigate();
  const secciones = navPorRol(rol ?? "PRODUCTOR");
  const iniciales = (usuario?.nombre ?? "KT")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="gradient-field flex size-10 shrink-0 items-center justify-center rounded-2xl shadow-soft">
            <Leaf className="size-5 text-primary-foreground" />
          </span>
          <span className="grid group-data-[collapsible=icon]:hidden">
            <span className="font-display text-base font-extrabold leading-none">KawsayTech</span>
            <span className="text-xs text-muted-foreground">
              {rol ? rolLabel[rol] : "Agro inteligente"}
            </span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {secciones.map((s) => (
          <NavSection key={s.label} label={s.label} items={s.items} />
        ))}
      </SidebarContent>
      <SidebarFooter className="gap-2 p-3">
        <div className="flex items-center gap-3 rounded-xl bg-accent/60 p-2">
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary text-primary-foreground">{iniciales}</AvatarFallback>
          </Avatar>
          <div className="grid min-w-0 text-xs group-data-[collapsible=icon]:hidden">
            <span className="truncate font-semibold">{usuario?.nombre ?? "Invitado"}</span>
            <span className="truncate text-muted-foreground">{usuario?.email ?? ""}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          className="h-11 w-full justify-start gap-3 rounded-xl text-[0.95rem]"
          onClick={() => {
            cerrarSesion();
            navigate({ to: "/", replace: true });
          }}
        >
          <LogOut className="size-5 shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden">Cerrar sesión</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppShell({
  title,
  subtitle,
  action,
  roles,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  /** Roles autorizados a ver la pantalla. Por defecto, cualquier usuario autenticado. */
  roles?: Rol[];
  children: ReactNode;
}) {
  const { cargando, usuario, rol } = useAuth();
  const navigate = useNavigate();
  const autorizado = !!rol && (!roles || roles.includes(rol) || rol === "ADMINISTRADOR");

  useEffect(() => {
    if (cargando) return;
    if (!usuario) {
      navigate({ to: "/auth", replace: true });
      return;
    }
    if (!autorizado && rol) {
      navigate({ to: inicioSegunRol(rol), replace: true });
    }
  }, [cargando, usuario, autorizado, rol, navigate]);

  if (cargando || !usuario || !autorizado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="gradient-field flex size-12 animate-pulse items-center justify-center rounded-2xl">
          <Leaf className="size-6 text-primary-foreground" />
        </span>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <KawsaySidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b bg-card/85 px-4 py-3 backdrop-blur md:px-8">
            <SidebarTrigger className="size-9" />
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-xl font-extrabold md:text-2xl">{title}</h1>
              {subtitle && <p className="truncate text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            <Button variant="ghost" size="icon" className="relative size-9 rounded-full" aria-label="Notificaciones" asChild>
              <Link to={rol === "COMPRADOR" ? "/notificaciones" : "/solicitudes"}>
                <Bell className="size-5" />
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-harvest" />
              </Link>
            </Button>
            {action}
          </header>
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
