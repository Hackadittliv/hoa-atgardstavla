-- House of Awesome / Life Is Awesome – åtgärdstavla
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
  ('00000000-0000-4000-8000-000000000001', 'Lokaler & inredning', 'Göra iordning gym – vad ska Åsa plocka bort', 'Rensa/förbered gymytan; stäm av med Åsa vad som ska bort', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000002', 'Lokaler & inredning', 'PT-rum', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000003', 'Lokaler & inredning', 'Inredning / husgeråd', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000004', 'Lokaler & inredning', 'Sköterskerum', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000005', 'Lokaler & inredning', 'Ett rum + Tobbes rum över', 'Disponera extra rum inkl. Tobbes', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000006', 'Lokaler & inredning', 'Tavlor, blommor, utsmyckning, högtalare', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000007', 'Lokaler & inredning', 'Belysning', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000008', 'Lokaler & inredning', 'Blue light / RA-belysning', 'Tolkning: circadian-/blåljusbelysning – verifiera', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000009', 'Lokaler & inredning', 'TV-apparater', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000010', 'Lokaler & inredning', 'Smink & intimskydd', 'Amenities/förbrukning till toaletter (tolkning)', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000011', 'Lokaler & inredning', 'Åsa & Pajtim samma rum', 'Rumsfördelning', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000012', 'Lokaler & inredning', 'Larm 24/7', 'Säkerhet / passersystem för 24/7', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000013', 'Lokaler & inredning', 'Lås rödljus(rum)', 'Lås / access till rödljusrum', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000014', 'Lokaler & inredning', 'Nya lokalen – då är allt i huset klart', 'Milstolpe', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000015', 'Utrustning & installationer', 'SensoPro?', 'Utvärdera inköp', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000016', 'Utrustning & installationer', 'Installera tryckluftskammare', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000017', 'Utrustning & installationer', 'Vending / kaffemaskin', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000018', 'Utrustning & installationer', 'Eleiko (eller annan?)', 'Gymutrustning – jämför leverantör', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000019', 'Utrustning & installationer', 'PEMF', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000020', 'Utrustning & installationer', 'Scalar', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000021', 'Utrustning & installationer', 'Vattenfilter', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000022', 'Utrustning & installationer', 'Luftrenare', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000023', 'Utrustning & installationer', 'Hörlurar', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000024', 'Digital utveckling', 'Bokningssystem', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000025', 'Digital utveckling', 'Medlemsportal med uppföljning', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000026', 'Digital utveckling', 'Hemsida – utformning', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000027', 'Digital utveckling', 'Ny hemsida för huset', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000028', 'Digital utveckling', 'Tryckluftskammare.se', 'Egen sajt/domän', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000029', 'Digital utveckling', 'Boka direkt', 'Bokadirekt-integration?', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000030', 'Digital utveckling', 'Conversify på hemsidan', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000031', 'Digital utveckling', 'Grossister kopplade mot hemsidan', 'Koppla grossister / e-handel', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000032', 'Digital utveckling', 'Powered by – digital infrastruktur', 'Digital plattform för partnernätverket', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000033', 'Digital utveckling', 'Drömtydningen', 'Digital avläsnings-/självförståelsetjänst', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000034', 'Digital utveckling', 'Medlemsportal kunder – uppföljning m. Claude/AI', 'AI-driven uppföljning', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000035', 'Produkter & tjänster', 'Poängpromenad', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000036', 'Produkter & tjänster', 'Kaffe (eget varumärke)', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000037', 'Produkter & tjänster', 'Produkt- & tjänstekatalog', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000038', 'Produkter & tjänster', 'Medlemskap – upplägg/nivåer', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000039', 'Produkter & tjänster', 'Företagspaket', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000040', 'Produkter & tjänster', 'Smoothie', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000041', 'Produkter & tjänster', 'Produkter på hyllor (retail)', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000042', 'Produkter & tjänster', 'Blodprover – parasit, C-vitamin', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000043', 'Produkter & tjänster', 'Challenge företag', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000044', 'Produkter & tjänster', 'Oura', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000045', 'Produkter & tjänster', 'Pulsetto, BrainTap m.fl.', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000046', 'Produkter & tjänster', 'Kokbok', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000047', 'Produkter & tjänster', 'DNA-test & Parasitkliniken', 'Lägg på hemsidan under Provtagning', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000048', 'Produkter & tjänster', 'Vätevatten', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000049', 'Produkter & tjänster', 'Online PT longevity', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000050', 'Produkter & tjänster', 'Seniorgympa', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000051', 'Produkter & tjänster', 'Uteträning', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000052', 'Produkter & tjänster', 'Slinga Stora Höga', 'Ev. i samarbete med kommunen', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000053', 'Produkter & tjänster', 'Årlig hälsokontroll', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000054', 'Produkter & tjänster', 'Scalar Celloxy-test', 'Diagnostiskt test', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000055', 'Produkter & tjänster', 'Friskvårdsbidrag', 'Gör tjänster friskvårdsberättigade', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000056', 'Marknadsföring & varumärke', 'Marknadsföring (övergripande plan)', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000057', 'Marknadsföring & varumärke', 'Logga ''House of Awesome''', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000058', 'Marknadsföring & varumärke', 'Optimera hemsidans synlighet', 'SEO / synlighet', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000059', 'Marknadsföring & varumärke', 'Skärmar Hemköp – uppdatera', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000060', 'Marknadsföring & varumärke', 'Skyltar & kommunen', 'Skyltlov', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000061', 'Marknadsföring & varumärke', 'Skyltar ''cirkus''', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000062', 'Marknadsföring & varumärke', 'Visitkort', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000063', 'Marknadsföring & varumärke', 'Goodiebag', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000064', 'Marknadsföring & varumärke', 'Fotosession', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000065', 'Marknadsföring & varumärke', 'Kläder, vattenflaskor, kopparflaska', 'Profilprodukter / merch', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000066', 'Sociala medier & content', 'Sociala medier (övergripande plan)', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000067', 'Sociala medier & content', 'Poddar – sätt dagar', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000068', 'Sociala medier & content', 'Poddstudio', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000069', 'Sociala medier & content', 'Dagens P.S.', 'Dagligt inlägg/tips', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000070', 'Sociala medier & content', 'Byt Instagram från AB', 'Byt konto från AB:t', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000071', 'Sociala medier & content', 'Lukas tjänster – hemsida/foto', 'Media/content via Lucas', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000072', 'Försäljning', 'Leads – ringa', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000073', 'Försäljning', 'Säljare: Markus, Andreas, Linus', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000074', 'Försäljning', 'Provisionsupplägg säljare', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000075', 'Samarbeten & partners', 'Frisörer', 'Hyresgäster/samarbete i huset', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000076', 'Samarbeten & partners', 'Nyttoteket', 'Leverantör/samarbete – verifiera', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000077', 'Samarbeten & partners', 'Edura', 'Leverantör/samarbete – verifiera', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000078', 'Samarbeten & partners', 'Besöka Age Back', 'Studiebesök / benchmark', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000079', 'Samarbeten & partners', 'Idrottsklubbar & föreningar', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000080', 'Samarbeten & partners', 'West Coast Bike', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000081', 'Samarbeten & partners', 'Erik Primal', 'Extern coach/samarbete – verifiera', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000082', 'Samarbeten & partners', 'Cera Thrive', 'Leverantör/varumärke – verifiera', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000083', 'Samarbeten & partners', 'Hocatt, Carol Morozko, OneBase, Vasper, ARX', 'Avtal & prislistor för behandlingsutrustning', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000084', 'Avtal & juridik', 'Hyresavtal terapeuter', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000085', 'Avtal & juridik', 'Försäkring', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000086', 'Avtal & juridik', 'Fysio – sjukförsäkringen', 'Bli godkänd vårdgivare hos försäkringsbolag', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000087', 'Ekonomi', 'Ekonomi (budget/övergripande)', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000088', 'Ekonomi', 'Leasingar / skjuta lån', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000089', 'Ekonomi', 'Hyresrabatt', 'Förhandla', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000090', 'Personal, coacher & kompetens', 'Pajtim', 'Roll/onboarding – förtydliga', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000091', 'Personal, coacher & kompetens', 'Coachning longevity – lär upp Lucas', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000092', 'Personal, coacher & kompetens', 'Fler coacher: yoga, meditation, breathwork', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000093', 'Event, mässor & PR', 'Event/workshops, konferens, hotell', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000094', 'Event, mässor & PR', 'Bjud in lokal press', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000095', 'Event, mässor & PR', 'Influencer-dag', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000096', 'Event, mässor & PR', 'Mässor/event/träffar att delta på', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000097', 'Event, mässor & PR', 'Event som ''Nordic'' med våra grejer', 'Eget event i Nordic-stil', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000098', 'Drift & rutiner', 'Synka kalender', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000099', 'Drift & rutiner', 'Daglig digital möte – tid & struktur', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000100', 'Drift & rutiner', 'Gemensam WhatsApp', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000101', 'Drift & rutiner', 'Dagar i huset – alla', 'Sätt gemensamma närvarodagar', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000102', 'Drift & rutiner', 'Städfirma', NULL, NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000103', 'Drift & rutiner', 'Vad gör vi varje dag framåt', 'Definiera daglig drift', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000104', 'Drift & rutiner', 'Öppningsdatum', 'Sätt datum (milstolpe)', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000105', 'Okategoriserad', 'Hemsund', 'Oklart – förtydliga', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000106', 'Okategoriserad', 'Kuala Lumpur', 'Oklart – ev. studieresa?', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000107', 'Okategoriserad', 'Beat 2', 'Oklart – förtydliga', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL),
  ('00000000-0000-4000-8000-000000000108', 'Okategoriserad', 'IR / booylab / vilopunkt / våra tjänster', 'Blandad punkt – dela upp/förtydliga', NULL, NULL, NULL, 'Ej påbörjad', NULL, NULL)
on conflict (id) do nothing;
