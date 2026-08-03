import type { LucideIcon } from "lucide-react";
import {
  Home,
  LayoutDashboard,
  Store,
  ScanEye,
  FlaskConical,
  Sprout,
  CloudSun,
  BarChart3,
  User,
  Settings,
  HelpCircle,
  Layers,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  proximamente?: boolean;
}

export const navPrincipal: NavItem[] = [
  { title: "Inicio", url: "/", icon: Home },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
];

export const navComercializacion: NavItem[] = [
  { title: "Marketplace", url: "/marketplace", icon: Store },
  { title: "Publicar producto", url: "/publicar", icon: Sprout },
  { title: "Mis publicaciones", url: "/mis-publicaciones", icon: Layers },
  { title: "Solicitudes", url: "/solicitudes", icon: HelpCircle },
  { title: "Historial", url: "/historial", icon: BarChart3 },
];

export const navFuturos: NavItem[] = [
  { title: "Diagnóstico IA", url: "/diagnostico", icon: ScanEye, proximamente: true },
  { title: "Fertilizantes", url: "/fertilizantes", icon: FlaskConical, proximamente: true },
  { title: "Cuidados del cultivo", url: "/cuidados", icon: Sprout, proximamente: true },
  { title: "Alertas climáticas", url: "/alertas", icon: CloudSun, proximamente: true },
  { title: "Estadísticas", url: "/estadisticas", icon: BarChart3, proximamente: true },
];

export const navCuenta: NavItem[] = [
  { title: "Perfil", url: "/perfil", icon: User },
  { title: "Configuración", url: "/configuracion", icon: Settings },
  { title: "Ayuda", url: "/ayuda", icon: HelpCircle },
  { title: "Arquitectura", url: "/arquitectura", icon: Layers },
];
