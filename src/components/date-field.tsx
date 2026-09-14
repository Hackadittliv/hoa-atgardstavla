"use client";

import { useRef, useState } from "react";
import { FieldInput } from "@/components/field";
import { cn, toDateInputValue } from "@/lib/utils";

export function DateField({
  value,
  onChange,
  overdue = false,
}: {
  value: string | null;
  onChange: (next: string | null) => void;
  overdue?: boolean;
}) {
  const iso = toDateInputValue(value);
  const [draft, setDraft] = useState(iso);
  const pickerRef = useRef<HTMLInputElement>(null);

  function commit(raw: string) {
    const next = toDateInputValue(raw);
    if (!raw.trim()) {
      if (iso) onChange(null);
      setDraft("");
      return;
    }
    if (!next) {
      setDraft(iso);
      return;
    }
    setDraft(next);
    if (next !== iso) onChange(next);
  }

  return (
    <div className="relative">
      <FieldInput
        type="text"
        inputMode="numeric"
        placeholder="ÅÅÅÅ-MM-DD"
        autoComplete="off"
        spellCheck={false}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => commit(draft)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
        aria-label="Datum"
        className={cn(
          "pr-8 font-mono text-[13px] tracking-tight",
          overdue && "border-[#C45B5B] text-[#E8A0A0]",
        )}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 flex w-8 items-center justify-center text-[#9A917F] hover:text-[#D4AF5F]"
        title="Välj datum"
        aria-label="Välj datum"
        onClick={() => {
          const picker = pickerRef.current;
          if (!picker) return;
          if (typeof picker.showPicker === "function") {
            picker.showPicker();
            return;
          }
          picker.focus();
          picker.click();
        }}
      >
        <CalendarIcon />
      </button>
      <input
        ref={pickerRef}
        type="date"
        value={iso}
        onChange={(event) => {
          const next = toDateInputValue(event.target.value);
          onChange(next || null);
        }}
        className="pointer-events-none absolute h-0 w-0 opacity-0"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <rect
        x="3"
        y="4.5"
        width="14"
        height="12"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M3 8h14M7 3v3M13 3v3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
