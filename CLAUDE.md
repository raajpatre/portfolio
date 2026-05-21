# CLAUDE.md — Portfolio Project Context

> Claude Code reads this file at the start of every session.
> Do not delete or rename this file. Update it when architecture decisions change.

---

## What This Project Is

Personal portfolio website for Raaj Patre. Full-stack, CMS-backed, gamified pixel-art RPG theme.
Two portals: a public-facing portfolio and a private admin CMS for content management.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14, App Router, TypeScript (strict mode) |
| Styling | Tailwind CSS with custom design tokens |
| Animations | GSAP + ScrollTrigger, Framer Motion |
| Database | Supabase (Postgres + Auth) |
| Image storage | Cloudinary (signed uploads only) |
| Admin auth | Supabase Auth, single-user, session-based |
| Deployment | Vercel |
| Fonts | Press Start 2P (pixel headers), JetBrains Mono (body) |
| Particles | tsParticles |

---

## Project Structure

```
app/
  (public)/              ← public portal route group
    layout.tsx
    page.tsx             ← home + welcome screen
    projects/page.tsx
    about/page.tsx       ← hardcoded, scroll-driven
    certificates/page.tsx
    feed/page.tsx
    contact/page.tsx
  admin/                 ← password-protected CMS
    layout.tsx
    login/page.tsx
    page.tsx             ← dashboard
    projects/page.tsx
    certificates/page.tsx
    feed/page.tsx
  api/
    admin/
      projects/route.ts
      certificates/route.ts
      feed/route.ts
    cloudinary/
      sign/route.ts
  globals.css
lib/
  supabase/
    client.ts            ← browser client (anon key only)
    server.ts            ← server client (anon key, uses cookies)
    admin.ts             ← service role client — SERVER ONLY
  cloudinary.ts          ← server-only Cloudinary config
  validation/
    projects.ts          ← Zod schema
    certificates.ts      ← Zod schema
    feed.ts              ← Zod schema
components/
  public/                ← public site components
  admin/                 ← admin CMS components
  ui/                    ← shared primitives
data/
  about.ts               ← hardcoded about page content (NOT from DB)
middleware.ts            ← protects all /admin/* routes
```

---

## Design System

### Colors (Tailwind custom tokens — already in tailwind.config.ts)

```
bg-base:        #0a0c1a   ← default background everywhere
bg-surface:     #12152b   ← cards, panels
bg-elevated:    #1a1e38   ← hover states
text-primary:   #e8e8f0
text-muted:     #6b7094
accent-gold:    #f5c542   ← legendary/featured items, primary CTAs
accent-violet:  #7c6df5   ← interactive elements, links
accent-teal:    #3dd6ac   ← shipped/success states
accent-red:     #f55c5c   ← in-progress/danger
border-pixel:   #2a2d4a   ← card borders
```

### Typography

- `font-pixel` (Press Start 2P): section titles, stat labels, status badges, dialogue boxes only. Never below 10px. Never for body text.
- `font-mono` (JetBrains Mono): everything else — body, descriptions, tags, timestamps.

### Pixel Border Pattern

```css
/* Standard */
border: 2px solid var(--border-pixel);

/* Hover — violet glow */
box-shadow: 0 0 12px var(--accent-violet), 0 0 0 1px var(--accent-violet);

/* Legendary — gold glow */
box-shadow: 0 0 16px var(--accent-gold), 0 0 0 1px var(--accent-gold);
```

---

## UI Handoff Context

The UI was designed separately in Claude Design and exported as component files.
The task is to wire these UI components into the existing Next.js project — replacing
placeholder content with real data, hooking up Supabase reads, and connecting admin forms
to API routes.

### UI Files Location
The designed UI components are in: `/ui-handoff/` (unzipped from Claude Design export)

### Wiring Rules
1. Do NOT rewrite the UI components from scratch. Wire them as-is.
2. If a UI component needs a prop that doesn't exist yet, add it — don't restructure the component.
3. If a UI component's structure conflicts with a security requirement, fix the security issue
   in the data layer — not by changing the UI structure.
4. Keep component files in `components/public/` or `components/admin/` as appropriate.
5. Shared primitives (PixelButton, DialogueBox, StackTag, etc.) go in `components/ui/`.

---

## Security Rules — NON-NEGOTIABLE

These apply to every task in every session. Any code that violates these must be rewritten
before moving on.

### 1. Server/Client Boundary

