import { createServerFn } from "@tanstack/react-start";
import type { Agricultor, Publicacion, Solicitud, Venta } from "./types";

const withDbErrorHandling = async <T>(label: string, operation: () => Promise<T>) => {
  try {
    return await operation();
  } catch (error) {
    console.error(`DB error in ${label}:`, error);
    throw error;
  }
};

const normalizeEntity = <T>(value: unknown) => value as T;

export const cargarPublicacionesEnDB = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const { query } = await import("@/lib/db");
      const result = await query<{
        id: string;
        cultivo: Publicacion["cultivo"];
        variedad: string;
        cantidad: number;
        unidad: Publicacion["unidad"];
        precio: number;
        calidad: Publicacion["calidad"];
        region: string;
        distrito: string;
        fecha_cosecha: string;
        descripcion: string;
        imagenes: string[];
        estado: Publicacion["estado"];
        agricultor_id: string;
        creada: string;
      }>(`SELECT id, cultivo, variedad, cantidad, unidad, precio, calidad, region, distrito,
          fecha_cosecha, descripcion, imagenes, estado, agricultor_id, creada
        FROM publicaciones ORDER BY created_at DESC`);

      return result.rows.map((p) => ({
        id: p.id,
        cultivo: p.cultivo,
        variedad: p.variedad,
        cantidad: Number(p.cantidad),
        unidad: p.unidad,
        precio: Number(p.precio),
        calidad: p.calidad,
        region: p.region,
        distrito: p.distrito,
        fechaCosecha: String(p.fecha_cosecha).slice(0, 10),
        descripcion: p.descripcion ?? "",
        imagenes: Array.isArray(p.imagenes) ? p.imagenes : [],
        estado: p.estado,
        agricultorId: p.agricultor_id,
        creada: String(p.creada).slice(0, 10),
      } satisfies Publicacion));
    } catch (error) {
      console.warn("PostgreSQL no disponible; usando datos locales de la app.", error);
      return [];
    }
  });

export const guardarCompradorEnDB = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    normalizeEntity<{ id: string; nombre: string; email: string }>(input),
  )
  .handler(async ({ data }) => {
    const { query } = await import("@/lib/db");
    await query(
      `INSERT INTO compradores (id, nombre, email)
       VALUES ($1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre, email = EXCLUDED.email, updated_at = NOW()`,
      [data.id, data.nombre, data.email],
    );
    return { ok: true };
  });

export const guardarAgricultorEnDB = createServerFn({ method: "POST" })
  .validator((input: unknown) => normalizeEntity<Agricultor>(input))
  .handler(async ({ data: a }) => {
    await withDbErrorHandling("guardarAgricultorEnDB", async () => {
      const { query } = await import("@/lib/db");
      await query(
        `INSERT INTO agricultores (id, nombre, region, telefono, calificacion, ventas, avatar_color)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
           nombre = EXCLUDED.nombre,
           region = EXCLUDED.region,
           telefono = EXCLUDED.telefono,
           calificacion = EXCLUDED.calificacion,
           ventas = EXCLUDED.ventas,
           avatar_color = EXCLUDED.avatar_color`,
        [
          a.id,
          a.nombre,
          a.region,
          a.telefono ?? "",
          a.calificacion ?? 0,
          a.ventas ?? 0,
          a.avatarColor ?? "bg-primary",
        ],
      );
    });

    return { ok: true };
  });

export const guardarPublicacionEnDB = createServerFn({ method: "POST" })
  .validator((input: unknown) => normalizeEntity<Publicacion>(input))
  .handler(async ({ data: p }) => {
    await withDbErrorHandling("guardarPublicacionEnDB", async () => {
      const { query } = await import("@/lib/db");
      await query(
        `INSERT INTO publicaciones (
           id, cultivo, variedad, cantidad, unidad, precio, calidad, region, distrito,
           fecha_cosecha, descripcion, imagenes, estado, agricultor_id, creada
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         ON CONFLICT (id) DO UPDATE SET
           cultivo = EXCLUDED.cultivo,
           variedad = EXCLUDED.variedad,
           cantidad = EXCLUDED.cantidad,
           unidad = EXCLUDED.unidad,
           precio = EXCLUDED.precio,
           calidad = EXCLUDED.calidad,
           region = EXCLUDED.region,
           distrito = EXCLUDED.distrito,
           fecha_cosecha = EXCLUDED.fecha_cosecha,
           descripcion = EXCLUDED.descripcion,
           imagenes = EXCLUDED.imagenes,
           estado = EXCLUDED.estado,
           agricultor_id = EXCLUDED.agricultor_id,
           creada = EXCLUDED.creada`,
        [
          p.id,
          p.cultivo,
          p.variedad,
          p.cantidad,
          p.unidad,
          p.precio,
          p.calidad,
          p.region,
          p.distrito,
          p.fechaCosecha,
          p.descripcion ?? "",
          JSON.stringify(p.imagenes ?? []),
          p.estado,
          p.agricultorId,
          p.creada,
        ],
      );
    });

    return { ok: true };
  });

