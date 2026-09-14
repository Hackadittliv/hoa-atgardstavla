"use client";

import { Button } from "@/components/ui/button";
import { TEAM_MEMBERS, type TeamMember } from "@/lib/types";

export function NamePicker({
  onPick,
}: {
  onPick: (name: TeamMember) => void;
}) {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-lg flex-1 flex-col justify-center px-5 py-16">
      <p className="text-xs tracking-[0.28em] text-[#D4AF5F]">HOUSE OF AWESOME</p>
      <h1 className="mt-3 font-serif text-4xl text-[#F3EDE0]">Vem är du?</h1>
      <p className="mt-3 text-sm leading-6 text-[#9A917F]">
        Ditt namn sparas lokalt och skrivs som den som senast ändrade en rad.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {TEAM_MEMBERS.map((name) => (
          <Button
            key={name}
            variant="outline"
            size="lg"
            className="justify-start"
            onClick={() => onPick(name)}
          >
            {name}
          </Button>
        ))}
      </div>
    </main>
  );
}
