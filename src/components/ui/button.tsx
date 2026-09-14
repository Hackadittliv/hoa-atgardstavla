import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF5F]/70 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#D4AF5F] text-[#11100C] hover:bg-[#e0c378]",
        outline:
          "border border-[#D4AF5F]/40 bg-transparent text-[#F3EDE0] hover:border-[#D4AF5F] hover:bg-[#D4AF5F]/10",
        ghost: "text-[#C9C0AE] hover:bg-white/5 hover:text-[#F3EDE0]",
        selected: "bg-[#D4AF5F]/15 text-[#D4AF5F] border border-[#D4AF5F]/50",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
