# PromptNX Backend Kickoff

This note captures how we will stand up the SaaS backend on top of our Supabase project at [supabase.com/dashboard/project/tjzdvneheryyhsgdlovm](https://supabase.com/dashboard/project/tjzdvneheryyhsgdlovm). Every change should flow **repo → Supabase** so we can diff, review, and roll back confidently.

---

## 0. Environment + Secrets

1. Duplicate `.env.example` into `.env` (backend) and `.env.local` (frontend) with:
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`
   - `RESEND_*`, provider API keys, etc.
2. Never paste keys in code; rely on environment variables or Supabase secrets.
3. Backend runs via `pnpm --filter pnx-backend dev` (or `npm run dev` inside `PNX-main/backend`).

---

## 1. Database as Code (Supabase)

* Source of truth lives in `supabase/schema.sql`. To sync:
  1. Edit the file.
  2. Copy/paste into the Supabase SQL editor (or run `supabase db push` if CLI is configured locally).
  3. Document any data migrations (e.g., seed scripts) under `supabase/seeds/` when needed.

* What’s in the initial schema:
  - Profiles + seller metadata (ties into `auth.users`).
  - Prompts, versions, assets, favorites.
  - Orders, order items, payouts, reviews.
  - Chat threads, notifications, audit logs, and storage policies.
  - Opinionated RLS defaults so public data stays public while seller/buyer actions remain scoped to `auth.uid()`.

* Next DB steps (after QA):
  - Seed starter categories + demo prompts via SQL inserts.
  - Wire Supabase Functions/Triggers for things like payout accruals and review eligibility checks.

---

## 2. Runtime wiring (Express backend)

We already have an Express server (`PNX-main/backend/index.ts`) that handles OTPs plus AI proxying. We’ll expand it into our API gateway:

1. Add a reusable Supabase admin client (service role) under `backend/lib/supabase.ts`.
2. Create modules for core domains:
   - `routes/auth.ts`: session checks, profile hydration.
   - `routes/prompts.ts`: CRUD + search backed by Supabase RPC/filters.
   - `routes/orders.ts`: checkout intents, fulfillment webhooks, payout ledger.
3. Use the service role key only on the server (never ship it to the browser).
4. Keep domain logic in `backend/services/*` so we can reuse with Edge Functions later if needed.

---

## 3. Implementation order

1. **Auth handshake**  
   - Hydrate `profiles` on signup.  
   - Mirror OTP login → Supabase session once we decide on primary auth (Supabase email magic link or Resend OTP).
   - ✅ `/api/profiles/sync` (service-role route) creates/updates both `profiles` and `seller_profiles` right after Supabase auth.

2. **Marketplace data**  
   - `/api/prompts` GET (public listing).  
   - ✅ `/api/sellers/:id/dashboard` returns seller KPIs, lifecycle status, payouts, notifications, and feedback derived from Supabase tables.  
   - `/api/prompts/:id/purchase-state` (does the buyer own it?).

3. **Commerce flow**  
   - `/api/orders` POST creates Supabase order + returns payment intent info.  
   - Webhook handler marks orders paid and unlocks prompt assets (leverages `order_items` + `prompt_assets`).

4. **Collaboration**  
   - `/api/chat` endpoints reading/writing Supabase chat tables.  
   - Notification fan-out (Supabase `realtime` can broadcast to the frontend).

Ship each slice end-to-end (DB + API + UI) before moving on so we keep integration risk low.

---

## 4. Operational notes

- Prefer Supabase Row Level Security + service role combo instead of re-implementing ACLs in Express.
- Add regression tests (Vitest/Jest) that stub Supabase via `@supabase/supabase-js` mocks.
- Once critical endpoints stabilize, move them into Supabase Edge Functions for better latency and automatic auth context.

Ping here whenever schema/API decisions change so future contributors have a single living document.


