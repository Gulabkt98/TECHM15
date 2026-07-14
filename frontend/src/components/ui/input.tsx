import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded-lg border border-input bg-surface-raised px-3 py-1 text-sm shadow-[inset_0_1px_0_hsl(0_0%_100%/0.55)] transition-all placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/10 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-none",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
