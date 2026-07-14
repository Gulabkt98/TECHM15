import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold tracking-[0.01em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-primary/15 bg-primary text-primary-foreground shadow-[inset_0_1px_0_hsl(0_0%_100%/0.18),0_10px_20px_-14px_hsl(var(--primary)/0.75)] hover:bg-primary-strong hover:shadow-elevated",
        secondary:
          "border border-border bg-surface text-foreground shadow-soft hover:border-border-strong hover:bg-surface-raised",
        outline:
          "border border-border bg-card text-foreground shadow-soft hover:border-border-strong hover:bg-surface",
        ghost:
          "text-muted-foreground hover:bg-surface-subtle hover:text-foreground",
        destructive:
          "border border-destructive/20 bg-destructive text-destructive-foreground shadow-[0_10px_20px_-16px_hsl(var(--destructive)/0.85)] hover:bg-destructive/90",
        success:
          "border border-success/20 bg-success text-white shadow-[0_10px_20px_-16px_hsl(var(--success)/0.85)] hover:bg-success/90",
        link:
          "h-auto rounded-sm px-0 py-0 font-semibold text-primary underline-offset-4 hover:text-primary-strong hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-lg px-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
