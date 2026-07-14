import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ElementType;
  tone?: "default" | "danger" | "warning" | "success";
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          {Icon && (
            <Icon
              className={cn("h-4 w-4", {
                "text-muted-foreground": tone === "default",
                "text-destructive": tone === "danger",
                "text-[hsl(var(--warning))]": tone === "warning",
                "text-[hsl(var(--success))]": tone === "success",
              })}
            />
          )}
        </div>
        <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}
