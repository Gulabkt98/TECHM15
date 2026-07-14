"use client";

import {
  BarChart3, Bot, FileSearch, FileText, FolderKanban, GitCompareArrows,
  LayoutDashboard, Network, ScrollText, Settings, ShieldAlert, ShieldCheck,
  UploadCloud, Workflow,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const groups: { label: string; items: { href: string; label: string; icon: React.ElementType }[] }[] = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/projects", label: "Projects", icon: FolderKanban },
    ],
  },
  {
    label: "Pipeline",
    items: [
      { href: "/upload", label: "Upload Center", icon: UploadCloud },
      { href: "/processing", label: "Processing", icon: Workflow },
    ],
  },
  {
    label: "Workspace",
    items: [
      { href: "/analysis", label: "Analysis", icon: FileSearch },
      { href: "/contracts", label: "Contract Viewer", icon: FileText },
      { href: "/compare", label: "Compare", icon: GitCompareArrows },
      { href: "/graph", label: "Knowledge Graph", icon: Network },
      { href: "/copilot", label: "AI Copilot", icon: Bot },
    ],
  },
  {
    label: "Governance",
    items: [
      { href: "/risks", label: "Risk Dashboard", icon: ShieldAlert },
      { href: "/compliance", label: "Compliance", icon: ShieldCheck },
      { href: "/reports", label: "Reports", icon: BarChart3 },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r bg-card/50 lg:flex">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ScrollText className="h-4.5 w-4.5" size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">LexGuard AI</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Contract Intelligence</p>
        </div>
      </Link>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4 scrollbar-thin">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-accent font-medium text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t px-3 py-3">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
            pathname.startsWith("/settings")
              ? "bg-accent font-medium text-accent-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
