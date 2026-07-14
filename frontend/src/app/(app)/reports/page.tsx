"use client";

import { BadgeCheck, Download, FileJson, Link2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuditTrail, useEvidenceGaps, useFindings, useReportSummary } from "@/hooks/use-data";
import { formatDate, titleCase } from "@/lib/utils";

export default function ReportsPage() {
  const report = useReportSummary();
  const findings = useFindings();
  const gaps = useEvidenceGaps();
  const audit = useAuditTrail();
  const summary = report.data?.data;

  const exportJson = () => {
    const payload = {
      summary,
      findings: findings.data?.data,
      evidence_gaps: gaps.data?.data,
      audit_trail: audit.data?.data,
      generated_by: "LexGuard AI",
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "lexguard-report-techcorp.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Reports & Audit"
        description="The reviewer pack: executive summary, honesty metrics, and the tamper-evident audit chain."
        demo={report.data?.demo}
        actions={
          <>
            <Button variant="outline" onClick={exportJson}><FileJson /> Export JSON</Button>
            <Button onClick={() => window.print()}><Download /> Export PDF</Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Findings" value={summary?.findings_total ?? 0}
          hint={`${summary?.findings_by_severity.critical ?? 0} critical · ${summary?.findings_by_severity.high ?? 0} high · ${summary?.findings_by_severity.medium ?? 0} medium`} />
        <StatCard label="Claims generated" value={summary?.claims_generated ?? 0} hint="Total AI claims produced" />
        <StatCard label="Verified" value={summary?.claims_verified ?? 0} icon={BadgeCheck} tone="success"
          hint="String-matched against source text" />
        <StatCard label="Rejected by gate" value={summary?.claims_rejected ?? 0} tone="warning"
          hint="Ungrounded claims — logged, never shown" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Executive summary</CardTitle>
            <CardDescription>Generated {summary ? formatDate(summary.generated_at) : "—"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              The TechCorp family (MSA + SOW #1) contains <strong>2 critical</strong> issues: a cross-document
              payment-terms contradiction (Net 60 vs 30 days — MSA prevails per §2.4) and an SLA credit table
              whose penalties can reach 25% against a 10% prose cap.
            </p>
            <p>
              The liability cap in MSA-9.2 is <strong>not airtight</strong>: MSA-14.1 removes it for data-breach
              claims via override. One drafting loop (MSA-12.3 ⇄ MSA-8.1) requires redrafting.
            </p>
            <p className="rounded-md border border-dashed border-[hsl(var(--warning))]/60 bg-[hsl(var(--warning))]/5 p-3 text-xs">
              <strong>Scope limitation:</strong> Exhibit B (Rate Card) was not provided. Rate and fee analysis for
              SOW-4.4 and its dependents is excluded from this report rather than assumed.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Link2 className="h-4 w-4" /> Audit chain</CardTitle>
            <CardDescription>Each event embeds the hash of its predecessor — tampering breaks the chain.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {audit.data?.data.map((event, i) => (
                <div key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
                  {i < (audit.data?.data.length ?? 0) - 1 && (
                    <span className="absolute left-[7px] top-4 h-full w-px bg-border" />
                  )}
                  <span className="z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-primary bg-card" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{titleCase(event.event_type.replace(".", " · "))}</p>
                      <Badge variant="secondary" className="font-mono text-[10px]">{event.event_hash}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(event.created_at)} · prev <span className="font-mono">{event.prev_hash.slice(0, 8)}…</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Badge variant="success" className="mt-3"><BadgeCheck className="h-3 w-3" /> Chain integrity verified</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
