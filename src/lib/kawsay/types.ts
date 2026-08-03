export type CultivoId = "papa" | "palta";

export type Calidad = "Primera" | "Segunda" | "Exportación" | "Orgánica";

export type EstadoPublicacion = "activa" | "pausada" | "vendida";

export type EstadoSolicitud = "pendiente" | "aceptada" | "rechazada" | "cerrada";

export interface Agricultor {
  id: string;
  nombre: string;
  region: string;
  telefono: string;
  calificacion: number;
  ventas: number;
  avatarColor: string;
}

export interface Publicacion {
  id: string;
  cultivo: CultivoId;
  variedad: string;
  cantidad: number;
  unidad: "kg" | "arroba" | "tonelada" | "saco";
  precio: number;
  calidad: Calidad;
  region: string;
  distrito: string;
  fechaCosecha: string;
  descripcion: string;
  imagenes: string[];
  estado: EstadoPublicacion;
  agricultorId: string;
  creada: string;
}

export interface Solicitud {
  id: string;
  publicacionId: string;
  comprador: string;
  cantidad: number;
  precioOfrecido: number;
  mensaje: string;
  fechaRequerida: string;
  estado: EstadoSolicitud;
  creada: string;
}

export interface Venta {
  id: string;
  publicacionId: string;
  comprador: string;
  cantidad: number;
  precio: number;
  fecha: string;
}
