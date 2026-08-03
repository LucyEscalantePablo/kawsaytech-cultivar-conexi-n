import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/kawsay/AppShell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function ComingSoon({
  title,
  subtitle,
  icon: Icon,
  descripcion,
  pantallas,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  descripcion: string;
  pantallas: { nombre: string; detalle: string }[];
}) {
  return (
    <AppShell title={title} subtitle={subtitle}>
      <div className="space-y-8">
        <Card className="gap-4 overflow-hidden rounded-3xl border-none p-8 shadow-lift">
          <div className="flex flex-wrap items-center gap-4">
            <span className="gradient-field flex size-14 items-center justify-center rounded-2xl">
              <Icon className="size-7 text-primary-foreground" />
            </span>
            <div className="min-w-[16rem] flex-1">
              <Badge className="mb-2 rounded-full bg-harvest text-harvest-foreground">
                <Sparkles className="mr-1 size-3" /> Próximamente
              </Badge>
              <h2 className="font-display text-2xl font-extrabold">{title}</h2>
              <p className="mt-1 max-w-2xl text-muted-foreground">{descripcion}</p>
            </div>
          </div>
        </Card>

        <section className="space-y-4">
          <h3 className="font-display text-lg font-bold">Wireframes previstos</h3>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pantallas.map((p) => (
              <Card
                key={p.nombre}
                className="gap-3 rounded-3xl border-dashed border-border p-5 shadow-none"
              >
                <div className="space-y-2" aria-hidden>
                  <div className="h-3 w-1/3 rounded-full bg-muted" />
                  <div className="h-24 rounded-2xl bg-muted/70" />
                  <div className="h-3 w-2/3 rounded-full bg-muted" />
                  <div className="h-3 w-1/2 rounded-full bg-muted" />
                </div>
                <p className="font-display font-bold">{p.nombre}</p>
                <p className="text-sm text-muted-foreground">{p.detalle}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
