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
  Heart,
  Inbox,
  ShoppingBag,
  Users,
  Bell,
  HandCoins,
} from "lucide-react";
import type { Rol } from "./auth";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  proximamente?: boolean;
}

export interface NavSectionDef {
  label: string;
  items: NavItem[];
}

const productor: NavSectionDef[] = [
  {
    label: "Panel",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Mis Cultivos", url: "/mis-cultivos", icon: Sprout },
    ],
  },
  {
    label: "Comercialización",
    items: [
      { title: "Comercializar", url: "/comercializar", icon: HandCoins },
      { title: "Marketplace", url: "/marketplace", icon: Store },
      { title: "Publicar producto", url: "/publicar", icon: Sprout },
      { title: "Mis Publicaciones", url: "/mis-publicaciones", icon: Layers },
      { title: "Solicitudes Recibidas", url: "/solicitudes", icon: Inbox },
      { title: "Ventas", url: "/historial", icon: HandCoins },
      { title: "Estadísticas", url: "/estadisticas", icon: BarChart3 },
    ],
  },
  {
    label: "Herramientas agrícolas",
    items: [
      { title: "Diagnóstico IA", url: "/diagnostico", icon: ScanEye },
      { title: "Fertilizantes", url: "/fertilizantes", icon: FlaskConical },
      { title: "Cuidados del Cultivo", url: "/cuidados", icon: Sprout },
      { title: "Alertas Climáticas", url: "/alertas", icon: CloudSun },
    ],
  },

  {
    label: "Cuenta",
    items: [
      { title: "Perfil", url: "/perfil", icon: User },
      { title: "Configuración", url: "/configuracion", icon: Settings },
      { title: "Ayuda", url: "/ayuda", icon: HelpCircle },
    ],
  },
];

const comprador: NavSectionDef[] = [
  {
    label: "Explorar",
    items: [
      { title: "Inicio", url: "/comprador", icon: Home },
      { title: "Marketplace", url: "/marketplace", icon: Store },
      { title: "Favoritos", url: "/favoritos", icon: Heart },
      { title: "Productores", url: "/productores", icon: Users },
    ],
  },
  {
    label: "Mis compras",
    items: [
      { title: "Mis Solicitudes", url: "/mis-solicitudes", icon: Inbox },
      { title: "Mis Compras", url: "/mis-compras", icon: ShoppingBag },
      { title: "Notificaciones", url: "/notificaciones", icon: Bell },
    ],
  },
  {
    label: "Cuenta",
    items: [
      { title: "Perfil", url: "/perfil", icon: User },
      { title: "Configuración", url: "/configuracion", icon: Settings },
      { title: "Ayuda", url: "/ayuda", icon: HelpCircle },
    ],
  },
];

const admin: NavSectionDef[] = [
  {
    label: "Administración",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Arquitectura", url: "/arquitectura", icon: Layers },
    ],
  },
  ...productor.slice(1),
  {
    label: "Vista comprador",
    items: comprador[1]!.items,
  },
];

export function navPorRol(rol: Rol): NavSectionDef[] {
  if (rol === "COMPRADOR") return comprador;
  if (rol === "ADMINISTRADOR") return admin;
  return productor;
}
