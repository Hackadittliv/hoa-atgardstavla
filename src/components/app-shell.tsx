"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ActionBoard } from "@/components/action-board";
import { NamePicker } from "@/components/name-picker";
import { PinGate } from "@/components/pin-gate";
import {
  ACTOR_STORAGE_KEY,
  type ActionItem,
  type ItemPatch,
  type TeamMember,
} from "@/lib/types";

type Gate = "loading" | "pin" | "name" | "board";

function readLocalActor(): TeamMember | null {
  const stored = window.localStorage.getItem(ACTOR_STORAGE_KEY);
  if (
    stored === "Lucas" ||
    stored === "Alexandra" ||
    stored === "Christian" ||
    stored === "Patrik"
  ) {
    return stored;
  }
  return null;
}

export function AppShell() {
  const [gate, setGate] = useState<Gate>("loading");
  const [actor, setActor] = useState<TeamMember | null>(null);
  const [admin, setAdmin] = useState(false);
  const [items, setItems] = useState<ActionItem[]>([]);
  const [demo, setDemo] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const savedTimer = useRef<number | null>(null);

  function markSaved() {
    setJustSaved(true);
    if (savedTimer.current) window.clearTimeout(savedTimer.current);
    savedTimer.current = window.setTimeout(() => setJustSaved(false), 2000);
  }

  const loadItems = useCallback(async () => {
    setError(null);
    setLoaded(false);
    try {
      const response = await fetch("/api/items");
      if (response.status === 401) {
        setGate("pin");
        return;
      }
      if (!response.ok) {
        setError("Kunde inte hämta listan.");
        return;
      }
      const data = (await response.json()) as {
        demo: boolean;
        items: ActionItem[];
      };
      setDemo(data.demo);
      setItems(data.items);
    } catch {
      setError("Kunde inte hämta listan.");
    } finally {
      setLoaded(true);
    }
  }, []);

  const openBoard = useCallback(
    async (name: TeamMember) => {
      setActor(name);
      setGate("board");
      await loadItems();
    },
    [loadItems],
  );

  const enterAfterPin = useCallback(async () => {
    const stored = readLocalActor();
    if (stored) {
      await openBoard(stored);
      return;
    }
    setGate("name");
  }, [openBoard]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/auth");
        const data = (await response.json()) as { ok: boolean };
        if (cancelled) return;
        if (!data.ok) {
          setGate("pin");
          return;
        }
        await enterAfterPin();
      } catch {
        if (!cancelled) {
          setError("Kunde inte kontrollera sessionen.");
          setGate("pin");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enterAfterPin]);

  useEffect(() => {
    return () => {
      if (savedTimer.current) window.clearTimeout(savedTimer.current);
    };
  }, []);

  function pickName(name: TeamMember) {
    window.localStorage.setItem(ACTOR_STORAGE_KEY, name);
    void openBoard(name);
  }

  async function patchItem(id: string, patch: ItemPatch) {
    if (!actor) return;
    const previous = items;
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              ...patch,
              updated_at: new Date().toISOString(),
              updated_by: actor,
            }
          : item,
      ),
    );
    setSavingId(id);
    setError(null);
    try {
      const response = await fetch("/api/items", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, updated_by: actor, ...patch }),
      });
      if (response.status === 401) {
        setGate("pin");
        return;
      }
      if (!response.ok) {
        setItems(previous);
        setError("Kunde inte spara ändringen.");
        return;
      }
      const data = (await response.json()) as { item: ActionItem };
      setItems((current) =>
        current.map((item) => (item.id === id ? data.item : item)),
      );
      markSaved();
    } catch {
      setItems(previous);
      setError("Kunde inte spara ändringen.");
    } finally {
      setSavingId(null);
    }
  }

  async function addItem() {
    if (!actor) return;
    setError(null);
    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updated_by: actor,
          category: "Okategoriserad",
          action: "Ny åtgärd",
        }),
      });
      if (!response.ok) {
        setError("Kunde inte lägga till åtgärd.");
        return;
      }
      const data = (await response.json()) as { item: ActionItem };
      setItems((current) => [data.item, ...current]);
    } catch {
      setError("Kunde inte lägga till åtgärd.");
    }
  }

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    setLoaded(false);
    setItems([]);
    setGate("pin");
  }

  if (gate === "loading") {
    return (
      <main className="flex flex-1 items-center justify-center px-5">
        <p className="text-sm text-[#9A917F]">Laddar åtgärdstavlan…</p>
      </main>
    );
  }

  if (gate === "pin") {
    return <PinGate onUnlocked={() => void enterAfterPin()} />;
  }

  if (gate === "name" || !actor) {
    return <NamePicker onPick={pickName} />;
  }

  if (!loaded) {
    return (
      <main className="flex flex-1 items-center justify-center px-5">
        <p className="text-sm text-[#9A917F]">Laddar åtgärder…</p>
      </main>
    );
  }

  return (
    <ActionBoard
      actor={actor}
      admin={admin}
      demo={demo}
      items={items}
      savingId={savingId}
      justSaved={justSaved}
      error={error}
      onPatch={patchItem}
      onAdd={addItem}
      onToggleAdmin={() => setAdmin((current) => !current)}
      onChangeActor={() => setGate("name")}
      onLogout={() => void logout()}
    />
  );
}
