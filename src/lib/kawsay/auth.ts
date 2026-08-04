import { useEffect, useState } from "react";
import { registrarAgricultor } from "./store";

export type Rol = "PRODUCTOR" | "COMPRADOR" | "ADMINISTRADOR";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
  /** Solo para PRODUCTOR: vincula al registro de agricultor. */
  agricultorId?: string;
}

interface AuthState {
  usuarios: Usuario[];
  sesion: string | null;
  favoritos: Record<string, string[]>;
}

const KEY = "kawsay.auth.v1";

const SEED: AuthState = {
  usuarios: [
    {
      id: "u-1",
      nombre: "Julián Quispe",
      email: "productor@kawsaytech.pe",
      password: "kawsay123",
      rol: "PRODUCTOR",
      agricultorId: "ag-1",
    },
    {
      id: "u-2",
      nombre: "Mercado Santa Anita",
      email: "comprador@kawsaytech.pe",
      password: "kawsay123",
      rol: "COMPRADOR",
    },
    {
      id: "u-3",
      nombre: "Equipo KawsayTech",
      email: "admin@kawsaytech.pe",
      password: "kawsay123",
      rol: "ADMINISTRADOR",
    },
  ],
  sesion: null,
  favoritos: {},
};

let state: AuthState = SEED;
let hidratado = false;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function persistir() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* almacenamiento no disponible */
  }
}

function hidratar() {
  if (hidratado || typeof window === "undefined") return;
  hidratado = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AuthState>;
      state = {
        usuarios: parsed.usuarios?.length ? parsed.usuarios : SEED.usuarios,
        sesion: parsed.sesion ?? null,
        favoritos: parsed.favoritos ?? {},
      };
    }
  } catch {
    state = SEED;
  }
  // Los productores registrados necesitan su ficha de agricultor en memoria.
  state.usuarios.forEach((u) => {
    if (u.rol === "PRODUCTOR" && u.agricultorId) {
      registrarAgricultor({ id: u.agricultorId, nombre: u.nombre });
    }
  });
  emit();
}

export interface AuthSnapshot {
  cargando: boolean;
  usuario: Usuario | null;
  rol: Rol | null;
  favoritos: string[];
}

export function useAuth(): AuthSnapshot {
  const [, setTick] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const l = () => setTick((t) => t + 1);
    listeners.add(l);
    hidratar();
    setCargando(false);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const usuario = state.usuarios.find((u) => u.id === state.sesion) ?? null;
  return {
    cargando,
    usuario,
    rol: usuario?.rol ?? null,
    favoritos: usuario ? (state.favoritos[usuario.id] ?? []) : [],
  };
}

export const rolLabel: Record<Rol, string> = {
  PRODUCTOR: "Productor agrícola",
  COMPRADOR: "Comprador",
  ADMINISTRADOR: "Administrador",
};

export function inicioSegunRol(rol: Rol): string {
  if (rol === "COMPRADOR") return "/comprador";
  return "/dashboard";
}

export function iniciarSesion(email: string, password: string): { ok: boolean; error?: string; rol?: Rol } {
  hidratar();
  const u = state.usuarios.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
  if (!u || u.password !== password) {
    return { ok: false, error: "Correo o contraseña incorrectos" };
  }
  state = { ...state, sesion: u.id };
  persistir();
  emit();
  return { ok: true, rol: u.rol };
}

export function registrar(input: {
  email: string;
  password: string;
  rol: Rol;
}): { ok: boolean; error?: string; rol?: Rol } {
  hidratar();
  const email = input.email.trim().toLowerCase();
  if (state.usuarios.some((u) => u.email.toLowerCase() === email)) {
    return { ok: false, error: "Ya existe una cuenta con ese correo" };
  }
  const nombre = email.split("@")[0]!.replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const id = `u-${Date.now()}`;
  const nuevo: Usuario = {
    id,
    nombre,
    email,
    password: input.password,
    rol: input.rol,
    ...(input.rol === "PRODUCTOR" ? { agricultorId: `ag-${Date.now()}` } : {}),
  };
  if (nuevo.agricultorId) {
    registrarAgricultor({ id: nuevo.agricultorId, nombre });
  }
  state = { ...state, usuarios: [...state.usuarios, nuevo], sesion: id };
  persistir();
  emit();
  return { ok: true, rol: nuevo.rol };
}

export function cerrarSesion() {
  state = { ...state, sesion: null };
  persistir();
  emit();
}

export function alternarFavorito(publicacionId: string) {
  if (!state.sesion) return;
  const actuales = state.favoritos[state.sesion] ?? [];
  const nuevos = actuales.includes(publicacionId)
    ? actuales.filter((x) => x !== publicacionId)
    : [...actuales, publicacionId];
  state = { ...state, favoritos: { ...state.favoritos, [state.sesion]: nuevos } };
  persistir();
  emit();
  return nuevos.includes(publicacionId);
}
