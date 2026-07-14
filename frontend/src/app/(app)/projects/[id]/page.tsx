"use client";

import { ArrowRight, FileText, FileWarning, Network, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDocuments, useEvidenceGaps, useFindings } from "@/hooks/use-data";
import { formatDate, titleCase } from "@/lib/utils";

export default function ProjectDetailPage() {
  const docs = useDocuments();
  const findings = useFindings();
  const gaps = useEvidenceGaps();
  const demo = docs.data?.demo ?? false;

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="TechCorp Platform Build"
        description="Contract family — governing MSA with SOW #1. Two planted conflicts, one drafting loop, one missing exhibit."
        demo={demo}
        actions={
          <Button asChild><Link href="/analysis">Open workspace <ArrowRight /></Link></Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>The family is analyzed as one linked structure, not file-by-file.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {docs.data?.data.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 rounded-md border p-3">
                <FileText className="h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">{doc.filename} · uploaded {formatDate(doc.uploaded_at)}</p>
                </div>
                <Badge variant="secondary" className="uppercase">{doc.doc_type}</Badge>
                <Badge variant={doc.status === "analyzed" ? "success" : "outline"}>{titleCase(doc.status)}</Badge>
              </div>
            ))}
            {gaps.data?.data.filter((g) => !g.resolved).map((gap) => (
              <div key={gap.missing_document} className="flex items-center gap-3 rounded-md border border-dashed border-[hsl(var(--warning))]/60 bg-[hsl(var(--warning))]/5 p-3">
                <FileWarning className="h-4 w-4 shrink-0 text-[hsl(var(--warning))]" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{gap.missing_document} — referenced but not uploaded</p>
                  <p className="text-xs text-muted-foreground">Blocks {gap.blocked_clause_refs.join(", ")}</p>
                </div>
                <Button asChild size="sm" variant="outline"><Link href="/upload">Upload</Link></Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-destructive" /> Top findings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {findings.data?.data.slice(0, 3).map((finding) => (
                <Link key={finding.id} href="/analysis" className="block rounded-md border p-2.5 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={finding.severity} />
                    <span className="text-xs text-muted-foreground">{titleCase(finding.category)}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs">{finding.summary}</p>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Network className="h-4 w-4 text-primary" /> Explore</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button asChild variant="outline" size="sm"><Link href="/graph">Clause dependency graph</Link></Button>
              <Button asChild variant="outline" size="sm"><Link href="/compare">MSA vs SOW comparison</Link></Button>
              <Button asChild variant="outline" size="sm"><Link href="/copilot">Ask the AI Copilot</Link></Button>
              <Button asChild variant="outline" size="sm"><Link href="/reports">Reports & audit trail</Link></Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
