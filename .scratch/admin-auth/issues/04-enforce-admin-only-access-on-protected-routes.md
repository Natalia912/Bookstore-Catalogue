# 04 — Enforce admin-only access on protected routes

**What to build:** the admin dashboard and related protected pages fail closed unless the current user is authenticated and identified as the designated admin.

**Blocked by:** 03 — Replace old NextAuth admin login flow

**Status:** ready-for-agent

- [ ] Centralize route protection for the admin area behind a server-side admin check.
- [ ] Reject unauthenticated users before they reach the dashboard.
- [ ] Reject non-admin users even when they are signed in.
- [ ] Preserve the intended admin-only experience without weakening the route boundary.
