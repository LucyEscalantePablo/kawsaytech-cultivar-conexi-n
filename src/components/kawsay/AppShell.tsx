import { Link, useRouterState } from "@tanstack/react-router";
import { Leaf, Bell } from "lucide-react";
import type { ReactNode } from "react";
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
import { navComercializacion, navCuenta, navFuturos, navPrincipal, type NavItem } from "@/lib/kawsay/nav";

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
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="gradient-field flex size-10 shrink-0 items-center justify-center rounded-2xl shadow-soft">
            <Leaf className="size-5 text-primary-foreground" />
          </span>
          <span className="grid group-data-[collapsible=icon]:hidden">
            <span className="font-display text-base font-extrabold leading-none">KawsayTech</span>
            <span className="text-xs text-muted-foreground">Agro inteligente</span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavSection label="General" items={navPrincipal} />
        <NavSection label="Comercialización" items={navComercializacion} />
        <NavSection label="Próximos módulos" items={navFuturos} />
        <NavSection label="Cuenta" items={navCuenta} />
      </SidebarContent>
      <SidebarFooter className="p-3">
        <div className="flex items-center gap-3 rounded-xl bg-accent/60 p-2">
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary text-primary-foreground">JQ</AvatarFallback>
          </Avatar>
          <div className="grid text-xs group-data-[collapsible=icon]:hidden">
            <span className="font-semibold">Julián Quispe</span>
            <span className="text-muted-foreground">Agricultor · Huánuco</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppShell({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
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
            <Button variant="ghost" size="icon" className="relative size-9 rounded-full" aria-label="Notificaciones">
              <Bell className="size-5" />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-harvest" />
            </Button>
            {action}
          </header>
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
