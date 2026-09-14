export const TEAM_MEMBERS = [
  "Lucas",
  "Alexandra",
  "Christian",
  "Patrik",
] as const;

export const OWNERS = [
  "Lucas",
  "Alexandra",
  "Christian",
  "Patrik",
  "Åsa",
  "Extern",
] as const;

export const STATUSES = ["Ej påbörjad", "Pågår", "Klar", "Vilande"] as const;

export const PRIORITIES = [1, 2, 3] as const;

export type TeamMember = (typeof TEAM_MEMBERS)[number];
export type Owner = (typeof OWNERS)[number];
export type Status = (typeof STATUSES)[number];
export type Priority = (typeof PRIORITIES)[number];

export type ActionItem = {
  id: string;
  category: string;
  action: string;
  note: string;
  owner: string | null;
  priority: number | null;
  due_date: string | null;
  status: Status;
  updated_at: string | null;
  updated_by: string | null;
};

export type ItemPatch = Partial<
  Pick<
    ActionItem,
    | "category"
    | "action"
    | "note"
    | "owner"
    | "priority"
    | "due_date"
    | "status"
  >
>;

export type ItemsResponse = {
  demo: boolean;
  items: ActionItem[];
};

export const ACTOR_STORAGE_KEY = "hoa_updated_by";