export const actualizarEstadoPublicacionEnDB = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const d = input as { id?: string; estado?: string };
    if (!d?.id || !d?.estado) throw new Error("id y estado son obligatorios");
    return d;
  })
  .handler(async ({ data }) => {
    await withDbErrorHandling("actualizarEstadoPublicacionEnDB", async () => {
      const { query } = await import("@/lib/db");
      await query(`UPDATE publicaciones SET estado = $2 WHERE id = $1`, [data.id, data.estado]);
    });

    return { ok: true };
  });

export const eliminarPublicacionEnDB = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (typeof input !== "string" || !input.trim()) throw new Error("id requerido");
    return input;
  })
  .handler(async ({ data: id }) => {
    await withDbErrorHandling("eliminarPublicacionEnDB", async () => {
      const { query } = await import("@/lib/db");
      await query(`DELETE FROM publicaciones WHERE id = $1`, [id]);
    });

    return { ok: true };
  });

export const guardarSolicitudEnDB = createServerFn({ method: "POST" })
  .validator((input: unknown) => normalizeEntity<Solicitud>(input))
  .handler(async ({ data: s }) => {
    await withDbErrorHandling("guardarSolicitudEnDB", async () => {
      const { query } = await import("@/lib/db");
      await query(
        `INSERT INTO solicitudes (
           id, publicacion_id, comprador_id, comprador, comprador_email, comprador_telefono, comprador_region,
           cantidad, precio_ofrecido, mensaje, fecha_requerida, estado, entrega, creada
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         ON CONFLICT (id) DO UPDATE SET
           publicacion_id = EXCLUDED.publicacion_id,
           comprador = EXCLUDED.comprador,
           comprador_email = EXCLUDED.comprador_email,
           comprador_telefono = EXCLUDED.comprador_telefono,
           comprador_region = EXCLUDED.comprador_region,
           cantidad = EXCLUDED.cantidad,
           precio_ofrecido = EXCLUDED.precio_ofrecido,
           mensaje = EXCLUDED.mensaje,
           fecha_requerida = EXCLUDED.fecha_requerida,
           estado = EXCLUDED.estado,
           entrega = EXCLUDED.entrega,
           creada = EXCLUDED.creada`,
        [
          s.id,
          s.publicacionId,
          s.compradorId ?? null,
          s.comprador,
          s.compradorEmail ?? null,
          s.compradorTelefono ?? null,
          s.compradorRegion ?? null,
          s.cantidad,
          s.precioOfrecido,
          s.mensaje ?? "",
          s.fechaRequerida,
          s.estado,
          s.entrega ? JSON.stringify(s.entrega) : null,
          s.creada,
        ],
      );
    });

    return { ok: true };
  });

export const actualizarSolicitudEnDB = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const d = input as { id?: string; estado?: string; entrega?: unknown };
    if (!d?.id || !d?.estado) throw new Error("id y estado son obligatorios");
    return d;
  })
  .handler(async ({ data }) => {
    await withDbErrorHandling("actualizarSolicitudEnDB", async () => {
      const { query } = await import("@/lib/db");
      await query(
        `UPDATE solicitudes
         SET estado = $2,
             entrega = $3,
             updated_at = NOW()
         WHERE id = $1`,
        [data.id, data.estado, data.entrega ? JSON.stringify(data.entrega) : null],
      );
    });

    return { ok: true };
  });

export const guardarVentaEnDB = createServerFn({ method: "POST" })
  .validator((input: unknown) => normalizeEntity<Venta>(input))
  .handler(async ({ data: v }) => {
    await withDbErrorHandling("guardarVentaEnDB", async () => {
      const { query } = await import("@/lib/db");
      await query(
        `INSERT INTO ventas (id, publicacion_id, comprador, comprador_email, cantidad, precio, fecha)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
           publicacion_id = EXCLUDED.publicacion_id,
           comprador = EXCLUDED.comprador,
           comprador_email = EXCLUDED.comprador_email,
           cantidad = EXCLUDED.cantidad,
           precio = EXCLUDED.precio,
           fecha = EXCLUDED.fecha`,
        [v.id, v.publicacionId, v.comprador, v.compradorEmail ?? null, v.cantidad, v.precio, v.fecha],
      );
    });

    return { ok: true };
  });
