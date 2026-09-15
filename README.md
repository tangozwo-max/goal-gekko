# Goal-Gekko

Career strategy board: destinations, the steps between them, and the
connections that link them. An [Astro](https://astro.build) site deployed to
Vercel at <https://gekko.riosiera.de>.

## Two modes

**Browser Mode** is the default and needs no account. The board lives in
`localStorage` under `career-board:local` and never reaches a server. This is
what an unauthenticated visitor sees, seeded with an example board.

**Login Mode** signs in with Google and syncs the board to Supabase, so it
follows you between devices. A local mirror is kept under
`career-board:<user-id>` as well.

## Supabase

The data lives in the Rio Siera hub project `wpfgbnwbdmmgacjllsza`, in the
`gekko` schema — three tables, `boards`, `nodes` and `edges`, each row owned by
one user and fenced off by row level security.

Before September 2026 this ran on `stfbdglkexcsgtfphvha`, sharing `auth.users`
with Career-Cobra. `supabase/migrations/` still holds the schema and the data
import from that era; the move to the hub is scripted in the `riosiera`
repository under `sql/cutover/02_gekko_*.sql`.

Access to the cloud board is gated on `riosiera.has_app_access('gekko')`, so
revoking Goal-Gekko in the Rio Siera admin area closes it. Browser Mode is not
affected — it never talks to the database.

## Environment

| Variable | Where | What |
|---|---|---|
| `PUBLIC_SUPABASE_URL` | build | Hub project URL |
| `PUBLIC_SUPABASE_KEY` | build | Hub anon key |
| `ANTHROPIC_API_KEY` | server | `api/chat.js` and `api/report.js` |

Both `PUBLIC_` variables are read at build time and inlined into the bundle, so
they must be set in **every** Vercel environment that builds the app, Preview
included — `astro.config.mjs` fails the build when either is missing, which is
deliberate: a missing key otherwise produces a silently login-less site rather
than a failed deploy. They are not secrets; the anon key is public by design
and row level security is what protects the data.

`ANTHROPIC_API_KEY` is a real secret and is only ever read server-side in the
two functions under `api/`.

## Development

```bash
npm install
npm run dev      # localhost:4321
npm run build
```
