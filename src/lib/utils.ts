import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea una fecha al formato DD/MM/YYYY
 */
export function formatDateDDMMYYYY(date: Date | string | undefined | null): string {
  if (!date) return "—";
  try {
    const d = typeof date === "string" ? new Date(date + (date.includes("T") ? "" : "T12:00:00")) : date;
    if (isNaN(d.getTime())) return "—";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "—";
  }
}

/**
 * Formatea una fecha mostrando el día de la semana y la fecha (ej: "lunes 22/07")
 */
export function formatDateWithWeekday(date: Date | string | undefined | null): { weekday: string; date: string } {
  if (!date) return { weekday: "—", date: "—" };
  try {
    const d = typeof date === "string" ? new Date(date + (date.includes("T") ? "" : "T12:00:00")) : date;
    if (isNaN(d.getTime())) return { weekday: "—", date: "—" };
    const weekday = d.toLocaleDateString("es-PE", { weekday: "long" });
    const formattedDate = formatDateDDMMYYYY(d);
    return { weekday, date: formattedDate };
  } catch {
    return { weekday: "—", date: "—" };
  }
}

/**
 * Formatea una fecha y hora (ej: "22/07/2026 14:30")
 */
export function formatDateTimeShort(date: Date | string | undefined | null): string {
  if (!date) return "—";
  try {
    const d = typeof date === "string" ? new Date(date + (date.includes("T") ? "" : "")) : date;
    if (isNaN(d.getTime())) return "—";
    const dateStr = formatDateDDMMYYYY(d);
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${dateStr} ${hours}:${minutes}`;
  } catch {
    return "—";
  }
}
