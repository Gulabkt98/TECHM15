"use client";

import {
  Background, Controls, Handle, MarkerType, Position, ReactFlow,
  type Edge, type Node, type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn, titleCase } from "@/lib/utils";
import type { CycleReport, GraphEdge, GraphNode } from "@/types/api";

const EDGE_STYLE: Record<string, { stroke: string; dash?: string; animated?: boolean }> = {
  OVERRIDES: { stroke: "hsl(0 72% 47%)", animated: true },
  CONTRADICTS: { stroke: "hsl(0 72% 47%)", dash: "6 3" },
  SUBORDINATE_TO: { stroke: "hsl(38 92% 50%)" },
  INCORPORATES: { stroke: "hsl(215 16% 55%)", dash: "3 3" },
  REFERENCES: { stroke: "hsl(221 83% 53%)" },
};

type ClauseNodeData = { label: string; clauseType: string; highlighted: boolean; inCycle: boolean };

function ClauseNode({ data }: NodeProps<Node<ClauseNodeData>>) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card px-3 py-2 shadow-soft transition-all",
        data.highlighted && "ring-2 ring-primary",
        data.inCycle && "animate-pulse border-destructive",
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground" />
      <p className="font-mono text-xs font-semibold">{data.label}</p>
      <Badge variant="secondary" className="mt-1 text-[10px]">{titleCase(data.clauseType)}</Badge>
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground" />
    </div>
  );
}

const nodeTypes = { clause: ClauseNode };

export function ClauseGraph({
  nodes: rawNodes,
  edges: rawEdges,
  cycles,
  onSelect,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  cycles: CycleReport[];
  onSelect?: (clauseRef: string) => void;
}) {
  const [search, setSearch] = useState("");
  const cycleRefs = new Set(cycles.flatMap((c) => c.clauses));

  const nodes: Node<ClauseNodeData>[] = useMemo(() => {
    const byDoc = new Map<string, GraphNode[]>();
    rawNodes.forEach((n) => byDoc.set(n.document_id, [...(byDoc.get(n.document_id) ?? []), n]));
    const docIds = Array.from(byDoc.keys());
    return rawNodes.map((n) => {
      const column = docIds.indexOf(n.document_id);
      const row = (byDoc.get(n.document_id) ?? []).indexOf(n);
      return {
        id: n.id,
        type: "clause",
        position: { x: 60 + column * 320, y: 40 + row * 110 },
        data: {
          label: n.clause_ref,
          clauseType: n.clause_type,
          highlighted: !!search && n.clause_ref.toLowerCase().includes(search.toLowerCase()),
          inCycle: cycleRefs.has(n.clause_ref),
        },
      };
    });
  }, [rawNodes, search, cycleRefs]);

  const edges: Edge[] = useMemo(
    () =>
      rawEdges.map((e, i) => {
        const style = EDGE_STYLE[e.edge_type] ?? EDGE_STYLE.REFERENCES;
        return {
          id: `e-${i}`,
          source: e.source,
          target: e.target,
          label: e.edge_type,
          animated: style.animated,
          labelStyle: { fontSize: 9, fill: "hsl(215 16% 45%)" },
          style: { stroke: style.stroke, strokeDasharray: style.dash },
          markerEnd: { type: MarkerType.ArrowClosed, color: style.stroke },
        };
      }),
    [rawEdges],
  );

  return (
    <div className="relative h-[calc(100vh-260px)] min-h-[480px] overflow-hidden rounded-lg border bg-card">
      <div className="absolute left-3 top-3 z-10 w-56">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search clause ref…" className="h-8 bg-card" />
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        onNodeClick={(_, node) => onSelect?.((node.data as ClauseNodeData).label)}
      >
        <Background gap={20} />
        <Controls showInteractive={false} />
      </ReactFlow>
      <div className="absolute bottom-3 left-3 z-10 flex flex-wrap gap-3 rounded-md border bg-card/90 px-3 py-2 text-[11px] backdrop-blur">
        {Object.entries(EDGE_STYLE).map(([type, style]) => (
          <span key={type} className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-5 rounded" style={{ background: style.stroke, opacity: style.dash ? 0.7 : 1 }} />
            {titleCase(type)}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full border border-destructive" /> Circular reference
        </span>
      </div>
    </div>
  );
}
