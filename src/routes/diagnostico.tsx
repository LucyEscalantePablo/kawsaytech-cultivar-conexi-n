import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Camera, Loader2, ScanEye, ShieldCheck, Upload, AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/kawsay/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CULTIVOS } from "@/lib/kawsay/store";
import type { CultivoId } from "@/lib/kawsay/types";
import { analizarCultivo, type DiagnosticoResultado } from "@/lib/kawsay/diagnostico.functions";

export const Route = createFileRoute("/diagnostico")({
  head: () => ({
    meta: [
      { title: "Diagnóstico con IA · KawsayTech" },
      {
        name: "description",
        content:
          "Sube una fotografía de tu cultivo de papa o palta y recibe el diagnóstico de enfermedades con inteligencia artificial, severidad y tratamiento.",
      },
      { property: "og:title", content: "Diagnóstico con IA · KawsayTech" },
      { property: "og:description", content: "Detecta enfermedades de papa y palta desde una foto." },
    ],
  }),
  component: DiagnosticoPage,
});

interface Registro extends DiagnosticoResultado {
  id: string;
  cultivo: CultivoId;
  fecha: string;
  imagen: string;
}

const severidadColor: Record<string, string> = {
  leve: "bg-success text-success-foreground",
  moderada: "bg-harvest text-harvest-foreground",
  severa: "bg-destructive text-destructive-foreground",
};

