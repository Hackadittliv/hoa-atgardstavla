"use client";

import { DateField } from "@/components/date-field";
import { FieldInput, FieldSelect, FieldTextarea } from "@/components/field";
import { OWNERS, STATUSES, type ActionItem, type ItemPatch } from "@/lib/types";
import { cn, formatUpdatedAt, isOverdue, toDateInputValue } from "@/lib/utils";

export function ActionItemFields({
  item,
  admin,
  layout,
  onPatch,
}: {
  item: ActionItem;
  admin: boolean;
  layout: "table" | "card";
  onPatch: (patch: ItemPatch) => void;
}) {
  const overdue = isOverdue(item.due_date, item.status);
  const updated = item.updated_by
    ? `${item.updated_by} · ${formatUpdatedAt(item.updated_at)}`
    : formatUpdatedAt(item.updated_at);

  const categoryField = admin ? (
    <FieldInput
      defaultValue={item.category}
      onBlur={(event) => {
        if (event.target.value !== item.category) {
          onPatch({ category: event.target.value });
        }
      }}
      aria-label="Kategori"
    />
  ) : (
    <p className="text-xs uppercase tracking-wide text-[#D4AF5F]">{item.category}</p>
  );

  const actionField = admin ? (
    <FieldInput
      defaultValue={item.action}
      onBlur={(event) => {
        if (event.target.value !== item.action) {
          onPatch({ action: event.target.value });
        }
      }}
      aria-label="Åtgärd"
    />
  ) : (
    <p className="font-medium text-[#F3EDE0]">{item.action}</p>
  );

  const noteField = (
    <FieldTextarea
      defaultValue={item.note}
      rows={layout === "card" ? 3 : 2}
      onBlur={(event) => {
        if (event.target.value !== item.note) {
          onPatch({ note: event.target.value });
        }
      }}
      aria-label="Anteckning"
    />
  );

  const ownerField = (
    <FieldSelect
      value={item.owner ?? ""}
      onChange={(event) => onPatch({ owner: event.target.value || null })}
      aria-label="Ansvarig"
    >
      <option value="">—</option>
      {OWNERS.map((owner) => (
        <option key={owner} value={owner}>
          {owner}
        </option>
      ))}
    </FieldSelect>
  );

  const priorityField = (
    <FieldSelect
      value={item.priority ?? ""}
      onChange={(event) =>
        onPatch({
          priority: event.target.value ? Number(event.target.value) : null,
        })
      }
      aria-label="Prio"
    >
      <option value="">—</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </FieldSelect>
  );

  const dueField = (
    <DateField
      key={`${item.id}-${toDateInputValue(item.due_date)}`}
      value={item.due_date}
      overdue={overdue}
      onChange={(due_date) => onPatch({ due_date })}
    />
  );

  const statusField = (
    <FieldSelect
      value={item.status}
      onChange={(event) =>
        onPatch({ status: event.target.value as ActionItem["status"] })
      }
      aria-label="Status"
    >
      {STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </FieldSelect>
  );

  if (layout === "card") {
    return (
      <article
        className={cn(
          "space-y-3 rounded-xl border border-[#2A261C] bg-[#141210] p-4",
          item.status === "Klar" && "opacity-70",
          item.priority === 1 && item.status !== "Klar" && "border-[#D4AF5F]/50",
        )}
      >
        {categoryField}
        {actionField}
        {noteField}
        <div className="grid grid-cols-2 gap-2">
          <label className="space-y-1 text-[11px] uppercase tracking-wide text-[#7A7364]">
            Ansvarig
            {ownerField}
          </label>
          <label className="space-y-1 text-[11px] uppercase tracking-wide text-[#7A7364]">
            Prio
            {priorityField}
          </label>
          <label className="space-y-1 text-[11px] uppercase tracking-wide text-[#7A7364]">
            Datum
            {dueField}
          </label>
          <label className="space-y-1 text-[11px] uppercase tracking-wide text-[#7A7364]">
            Status
            {statusField}
          </label>
        </div>
        <p className="text-xs text-[#7A7364]">{updated}</p>
      </article>
    );
  }

  return (
    <tr
      className={cn(
        "align-top border-b border-[#2A261C]/80",
        item.status === "Klar" && "opacity-60",
      )}
    >
      <td className="px-3 py-3">{categoryField}</td>
      <td className="px-3 py-3">{actionField}</td>
      <td className="min-w-52 px-3 py-3">{noteField}</td>
      <td className="w-36 px-3 py-3">{ownerField}</td>
      <td className="w-20 px-3 py-3">{priorityField}</td>
      <td className="w-48 min-w-48 px-3 py-3">{dueField}</td>
      <td className="w-40 px-3 py-3">{statusField}</td>
      <td className="w-44 px-3 py-3 text-xs leading-5 text-[#7A7364]">{updated}</td>
    </tr>
  );
}
