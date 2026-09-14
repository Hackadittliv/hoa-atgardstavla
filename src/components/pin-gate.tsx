"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PinGate({ onUnlocked }: { onUnlocked: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (!response.ok) {
        setError("Fel pinkod. Försök igen.");
        return;
      }
      onUnlocked();
    } catch {
      setError("Kunde inte nå servern. Försök igen.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-1 flex-col justify-center px-5 py-16">
      <p className="text-xs tracking-[0.28em] text-[#D4AF5F]">HOUSE OF AWESOME</p>
      <h1 className="mt-3 font-serif text-4xl text-[#F3EDE0]">Åtgärdstavla</h1>
      <p className="mt-3 text-sm leading-6 text-[#9A917F]">
        Delad lista för Life Is Awesome. Ange pinkoden för att öppna tavlan.
      </p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block text-sm text-[#C9C0AE]">
          Pinkod
          <Input
            className="mt-2"
            type="password"
            autoComplete="current-password"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            autoFocus
          />
        </label>
        {error ? <p className="text-sm text-[#E8A0A0]">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={pending || !pin.trim()}>
          {pending ? "Öppnar…" : "Fortsätt"}
        </Button>
      </form>
    </main>
  );
}
