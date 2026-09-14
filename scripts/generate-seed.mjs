import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  const input = text.replace(/^\uFEFF/, "");

  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (inQuotes) {
      if (c === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c !== "\r") {
      field += c;
    }
  }

  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  const header = rows[0].map((h) => h.trim());
  return rows
    .slice(1)
    .filter((r) => r.some((cell) => cell.trim()))
    .map((r) => {
      const obj = {};
      header.forEach((key, i) => {
        obj[key] = (r[i] ?? "").trim();
      });
      return obj;
    });
}

function seedUuid(n) {
  return `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
}

function sqlStr(value) {
  if (value == null || value === "") return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

const csv = readFileSync(join(root, "data/seed.csv"), "utf8");
const rows = parseCsv(csv);

const items = rows.map((row, index) => ({
  id: seedUuid(index + 1),
  category: row.category,
  action: row.action,
  note: row.note || "",
  owner: row.owner || null,
  priority: row.priority ? Number(row.priority) : null,
  due_date: row.due_date || null,
  status: row.status || "Ej påbörjad",
  updated_at: null,
  updated_by: null,
}));

writeFileSync(join(root, "data/seed.json"), `${JSON.stringify(items, null, 2)}\n`);

const values = items
  .map(
    (item) =>
      `  (${sqlStr(item.id)}, ${sqlStr(item.category)}, ${sqlStr(item.action)}, ${sqlStr(item.note)}, ${sqlStr(item.owner)}, ${item.priority ?? "NULL"}, ${sqlStr(item.due_date)}, ${sqlStr(item.status)}, NULL, NULL)`,
  )
  .join(",\n");

const schema = `-- House of Awesome / Life Is Awesome – åtgärdstavla
-- Kör hela filen i Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.action_items (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  action text not null,
  note text not null default '',
  owner text,
  priority integer,
  due_date date,
  status text not null default 'Ej påbörjad',
  updated_at timestamptz,
  updated_by text,
  constraint action_items_status_check
    check (status in ('Ej påbörjad', 'Pågår', 'Klar', 'Vilande')),
  constraint action_items_priority_check
    check (priority is null or priority in (1, 2, 3)),
  constraint action_items_owner_check
    check (
      owner is null
      or owner in ('Lucas', 'Alexandra', 'Christian', 'Patrik', 'Åsa', 'Extern', '')
    )
);

create index if not exists action_items_category_idx on public.action_items (category);
create index if not exists action_items_status_idx on public.action_items (status);
create index if not exists action_items_owner_idx on public.action_items (owner);
create index if not exists action_items_priority_idx on public.action_items (priority);

alter table public.action_items enable row level security;

-- Service role kringgår RLS. Inga policies för anon i Drop 1:
-- appen skriver bara via /api/items med SUPABASE_SERVICE_ROLE_KEY.

insert into public.action_items (
  id, category, action, note, owner, priority, due_date, status, updated_at, updated_by
) values
${values}
on conflict (id) do nothing;
`;

mkdirSync(join(root, "supabase"), { recursive: true });
writeFileSync(join(root, "supabase/schema.sql"), schema);
console.log(`Generated ${items.length} seed items`);