function DiagnosticoPage() {
  const [cultivo, setCultivo] = useState<CultivoId>("papa");
  const [nota, setNota] = useState("");
  const [imagen, setImagen] = useState<string | null>(null);
  const [historial, setHistorial] = useState<Registro[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const analizar = useServerFn(analizarCultivo);

  const mutacion = useMutation({
    mutationFn: async () => {
      if (!imagen) throw new Error("Primero sube una fotografía del cultivo.");
      return await analizar({ data: { cultivo, imagen, nota: nota || undefined } });
    },
    onSuccess: (r) => {
      if (!r.esCultivo) {
        toast.error("La foto no parece ser del cultivo seleccionado. Intenta con una hoja o fruto más cercano.");
        return;
      }
      setHistorial((h) => [
        {
          ...r,
          id: crypto.randomUUID(),
          cultivo,
          imagen: imagen!,
          fecha: new Date().toLocaleString("es-PE", { dateStyle: "medium", timeStyle: "short" }),
        },
        ...h,
      ]);
      toast.success("Análisis completado");
    },
    onError: (e: Error) => toast.error(e.message || "No se pudo analizar la imagen"),
  });

  const resultado = mutacion.data && mutacion.data.esCultivo ? mutacion.data : null;

  function cargar(file: File) {
    if (file.size > 6 * 1024 * 1024) {
      toast.error("La imagen es muy grande (máximo 6 MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImagen(reader.result as string);
      mutacion.reset();
    };
    reader.readAsDataURL(file);
  }

  return (
    <AppShell
      title="Diagnóstico con IA"
      subtitle="Toma una foto de la hoja o el fruto y la IA identifica la enfermedad"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Card className="gap-5 rounded-3xl p-6 shadow-soft">
          <div className="grid gap-2">
            <Label>Cultivo</Label>
            <Select value={cultivo} onValueChange={(v) => setCultivo(v as CultivoId)}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CULTIVOS).map(([id, c]) => (
                  <SelectItem key={id} value={id}>
                    {c.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Fotografía</Label>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex min-h-56 w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted/40 p-4 text-center transition-colors hover:border-primary"
            >
              {imagen ? (
                <img src={imagen} alt="Muestra del cultivo" className="max-h-72 w-full rounded-xl object-cover" />
              ) : (
                <>
                  <Camera className="size-10 text-muted-foreground" />
                  <span className="font-semibold">Sube o toma una foto</span>
                  <span className="text-sm text-muted-foreground">
                    Acerca la cámara a la hoja o fruto afectado, con buena luz natural.
                  </span>
                </>
              )}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) cargar(f);
                e.target.value = "";
              }}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="nota">¿Qué observas? (opcional)</Label>
            <Textarea
              id="nota"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Ej. manchas oscuras en los bordes de la hoja hace 5 días, con lluvias constantes."
              className="min-h-24 rounded-xl"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              className="h-11 flex-1 rounded-xl"
              disabled={!imagen || mutacion.isPending}
              onClick={() => mutacion.mutate()}
            >
              {mutacion.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Analizando…
                </>
              ) : (
                <>
                  <ScanEye className="mr-2 size-4" /> Analizar con IA
                </>
              )}
            </Button>
            {imagen && (
              <Button
                variant="outline"
                className="h-11 rounded-xl"
                onClick={() => {
                  setImagen(null);
                  mutacion.reset();
                }}
              >
                <Upload className="mr-2 size-4" /> Cambiar
              </Button>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          {mutacion.isPending && (
            <Card className="gap-3 rounded-3xl p-6 shadow-soft">
              <p className="font-display font-bold">Procesando la imagen…</p>
              <Progress value={70} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Comparando síntomas con enfermedades frecuentes de {CULTIVOS[cultivo].nombre.toLowerCase()}.
              </p>
            </Card>
          )}

          {resultado && (
            <Card className="gap-4 rounded-3xl p-6 shadow-lift">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl font-extrabold">{resultado.enfermedad}</h2>
                  {resultado.nombreCientifico && (
                    <p className="text-sm italic text-muted-foreground">{resultado.nombreCientifico}</p>
                  )}
                </div>
                <Badge className={`rounded-full ${severidadColor[resultado.severidad] ?? ""}`}>
                  Severidad {resultado.severidad}
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Confianza del modelo</span>
                  <span className="font-bold">{Math.round(resultado.confianza)}%</span>
                </div>
                <Progress value={resultado.confianza} className="h-2" />
              </div>

              <p className="text-sm text-muted-foreground">{resultado.resumen}</p>

              <Bloque icono={<AlertTriangle className="size-4 text-harvest-foreground" />} titulo="Síntomas observados" items={resultado.sintomas} />
              <Bloque icono={<ShieldCheck className="size-4 text-primary" />} titulo="Tratamiento recomendado" items={resultado.tratamiento} />
              <Bloque icono={<ShieldCheck className="size-4 text-success" />} titulo="Prevención" items={resultado.prevencion} />

              <p className="rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
                Resultado orientativo generado con IA. Ante daño severo, confirme con un ingeniero agrónomo antes de aplicar productos.
              </p>
            </Card>
          )}

          {!resultado && !mutacion.isPending && (
            <Card className="gap-2 rounded-3xl border-dashed p-6 shadow-none">
              <p className="font-display font-bold">Aún no hay análisis</p>
              <p className="text-sm text-muted-foreground">
                Sube una foto y presiona “Analizar con IA” para obtener enfermedad, severidad, tratamiento y prevención.
              </p>
            </Card>
          )}

          {historial.length > 0 && (
            <section className="space-y-3">
              <h3 className="font-display text-lg font-bold">Historial de diagnósticos</h3>
              <div className="space-y-3">
                {historial.map((h) => (
                  <Card key={h.id} className="flex-row items-center gap-4 rounded-2xl p-3 shadow-soft">
                    <img src={h.imagen} alt={h.enfermedad} className="size-16 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{h.enfermedad}</p>
                      <p className="text-xs text-muted-foreground">
                        {CULTIVOS[h.cultivo].nombre} · {h.fecha} · {Math.round(h.confianza)}%
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Eliminar del historial"
                      onClick={() => setHistorial((prev) => prev.filter((x) => x.id !== h.id))}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Bloque({ icono, titulo, items }: { icono: React.ReactNode; titulo: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="space-y-2">
      <p className="flex items-center gap-2 font-display text-sm font-bold">
        {icono} {titulo}
      </p>
      <ul className="space-y-1 text-sm text-muted-foreground">
        {items.map((i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
