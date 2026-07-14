"use client";

import { BellOff } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { KindDot } from "@/components/shared/kind-dot";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";

export default function NotificationsPage() {
  const { notifications, markAllRead } = useUiStore();

  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      <PageHeader
        title="Notifications"
        description="Pipeline events, evidence gaps, and reviewer activity."
        actions={<Button variant="outline" onClick={markAllRead}>Mark all read</Button>}
      />
      {notifications.length === 0 ? (
        <EmptyState icon={BellOff} title="All caught up" />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <Card key={n.id} className={cn(!n.read && "border-primary/40")}>
              <CardContent className="flex items-start gap-3 p-4">
                <KindDot kind={n.kind} className="mt-1.5 h-2 w-2" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn("text-sm", !n.read && "font-semibold")}>{n.title}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">{formatDate(n.at)}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
