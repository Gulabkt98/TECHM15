import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold leading-5 tracking-[0.02em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-primary/18 bg-primary-soft text-primary-strong",
        secondary: "border-border bg-surface text-muted-foreground",
        outline: "border-border bg-card text-foreground",
        critical: "border-risk-critical/20 bg-risk-critical/10 text-risk-critical",
        high: "border-risk-high/20 bg-risk-high/10 text-risk-high",
        medium: "border-risk-medium/20 bg-risk-medium/10 text-risk-medium",
        low: "border-risk-low/20 bg-risk-low/10 text-risk-low",
        success: "border-success/20 bg-success/10 text-success",
        demo: "border-dashed border-border-strong bg-surface-subtle text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
