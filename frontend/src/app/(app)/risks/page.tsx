"use client";

import { BadgeCheck, ShieldAlert, ShieldX } from "lucide-react";
import Link from "next/link";
import { Bar, BarChart, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFindings, useReportSummary } from "@/hooks/use-data";
import { titleCase } from "@/lib/utils";

export default function RisksPage() {
  const findings = useFindings();
  const report = useReportSummary();
  const list = findings.data?.data ?? [];
  const summary = report.data?.data;

  const byCategory = Object.entries(
    list.reduce<Record<string, number>>((acc, f) => ({ ...acc, [f.category]: (acc[f.category] ?? 0) + 1 }), {}),
  ).map(([name, count]) => ({ name: titleCase(name), count }));

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Risk Dashboard"
        description="Portfolio risk posture. Severity comes from playbook rules; the grounding counter shows the AI being held to evidence."
        demo={findings.data?.demo}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Open findings" value={list.filter((f) => f.status === "open").length} icon={ShieldAlert} tone="danger"
          hint="Awaiting reviewer decision" />
        <StatCard label="Grounding gate" value={`${summary?.claims_verified ?? 0} verified`} icon={BadgeCheck} tone="success"
          hint={`${summary?.claims_rejected ?? 0} AI claims rejected as ungrounded — logged, never shown`} />
        <StatCard label="Walk-away positions" value={list.filter((f) => f.severity === "critical").length} icon={ShieldX} tone="warning"
          hint="Critical breaches of the playbook" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <CardTitle>All findings</CardTitle>
            <CardDescription>Click through to review with full evidence.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {list.map((finding) => (
              <Link key={finding.id} href="/analysis" className="flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/50">
                <SeverityBadge severity={finding.severity} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{finding.summary}</p>
                  <p className="text-xs text-muted-foreground">
                    {titleCase(finding.category)} · <span className="font-mono">{finding.playbook_rule}</span>
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">{titleCase(finding.status)}</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Findings by category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byCategory} layout="vertical" margin={{ left: 8, right: 8 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={110} tickLine={false} axisLine={false} fontSize={12} />
                  <ChartTooltip cursor={{ fill: "hsl(var(--muted))" }} />
                  <Bar dataKey="count" fill="hsl(221 83% 53%)" radius={[0, 6, 6, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
