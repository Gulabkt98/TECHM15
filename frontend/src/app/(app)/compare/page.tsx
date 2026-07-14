"use client";

import { GitCompareArrows, Scale } from "lucide-react";
import { CitationQuote } from "@/components/shared/citation-quote";
import { PageHeader } from "@/components/shared/page-header";
import { RedlineDiff } from "@/components/shared/redline-diff";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClauses, useFindings } from "@/hooks/use-data";

export default function ComparePage() {
  const findings = useFindings();
  const clauses = useClauses();

  const contradictions = (findings.data?.data ?? []).filter((f) => f.category === "contradiction");
  const msaPayment = clauses.data?.data.find((c) => c.clause_ref === "MSA-5.1");
  const sowPayment = clauses.data?.data.find((c) => c.clause_ref === "SOW-3.2");
  const precedence = clauses.data?.data.find((c) => c.clause_type === "precedence");

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="MSA vs SOW Comparison"
        description="Comparable clauses aligned across the family. Numeric conflicts are confirmed deterministically, then resolved via the Order of Precedence clause."
        demo={findings.data?.demo}
      />

      <Tabs defaultValue="conflicts">
        <TabsList>
          <TabsTrigger value="conflicts"><GitCompareArrows className="h-3.5 w-3.5" /> Conflicts ({contradictions.length})</TabsTrigger>
          <TabsTrigger value="side-by-side"><Scale className="h-3.5 w-3.5" /> Side-by-side</TabsTrigger>
        </TabsList>

        <TabsContent value="conflicts" className="space-y-4">
          {contradictions.map((finding) => (
            <Card key={finding.id}>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <SeverityBadge severity={finding.severity} />
                  <Badge variant="secondary">Cross-document</Badge>
                </div>
                <CardTitle className="pt-1 text-sm font-medium leading-relaxed">{finding.summary}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-2 md:grid-cols-2">
                  {finding.citations.slice(0, 2).map((c, i) => <CitationQuote key={i} citation={c} />)}
                </div>
                {finding.citations[2] && (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resolution authority</p>
                    <CitationQuote citation={finding.citations[2]} />
                  </div>
                )}
                {finding.redline && (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Proposed fix</p>
                    <RedlineDiff ops={finding.redline.ops} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="side-by-side">
          <div className="grid gap-4 md:grid-cols-2">
            {[{ doc: "MSA", clause: msaPayment }, { doc: "SOW-1", clause: sowPayment }].map(({ doc, clause }) => (
              <Card key={doc}>
                <CardHeader>
                  <CardTitle className="text-sm">{doc} — {clause?.title}</CardTitle>
                  <CardDescription className="font-mono text-xs">{clause?.clause_ref} · p.{clause?.page}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="rounded-md border bg-muted/30 p-3 text-sm leading-7">{clause?.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {precedence && (
            <Card className="mt-4 border-primary/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Who wins? — {precedence.clause_ref}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-muted-foreground">{precedence.text}</p>
                <Badge variant="success" className="mt-2">Verdict: MSA prevails — SOW payment term unenforceable as drafted</Badge>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
