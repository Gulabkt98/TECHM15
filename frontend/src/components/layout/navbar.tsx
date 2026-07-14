"use client";

import { useQuery } from "@tanstack/react-query";
import { Bell, LogOut, Moon, Search, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { KindDot } from "@/components/shared/kind-dot";
import { backendOnline } from "@/services";
import { useAuthStore } from "@/stores/auth-store";
import { useUiStore } from "@/stores/ui-store";
import { cn, formatDate } from "@/lib/utils";

export function Navbar() {
  const { setTheme, resolvedTheme } = useTheme();
  const router = useRouter();
  const { email, signOut } = useAuthStore();
  const { notifications, markAllRead } = useUiStore();
  const unread = notifications.filter((n) => !n.read).length;

  const { data: online } = useQuery({ queryKey: ["health"], queryFn: backendOnline, refetchInterval: 15_000 });

  return (
    <header className="flex h-14 items-center gap-3 border-b bg-card/50 px-4 backdrop-blur">
      <div className="relative hidden max-w-sm flex-1 md:block">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search clauses, findings, documents…" className="h-8 pl-8" />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Badge variant={online ? "success" : "demo"} className="hidden sm:inline-flex">
          <span className={cn("h-1.5 w-1.5 rounded-full", online ? "bg-[hsl(var(--success))]" : "bg-muted-foreground")} />
          {online ? "Backend connected" : "Demo mode"}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-destructive px-0.5 text-[9px] font-bold text-destructive-foreground">
                  {unread}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96">
            <div className="flex items-center justify-between px-2 py-1.5">
              <p className="text-sm font-semibold">Notifications</p>
              <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                Mark all read
              </button>
            </div>
            <DropdownMenuSeparator />
            {notifications.slice(0, 5).map((n) => (
              <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5 py-2" onClick={() => router.push("/notifications")}>
                <div className="flex w-full items-center gap-2">
                  <KindDot kind={n.kind} />
                  <span className={cn("text-sm", !n.read && "font-medium")}>{n.title}</span>
                  <span className="ml-auto text-[11px] text-muted-foreground">{formatDate(n.at)}</span>
                </div>
                <p className="line-clamp-2 pl-3.5 text-xs text-muted-foreground">{n.body}</p>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/notifications" className="justify-center text-xs text-primary">View all</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 dark:hidden" />
          <Moon className="hidden h-4 w-4 dark:block" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button aria-label="Account menu">
              <Avatar>
                <AvatarFallback>{(email ?? "LG").slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-2 py-1.5">
              <p className="truncate text-sm font-medium">{email ?? "Guest"}</p>
              <p className="text-xs text-muted-foreground">Legal Reviewer</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/profile"><User /> Profile</Link></DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                signOut();
                router.push("/login");
              }}
            >
              <LogOut /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
