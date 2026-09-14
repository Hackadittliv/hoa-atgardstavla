import { NextResponse } from "next/server";
import { hasValidSession } from "@/lib/auth";
import {
  createDemoItem,
  listDemoItems,
  patchDemoItem,
} from "@/lib/demo-store";
import { isTeamMember, normalizeNewItem, sanitizePatch } from "@/lib/item-patch";
import { isDemoMode, getSupabase } from "@/lib/supabase";
import type { ActionItem } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function requireSession() {
  if (await hasValidSession()) return null;
  return NextResponse.json({ error: "Pinkod krävs" }, { status: 401 });
}

function unauthorizedUpdatedBy() {
  return NextResponse.json({ error: "Välj vem du är" }, { status: 400 });
}

export async function GET() {
  const denied = await requireSession();
  if (denied) return denied;

  if (isDemoMode()) {
    return NextResponse.json({ demo: true, items: listDemoItems() });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ demo: true, items: listDemoItems() });
  }

  const { data, error } = await supabase
    .from("action_items")
    .select("*")
    .order("category", { ascending: true })
    .order("action", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    demo: false,
    items: (data ?? []) as ActionItem[],
  });
}

export async function PATCH(request: Request) {
  const denied = await requireSession();
  if (denied) return denied;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Ogiltig begäran" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  if (!id) {
    return NextResponse.json({ error: "id saknas" }, { status: 400 });
  }
  if (!isTeamMember(body.updated_by)) {
    return unauthorizedUpdatedBy();
  }

  let patch;
  try {
    patch = sanitizePatch(body);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Ogiltig ändring" },
      { status: 400 },
    );
  }

  const updatedBy = body.updated_by;
  const stamp = {
    ...patch,
    updated_at: new Date().toISOString(),
    updated_by: updatedBy,
  };

  if (isDemoMode()) {
    const item = patchDemoItem(id, patch, updatedBy);
    if (!item) {
      return NextResponse.json({ error: "Hittades inte" }, { status: 404 });
    }
    return NextResponse.json({ demo: true, item });
  }

  const supabase = getSupabase();
  if (!supabase) {
    const item = patchDemoItem(id, patch, updatedBy);
    if (!item) {
      return NextResponse.json({ error: "Hittades inte" }, { status: 404 });
    }
    return NextResponse.json({ demo: true, item });
  }

  const { data, error } = await supabase
    .from("action_items")
    .update(stamp)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ demo: false, item: data as ActionItem });
}

export async function POST(request: Request) {
  const denied = await requireSession();
  if (denied) return denied;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Ogiltig begäran" }, { status: 400 });
  }

  if (!isTeamMember(body.updated_by)) {
    return unauthorizedUpdatedBy();
  }

  let input;
  try {
    input = normalizeNewItem(body);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Ogiltig åtgärd" },
      { status: 400 },
    );
  }

  const updatedBy = body.updated_by;

  if (isDemoMode()) {
    const item = createDemoItem(input, updatedBy);
    return NextResponse.json({ demo: true, item }, { status: 201 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    const item = createDemoItem(input, updatedBy);
    return NextResponse.json({ demo: true, item }, { status: 201 });
  }

  const { data, error } = await supabase
    .from("action_items")
    .insert({
      ...input,
      updated_at: new Date().toISOString(),
      updated_by: updatedBy,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ demo: false, item: data as ActionItem }, { status: 201 });
}
