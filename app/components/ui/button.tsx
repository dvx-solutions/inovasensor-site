import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-[0_0_24px_rgba(59,130,246,0.4)] hover:-translate-y-0.5",
        ghost:
          "bg-white/4 border border-white/8 text-slate-300 hover:bg-white/8 hover:text-white hover:border-white/14",
        outline:
          "border border-white/10 bg-transparent text-slate-300 hover:bg-white/5 hover:text-white hover:border-white/20",
        emerald:
          "bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-[0_0_24px_rgba(16,185,129,0.35)] hover:-translate-y-0.5",
        violet:
          "bg-violet-600 text-white hover:bg-violet-500 hover:shadow-[0_0_24px_rgba(139,92,246,0.35)] hover:-translate-y-0.5",
        amber:
          "bg-amber-500 text-black hover:bg-amber-400 hover:shadow-[0_0_24px_rgba(245,158,11,0.35)] hover:-translate-y-0.5",
        brand:
          "bg-[#e13e6b] text-white hover:bg-[#f06090] hover:shadow-[0_0_28px_rgba(225,62,107,0.5)] hover:-translate-y-0.5",
        link: "text-blue-400 underline-offset-4 hover:underline hover:text-blue-300",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-4 py-1.5 text-xs",
        lg: "h-12 px-7 py-3 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
