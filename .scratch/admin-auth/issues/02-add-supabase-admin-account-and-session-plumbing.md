# 02 — Add Supabase admin account and session plumbing

**What to build:** the app can authenticate through Supabase and resolve a signed-in user as the designated administrator using the database-backed admin identity model.

**Blocked by:** 01 — Define single-admin auth contract

**Status:** ready-for-agent

- [ ] Add the required Supabase auth/session plumbing for the admin user.
- [ ] Represent the admin identity explicitly in the database or user profile model.
- [ ] Ensure the app can distinguish the designated admin from any other authenticated user.
- [ ] Preserve a clean server-side path for checking the admin identity later in route protection.
