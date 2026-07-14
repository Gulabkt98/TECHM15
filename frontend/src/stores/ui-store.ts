"use client";

import { create } from "zustand";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  kind: "info" | "success" | "warning" | "danger";
  read: boolean;
  at: string;
}

interface UiState {
  notifications: AppNotification[];
  notify: (n: Omit<AppNotification, "id" | "read" | "at">) => void;
  markAllRead: () => void;
}

const seed: AppNotification[] = [
  {
    id: "n-1", kind: "danger", read: false, at: "2026-07-14T09:14:10Z",
    title: "Evidence gap detected",
    body: "Exhibit B (Rate Card) is missing — 3 clauses in SOW-1 are unevaluable until it is uploaded.",
  },
  {
    id: "n-2", kind: "warning", read: false, at: "2026-07-14T09:16:45Z",
    title: "Analysis complete: 5 findings",
    body: "TechCorp family analyzed — 2 critical, 2 high, 1 medium. 139/142 claims verified.",
  },
  {
    id: "n-3", kind: "success", read: true, at: "2026-07-14T09:41:22Z",
    title: "Redline accepted",
    body: "Payment-terms redline on SOW-3.2 accepted by priya@lexguard.ai.",
  },
];

export const useUiStore = create<UiState>()((set) => ({
  notifications: seed,
  notify: (n) =>
    set((s) => ({
      notifications: [
        { ...n, id: crypto.randomUUID(), read: false, at: new Date().toISOString() },
        ...s.notifications,
      ],
    })),
  markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
}));
