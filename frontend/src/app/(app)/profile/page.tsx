"use client";

import { BadgeCheck, ClipboardCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuditTrail } from "@/hooks/use-data";
import { formatDate, titleCase } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

export default function ProfilePage() {
  const { email, demo } = useAuthStore();
  const audit = useAuditTrail();
  const myActions = (audit.data?.data ?? []).filter((e) => e.event_type.startsWith("review."));

  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      <PageHeader title="Profile" />
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="text-lg">{(email ?? "LG").slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{email ?? "Guest"}</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="secondary">Legal Reviewer</Badge>
              {demo && <Badge variant="demo">Demo session</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ClipboardCheck className="h-4 w-4" /> Review activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {myActions.length === 0 && <p className="text-sm text-muted-foreground">No review decisions yet this session.</p>}
          {myActions.map((event) => (
            <div key={event.id} className="flex items-center gap-3 rounded-md border p-3 text-sm">
              <BadgeCheck className="h-4 w-4 text-[hsl(var(--success))]" />
              <span>{titleCase(event.event_type.replace(".", " "))}</span>
              <span className="ml-auto text-xs text-muted-foreground">{formatDate(event.created_at)}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
