"use client";

import { BadgeCheck, FileWarning, Files, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as ChartTooltip } from "recharts";
import { CitationQuote } from "@/components/shared/citation-quote";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuditTrail, useEvidenceGaps, useFindings, useReportSummary } from "@/hooks/use-data";
import { formatDate, titleCase } from "@/lib/utils";

const SEVERITY_COLORS: Record<string, string> = {
  critical: "hsl(0 72% 47%)",
  high: "hsl(38 92% 50%)",
  medium: "hsl(221 83% 53%)",
  low: "hsl(215 16% 65%)",
};

export default function DashboardPage() {
  const report = useReportSummary();
  const gaps = useEvidenceGaps();
  const audit = useAuditTrail();
  const findings = useFindings();

  const summary = report.data?.data;
  const demo = report.data?.demo ?? false;
  const donut = summary
    ? Object.entries(summary.findings_by_severity).map(([name, value]) => ({ name, value }))
    : [];

  if (report.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Portfolio Overview"
        description="Risk posture across your contract families — every number traces to a verified citation."
        demo={demo}
        actions={
          <Button asChild><Link href="/upload">Upload contracts</Link></Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open findings" value={summary?.findings_total ?? 0} icon={ShieldAlert} tone="danger"
          hint={`${summary?.findings_by_severity.critical ?? 0} critical · ${summary?.findings_by_severity.high ?? 0} high`} />
        <StatCard label="Claims verified" value={`${summary?.claims_verified ?? 0}/${summary?.claims_generated ?? 0}`}
          icon={BadgeCheck} tone="success"
          hint={`${summary?.claims_rejected ?? 0} rejected by the grounding gate — never shown`} />
        <StatCard label="Evidence gaps" value={gaps.data?.data.filter((g) => !g.resolved).length ?? 0}
          icon={FileWarning} tone="warning" hint="Missing exhibits blocking evaluation" />
        <StatCard label="Documents analyzed" value={2} icon={Files} hint="MSA + SOW · TechCorp family" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Findings by severity</CardTitle>
            <CardDescription>Severity is playbook-derived, never model-guessed.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donut} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={3} strokeWidth={0}>
                    {donut.map((entry) => <Cell key={entry.name} fill={SEVERITY_COLORS[entry.name]} />)}
                  </Pie>
                  <ChartTooltip formatter={(value, name) => [`${value}`, titleCase(String(name))]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs">
              {donut.map((d) => (
                <span key={d.name} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: SEVERITY_COLORS[d.name] }} />
                  {titleCase(d.name)} · {d.value}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[hsl(var(--warning))]/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileWarning className="h-4 w-4 text-[hsl(var(--warning))]" />
              Evidence Gap Report
            </CardTitle>
            <CardDescription>LexGuard refuses to evaluate what it cannot verify.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {gaps.data?.data.length ? (
              gaps.data.data.map((gap) => (
                <div key={gap.missing_document} className="rounded-md border border-dashed border-[hsl(var(--warning))]/50 bg-[hsl(var(--warning))]/5 p-3">
                  <p className="text-sm font-medium">{gap.missing_document} is missing</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Referenced from {gap.referenced_from.join(", ")} — blocks{" "}
                    <span className="font-mono">{gap.blocked_clause_refs.join(", ")}</span>
                  </p>
                  <Button asChild size="sm" variant="outline" className="mt-2">
                    <Link href="/upload">Upload {gap.missing_document}</Link>
                  </Button>
                </div>
              ))
            ) : (
              <EmptyState title="No evidence gaps" description="All referenced exhibits are present." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Hash-chained audit trail — tamper-evident.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {audit.data?.data.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-start gap-2.5 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0">
                  <p className="truncate font-medium">{titleCase(event.event_type.replace(".", " · "))}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(event.created_at)} · <span className="font-mono">{event.event_hash}</span></p>
                </div>
              </div>
            ))}
            <Button asChild variant="link" size="sm" className="px-0"><Link href="/reports">Full audit trail →</Link></Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Top risk right now</CardTitle>
        </CardHeader>
        <CardContent>
          {findings.data?.data[0] && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <SeverityBadge severity={findings.data.data[0].severity} />
                <p className="text-sm font-medium">{findings.data.data[0].summary}</p>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {findings.data.data[0].citations.slice(0, 2).map((c, i) => <CitationQuote key={i} citation={c} />)}
              </div>
              <Button asChild variant="outline" size="sm" className="self-start">
                <Link href="/analysis">Open analysis workspace →</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