- `lib/supabase/admin.ts` starts with `import 'server-only'` — never import it in a client component or page. Only in API route handlers and server actions.
- `lib/cloudinary.ts` starts with `import 'server-only'` — same rule.
- `SUPABASE_SERVICE_ROLE_KEY` must only appear in `lib/supabase/admin.ts` and `.env.example`.
- `CLOUDINARY_API_SECRET` must only appear in `lib/cloudinary.ts` and `.env.example`.
- After any wiring session, run: `grep -r "SERVICE_ROLE" .next/static/` — must return nothing.

### 2. Supabase / Database

- RLS is enabled on all tables. Do not disable it.
- Public reads use `lib/supabase/server.ts` (anon key). This is correct and intentional.
- All writes (INSERT/UPDATE/DELETE) go through API routes using `lib/supabase/admin.ts` (service role).
- Never write directly to Supabase from a client component.
- Never construct raw SQL by string concatenation. Use the Supabase JS client methods only.

### 3. Admin Route Protection

- `middleware.ts` protects all `/admin/*` routes.
- Every `/api/admin/*` route handler verifies session AND checks email === `process.env.ADMIN_EMAIL` before any logic.
- These checks must be the first thing in every admin route handler — before parsing body, before DB calls.
- Template:
  ```ts
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.email !== process.env.ADMIN_EMAIL) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  ```

### 4. Cloudinary Uploads

- Use signed uploads only. Flow:
  1. Client calls `/api/cloudinary/sign` (auth-checked server route)
  2. Server generates signature, returns `{ signature, timestamp, apiKey, cloudName, folder }`
  3. Client uploads directly to Cloudinary with that signature
  4. Returned `secure_url` is saved to Supabase via another auth-checked API route
- The sign route validates:
  - Admin session exists
  - `folder` param is in the allowlist (`raaj-portfolio/projects`, `raaj-portfolio/certificates`)
  - Never expose `CLOUDINARY_API_SECRET` or `CLOUDINARY_API_KEY` to the client

### 5. Input Validation

- All API route inputs validated with Zod schemas from `lib/validation/`.
- Validate on the server. Client validation is UX only.
- Schemas already exist — use them, don't rewrite them.

### 6. General

- No `console.log` of session tokens, keys, or request bodies.
- TypeScript strict mode is on. No `any` without a comment explaining why.
- No new npm packages without flagging it first and stating the reason.

---

## Database Schema

```sql
projects (
  id            uuid PK,
  title         text NOT NULL,
  tagline       text NOT NULL,
  description   text NOT NULL,
  stack         text[],
  live_url      text,
  repo_url      text,
  screenshots   text[],        ← Cloudinary URLs
  status        text CHECK (status IN ('shipped','in_progress')),
  featured      boolean DEFAULT false,
  created_at    timestamptz DEFAULT now()
)

certificates (
  id            uuid PK,
  title         text NOT NULL,
  issuer        text NOT NULL,
  issued_date   date NOT NULL,
  credential_url text,
  image_url     text,           ← Cloudinary URL
  created_at    timestamptz DEFAULT now()
)

feed_entries (
  id            uuid PK,
  content       text NOT NULL,
  category      text CHECK (category IN ('win','launch','event','contribution')),
  entry_date    date NOT NULL,
  link_url      text,
  created_at    timestamptz DEFAULT now()
)
```

RLS: enabled on all three tables. Public SELECT allowed. No public write policies.

---

## Data Fetching Patterns

### Public pages — read from Supabase server-side

```ts
// In a server component (app/(public)/projects/page.tsx)
import { createServerClient } from '@/lib/supabase/server'

const supabase = createServerClient()
const { data: projects } = await supabase
  .from('projects')
  .select('*')
  .order('created_at', { ascending: false })
```

Add `export const revalidate = 60` to public data-fetching pages.

### Admin pages — same anon client for reads, API routes for writes

```ts
// Reads in admin pages: same anon server client (RLS public read allows it)
// Writes: fetch('/api/admin/projects', { method: 'POST', body: ... })
```

### About page — NO Supabase

`/about` is fully hardcoded. All content lives in `data/about.ts`. Do not add DB calls here.

---

## What's Hardcoded vs DB-Driven

| Content | Source |
|---|---|
| Projects | Supabase DB |
| Certificates | Supabase DB |
| Feed entries | Supabase DB |
| About / resume content | `data/about.ts` — hardcoded |
| Nav links | Hardcoded in `components/public/Nav.tsx` |
| Color system | `tailwind.config.ts` |
| Resume PDF | `/public/resume/raaj-patre-resume.pdf` — static asset |

---

## Welcome Screen Behavior

- Show fullscreen overlay on first visit only
- localStorage key: `'rp-welcomed'`, value: `'1'`
- On "Enter Portfolio" click: set flag, fade out overlay
- On subsequent visits: skip overlay entirely, render hero directly
- Character sprite: `/public/character/idle.png` — placeholder until commissioned sprite arrives

