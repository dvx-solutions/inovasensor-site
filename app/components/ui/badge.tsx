import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition-colors",
  {
    variants: {
      variant: {
        blue:   "bg-blue-500/12 border-blue-500/25 text-blue-300",
        amber:  "bg-amber-500/12 border-amber-500/25 text-amber-300",
        green:  "bg-emerald-500/12 border-emerald-500/25 text-emerald-300",
        violet: "bg-violet-500/12 border-violet-500/25 text-violet-300",
        slate:  "bg-white/5 border-white/10 text-slate-400",
      },
    },
    defaultVariants: { variant: "blue" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
