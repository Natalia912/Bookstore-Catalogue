# 01 — Define single-admin auth contract

**What to build:** the system defines one explicit admin identity contract for this app, replacing the current env-based credential check with a clear requirement that admin access is granted only to the designated Supabase-backed administrator.

**Blocked by:** None — can start immediately.

**Status:** resolved

- [x] Confirm the single-admin rule: one trusted admin identity and no broader role model is required for this feature.
- [x] Document the admin access contract in terms of authenticated user plus admin flag/role.
- [x] Confirm the current NextAuth credential flow is retired from the contract and replaced by the Supabase-backed model.

## Answer

The contract is documented in `docs/admin-auth-contract.md`. `public.admin_profiles.is_admin` is the sole authorization decision, constrained to at most one administrator. Supabase Auth verifies the user session; the former NextAuth credentials flow is removed.
