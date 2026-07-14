import { BadgeCheck, CircleAlert } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Citation } from "@/types/api";

/** A verified evidence quote — the platform's core trust unit.
 *  Clicking navigates to the clause in the Contract Viewer. */
export function CitationQuote({ citation }: { citation: Citation }) {
  return (
    <Link
      href={`/contracts?clause=${encodeURIComponent(citation.clause_ref)}`}
      className="block rounded-md border border-l-2 border-l-primary bg-muted/40 px-3 py-2 transition-colors hover:bg-muted"
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="font-mono font-medium text-foreground">{citation.clause_ref}</span>
        <span>· {citation.document || "table"} · p.{citation.page}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="ml-auto">
              {citation.verified ? (
                <BadgeCheck className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
              ) : (
                <CircleAlert className="h-3.5 w-3.5 text-[hsl(var(--warning))]" />
              )}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            {citation.verified
              ? "Grounding verified — this quote was string-matched against the source document."
              : "Pending verification."}
          </TooltipContent>
        </Tooltip>
      </div>
      <p className="mt-1 text-sm italic leading-relaxed">“{citation.quote}”</p>
    </Link>
  );
}
