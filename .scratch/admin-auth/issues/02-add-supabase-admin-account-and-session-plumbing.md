# 02 — Add Supabase admin account and session plumbing

**What to build:** the app can authenticate through Supabase and resolve a signed-in user as the designated administrator using the database-backed admin identity model.

**Blocked by:** 01 — Define single-admin auth contract

**Status:** resolved

- [x] Add the required Supabase auth/session plumbing for the admin user.
- [x] Represent the admin identity explicitly in the database or user profile model.
- [x] Ensure the app can distinguish the designated admin from any other authenticated user.
- [x] Preserve a clean server-side path for checking the admin identity later in route protection.

## Answer

Supabase Auth browser and server session plumbing is implemented through the existing SSR clients. `admin_profiles.is_admin` identifies the single designated administrator, and `hasAdminAccess()` verifies the Supabase user before checking that profile. Run `scripts/provision-supabase-admin.sh` to create the operator account, apply the database migration, and configure the browser-safe Supabase environment values.