---

## Environment Variables

All defined in `.env.local` (local) and Vercel project settings (production).

```
NEXT_PUBLIC_SUPABASE_URL          ← public
NEXT_PUBLIC_SUPABASE_ANON_KEY     ← public
SUPABASE_SERVICE_ROLE_KEY         ← server-only
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ← public
CLOUDINARY_API_KEY                ← server-only
CLOUDINARY_API_SECRET             ← server-only
ADMIN_EMAIL                       ← server-only
```

---

## Current Status

- [x] Phase 1: Foundation — project scaffolded, schema migrated, env configured
- [x] Phase 2: Admin Portal — CRUD working, Cloudinary upload working, auth working
- [x] Phase 3: Public Site — pages rendering with real data from Supabase
- [x] Phase 4: About Page — scroll experience built
- [x] Phase 5: Deployed to Vercel, custom domain live
- [ ] UI Wiring — Claude Design components need to replace current placeholder UI

---

## Known Decisions + Why (do not second-guess these)

| Decision | Reason |
|---|---|
| Cloudinary over Supabase Storage | Better image transformations (f_auto, q_auto) out of the box |
| Signed uploads (not unsigned presets) | Security — unsigned presets are exploitable |
| Hardcoded about page | Content changes rarely; no admin overhead worth it |
| Service role only in API routes | Prevents accidental client-side secret exposure |
| Single admin user model | It's a personal portfolio. No multi-user complexity needed. |
| `revalidate = 60` on public pages | Content updates propagate within 1 min without a full rebuild |
| No contact form backend | mailto: is sufficient; no infra, no spam handling needed |

---

## How to Start a New Claude Code Session

At the beginning of every session, say:

> "Read CLAUDE.md for full project context before doing anything."

Then describe the specific task for that session. Claude Code will have all the context
it needs without re-explaining the stack, design decisions, or security rules.

---

## Wiring Session Task Prompts

Use these to start each wiring session precisely.

### Session W1 — Wire Global Components + Nav
```
Read CLAUDE.md. 

Task: Wire the global UI components from /ui-handoff/ into the project.

1. Move these components to components/ui/:
   PixelButton, DialogueBox, StackTag, StatusBadge, SectionHeader
2. Move Nav.tsx to components/public/Nav.tsx
   Wire active route highlighting using usePathname()
   Wire mobile menu open/close state
3. Move Footer.tsx to components/public/Footer.tsx
4. Update app/(public)/layout.tsx to use Nav and Footer
5. Verify: pnpm build passes, nav renders on all public pages,
   active link highlights correctly, mobile menu opens/closes.

Security check: no new API calls, no new env var usage. These are pure UI components.
```

### Session W2 — Wire Welcome Screen + Hero
```
Read CLAUDE.md.

Task: Wire the Welcome Screen and Hero from /ui-handoff/ into app/(public)/page.tsx.

1. Move WelcomeScreen.tsx to components/public/WelcomeScreen.tsx
   Wire localStorage check: key 'rp-welcomed'
   On Enter Portfolio click: set flag, trigger fade-out transition
   Character image: use /public/character/idle.png (placeholder)
2. Move Hero.tsx to components/public/Hero.tsx
   No data fetching needed — hero content is static
3. Move FeaturedProjects.tsx to components/public/FeaturedProjects.tsx
   Wire to Supabase: fetch projects WHERE featured = true, ORDER BY created_at DESC, LIMIT 3
   Use lib/supabase/server.ts (anon key) in the page server component, pass data as props
4. Update app/(public)/page.tsx to compose these three components
   Add export const revalidate = 60
   
Security check: data fetch uses anon client (server component), no service role usage here.
```

### Session W3 — Wire Quest Board (/projects)
```
Read CLAUDE.md.

Task: Wire the projects page from /ui-handoff/.

1. Move QuestBoard.tsx to components/public/QuestBoard.tsx (client component — has filters)
2. Move ProjectCard.tsx to components/public/ProjectCard.tsx
3. Move StackTag.tsx to components/ui/ (if not already done in W1)
4. In app/(public)/projects/page.tsx (server component):
   Fetch all projects from Supabase using lib/supabase/server.ts
   Pass to QuestBoard as props
   Add export const revalidate = 60
5. Wire QuestBoard filters: status filter + stack tag filter work client-side on the passed data
   No re-fetching on filter — filter the prop data in state
6. Wire ProjectCard: live_url and repo_url open in new tab with rel="noopener noreferrer"

Security check: all fetching server-side, anon key, no client-side Supabase calls.
```

