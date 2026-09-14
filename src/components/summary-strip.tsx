import { STATUSES, type ActionItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<string, string> = {
  "Ej påbörjad": "text-[#C9C0AE]",
  Pågår: "text-[#D4AF5F]",
  Klar: "text-[#8FBF8A]",
  Vilande: "text-[#8AA0BF]",
};

export function SummaryStrip({ items }: { items: ActionItem[] }) {
  const openPrio1 = items.filter(
    (item) => item.priority === 1 && item.status !== "Klar",
  ).length;

  return (
    <section className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {STATUSES.map((status) => {
        const count = items.filter((item) => item.status === status).length;
        return (
          <div
            key={status}
            className="rounded-lg border border-[#2A261C] bg-[#141210] px-3 py-2.5"
          >
            <p className="text-[11px] uppercase tracking-wide text-[#7A7364]">
              {status}
            </p>
            <p className={cn("mt-1 text-xl font-semibold", STATUS_TONE[status])}>
              {count}
            </p>
          </div>
        );
      })}
      <div className="rounded-lg border border-[#D4AF5F]/35 bg-[#D4AF5F]/10 px-3 py-2.5">
        <p className="text-[11px] uppercase tracking-wide text-[#D4AF5F]">
          Öppna prio 1
        </p>
        <p className="mt-1 text-xl font-semibold text-[#F3EDE0]">{openPrio1}</p>
      </div>
    </section>
  );
}
