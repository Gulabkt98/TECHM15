"use client";

import { ArrowUpRight, FileText, Lock, Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { ConfidenceChip } from "@/components/shared/confidence-chip";
import { PageHeader } from "@/components/shared/page-header";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useClauses, useDocuments, useFindings, useGraph } from "@/hooks/use-data";
import { cn, titleCase } from "@/lib/utils";

function ContractViewer() {
  const params = useSearchParams();
  const clauses = useClauses();
  const docs = useDocuments();
  const findings = useFindings();
  const graph = useGraph();
  const [query, setQuery] = useState("");
  const [selectedRef, setSelectedRef] = useState<string | null>(params.get("clause"));

  const list = clauses.data?.data ?? [];
  const filtered = useMemo(
    () =>
      list.filter(
        (c) =>
          !query ||
          c.clause_ref.toLowerCase().includes(query.toLowerCase()) ||
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.text.toLowerCase().includes(query.toLowerCase()),
      ),
    [list, query],
  );
  const selected = list.find((c) => c.clause_ref === selectedRef) ?? filtered[0];
  const docTitle = (id: string) => docs.data?.data.find((d) => d.id === id)?.title ?? id;

  const relatedFindings = (findings.data?.data ?? []).filter((f) =>
    f.citations.some((c) => c.clause_ref === selected?.clause_ref),
  );
  const overrides = (graph.data?.data.edges ?? []).filter(
    (e) => selected && (e.target === selected.id || e.source === selected.id) && e.edge_type === "OVERRIDES",
  );

  if (clauses.isLoading) {
    return <div className="grid gap-4 lg:grid-cols-[340px_1fr]"><Skeleton className="h-96" /><Skeleton className="h-96" /></div>;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
      <Card className="lg:h-[calc(100vh-210px)] lg:overflow-hidden">
        <CardHeader className="pb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find clause…" className="h-8 pl-8" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1 overflow-y-auto pb-4 scrollbar-thin lg:h-[calc(100%-70px)]">
          {filtered.map((clause) => (
            <button
              key={clause.id}
              onClick={() => setSelectedRef(clause.clause_ref)}
              className={cn(
                "w-full rounded-md px-2.5 py-2 text-left transition-colors",
                selected?.id === clause.id ? "bg-accent" : "hover:bg-muted",
              )}
            >
              <div className="flex items-center gap-2">
                {clause.evaluability === "unevaluable"
                  ? <Lock className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--warning))]" />
                  : <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
                <span className="font-mono text-xs font-medium">{clause.clause_ref}</span>
                <Badge variant="secondary" className="ml-auto text-[10px]">{titleCase(clause.clause_type)}</Badge>
              </div>
              <p className="mt-0.5 truncate pl-5.5 text-xs text-muted-foreground" style={{ paddingLeft: "1.375rem" }}>
                {clause.title}
              </p>
            </button>
          ))}
        </CardContent>
      </Card>

      {selected ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <p className="text-xs text-muted-foreground">{docTitle(selected.document_id)} · page {selected.page}</p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <CardTitle className="text-base">{selected.section_path.join(" › ")}</CardTitle>
                <ConfidenceChip value={selected.extraction_confidence} />
                {selected.evaluability === "unevaluable" && (
                  <Badge variant="high"><Lock className="h-3 w-3" /> Unevaluable — missing Exhibit B</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line rounded-md border bg-muted/30 p-4 text-sm leading-7">{selected.text}</p>
              {overrides.length > 0 && (
                <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
                  <p className="font-medium text-destructive">⚡ Override relationship</p>
                  {overrides.map((edge, i) => (
                    <p key={i} className="mt-1 text-xs text-muted-foreground">
                      Trigger: <span className="italic">“{edge.trigger_text}”</span> — read this clause together with its
                      override chain; the base text alone is misleading.
                    </p>
                  ))}
                  <Link href="/graph" className="mt-1.5 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                    View in dependency graph <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {relatedFindings.length > 0 && (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Findings citing this clause</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {relatedFindings.map((finding) => (
                  <Link key={finding.id} href="/analysis" className="flex items-start gap-2 rounded-md border p-2.5 transition-colors hover:bg-muted/50">
                    <SeverityBadge severity={finding.severity} />
                    <p className="text-xs leading-relaxed">{finding.summary}</p>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card className="flex items-center justify-center"><p className="text-sm text-muted-foreground">Select a clause</p></Card>
      )}
    </div>
  );
}

export default function ContractsPage() {
  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Contract Viewer"
        description="The clause registry with full provenance — section hierarchy, page, extraction confidence, and override relationships."
      />
      <Suspense fallback={<Skeleton className="h-96" />}>
        <ContractViewer />
      </Suspense>
    </div>
  );
}
