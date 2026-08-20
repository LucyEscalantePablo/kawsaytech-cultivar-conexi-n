import { useState } from "react";
import { MapPin, Warehouse, PhoneCall, Clock, CheckCircle2, MessageCircle, Truck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  coordinarEntrega,
  completarSolicitud,
  getAgricultor,
  getPublicacion,
  getPuntoAcopio,
  puntosCercanos,
} from "@/lib/kawsay/store";
import type { PuntoAcopio, Solicitud } from "@/lib/kawsay/types";

const soloDigitos = (t: string) => t.replace(/[^\d]/g, "");

function MapaPunto({ punto }: { punto: PuntoAcopio }) {
  const d = 0.02;
  const bbox = `${punto.lng - d},${punto.lat - d},${punto.lng + d},${punto.lat + d}`;
  return (
    <iframe
      title={`Mapa de ${punto.nombre}`}
      className="h-56 w-full rounded-2xl border border-border"
      loading="lazy"
      src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${punto.lat},${punto.lng}`}
    />
  );
}

function TarjetaPunto({
  punto,
  origen,
  activo,
  onSelect,
}: {
  punto: PuntoAcopio;
  origen: boolean;
  activo: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-2xl border p-4 text-left transition ${
        activo ? "border-primary bg-primary/5 shadow-soft" : "border-border hover:border-primary/50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{punto.nombre}</p>
          <p className="text-sm text-muted-foreground">
            {punto.distrito}, {punto.provincia} · {punto.region}
          </p>
          <p className="text-sm text-muted-foreground">{punto.direccion}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3.5" /> {punto.horario}
          </p>
        </div>
        <Badge variant="outline" className="rounded-full text-xs">
          {origen ? "Cerca del productor" : "Cerca del comprador"}
        </Badge>
      </div>
    </button>
  );
}

function Contacto({ nombre, telefono, rol }: { nombre: string; telefono?: string | undefined; rol: string }) {
  if (!telefono) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-muted/60 p-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{rol}</p>
        <p className="font-semibold">{nombre}</p>
        <p className="text-sm text-muted-foreground">{telefono}</p>
      </div>
      <div className="flex gap-2">
        <Button asChild variant="secondary" className="rounded-xl">
          <a href={`tel:${soloDigitos(telefono)}`}>
            <PhoneCall className="mr-1 size-4" /> Llamar
          </a>
        </Button>
        <Button asChild className="rounded-xl">
          <a
            href={`https://wa.me/${soloDigitos(telefono)}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            <MessageCircle className="mr-1 size-4" /> WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}

/**
 * Paso 7 del flujo: elección de la modalidad de entrega.
 * `modo="productor"` permite coordinar y completar; `modo="comprador"` es solo lectura + contacto.
 */
export function EntregaPanel({ s, modo }: { s: Solicitud; modo: "productor" | "comprador" }) {
  const pub = getPublicacion(s.publicacionId);
  const agricultor = pub ? getAgricultor(pub.agricultorId) : undefined;
  const regionOrigen = pub?.region;
  const cercanos = puntosCercanos(regionOrigen, s.compradorRegion);
  const [modalidad, setModalidad] = useState<"acopio" | "directa" | null>(
    cercanos.length ? null : "directa",
  );
  const [puntoId, setPuntoId] = useState<string | null>(cercanos[0]?.id ?? null);
  const [nota, setNota] = useState("");

  const puntoElegido = getPuntoAcopio(s.entrega?.puntoAcopioId ?? puntoId ?? undefined);

  // Entrega ya coordinada → resumen
  if (s.entrega) {
    return (
      <div className="space-y-4 rounded-3xl border border-primary/30 bg-primary/5 p-5">
        <p className="flex items-center gap-2 font-display text-base font-bold">
          <CheckCircle2 className="size-5 text-success" /> Entrega coordinada
          <Badge className="rounded-full">
            {s.entrega.modalidad === "acopio" ? "Punto de acopio" : "Coordinación directa"}
          </Badge>
        </p>
        {s.entrega.modalidad === "acopio" && puntoElegido ? (
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="font-semibold">{puntoElegido.nombre}</p>
                <p className="text-sm text-muted-foreground">
                  {puntoElegido.direccion} · {puntoElegido.distrito}, {puntoElegido.region}
                </p>
                <p className="text-sm text-muted-foreground">{puntoElegido.horario}</p>
              </div>
            </div>
            <MapaPunto punto={puntoElegido} />
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Ambas partes acordarán el punto de encuentro por teléfono o WhatsApp.
            </p>
            {modo === "productor" ? (
              <Contacto nombre={s.comprador} telefono={s.compradorTelefono} rol="Comprador" />
            ) : (
              <Contacto
                nombre={agricultor?.nombre ?? "Productor"}
                telefono={agricultor?.telefono}
                rol="Productor"
              />
            )}
          </div>
        )}
        {s.entrega.nota && (
          <p className="rounded-2xl bg-background/70 p-4 text-sm text-muted-foreground">
            “{s.entrega.nota}”
          </p>
        )}
        <p className="text-xs text-muted-foreground">Coordinada el {s.entrega.fecha}</p>
        {modo === "productor" && s.estado === "coordinada" && (
          <Button
            className="h-12 rounded-xl"
            onClick={() => {
              completarSolicitud(s.id);
              toast.success("Transacción completada");
            }}
          >
            <Truck className="mr-1 size-5" /> Marcar entrega como completada
          </Button>
        )}
      </div>
    );
  }

  if (modo === "comprador") {
    return (
      <div className="rounded-3xl border border-dashed border-border p-5 text-sm text-muted-foreground">
        El productor está eligiendo la modalidad de entrega. Te avisaremos cuando quede coordinada.
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-3xl border border-border bg-muted/30 p-5">
      <div>
        <p className="font-display text-base font-bold">Elige cómo se hará la entrega</p>
        <p className="text-sm text-muted-foreground">
          Origen: {regionOrigen ?? "—"} · Destino: {s.compradorRegion ?? "por definir"}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={!cercanos.length}
          onClick={() => setModalidad("acopio")}
          className={`rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
            modalidad === "acopio" ? "border-primary bg-primary/5 shadow-soft" : "border-border hover:border-primary/50"
          }`}
        >
          <Warehouse className="mb-2 size-6 text-primary" />
          <p className="font-semibold">Punto de acopio</p>
          <p className="text-sm text-muted-foreground">
            {cercanos.length
              ? `${cercanos.length} puntos disponibles cerca`
              : "Sin puntos registrados en estas regiones"}
          </p>
        </button>
        <button
          type="button"
          onClick={() => setModalidad("directa")}
          className={`rounded-2xl border p-4 text-left transition ${
            modalidad === "directa" ? "border-primary bg-primary/5 shadow-soft" : "border-border hover:border-primary/50"
          }`}
        >
          <PhoneCall className="mb-2 size-6 text-primary" />
          <p className="font-semibold">Coordinar directamente</p>
          <p className="text-sm text-muted-foreground">
            Acuerden el punto de encuentro por teléfono o WhatsApp.
          </p>
        </button>
      </div>

      {modalidad === "acopio" && (
        <div className="space-y-3">
          {cercanos.map((p) => (
            <TarjetaPunto
              key={p.id}
              punto={p}
              origen={p.region === regionOrigen}
              activo={puntoId === p.id}
              onSelect={() => setPuntoId(p.id)}
            />
          ))}
          {puntoElegido && <MapaPunto punto={puntoElegido} />}
        </div>
      )}

      {modalidad === "directa" && (
        <Contacto nombre={s.comprador} telefono={s.compradorTelefono} rol="Comprador" />
      )}

      {modalidad && (
        <>
          <Textarea
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Nota para el comprador (horario de entrega, transporte, etc.)"
            className="min-h-20 rounded-2xl"
          />
          <Button
            size="lg"
            className="h-12 rounded-xl"
            onClick={() => {
              if (modalidad === "acopio" && !puntoId) {
                toast.error("Selecciona un punto de acopio");
                return;
              }
              coordinarEntrega(s.id, {
                modalidad,
                ...(modalidad === "acopio" && puntoId ? { puntoAcopioId: puntoId } : {}),
                ...(nota.trim() ? { nota: nota.trim() } : {}),
              });
              toast.success("Entrega coordinada");
            }}
          >
            Confirmar entrega coordinada
          </Button>
        </>
      )}
    </div>
  );
}

export function PasosEntrega({ estado }: { estado: Solicitud["estado"] }) {
  const pasos = ["Solicitud aceptada", "Entrega coordinada", "Completada"];
  const activo = estado === "completada" ? 2 : estado === "coordinada" ? 1 : 0;
  return (
    <ol className="flex flex-wrap items-center gap-2 text-xs">
      {pasos.map((p, i) => (
        <li key={p} className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1 rounded-full px-3 py-1 font-semibold ${
              i <= activo ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            }`}
          >
            {i < activo && <CheckCircle2 className="size-3.5" />} {p}
          </span>
          {i < pasos.length - 1 && <span className="text-muted-foreground">→</span>}
        </li>
      ))}
    </ol>
  );
}
