# 05 — Add admin access regression tests

**What to build:** the app proves the admin boundary works from the outside by checking that the admin can access the protected area while unauthenticated and non-admin users are blocked.

**Blocked by:** 04 — Enforce admin-only access on protected routes

**Status:** ready-for-agent

- [ ] Write a regression test covering the admin success path.
- [ ] Write a regression test covering the unauthenticated denial path.
- [ ] Write a regression test covering the non-admin denial path.
- [ ] Keep tests focused on real access behaviour rather than implementation details.
