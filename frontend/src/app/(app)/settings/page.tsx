"use client";

import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { backendOnline } from "@/services";

export default function SettingsPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const { data: online } = useQuery({ queryKey: ["health"], queryFn: backendOnline });

  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      <PageHeader title="Settings" description="Workspace configuration." />

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <Label>Dark mode</Label>
              <p className="text-xs text-muted-foreground">Theme follows your system by default.</p>
            </div>
            <Switch checked={resolvedTheme === "dark"} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Backend connection</CardTitle>
            <CardDescription>The UI falls back to labelled demo data when an endpoint is unavailable.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">API base URL</span>
              <code className="rounded bg-muted px-2 py-0.5 text-xs">{process.env.NEXT_PUBLIC_API_URL}</code>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={online ? "success" : "demo"}>{online ? "Connected" : "Offline — demo mode"}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Legal playbook</CardTitle>
            <CardDescription>Rules that decide what gets flagged. Swappable per client without code changes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="font-medium">default_enterprise</p>
                <p className="text-xs text-muted-foreground">v1 · customer perspective · 6 rule groups</p>
              </div>
              <Badge>Active</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
