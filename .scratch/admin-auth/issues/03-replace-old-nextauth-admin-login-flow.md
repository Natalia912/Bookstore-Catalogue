# 03 — Replace old NextAuth admin login flow

**What to build:** the admin sign-in experience is migrated from the custom credentials check to the Supabase Auth flow while preserving the current UI intent and the admin-only entry point.

**Blocked by:** 02 — Add Supabase admin account and session plumbing

**Status:** ready-for-agent

- [ ] Remove the brittle env-based email/password hash comparison from the admin auth flow.
- [ ] Update the admin login page to authenticate through Supabase Auth.
- [ ] Keep the app behaviour consistent for the single admin account while moving to the new auth provider.
- [ ] Verify the admin login path remains usable for the trusted operator.
