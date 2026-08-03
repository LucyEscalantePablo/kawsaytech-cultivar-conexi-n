import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "primary",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: "primary" | "harvest" | "earth" | "success";
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary-soft text-primary",
    harvest: "bg-harvest/40 text-harvest-foreground",
    earth: "bg-earth/20 text-earth",
    success: "bg-success/15 text-success",
  };

  return (
    <Card className="gap-3 rounded-3xl border-border/70 p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <span className={`flex size-11 items-center justify-center rounded-2xl ${tones[tone]}`}>
          <Icon className="size-5" />
        </span>
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <p className="font-display text-3xl font-extrabold leading-none">{value}</p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}
