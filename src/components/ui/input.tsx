import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md border border-[#2A261C] bg-[#141210] px-3 text-sm text-[#F3EDE0] placeholder:text-[#7A7364] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF5F]/60",
        className,
      )}
      {...props}
    />
  );
}
