"use client";

import { Bot, Loader2, SendHorizonal, ShieldOff, User } from "lucide-react";
import { useRef, useState } from "react";
import { CitationQuote } from "@/components/shared/citation-quote";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { askCopilot } from "@/services";
import type { ChatAnswer } from "@/types/api";

interface Message {
  role: "user" | "assistant";
  text: string;
  answer?: ChatAnswer;
  demo?: boolean;
}

const SUGGESTIONS = [
  "What are the payment terms?",
  "Is the liability cap airtight?",
  "What are the rates in Exhibit B?",
];

export function ChatPanel({ compact = false }: { compact?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const send = async (question: string) => {
    if (!question.trim() || busy) return;
    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setBusy(true);
    const { data, demo } = await askCopilot(question);
    setMessages((m) => [...m, { role: "assistant", text: data.answer, answer: data, demo }]);
    setBusy(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  return (
    <div className={cn("flex flex-col", compact ? "h-[480px]" : "h-[calc(100vh-220px)]")}>
      <div className="flex-1 space-y-4 overflow-y-auto pr-1 scrollbar-thin">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Bot className="mb-2 h-8 w-8 text-primary" />
            <p className="text-sm font-medium">Grounded contract Q&A</p>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              Every answer cites verified clauses. When evidence is missing, the copilot refuses instead of guessing.
            </p>
            <div className="mt-4 flex flex-col gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => void send(s)} className="rounded-full border px-3 py-1 text-xs hover:bg-muted">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, i) => (
          <div key={i} className={cn("flex gap-2.5", message.role === "user" && "justify-end")}>
            {message.role === "assistant" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot className="h-3.5 w-3.5" />
              </div>
            )}
            <div className={cn("max-w-[85%] space-y-2", message.role === "user" && "order-first")}>
              <div
                className={cn(
                  "rounded-lg px-3.5 py-2.5 text-sm leading-relaxed",
                  message.role === "user" ? "bg-primary text-primary-foreground" : "border bg-card",
                )}
              >
                {message.answer?.refused && (
                  <Badge variant="high" className="mb-1.5"><ShieldOff className="h-3 w-3" /> Refused to guess</Badge>
                )}
                {message.text}
                {message.answer?.refusal_reason && (
                  <p className="mt-1.5 text-xs text-muted-foreground">{message.answer.refusal_reason}</p>
                )}
              </div>
              {message.answer && message.answer.claims.length > 0 && (
                <div className="space-y-1.5">
                  {message.answer.claims.map((claim, j) => (
                    <CitationQuote
                      key={j}
                      citation={{ document: "", clause_ref: claim.clause_ref, page: 0, quote: claim.quote, verified: claim.verified ?? true }}
                    />
                  ))}
                </div>
              )}
            </div>
            {message.role === "user" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                <User className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        ))}
        {busy && <Loader2 className="mx-auto h-4 w-4 animate-spin text-muted-foreground" />}
        <div ref={bottomRef} />
      </div>

      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => { e.preventDefault(); void send(input); }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about clauses, risks, dependencies…"
        />
        <Button type="submit" size="icon" disabled={busy || !input.trim()} aria-label="Send">
          <SendHorizonal />
        </Button>
      </form>
    </div>
  );
}
