"use client";

import { Bot, FileWarning, ListFilter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ChatPanel } from "@/components/features/chat-panel";
import { FindingCard } from "@/components/features/finding-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvidenceGaps, useFindings } from "@/hooks/use-data";
import { cn } from "@/lib/utils";
import type { Severity } from "@/types/api";

const FILTERS: (Severity | "all")[] = ["all", "critical", "high", "medium", "low"];

export default function AnalysisPage() {
  const findings = useFindings();
  const gaps = useEvidenceGaps();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");

  const list = (findings.data?.data ?? []).filter((f) => filter === "all" || f.severity === filter);

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Analysis Workspace"
        description="Severity-ranked findings with verified citations. Every decision you make here is recorded in the audit chain."
        demo={findings.data?.demo}
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <ListFilter className="h-4 w-4 text-muted-foreground" />
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors",
                  filter === f ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                {f}
              </button>
            ))}
            <span className="ml-auto text-xs text-muted-foreground">{list.length} findings</span>
          </div>

          <div className="space-y-4">
            {findings.isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-44" />)}
            {!findings.isLoading && list.length === 0 && (
              <EmptyState title="No findings at this severity" description="Adjust the filter or run a fresh analysis." />
            )}
            {list.map((finding) => <FindingCard key={finding.id} finding={finding} />)}
          </div>
        </div>

        <div className="space-y-4">
          {gaps.data?.data.some((g) => !g.resolved) && (
            <Card className="border-dashed border-[hsl(var(--warning))]/60 bg-[hsl(var(--warning))]/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <FileWarning className="h-4 w-4 text-[hsl(var(--warning))]" /> Unevaluable clauses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gaps.data?.data.filter((g) => !g.resolved).map((gap) => (
                  <p key={gap.missing_document} className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{gap.missing_document}</span> is missing — {" "}
                    <span className="font-mono">{gap.blocked_clause_refs.join(", ")}</span> are excluded from
                    this analysis rather than guessed at.
                  </p>
                ))}
                <Button asChild size="sm" variant="outline" className="mt-2.5">
                  <Link href="/upload">Resolve gap</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Bot className="h-4 w-4 text-primary" /> AI Copilot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChatPanel compact />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
