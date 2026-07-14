"use client";

import { FileText, FolderKanban, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDocuments, useEvidenceGaps, useFindings } from "@/hooks/use-data";

interface Project {
  id: string;
  name: string;
  client: string;
  createdAt: string;
}

const seedProjects: Project[] = [
  { id: "fam-techcorp", name: "TechCorp Platform Build", client: "TechCorp / Meridian Systems", createdAt: "2026-07-14" },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [open, setOpen] = useState(false);
  const docs = useDocuments();
  const findings = useFindings();
  const gaps = useEvidenceGaps();

  const create = () => {
    if (!name.trim()) return;
    setProjects((p) => [
      { id: crypto.randomUUID(), name: name.trim(), client: client.trim() || "—", createdAt: new Date().toISOString().slice(0, 10) },
      ...p,
    ]);
    setName(""); setClient(""); setOpen(false);
  };

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Projects"
        description="Each project is a contract family: a governing MSA with its SOWs, amendments, and exhibits."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus /> New project</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create project</DialogTitle>
                <DialogDescription>A workspace for one contract family.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="pname">Project name</Label>
                  <Input id="pname" value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Cloud Migration" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pclient">Counterparty</Label>
                  <Input id="pclient" value={client} onChange={(e) => setClient(e.target.value)} placeholder="Acme Corp" />
                </div>
                <Button onClick={create} className="w-full">Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => {
          const isSeed = project.id === "fam-techcorp";
          const docCount = isSeed ? docs.data?.data.length ?? 0 : 0;
          const findingCount = isSeed ? findings.data?.data.length ?? 0 : 0;
          const gapCount = isSeed ? gaps.data?.data.filter((g) => !g.resolved).length ?? 0 : 0;
          return (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <FolderKanban className="h-5 w-5 text-primary" />
                    {gapCount > 0 && <Badge variant="high">{gapCount} evidence gap</Badge>}
                  </div>
                  <CardTitle className="pt-2 text-base">{project.name}</CardTitle>
                  <CardDescription>{project.client}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> {docCount} documents</span>
                    <span>{findingCount} findings</span>
                    <span className="ml-auto">{project.createdAt}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
