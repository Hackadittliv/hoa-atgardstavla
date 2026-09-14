import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUpdatedAt(value: string | null): string {
  if (!value) return "–";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "–";
  return new Intl.DateTimeFormat("sv-SE", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function toDateInputValue(value: string | null): string {
  if (!value) return "";
  const compact = value.trim();
  const match = compact.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
    ?? compact.match(/^(\d{4})(\d{2})(\d{2})$/)
    ?? compact.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return "";
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return "";
  }
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function isOverdue(dueDate: string | null, status: string): boolean {
  const day = toDateInputValue(dueDate);
  if (!day || status === "Klar") return false;
  return day < new Date().toISOString().slice(0, 10);
}
