"use client";

import { motion } from "framer-motion";
import {
  Braces, CheckCircle2, FileScan, FileWarning, Languages, ListTree,
  Loader2, Network, ScanSearch, ShieldAlert, Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Pipeline visualisation. Stage timings are simulated until the backend
 *  exposes per-job progress; the stage list mirrors the real pipeline. */
const STAGES = [
  { icon: FileScan, label: "Upload & validation", detail: "Format, size, password, integrity checks" },
  { icon: ScanSearch, label: "OCR", detail: "Only for pages without a text layer" },
  { icon: Languages, label: "Language detection", detail: "English detected — proceeding" },
  { icon: Braces, label: "Metadata extraction", detail: "Title, parties, dates, governing document" },
  { icon: ListTree, label: "Clause extraction", detail: "Sections, clauses, tables, cross-references" },
  { icon: Network, label: "Knowledge graph", detail: "Typed edges · cycle detection · completeness gate" },
  { icon: Sparkles, label: "Embeddings & indexing", detail: "Clause-boundary chunks, hybrid retrieval" },
  { icon: ShieldAlert, label: "Risk analysis", detail: "Playbook rules + cross-document contradictions" },
  { icon: FileWarning, label: "Report generation", detail: "Findings, redlines, evidence gaps, audit digest" },
];

export default function ProcessingPage() {
  const [current, setCurrent] = useState(0);
  const done = current >= STAGES.length;

  useEffect(() => {
    if (done) return;
    const timer = setTimeout(() => setCurrent((c) => c + 1), current === 5 ? 2200 : 1100);
    return () => clearTimeout(timer);
  }, [current, done]);

  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      <PageHeader
        title="Processing pipeline"
        description="Watch the family move through the pipeline. The completeness gate can refuse — that's a feature, not a failure."
        actions={
          done ? (
            <Button asChild><Link href="/analysis">Open results →</Link></Button>
          ) : (
            <Button variant="outline" onClick={() => setCurrent(STAGES.length)}>Skip animation</Button>
          )
        }
      />

      <div className="relative space-y-2">
        {STAGES.map((stage, index) => {
          const state = index < current ? "done" : index === current ? "running" : "pending";
          return (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: state === "pending" ? 0.5 : 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={cn(state === "running" && "border-primary/60 shadow-md")}>
                <CardContent className="flex items-center gap-3.5 p-4">
                  <div
                    className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", {
                      "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]": state === "done",
                      "bg-primary/10 text-primary": state === "running",
                      "bg-muted text-muted-foreground": state === "pending",
                    })}
                  >
                    <stage.icon className="h-4.5 w-4.5" size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{stage.label}</p>
                    <p className="truncate text-xs text-muted-foreground">{stage.detail}</p>
                  </div>
                  {state === "done" && <CheckCircle2 className="h-4 w-4 shrink-0 text-[hsl(var(--success))]" />}
                  {state === "running" && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />}
                </CardContent>
              </Card>

              {index === 5 && current > 5 && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                  <Card className="mt-2 border-dashed border-[hsl(var(--warning))]/60 bg-[hsl(var(--warning))]/5">
                    <CardContent className="flex items-start gap-3 p-4">
                      <FileWarning className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--warning))]" />
                      <div className="text-sm">
                        <p className="font-medium">Completeness gate: Exhibit B is missing</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          SOW-4.4 incorporates the Rate Card by reference. 3 clauses are marked{" "}
                          <span className="font-mono">UNEVALUABLE</span> — analysis continues on everything else.
                          LexGuard refuses to guess.
                        </p>
                        <Button asChild size="sm" variant="outline" className="mt-2">
                          <Link href="/upload">Upload Exhibit B to unlock</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {done && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-5 text-center text-sm text-muted-foreground"
        >
          Analysis complete — <span className="font-medium text-foreground">5 findings</span>, 139/142 claims verified,{" "}
          <span className="font-medium text-foreground">1 evidence gap</span>.
        </motion.p>
      )}
    </div>
  );
}