### Session W4 — Wire Certificates + Feed
```
Read CLAUDE.md.

Task: Wire certificates and feed pages from /ui-handoff/.

CERTIFICATES:
1. Move AchievementCard.tsx, AchievementGrid.tsx to components/public/
2. In app/(public)/certificates/page.tsx:
   Fetch all certificates from Supabase, pass to AchievementGrid
   Add export const revalidate = 60
3. Wire credential_url on card back-face button (open in new tab)

FEED:
1. Move BattleLog.tsx, BattleLogEntry.tsx to components/public/
2. In app/(public)/feed/page.tsx:
   Fetch all feed_entries ORDER BY entry_date DESC, pass to BattleLog
   Add export const revalidate = 60
3. Wire category filter in BattleLog (client-side, same pattern as QuestBoard)
4. Wire link_url on entries that have it

Security check: all server-side fetching, anon key only.
```

### Session W5 — Wire About Page
```
Read CLAUDE.md.

Task: Wire the About page from /ui-handoff/.

IMPORTANT: This page has NO database calls. All content comes from data/about.ts.

1. Verify data/about.ts has correctly typed exports for all 5 chapters
2. Move AboutDesktop.tsx and AboutMobile.tsx to components/public/
3. In app/(public)/about/page.tsx:
   Import content from data/about.ts
   Detect viewport and render appropriate component (useEffect + matchMedia in a client wrapper)
   OR use CSS (hidden/visible classes) for the switch — prefer CSS if feasible
4. Wire GSAP ScrollTrigger in AboutDesktop.tsx
   Import GSAP dynamically: const gsap = (await import('gsap')).default
5. Wire the resume download button: links to /public/resume/raaj-patre-resume.pdf
   Ensure the PDF exists at that path

Security check: no API calls, no env vars, no Supabase. Pure UI + static data.
```

### Session W6 — Wire Admin CRUD Pages
```
Read CLAUDE.md.

Task: Wire the admin UI from /ui-handoff/ into the admin portal pages.
All API routes already exist and are secured. Task is connecting the UI to them.

SECURITY REMINDER: Every admin API route already checks session + ADMIN_EMAIL.
Do not add client-side auth checks as a substitute — the server-side ones are the real security.

PROJECTS ADMIN:
1. Move admin UI components to components/admin/
2. In app/admin/projects/page.tsx:
   Fetch projects with lib/supabase/server.ts for the table (anon read is fine)
   Wire [+ NEW] button to open the create drawer
   Wire [EDIT] to open edit drawer with pre-filled form data
   Wire [DELETE] to show confirm modal, on confirm: DELETE /api/admin/projects/[id]
   Wire create/edit form submit to POST/PATCH /api/admin/projects (or /[id])
   Wire image upload to: call /api/cloudinary/sign → upload to Cloudinary → save URL in form state
3. Repeat same pattern for certificates and feed pages

FORM VALIDATION:
   Client-side: basic HTML5 + state checks for UX
   Server-side: already handled by Zod in the API route — trust it

LOADING + ERROR STATES:
   All form submits must show loading state (disable button, show spinner)
   All errors from API routes must surface to the user (show in form, not just console.log)

Security check: 
- No service role client imported here
- All mutations go through /api/admin/* routes
- Cloudinary upload follows the sign → upload → save-URL flow
- Never send CLOUDINARY_API_SECRET or SUPABASE_SERVICE_ROLE_KEY to the client
```

### Session W7 — Final Polish + Verification
```
Read CLAUDE.md.

Task: Final wiring polish, error states, and pre-deploy verification.

1. Wire 404 page: move not-found UI from /ui-handoff/ to app/not-found.tsx
2. Wire error page: move error UI to app/error.tsx (must be client component)
3. Audit all next/image usages:
   - All Cloudinary image URLs must have the res.cloudinary.com domain in next.config.js
   - All images have alt text
   - All images have explicit width and height (or fill with sized container)
4. Add f_auto,q_auto to all Cloudinary URLs (append to the URL path before the filename)
5. Run full build: pnpm build — zero errors, zero warnings
6. Run security checks:
   grep -r "SERVICE_ROLE" .next/static/    ← must be empty
   grep -r "API_SECRET" .next/static/      ← must be empty
7. Test checklist (do manually):
   - First visit shows welcome screen
   - Return visit skips welcome screen
   - /projects filter works
   - /about scroll works on desktop, stacked on mobile
   - /certificates flip cards work
   - /feed filter works
   - /admin redirects to login if logged out
   - Admin CRUD works end-to-end for one project
   - Image upload works in admin
```
