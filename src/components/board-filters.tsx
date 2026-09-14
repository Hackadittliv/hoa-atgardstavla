"use client";

import { FieldInput, FieldSelect } from "@/components/field";
import { Button } from "@/components/ui/button";
import { STATUSES } from "@/lib/types";
import { cn } from "@/lib/utils";

export type BoardFilters = {
  scope: "alla" | "mina";
  category: string;
  status: string;
  prio1: boolean;
  query: string;
};

export function BoardFiltersBar({
  filters,
  categories,
  onChange,
}: {
  filters: BoardFilters;
  categories: string[];
  onChange: (next: BoardFilters) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={filters.scope === "alla" ? "selected" : "outline"}
          onClick={() => onChange({ ...filters, scope: "alla" })}
        >
          Alla
        </Button>
        <Button
          size="sm"
          variant={filters.scope === "mina" ? "selected" : "outline"}
          onClick={() => onChange({ ...filters, scope: "mina" })}
        >
          Mina
        </Button>
        <Button
          size="sm"
          variant={filters.prio1 ? "selected" : "outline"}
          onClick={() => onChange({ ...filters, prio1: !filters.prio1 })}
        >
          Prio 1
        </Button>
        <FieldSelect
          className="w-auto min-w-44"
          value={filters.category}
          onChange={(event) =>
            onChange({ ...filters, category: event.target.value })
          }
          aria-label="Kategori"
        >
          <option value="">Alla kategorier</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </FieldSelect>
        <FieldSelect
          className="w-auto min-w-36"
          value={filters.status}
          onChange={(event) =>
            onChange({ ...filters, status: event.target.value })
          }
          aria-label="Status"
        >
          <option value="">Alla statusar</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </FieldSelect>
      </div>
      <FieldInput
        className={cn("h-10 max-w-xl")}
        placeholder="Sök åtgärd, anteckning eller kategori…"
        value={filters.query}
        onChange={(event) => onChange({ ...filters, query: event.target.value })}
        aria-label="Sök"
      />
    </div>
  );
}
