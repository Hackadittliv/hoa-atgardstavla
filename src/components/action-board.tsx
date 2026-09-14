"use client";

import { useMemo, useState } from "react";
import { ActionItemFields } from "@/components/action-item-fields";
import { BoardFiltersBar, type BoardFilters } from "@/components/board-filters";
import { SummaryStrip } from "@/components/summary-strip";
import { Button } from "@/components/ui/button";
import type { ActionItem, ItemPatch, TeamMember } from "@/lib/types";

export function ActionBoard({
  actor,
  admin,
  demo,
  items,
  savingId,
  justSaved,
  error,
  onPatch,
  onAdd,
  onToggleAdmin,
  onChangeActor,
  onLogout,
}: {
  actor: TeamMember;
  admin: boolean;
  demo: boolean;
  items: ActionItem[];
  savingId: string | null;
  justSaved: boolean;
  error: string | null;
  onPatch: (id: string, patch: ItemPatch) => void;
  onAdd: () => void;
  onToggleAdmin: () => void;
  onChangeActor: () => void;
  onLogout: () => void;
}) {
  const [filters, setFilters] = useState<BoardFilters>({
    scope: "alla",
    category: "",
    status: "",
    prio1: false,
    query: "",
  });

  const categories = useMemo(() => {
    return Array.from(new Set(items.map((item) => item.category))).sort((a, b) =>
      a.localeCompare(b, "sv"),
    );
  }, [items]);

  const visible = useMemo(() => {
    const query = filters.query.trim().toLocaleLowerCase("sv");
    return items.filter((item) => {
      if (filters.scope === "mina" && item.owner !== actor) return false;
      if (filters.category && item.category !== filters.category) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.prio1 && item.priority !== 1) return false;
      if (!query) return true;
      const haystack = [item.category, item.action, item.note, item.owner ?? ""]
        .join(" ")
        .toLocaleLowerCase("sv");
      return haystack.includes(query);
    });
  }, [actor, filters, items]);

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-[#D4AF5F]/25 bg-[#11100C]/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] tracking-[0.28em] text-[#D4AF5F]">
                LIFE IS AWESOME · HOUSE OF AWESOME
              </p>
              <h1 className="mt-1 font-serif text-3xl text-[#F3EDE0] sm:text-4xl">
                Åtgärdstavla
              </h1>
              <p className="mt-1 text-sm text-[#9A917F]">
                Inloggad som <span className="text-[#D4AF5F]">{actor}</span>
                {savingId ? " · Sparar…" : justSaved ? " · Sparad" : ""}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant={admin ? "selected" : "outline"}
                onClick={onToggleAdmin}
              >
                Admin
              </Button>
              {admin ? (
                <Button size="sm" variant="outline" onClick={onAdd}>
                  Ny åtgärd
                </Button>
              ) : null}
              <Button size="sm" variant="ghost" onClick={onChangeActor}>
                Byt person
              </Button>
              <Button size="sm" variant="ghost" onClick={onLogout}>
                Lås
              </Button>
            </div>
          </div>
          {demo ? (
            <div className="rounded-md border border-[#D4AF5F]/40 bg-[#D4AF5F]/10 px-3 py-2 text-sm text-[#E8D7A8]">
              Demo – ej delat. Ändringar lever bara i den här sessionen tills
              Supabase är kopplat.
            </div>
          ) : null}
          {error ? (
            <div className="rounded-md border border-[#C45B5B]/50 bg-[#3A1C1C] px-3 py-2 text-sm text-[#E8A0A0]">
              {error}
            </div>
          ) : null}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-5 px-4 py-5 sm:px-6">
        <SummaryStrip items={items} />
        <BoardFiltersBar
          filters={filters}
          categories={categories}
          onChange={setFilters}
        />
        <p className="text-xs text-[#7A7364]">
          Visar {visible.length} av {items.length} åtgärder
          {admin
            ? " · Admin är på – kategori och åtgärd kan redigeras"
            : " · Kategori och åtgärd är låsta"}
        </p>

        {visible.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#2A261C] px-4 py-16 text-center text-sm text-[#9A917F]">
            Inga åtgärder matchar filtren.
          </div>
        ) : (
          <>
            <div className="grid gap-3 md:hidden">
              {visible.map((item) => (
                <ActionItemFields
                  key={item.id}
                  item={item}
                  admin={admin}
                  layout="card"
                  onPatch={(patch) => onPatch(item.id, patch)}
                />
              ))}
            </div>
            <div className="hidden overflow-x-auto rounded-xl border border-[#2A261C] md:block">
              <table className="w-full min-w-[1100px] border-collapse text-left">
                <thead className="bg-[#141210] text-[11px] uppercase tracking-wide text-[#7A7364]">
                  <tr>
                    <th className="px-3 py-3 font-medium">Kategori</th>
                    <th className="px-3 py-3 font-medium">Åtgärd</th>
                    <th className="px-3 py-3 font-medium">Anteckning</th>
                    <th className="px-3 py-3 font-medium">Ansvarig</th>
                    <th className="px-3 py-3 font-medium">Prio</th>
                    <th className="px-3 py-3 font-medium">Datum</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">Uppdaterad</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((item) => (
                    <ActionItemFields
                      key={item.id}
                      item={item}
                      admin={admin}
                      layout="table"
                      onPatch={(patch) => onPatch(item.id, patch)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
