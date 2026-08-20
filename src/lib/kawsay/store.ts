import { useEffect, useState } from "react";
import papa from "@/assets/papa.jpg";
import papa2 from "@/assets/papa-2.jpg";
import palta from "@/assets/palta.jpg";
import palta2 from "@/assets/palta-2.jpg";
import papa3 from "@/assets/papa-3.jpg";
import palta3 from "@/assets/palta-3.jpg";
import type {
  Agricultor,
  CultivoId,
  Publicacion,
  Solicitud,
  Venta,
  EstadoPublicacion,
  Entrega,
  PuntoAcopio,
} from "./types";

/** Red nacional de puntos de acopio (datos de ejemplo del MVP). */
export const PUNTOS_ACOPIO: PuntoAcopio[] = [
  {
    id: "pa-1",
    nombre: "Centro de Acopio Chinchao",
    direccion: "Carretera Central km 32, mercado zonal",
    region: "Huánuco",
    provincia: "Huánuco",
    distrito: "Chinchao",
    lat: -9.6167,
    lng: -76.0833,
    horario: "Lun a Sáb · 6:00 – 16:00",
  },
  {
    id: "pa-2",
    nombre: "Acopio Agrario Huánuco Centro",
    direccion: "Av. Universitaria 1250, Cayhuayna",
    region: "Huánuco",
    provincia: "Huánuco",
    distrito: "Pillco Marca",
    lat: -9.9611,
    lng: -76.2422,
    horario: "Lun a Dom · 5:00 – 18:00",
  },
  {
    id: "pa-3",
    nombre: "Centro de Acopio Huanta",
    direccion: "Jr. Gervasio Santillana 480",
    region: "Ayacucho",
    provincia: "Huanta",
    distrito: "Huanta",
    lat: -12.9375,
    lng: -74.2472,
    horario: "Mar a Dom · 6:00 – 15:00",
  },
  {
    id: "pa-4",
    nombre: "Plataforma Agrícola Ayacucho",
    direccion: "Mercado Mayorista Nery García, Av. Los Incas",
    region: "Ayacucho",
    provincia: "Huamanga",
    distrito: "Ayacucho",
    lat: -13.1588,
    lng: -74.2239,
    horario: "Lun a Sáb · 5:30 – 17:00",
  },
  {
    id: "pa-5",
    nombre: "Acopio Valle del Mantaro",
    direccion: "Av. Circunvalación s/n, feria agropecuaria",
    region: "Junín",
    provincia: "Concepción",
    distrito: "Concepción",
    lat: -11.9139,
    lng: -75.3167,
    horario: "Lun, Mié y Vie · 6:00 – 14:00",
  },
  {
    id: "pa-6",
    nombre: "Terminal Agrícola Huancayo",
    direccion: "Jr. Huancas 900, El Tambo",
    region: "Junín",
    provincia: "Huancayo",
    distrito: "El Tambo",
    lat: -12.0553,
    lng: -75.2103,
    horario: "Lun a Dom · 4:00 – 19:00",
  },
  {
    id: "pa-7",
    nombre: "Centro de Acopio Limatambo",
    direccion: "Plaza principal, vía Cusco–Abancay",
    region: "Cusco",
    provincia: "Anta",
    distrito: "Limatambo",
    lat: -13.4917,
    lng: -72.4333,
    horario: "Mar a Sáb · 6:00 – 15:00",
  },
  {
    id: "pa-8",
    nombre: "Acopio Vinocanchón San Jerónimo",
    direccion: "Mercado mayorista Vinocanchón",
    region: "Cusco",
    provincia: "Cusco",
    distrito: "San Jerónimo",
    lat: -13.5678,
    lng: -71.8853,
    horario: "Lun a Dom · 5:00 – 18:00",
  },
  {
    id: "pa-9",
    nombre: "Acopio Valle de Virú",
    direccion: "Panamericana Norte km 515",
    region: "La Libertad",
    provincia: "Virú",
    distrito: "Virú",
    lat: -8.4142,
    lng: -78.7539,
    horario: "Lun a Sáb · 6:00 – 17:00",
  },
  {
    id: "pa-10",
    nombre: "Hub Logístico Santa Anita",
    direccion: "Gran Mercado Mayorista de Lima, Santa Anita",
    region: "Lima",
    provincia: "Lima",
    distrito: "Santa Anita",
    lat: -12.0533,
    lng: -76.9497,
    horario: "Lun a Dom · 24 horas",
  },
];

