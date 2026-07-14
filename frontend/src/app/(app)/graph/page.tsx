"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCycles, useGraph } from "@/hooks/use-data";

const ClauseGraph = dynamic(
  () => import("@/components/features/clause-graph").then((m) => m.ClauseGraph),
  { ssr: false, loading: () => <Skeleton className="h-[480px]" /> },
);

export default function GraphPage() {
  const graph = useGraph();
  const cycles = useCycles();
  const router = useRouter();

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Knowledge Graph"
        description="The clause dependency DAG — typed edges for references, overrides, subordination, and incorporation. Click a node to open the clause."
        demo={graph.data?.demo}
      />

      {cycles.data?.data.length ? (
        <Card className="mb-4 border-destructive/40 bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-destructive">
              <RefreshCcw className="h-4 w-4" /> Drafting loop detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cycles.data.data.map((cycle, i) => (
              <div key={i} className="text-sm">
                <p>
                  <span className="font-mono font-medium">{cycle.clauses.join(" ⇄ ")}</span> reference each other —
                  the clauses have no resolvable meaning as drafted.
                </p>
                {cycle.suggested_break && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Suggested fix: sever the <span className="font-mono">{cycle.suggested_break.edge_type}</span> edge
                    “{cycle.suggested_break.trigger_text}” in {cycle.suggested_break.source} and state the period explicitly.
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {graph.data && (
        <ClauseGraph
          nodes={graph.data.data.nodes}
          edges={graph.data.data.edges}
          cycles={cycles.data?.data ?? []}
          onSelect={(ref) => router.push(`/contracts?clause=${encodeURIComponent(ref)}`)}
        />
      )}
    </div>
  );
}
