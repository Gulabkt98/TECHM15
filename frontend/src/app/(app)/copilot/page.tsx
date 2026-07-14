"use client";

import { ChatPanel } from "@/components/features/chat-panel";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function CopilotPage() {
  return (
    <div className="mx-auto max-w-3xl animate-fade-up">
      <PageHeader
        title="AI Copilot"
        description="Grounded Q&A over the contract family. Every claim carries a verified quote — and when the evidence sits behind a missing exhibit, the copilot refuses rather than guesses."
      />
      <Card>
        <CardContent className="p-5">
          <ChatPanel />
        </CardContent>
      </Card>
    </div>
  );
}