export const getPuntoAcopio = (id?: string) =>
  id ? PUNTOS_ACOPIO.find((p) => p.id === id) : undefined;

/**
 * Puntos de acopio cercanos: primero los de la región del productor (origen),
 * luego los de la región del comprador (destino).
 */
export function puntosCercanos(regionOrigen?: string, regionDestino?: string): PuntoAcopio[] {
  const origen = PUNTOS_ACOPIO.filter((p) => p.region === regionOrigen);
  const destino = PUNTOS_ACOPIO.filter(
    (p) => p.region === regionDestino && p.region !== regionOrigen,
  );
  return [...origen, ...destino];
}

export const IMAGENES: Record<CultivoId, string[]> = {
  papa: [papa, papa2, papa3],
  palta: [palta, palta2, palta3],
};

/** Rota las fotos del cultivo para que cada publicación tenga una portada distinta. */
export function imagenesDe(cultivo: CultivoId, offset = 0): string[] {
  const base = IMAGENES[cultivo];
  const i = ((offset % base.length) + base.length) % base.length;
  return [...base.slice(i), ...base.slice(0, i)];
}

export const CULTIVOS: Record<CultivoId, { nombre: string; variedades: string[] }> = {
  papa: {
    nombre: "Papa",
    variedades: ["Amarilla Tumbay", "Canchán", "Huayro", "Peruanita", "Yungay"],
  },
  palta: { nombre: "Palta", variedades: ["Hass", "Fuerte", "Nabal"] },
};

export const REGIONES = [
  "Huánuco",
  "Junín",
  "Cusco",
  "Ayacucho",
  "La Libertad",
  "Arequipa",
  "Lima",
];

export const AGRICULTOR_ACTUAL = "ag-1";

export let agricultores: Agricultor[] = [
  {
    id: "ag-1",
    nombre: "Julián Quispe",
    region: "Huánuco",
    telefono: "+51 962 118 340",
    calificacion: 4.8,
    ventas: 46,
    avatarColor: "bg-primary",
  },
  {
    id: "ag-2",
    nombre: "Rosa Ccahuana",
    region: "Cusco",
    telefono: "+51 984 552 110",
    calificacion: 4.9,
    ventas: 71,
    avatarColor: "bg-earth",
  },
  {
    id: "ag-3",
    nombre: "Cooperativa Valle Verde",
    region: "La Libertad",
    telefono: "+51 944 220 987",
    calificacion: 4.6,
    ventas: 128,
    avatarColor: "bg-success",
  },
];

