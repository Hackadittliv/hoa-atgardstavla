import { randomUUID } from "node:crypto";
import { loadSeedItems } from "@/lib/seed";
import type { ActionItem, ItemPatch } from "@/lib/types";

let items: ActionItem[] | null = null;

function store(): ActionItem[] {
  if (!items) {
    items = loadSeedItems();
  }
  return items;
}

export function listDemoItems(): ActionItem[] {
  return store();
}

export function patchDemoItem(
  id: string,
  patch: ItemPatch,
  updatedBy: string,
): ActionItem | null {
  const current = store();
  const index = current.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const next: ActionItem = {
    ...current[index],
    ...patch,
    updated_at: new Date().toISOString(),
    updated_by: updatedBy,
  };
  current[index] = next;
  return next;
}

export function createDemoItem(
  input: Pick<ActionItem, "category" | "action"> & ItemPatch,
  updatedBy: string,
): ActionItem {
  const item: ActionItem = {
    id: randomUUID(),
    category: input.category,
    action: input.action,
    note: input.note ?? "",
    owner: input.owner ?? null,
    priority: input.priority ?? null,
    due_date: input.due_date ?? null,
    status: input.status ?? "Ej påbörjad",
    updated_at: new Date().toISOString(),
    updated_by: updatedBy,
  };
  store().unshift(item);
  return item;
}
