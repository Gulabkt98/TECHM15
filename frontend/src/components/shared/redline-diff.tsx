import { cn } from "@/lib/utils";
import type { RedlineOp } from "@/types/api";

/** Word-level tracked-changes rendering: red strikethrough deletions,
 *  green insertions — mirroring the backend's diff-match-patch output. */
export function RedlineDiff({ ops, className }: { ops: RedlineOp[]; className?: string }) {
  return (
    <p className={cn("rounded-md border bg-muted/30 p-3 text-sm leading-7", className)}>
      {ops.map((op, i) =>
        op.op === "equal" ? (
          <span key={i}>{op.text}</span>
        ) : op.op === "delete" ? (
          <del key={i} className="rounded bg-destructive/10 px-0.5 text-destructive decoration-destructive/60">
            {op.text}
          </del>
        ) : (
          <ins key={i} className="rounded bg-[hsl(var(--success))]/10 px-0.5 text-[hsl(var(--success))] no-underline">
            {op.text}
          </ins>
        ),
      )}
    </p>
  );
}
