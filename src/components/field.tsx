import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const fieldClass =
  "h-8 w-full min-w-0 rounded-md border border-[#2A261C] bg-[#11100C] px-2 text-sm text-[#F3EDE0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF5F]/70 disabled:cursor-default disabled:opacity-80";

export function FieldSelect({
  className,
  ...props
}: ComponentProps<"select">) {
  return <select className={cn(fieldClass, className)} {...props} />;
}

export function FieldInput({
  className,
  ...props
}: ComponentProps<"input">) {
  return <input className={cn(fieldClass, className)} {...props} />;
}

export function FieldTextarea({
  className,
  ...props
}: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        fieldClass,
        "h-auto min-h-8 resize-y py-1.5 leading-5",
        className,
      )}
      {...props}
    />
  );
}
