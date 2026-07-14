import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/** Extraction confidence ("did we read it right?") — deliberately separate
 *  from risk severity, mirroring the backend's dual confidence model. */
export function ConfidenceChip({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[11px] tabular-nums",
            pct >= 90 ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]"
              : pct >= 70 ? "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]"
              : "bg-destructive/10 text-destructive",
          )}
        >
          {pct}%
        </span>
      </TooltipTrigger>
      <TooltipContent>
        Extraction confidence — how reliably this text was read from the source. Separate from risk severity.
      </TooltipContent>
    </Tooltip>
  );
}
