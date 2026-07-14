import { cn } from "@/lib/utils";
import type { AppNotification } from "@/stores/ui-store";

/** Colored status dot for notification kinds — single source of the mapping. */
export function KindDot({ kind, className }: { kind: AppNotification["kind"]; className?: string }) {
  return (
    <span
      className={cn(
        "h-1.5 w-1.5 shrink-0 rounded-full",
        {
          "bg-destructive": kind === "danger",
          "bg-[hsl(var(--warning))]": kind === "warning",
          "bg-[hsl(var(--success))]": kind === "success",
          "bg-primary": kind === "info",
        },
        className,
      )}
    />
  );
}
