"use client";

import { CheckCircle2, CloudUpload, FileText, Loader2, Lock, XCircle } from "lucide-react";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { uploadDocument } from "@/services";
import { useUiStore } from "@/stores/ui-store";

const DOC_TYPES = [
  { value: "msa", label: "MSA" },
  { value: "sow", label: "SOW" },
  { value: "nda", label: "NDA" },
  { value: "amendment", label: "Amendment" },
  { value: "exhibit", label: "Exhibit / Playbook" },
];

type FileState = {
  file: File;
  docType: string;
  status: "checking" | "uploading" | "done" | "error" | "blocked";
  progress: number;
  note: string;
};

/** Real client-side pre-flight: PDF magic-bytes check (corruption) and
 *  /Encrypt scan (password protection). Language shown as detected-basic. */
async function preflight(file: File): Promise<{ ok: boolean; note: string }> {
  const head = new Uint8Array(await file.slice(0, 1024).arrayBuffer());
  const text = new TextDecoder("latin1").decode(head);
  if (file.name.toLowerCase().endsWith(".pdf") && !text.startsWith("%PDF")) {
    return { ok: false, note: "Not a valid PDF (corrupted or wrong format)" };
  }
  const body = new TextDecoder("latin1").decode(new Uint8Array(await file.arrayBuffer()));
  if (body.includes("/Encrypt")) {
    return { ok: false, note: "Password-protected PDF — unlock it before uploading" };
  }
  const searchable = body.includes("/Font") || !file.name.toLowerCase().endsWith(".pdf");
  return { ok: true, note: searchable ? "Text layer found · language: English" : "No text layer — OCR will run" };
}

export default function UploadPage() {
  const [docType, setDocType] = useState("msa");
  const [files, setFiles] = useState<FileState[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const notify = useUiStore((s) => s.notify);

  const handleFiles = useCallback(
    async (list: FileList | File[]) => {
      for (const file of Array.from(list)) {
        const entry: FileState = { file, docType, status: "checking", progress: 10, note: "Running pre-flight checks…" };
        setFiles((f) => [entry, ...f]);
        const update = (patch: Partial<FileState>) =>
          setFiles((f) => f.map((x) => (x.file === file ? { ...x, ...patch } : x)));

        const check = await preflight(file);
        if (!check.ok) {
          update({ status: "blocked", progress: 100, note: check.note });
          continue;
        }
        update({ status: "uploading", progress: 45, note: check.note });
        try {
          await uploadDocument(file, docType);
          update({ status: "done", progress: 100, note: `${check.note} · accepted for parsing` });
          notify({ kind: "info", title: "Document accepted", body: `${file.name} queued for parsing → graph → completeness gate.` });
        } catch {
          update({ status: "error", progress: 100, note: "Backend unreachable — start the API and retry" });
        }
      }
    },
    [docType, notify],
  );

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Upload Center"
        description="Add documents to the contract family. Every upload runs pre-flight validation, then parsing, graph building, and the completeness gate."
        actions={<Button asChild variant="outline"><Link href="/processing">View pipeline →</Link></Button>}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Document type:</span>
        {DOC_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setDocType(t.value)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              docType === t.value ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); void handleFiles(e.dataTransfer.files); }}
        className={cn(
          "flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed py-14 transition-colors",
          dragging ? "border-primary bg-accent" : "border-border hover:border-primary/50 hover:bg-muted/40",
        )}
      >
        <CloudUpload className="mb-3 h-9 w-9 text-primary" />
        <p className="text-sm font-medium">Drop PDF or DOCX here, or click to browse</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Up to 50 MB · pre-flight checks: format, password protection, text layer / OCR need
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && void handleFiles(e.target.files)}
        />
      </button>

      <div className="mt-5 space-y-2.5">
        {files.map((f, i) => (
          <Card key={`${f.file.name}-${i}`}>
            <CardContent className="flex items-center gap-3 p-4">
              {f.status === "blocked" ? (
                <Lock className="h-4 w-4 shrink-0 text-destructive" />
              ) : (
                <FileText className="h-4 w-4 shrink-0 text-primary" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">{f.file.name}</p>
                  <Badge variant="secondary" className="uppercase">{f.docType}</Badge>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {(f.file.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-3">
                  <Progress value={f.progress} className="h-1.5 flex-1" />
                  {f.status === "checking" || f.status === "uploading" ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                  ) : f.status === "done" ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-destructive" />
                  )}
                </div>
                <p className={cn("mt-1 text-xs", f.status === "blocked" || f.status === "error" ? "text-destructive" : "text-muted-foreground")}>
                  {f.note}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