let publicaciones: Publicacion[] = [
  {
    id: "pub-1",
    cultivo: "papa",
    variedad: "Amarilla Tumbay",
    cantidad: 2400,
    unidad: "kg",
    precio: 2.6,
    calidad: "Primera",
    region: "Huánuco",
    distrito: "Chinchao",
    fechaCosecha: "2026-07-20",
    descripcion:
      "Papa amarilla Tumbay recién cosechada, seleccionada a mano y libre de golpes. Ideal para mercados mayoristas y restaurantes.",
    imagenes: IMAGENES.papa,
    estado: "activa",
    agricultorId: "ag-1",
    creada: "2026-07-22",
  },
  {
    id: "pub-2",
    cultivo: "palta",
    variedad: "Hass",
    cantidad: 5200,
    unidad: "kg",
    precio: 5.4,
    calidad: "Exportación",
    region: "La Libertad",
    distrito: "Virú",
    fechaCosecha: "2026-07-28",
    descripcion:
      "Palta Hass calibre 18-20 con certificación de buenas prácticas agrícolas. Cadena de frío disponible en chacra.",
    imagenes: IMAGENES.palta,
    estado: "activa",
    agricultorId: "ag-3",
    creada: "2026-07-29",
  },
  {
    id: "pub-3",
    cultivo: "papa",
    variedad: "Canchán",
    cantidad: 900,
    unidad: "saco",
    precio: 68,
    calidad: "Segunda",
    region: "Junín",
    distrito: "Concepción",
    fechaCosecha: "2026-07-12",
    descripcion: "Sacos de 50 kg de papa Canchán, buen calibre para consumo doméstico.",
    imagenes: [papa2, papa],
    estado: "activa",
    agricultorId: "ag-2",
    creada: "2026-07-15",
  },
  {
    id: "pub-4",
    cultivo: "palta",
    variedad: "Fuerte",
    cantidad: 1800,
    unidad: "kg",
    precio: 4.2,
    calidad: "Orgánica",
    region: "Cusco",
    distrito: "Limatambo",
    fechaCosecha: "2026-06-30",
    descripcion: "Palta Fuerte de cultivo orgánico en valle interandino, cosecha escalonada.",
    imagenes: [palta2, palta],
    estado: "pausada",
    agricultorId: "ag-1",
    creada: "2026-07-02",
  },
  {
    id: "pub-5",
    cultivo: "papa",
    variedad: "Huayro",
    cantidad: 1200,
    unidad: "kg",
    precio: 3.1,
    calidad: "Primera",
    region: "Ayacucho",
    distrito: "Huanta",
    fechaCosecha: "2026-06-18",
    descripcion: "Papa Huayro de altura, textura harinosa muy valorada en gastronomía.",
    imagenes: IMAGENES.papa,
    estado: "vendida",
    agricultorId: "ag-1",
    creada: "2026-06-20",
  },
];

let solicitudes: Solicitud[] = [
  {
    id: "sol-1",
    publicacionId: "pub-1",
    comprador: "Mercado Santa Anita",
    compradorEmail: "comprador@kawsaytech.pe",
    cantidad: 1200,
    precioOfrecido: 2.45,
    mensaje: "Necesitamos entrega en dos camionadas, pagamos al contado en chacra.",
    fechaRequerida: "2026-08-10",
    estado: "pendiente",
    creada: "2026-08-01",
  },
  {
    id: "sol-2",
    publicacionId: "pub-1",
    comprador: "Mercado Santa Anita",
    compradorEmail: "comprador@kawsaytech.pe",
    cantidad: 300,
    precioOfrecido: 2.8,
    mensaje: "Compra semanal recurrente si la calidad se mantiene.",
    fechaRequerida: "2026-08-06",
    estado: "aceptada",
    creada: "2026-07-30",
  },
  {
    id: "sol-3",
    publicacionId: "pub-4",
    comprador: "Exportadora AndesFresh",
    cantidad: 1500,
    precioOfrecido: 4.0,
    mensaje: "Requerimos ficha técnica y análisis de residuos.",
    fechaRequerida: "2026-08-18",
    estado: "pendiente",
    creada: "2026-07-31",
  },
];

let ventas: Venta[] = [
  {
    id: "ven-1",
    publicacionId: "pub-5",
    comprador: "Distribuidora Los Andes",
    cantidad: 1200,
    precio: 3.1,
    fecha: "2026-06-25",
  },
  {
    id: "ven-2",
    publicacionId: "pub-1",
    comprador: "Mercado Santa Anita",
    compradorEmail: "comprador@kawsaytech.pe",
    cantidad: 300,
    precio: 2.8,
    fecha: "2026-07-31",
  },
  {
    id: "ven-3",
    publicacionId: "pub-3",
    comprador: "Feria Agropecuaria Junín",
    cantidad: 120,
    precio: 68,
    fecha: "2026-07-19",
  },
];

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function useKawsayData() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const l = () => setTick((t) => t + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return { publicaciones, solicitudes, ventas, agricultores };
}

