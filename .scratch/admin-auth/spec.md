Status: ready-for-agent

## Problem Statement

The application currently exposes a simple admin login flow that depends on a hard-coded email and a password hash stored in environment variables. This is brittle, difficult to audit, and not appropriate for a real admin security boundary. The user wants a single admin account that is managed through Supabase, with the admin dashboard restricted to that account only.

## Solution

Replace the custom credential-based admin auth flow with a Supabase-backed authentication model that supports a single administrator identity. The system will authenticate users through Supabase Auth, then verify that the authenticated user is the designated admin before permitting access to the admin dashboard and related management actions.

This solution keeps the product behaviour simple: one trusted administrator can sign in, and everyone else is denied. Authentication and role validation remain centralized so the admin boundary is enforced consistently across the app.

## User Stories

1. As an admin operator, I want to sign in with a dedicated administrator account, so that I can access the bookstore management features securely.
2. As an admin operator, I want the application to validate my identity with Supabase Auth, so that credentials are handled by a managed auth system instead of custom env-based password comparisons.
3. As an admin operator, I want my admin access to be tied to a single trusted account, so that there is no ambiguity about who can manage the catalogue.
4. As an unauthenticated user, I want the app to redirect me away from the admin area, so that protected management routes are not publicly accessible.
5. As a non-admin user, I want access to the admin area to be denied even if I am authenticated, so that the admin boundary is enforced by role rather than by sign-in alone.
6. As a developer, I want auth checks to live in one place, so that the system is easier to reason about and harder to misconfigure.
7. As a developer, I want the admin account model to be explicit, so that the app can distinguish between regular users and the single administrator.
8. As a maintainer, I want the admin setup to be versioned and auditable in the database layer, so that the security boundary is clearer than a hard-coded env secret.
9. As a product owner, I want the login flow for admin access to feel consistent with modern auth patterns, so that the app remains maintainable and secure.
10. As a platform operator, I want the admin account to be backed by Supabase-managed credentials, so that password handling and session management follow a supported system.
11. As an admin operator, I want the dashboard to remain protected after a sign-in, so that session state is continuously validated.
12. As a developer, I want the app to reject invalid or missing sessions before rendering protected views, so that there are no accidental route leaks.
13. As a product owner, I want the system to support a single-admin model without introducing unnecessary complexity, so that the app remains simple to operate.
14. As a user, I want the app to fail closed when the admin check is missing or invalid, so that access is never granted by accident.
15. As an operator, I want a clear admin account status in the database, so that the trusted admin identity remains explicit and easy to review.
16. As a maintainer, I want the existing admin entry points to be preserved while the auth mechanism changes, so that the user experience remains stable.
17. As a developer, I want route access control to be enforced on the server side, so that the auth rule cannot be bypassed through client-side manipulation.
18. As a product owner, I want the admin login flow to remain straightforward for one operator, so that the operational burden stays low.
19. As a maintainer, I want the auth migration to avoid a broad rewrite of the catalogue features, so that the change stays focused on the admin security boundary.
20. As a developer, I want the admin identity to be represented as a first-class domain concept, so that future permission changes can be made without backtracking to env configuration.

## Implementation Decisions

- The auth model will be simplified to a single trusted administrator identity, rather than a generic multi-role system.
- The system will validate session presence and admin status at the server boundary before allowing access to the admin dashboard.
- Authentication will move from a custom credential function to a standard Supabase Auth flow managed by the platform.
- The user record representing the admin will be represented explicitly in the database as an admin identity or user profile with an admin flag.
- The app will treat admin access as a permission check, not merely a sign-in check.
- The login experience will remain intentionally simple: a dedicated admin sign-in flow for the single admin user.
- Browser and server boundaries will be kept separate: the client may initiate sign-in, but the server will enforce the access decision.
- The admin route protection should be centralized so that the app has one decision point for protected access instead of scattering checks across pages.
- The system will fail closed if the session is missing, invalid, or does not include the admin role.
- The existing admin-only product behaviour will be maintained, but the underlying trust model will be stronger and more maintainable.
- Any database schema changes required for the admin record will be minimal and explicit, instead of relying on environment variables or custom credential comparisons.
- The migration should preserve the current admin user experience during the transition, only swapping out the underlying auth mechanism.
- The feature is intentionally scoped to the single-admin dashboard use case and does not broaden into a full multi-user auth system unless the product later requires it.

## Testing Decisions

- The most important tests are end-to-end or route-level tests that confirm the admin dashboard denies unauthenticated access and allows the single admin user through after a successful Supabase sign-in.
- Tests should validate the external behaviour of the admin boundary rather than implementation details like internal helper names or specific session object shape.
- A good regression test will cover the real access outcome: access granted for the admin user, blocked for non-admin or unauthenticated users.
- The route enforcement tests should be treated as the primary guard, because that is where the product receives the real security decision.
- Existing app-level patterns for route protection and login flows should be reused where possible rather than introducing a parallel system with a different behaviour.
- Tests should focus on the admin contract: the protected area is behind a trusted signed-in admin identity, and access is denied otherwise.
- If helper code is introduced, it should be tested only insofar as it affects access decisions, not for internal wiring details.

## Out of Scope

- A full multi-user role system beyond the single admin account.
- Social login, SSO, or additional auth providers.
- General user management features for non-admin users.
- Reworking unrelated catalogue functionality that is not part of the admin auth and access boundary.
- A broad migration of all application auth patterns if the single-admin model is sufficient for this project.

## Further Notes

This feature is intentionally narrow: the goal is to replace the fragile custom admin credential check with a safer, explicit Supabase-backed admin model. The app should retain its current minimal admin workflow while moving the trust boundary into a supported auth platform and database-backed role check.
