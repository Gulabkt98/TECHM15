"use client";

import { BadgeCheck, Check, Pencil, X } from "lucide-react";
import { useState } from "react";
import { CitationQuote } from "@/components/shared/citation-quote";
import { ConfidenceChip } from "@/components/shared/confidence-chip";
import { RedlineDiff } from "@/components/shared/redline-diff";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useReviewFinding } from "@/hooks/use-data";
import { titleCase } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";
import type { Finding } from "@/types/api";

export function FindingCard({ finding }: { finding: Finding }) {
  const review = useReviewFinding();
  const notify = useUiStore((s) => s.notify);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [localStatus, setLocalStatus] = useState(finding.status);

  const act = (action: "accepted" | "modified" | "rejected", why?: string) => {
    review.mutate({ id: finding.id, action, reason: why });
    setLocalStatus(action);
    notify({
      kind: action === "rejected" ? "warning" : "success",
      title: `Finding ${action}`,
      body: `${finding.citations[0]?.clause_ref ?? finding.id}: ${finding.summary.slice(0, 80)}…`,
    });
  };

  return (
    <Card className={localStatus !== "open" ? "opacity-75" : undefined}>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <SeverityBadge severity={finding.severity} />
          <Badge variant="secondary">{titleCase(finding.category)}</Badge>
          {finding.grounding_verified && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-1 text-xs text-[hsl(var(--success))]">
                  <BadgeCheck className="h-3.5 w-3.5" /> grounded
                </span>
              </TooltipTrigger>
              <TooltipContent>Every quote below was string-matched against the source document.</TooltipContent>
            </Tooltip>
          )}
          <span className="ml-auto flex items-center gap-2">
            <ConfidenceChip value={finding.extraction_confidence} />
            {localStatus !== "open" && <Badge variant={localStatus === "rejected" ? "outline" : "success"}>{titleCase(localStatus)}</Badge>}
          </span>
        </div>
        <p className="pt-1 text-sm font-medium leading-relaxed">{finding.summary}</p>
        <p className="text-xs text-muted-foreground">
          Rule: <span className="font-mono">{finding.playbook_rule}</span>
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 lg:grid-cols-2">
          {finding.citations.map((citation, i) => <CitationQuote key={i} citation={citation} />)}
        </div>

        {finding.redline && (
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Pencil className="h-3 w-3" /> Suggested redline
            </p>
            <RedlineDiff ops={finding.redline.ops} />
          </div>
        )}

        {localStatus === "open" && (
          <div className="flex items-center gap-2 pt-1">
            <Button size="sm" variant="success" onClick={() => act("accepted")}>
              <Check /> Accept
            </Button>
            <Button size="sm" variant="outline" onClick={() => act("modified")}>
              <Pencil /> Modify
            </Button>
            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setRejectOpen(true)}>
              <X /> Reject
            </Button>
            <span className="ml-auto text-[11px] text-muted-foreground">Decision is appended to the audit chain</span>
          </div>
        )}
      </CardContent>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject finding</DialogTitle>
            <DialogDescription>A reason is required — it becomes part of the audit trail.</DialogDescription>
          </DialogHeader>
          <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why is this finding not a risk here?" />
          <Button
            disabled={reason.trim().length < 5}
            variant="destructive"
            onClick={() => { act("rejected", reason); setRejectOpen(false); }}
          >
            Reject with reason
          </Button>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