export const getAgricultor = (id: string) =>
  agricultores.find((a) => a.id === id) ?? agricultores[0]!;

export const getPublicacion = (id: string) => publicaciones.find((p) => p.id === id);

/** Crea (o reutiliza) la ficha de agricultor de un productor registrado. */
export function registrarAgricultor({
  id,
  nombre,
  region = "Perú",
}: {
  id: string;
  nombre: string;
  region?: string;
}) {
  if (agricultores.some((a) => a.id === id)) return;
  agricultores = [
    ...agricultores,
    {
      id,
      nombre,
      region,
      telefono: "+51 900 000 000",
      calificacion: 5,
      ventas: 0,
      avatarColor: "bg-primary",
    },
  ];
  emit();
}

export function crearPublicacion(
  data: Omit<Publicacion, "id" | "creada" | "agricultorId" | "imagenes"> & {
    imagenes?: string[];
    agricultorId?: string;
  },
) {
  const nueva: Publicacion = {
    ...data,
    imagenes: data.imagenes?.length ? data.imagenes : imagenesDe(data.cultivo, publicaciones.length),
    id: `pub-${Date.now()}`,
    agricultorId: data.agricultorId ?? AGRICULTOR_ACTUAL,
    creada: new Date().toISOString().slice(0, 10),
  };
  publicaciones = [nueva, ...publicaciones];
  emit();
  return nueva;
}

export function actualizarEstado(id: string, estado: EstadoPublicacion) {
  publicaciones = publicaciones.map((p) => (p.id === id ? { ...p, estado } : p));
  emit();
}

export function eliminarPublicacion(id: string) {
  publicaciones = publicaciones.filter((p) => p.id !== id);
  emit();
}

export function duplicarPublicacion(id: string) {
  const p = publicaciones.find((x) => x.id === id);
  if (!p) return;
  publicaciones = [
    { ...p, id: `pub-${Date.now()}`, estado: "pausada", creada: new Date().toISOString().slice(0, 10) },
    ...publicaciones,
  ];
  emit();
}

export function crearSolicitud(data: Omit<Solicitud, "id" | "creada" | "estado">) {
  const nueva: Solicitud = {
    ...data,
    id: `sol-${Date.now()}`,
    estado: "pendiente",
    creada: new Date().toISOString().slice(0, 10),
  };
  solicitudes = [nueva, ...solicitudes];
  emit();
  return nueva;
}

export function responderSolicitud(id: string, estado: Solicitud["estado"]) {
  const sol = solicitudes.find((s) => s.id === id);
  solicitudes = solicitudes.map((s) => (s.id === id ? { ...s, estado } : s));
  if (sol && estado === "aceptada") {
    ventas = [
      {
        id: `ven-${Date.now()}`,
        publicacionId: sol.publicacionId,
        comprador: sol.comprador,
        compradorEmail: sol.compradorEmail ?? "",
        cantidad: sol.cantidad,
        precio: sol.precioOfrecido,
        fecha: new Date().toISOString().slice(0, 10),
      },
      ...ventas,
    ];
  }
  emit();
}

/** Paso 7: guarda la modalidad de entrega y pasa la solicitud a "coordinada". */
export function coordinarEntrega(
  id: string,
  entrega: Omit<Entrega, "fecha"> & { fecha?: string },
) {
  solicitudes = solicitudes.map((s) =>
    s.id === id
      ? {
          ...s,
          estado: "coordinada",
          entrega: { ...entrega, fecha: entrega.fecha ?? new Date().toISOString().slice(0, 10) },
        }
      : s,
  );
  emit();
}

/** Paso 8: cierra la transacción como completada. */
export function completarSolicitud(id: string) {
  solicitudes = solicitudes.map((s) => (s.id === id ? { ...s, estado: "completada" } : s));
  emit();
}

export const soles = (n: number) =>
  `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
