import {
  OWNERS,
  STATUSES,
  type ActionItem,
  type ItemPatch,
  type Status,
  type TeamMember,
} from "@/lib/types";

const TEAM = new Set(["Lucas", "Alexandra", "Christian", "Patrik"]);
const OWNER_SET = new Set<string>(OWNERS);
const STATUS_SET = new Set<string>(STATUSES);

export function isTeamMember(value: unknown): value is TeamMember {
  return typeof value === "string" && TEAM.has(value);
}

function emptyToNull(value: unknown): string | null {
  if (value == null) return null;
  const text = String(value).trim();
  return text === "" ? null : text;
}

export function sanitizePatch(body: Record<string, unknown>): ItemPatch {
  const patch: ItemPatch = {};

  if ("category" in body && typeof body.category === "string") {
    patch.category = body.category.trim();
  }
  if ("action" in body && typeof body.action === "string") {
    patch.action = body.action.trim();
  }
  if ("note" in body && typeof body.note === "string") {
    patch.note = body.note;
  }
  if ("owner" in body) {
    const owner = emptyToNull(body.owner);
    if (owner && !OWNER_SET.has(owner)) {
      throw new Error("Ogiltig ansvarig");
    }
    patch.owner = owner;
  }
  if ("priority" in body) {
    if (body.priority == null || body.priority === "") {
      patch.priority = null;
    } else {
      const priority = Number(body.priority);
      if (![1, 2, 3].includes(priority)) {
        throw new Error("Ogiltig prio");
      }
      patch.priority = priority;
    }
  }
  if ("due_date" in body) {
    const due = emptyToNull(body.due_date);
    if (due && !/^\d{4}-\d{2}-\d{2}$/.test(due)) {
      throw new Error("Ogiltigt datum");
    }
    patch.due_date = due;
  }
  if ("status" in body) {
    if (typeof body.status !== "string" || !STATUS_SET.has(body.status)) {
      throw new Error("Ogiltig status");
    }
    patch.status = body.status as Status;
  }

  return patch;
}

export function normalizeNewItem(
  body: Record<string, unknown>,
): Pick<ActionItem, "category" | "action"> & ItemPatch {
  const category =
    typeof body.category === "string" && body.category.trim()
      ? body.category.trim()
      : "Okategoriserad";
  const action =
    typeof body.action === "string" && body.action.trim()
      ? body.action.trim()
      : "Ny åtgärd";
  return { category, action, ...sanitizePatch(body) };
}
