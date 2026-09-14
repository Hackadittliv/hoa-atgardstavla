# Åtgärdstavla · House of Awesome

Delad åtgärdslista för **Life Is Awesome / House of Awesome**. Ersätter Excel-listan.

Lucas, Alexandra, Christian och Patrik öppnar samma URL, anger pinkod, väljer vem de är och redigerar samma live-lista.

## Köra lokalt

Kräver **Node 20+**.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Öppna [http://127.0.0.1:43147](http://127.0.0.1:43147).

Utan Supabase-nycklar startar appen i **demo**: seedad lista, ändringar bara i minnet, banner *Demo – ej delat*.

Standardpinkod när `ACCESS_PIN` saknas: `awesome`.

```bash
npm run typecheck
npm run build
```

## Miljövariabler

| Variabel | Var | Syfte |
|---|---|---|
| `ACCESS_PIN` | server | Delad pinkod. Sätts i Netlify / `.env.local`. Aldrig i klientkod. |
| `NEXT_PUBLIC_SUPABASE_URL` | server (namnet är låst) | Supabase-projektets URL. Tom = demo. |
| `SUPABASE_SERVICE_ROLE_KEY` | server | Service role. Används bara i `/api/items`. **Inte** anon-nyckeln. |

Pinkod och service role stannar på servern. Klienten pratar bara med `/api/auth` och `/api/items`.

## Supabase

1. Skapa ett projekt.
2. Kör `supabase/schema.sql` i SQL Editor (tabell + ~108 seed-rader).
3. Kopiera Project URL och **service_role** till env ovan.
4. Redeploy / starta om `npm run dev`.

Tabellen `action_items` har RLS påslaget utan anon-policies. Appen skriver med service role via API-routes.

Seedkällan är `data/seed.csv` (exakt export). `data/seed.json` och SQL-inserts genereras med:

```bash
npm run generate-seed
```

## Netlify

1. Koppla repot. Build: `npm run build`, publish: `.next` (`netlify.toml` + `@netlify/plugin-nextjs`).
2. Sätt `ACCESS_PIN`, och när ni är redo `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`.
3. Node 20 är låst i `netlify.toml`.

Utan Supabase-env är produktionspreview också demo – bra att klicka igenom, inte för gemensam redigering.

## Användning

1. Pinkod → välj namn (sparas i `localStorage` som `updated_by`).
2. Filter: Alla / Mina / kategori / status / Prio 1 + sök.
3. Redigera ansvarig, prio, datum, status och anteckning. Kategori och åtgärd är låsta tills **Admin** slås på (av som standard).
4. Ändringar sparas direkt (optimistiskt). Varje rad visar vem som ändrade senast och när.

## API

- `GET /api/auth` – session?
- `POST /api/auth` `{ pin }` – sätter httpOnly-cookie
- `DELETE /api/auth` – lås
- `GET /api/items` – lista (`{ demo, items }`)
- `PATCH /api/items` `{ id, updated_by, ...fält }`
- `POST /api/items` `{ updated_by, category?, action?, ... }` – ny rad (Admin → Ny åtgärd)
