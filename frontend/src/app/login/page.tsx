"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ScrollText, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/services";
import { useAuthStore } from "@/stores/auth-store";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const signIn = useAuthStore((s) => s.signIn);
  const [busy, setBusy] = useState(false);
  const { register, handleSubmit, formState } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    setBusy(true);
    const result = await login(values.email, values.password);
    signIn(result.token, values.email, result.demo);
    router.replace("/dashboard");
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
            <ScrollText size={20} />
          </div>
          <h1 className="text-lg font-semibold">LexGuard AI</h1>
          <p className="text-sm text-muted-foreground">Contract intelligence that refuses to guess.</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@company.com" autoComplete="email" {...register("email")} />
                {formState.errors.email && <p className="text-xs text-destructive">{formState.errors.email.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" autoComplete="current-password" {...register("password")} />
                {formState.errors.password && <p className="text-xs text-destructive">{formState.errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy && <Loader2 className="animate-spin" />}
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          Demo build — any credentials sign you into the sandbox workspace.
        </p>
      </div>
    </div>
  );
}
