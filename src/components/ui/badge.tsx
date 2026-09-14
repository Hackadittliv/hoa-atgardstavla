import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[#D4AF5F]/25 bg-[#D4AF5F]/10 px-2.5 py-0.5 text-xs font-medium text-[#D4AF5F]",
        className,
      )}
    >
      {children}
    </span>
  );
}
