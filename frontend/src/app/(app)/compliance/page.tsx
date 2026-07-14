"use client";

import { CheckCircle2, Lock, XCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEvidenceGaps, useFindings } from "@/hooks/use-data";

/** Playbook rules evaluated against the family. Status derives from
 *  findings (fail), evidence gaps (blocked), or absence of both (pass). */
const PLAYBOOK_RULES = [
  { rule: "payment.max_payment_days=45", label: "Payment terms within 45 days", category: "payment" },
  { rule: "liability.max_cap_months=12", label: "Liability cap ≤ 12 months of fees", category: "liability" },
  { rule: "sla.max_total_credits_pct=10", label: "SLA credits capped at 10%", category: "sla" },
  { rule: "confidentiality.min_survival_years=2", label: "Confidentiality survives ≥ 2 years", category: "confidentiality" },
  { rule: "termination.min_notice_days=30", label: "Termination notice ≥ 30 days", category: "termination" },
  { rule: "ip.customer_owns_deliverables", label: "Customer owns deliverable IP", category: "ip" },
  { rule: "cross_document.consistency", label: "No MSA ↔ SOW contradictions", category: "contradiction" },
  { rule: "graph.no_circular_references", label: "No drafting loops", category: "termination" },
];

export default function CompliancePage() {
  const findings = useFindings();
  const gaps = useEvidenceGaps();
  const list = findings.data?.data ?? [];
  const hasGaps = (gaps.data?.data ?? []).some((g) => !g.resolved);

  const failing = new Set(list.filter((f) => f.status !== "rejected").map((f) => f.playbook_rule));
  const failingCategories = new Set(list.filter((f) => f.status !== "rejected").map((f) => f.category));

  const evaluated = PLAYBOOK_RULES.map((r) => {
    const fails = failing.has(r.rule) || failingCategories.has(r.category as never);
    const blocked = !fails && hasGaps && (r.category === "payment" || r.category === "sla");
    return { ...r, status: fails ? "fail" : blocked ? "blocked" : "pass" };
  });
  const passCount = evaluated.filter((r) => r.status === "pass").length;
  const score = Math.round((passCount / evaluated.length) * 100);

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Compliance Dashboard"
        description="The contract family scored against the active playbook. Blocked rules are excluded from the score, not assumed compliant."
        demo={findings.data?.demo}
      />

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Playbook compliance</CardTitle>
            <CardDescription>default_enterprise v1 · customer perspective</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold tabular-nums">{score}%</p>
            <Progress value={score} className="mt-3" />
            <div className="mt-4 space-y-1 text-xs text-muted-foreground">
              <p>{passCount} rules pass</p>
              <p>{evaluated.filter((r) => r.status === "fail").length} rules failing</p>
              <p>{evaluated.filter((r) => r.status === "blocked").length} blocked by missing Exhibit B</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rule-by-rule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {evaluated.map((rule) => (
              <div key={rule.rule} className="flex items-center gap-3 rounded-md border p-3">
                {rule.status === "pass" && <CheckCircle2 className="h-4 w-4 shrink-0 text-[hsl(var(--success))]" />}
                {rule.status === "fail" && <XCircle className="h-4 w-4 shrink-0 text-destructive" />}
                {rule.status === "blocked" && <Lock className="h-4 w-4 shrink-0 text-[hsl(var(--warning))]" />}
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{rule.label}</p>
                  <p className="font-mono text-xs text-muted-foreground">{rule.rule}</p>
                </div>
                <Badge variant={rule.status === "pass" ? "success" : rule.status === "fail" ? "critical" : "high"}>
                  {rule.status === "blocked" ? "unevaluable" : rule.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
