# NestOS — AI Powered Hostel Management System (Frontend)

A frontend-only React + Vite + Tailwind dashboard, styled like a modern SaaS
product (Notion / Linear / Vercel-adjacent), built for a hostel management
use case. Runs entirely on dummy data — no backend required to demo it.

## Run it

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

Student demo login: `student@gmail.com` / `123456`

Admin demo login (Security Dashboard only): `admin@nestos.in` / `Warden@2026`
— use the "Admin access" link at the bottom of the sidebar, or go to
`/admin-login` directly.

## Structure

```
src/
  components/      Sidebar, Topbar, GlassCard, StatCard, Modal,
                    ForgotPasswordModal, LiquidNav, AnimatedBackground,
                    LiquidBackdrop, DashboardLayout, PagePlaceholder,
                    RequireAdmin
  pages/           One file per route: Landing, Login, AdminLogin,
                    Dashboard, RoomDetails, Attendance, Leave, Notices,
                    FeeStatus, Complaints, Mess, Laundry, LostFound,
                    Visitors, SOS, Inspection, Inventory, Analytics,
                    Settings, SecurityDashboard, NotFound
  data/            dummyData.js — all fake "API" data + a fakeApi() helper
  auth.js          Admin credential check + session helpers (kept
                    separate from the student login in Login.jsx)
  App.jsx          Route table
  main.jsx         Entry point
```

## Design system

- **Palette** — Primary `#2563EB`, Success `#22C55E`, Danger `#EF4444`,
  Warning `#F59E0B`, Background `#F8FAFC`, plus a near-black `#0B1120`
  ("ink") used for the aurora backdrops.
- **Type** — Space Grotesk (display/headings), Inter (body), JetBrains Mono
  (IDs, codes, timestamps).
- **Signature element** — a mouse-reactive "liquid glass" backdrop, now
  used on every screen: a dark aurora mesh on Landing/Login/Admin-login
  (`AnimatedBackground.jsx`), and a light equivalent on the dashboard shell
  (`LiquidBackdrop.jsx`). Both drift toward the cursor via CSS custom
  properties set on mousemove — no canvas, stays lightweight.

## What changed in this upgrade pass

- **Liquid glass design, everywhere** — the glass/aurora look no longer
  stops at Landing/Login; the dashboard shell, Sidebar and Topbar are now
  translucent glass surfaces sitting over an ambient, mouse-reactive blob
  backdrop (`LiquidBackdrop.jsx`).
- **Toned-down blue, more interactive cards** — `GlassCard` no longer
  glows blue on hover. It lifts with a neutral shadow, tilts gently toward
  the cursor, and sweeps a soft light "shine" across on hover instead.
  The sidebar's active-link state is a thin gradient bar rather than a
  full blue background wash.
- **Chatbot removed** from the student dashboard — the page, its route,
  and its sidebar link are gone. The landing page's feature grid swaps
  that slot for Room Inspection.
- **Security Dashboard is admin-only** — it's no longer in the student
  sidebar at all. It sits behind `/admin-login`, a separate sign-in
  screen with its own demo credentials, defined in `src/auth.js`
  (`ADMIN_EMAIL` / `ADMIN_PASSWORD`). The route is wrapped in
  `RequireAdmin`, which redirects anyone without an active admin session
  back to the login. Swap `auth.js` for a real backend check whenever
  it's ready — nothing else needs to change.
- **Every previously-scaffolded page is now fully built**: Leave,
  Notices, Fee Status, Mess, Laundry, Lost & Found, Visitors,
  Inspection, Inventory, and Settings all use real dummy data. Several
  (Leave, Lost & Found, Visitors, Mess, Settings) have working
  forms/toggles backed by local component state, ready to be pointed at
  real endpoints later.

## Connecting the real backend

Everything here is written so a backend can be dropped in without touching
component structure:

1. **Data** — `src/data/dummyData.js` exports plain arrays/objects and one
   `fakeApi(data, delay)` helper that returns a Promise. Replace the
   imports in each page with real `fetch()` calls that resolve to the same
   shapes, or point `fakeApi` at your API instead of `setTimeout`.
2. **Student login** — `src/pages/Login.jsx` checks a hardcoded
   email/password. Swap `handleSubmit` for a call to your auth endpoint
   and store the returned token instead of navigating straight to
   `/dashboard`.
3. **Admin login** — `src/auth.js` holds the admin credential check and
   session flag used by the Security Dashboard. Replace `loginAdmin()`
   with a real request to your admin auth endpoint, and swap the
   `sessionStorage` flag for a real token/role check.
4. **Forgot password** — `src/components/ForgotPasswordModal.jsx` "sends"
   a code by generating one client-side (since there's no email service
   yet). Replace `sendCode()`/`verifyCode()` with real endpoint calls —
   the UI steps don't need to change.
5. **SOS** — `src/pages/SOS.jsx`'s `handleTrigger()` is where you'd fire a
   request to notify security/warden/parents and, ideally, send live
   geolocation instead of the static address shown now.
6. **Security dashboard** — `src/pages/SecurityDashboard.jsx` expects
   camera-feed and alert data shaped like `cameraFeeds`/`securityAlerts`
   in `dummyData.js` — point it at your camera/alerting API once ready.
