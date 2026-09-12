# Admin authentication contract

Admin access requires both a verified Supabase Auth user and that user's `public.admin_profiles` record to have `is_admin = true`.

The partial unique index in `20260817110000_create_admin_profiles.sql` permits at most one administrator. After creating the intended Supabase Auth user, insert its UUID into `public.admin_profiles` with `is_admin = true` through a privileged database migration or the Supabase SQL editor. Do not use an environment variable to select the administrator.

The application fails closed when the Supabase session cannot be verified, the profile is absent, or `is_admin` is false. The login page uses Supabase Auth directly; it does not issue a NextAuth session.
