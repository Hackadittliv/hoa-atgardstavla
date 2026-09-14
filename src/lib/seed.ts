import seedItems from "../../data/seed.json";
import type { ActionItem } from "@/lib/types";

export function loadSeedItems(): ActionItem[] {
  return structuredClone(seedItems) as ActionItem[];
}
