#!/usr/bin/env bash

set -euo pipefail

TOTAL_STAGES=4
ENV_FILE="${ENV_FILE:-.env}"
stage_index=0

stage() {
  stage_index=$((stage_index + 1))
  printf '\nStage %s/%s — %s\n' "$stage_index" "$TOTAL_STAGES" "$1"
}

step() {
  printf '  → %s\n' "$1"
}

pause() {
  read -r -p "  Press Enter when complete: " _
}

ask() {
  local key="$1" prompt="$2" value=""
  read -r -p "  $prompt " value
  printf -v "$key" '%s' "$value"
}

write_env() {
  local key="$1" value="$2" temporary
  touch "$ENV_FILE"
  temporary=$(mktemp)
  grep -vE "^${key}=" "$ENV_FILE" > "$temporary" || true
  printf '%s=%s\n' "$key" "$value" >> "$temporary"
  mv "$temporary" "$ENV_FILE"
  printf '  ✓ wrote %s to %s\n' "$key" "$ENV_FILE"
}

printf 'Supabase single-admin provisioning (%s stages)\n' "$TOTAL_STAGES"

stage "Record browser-safe Supabase configuration"
step "In Supabase Dashboard, open Project Settings → API."
step "Copy the Project URL and the publishable/anon key. These values are safe for browser use."
ask SUPABASE_PUBLIC_URL "Paste the Project URL:"
ask SUPABASE_PUBLIC_KEY "Paste the publishable/anon key:"
write_env NEXT_PUBLIC_SUPABASE_URL "$SUPABASE_PUBLIC_URL"
write_env NEXT_PUBLIC_SUPABASE_ANON_KEY "$SUPABASE_PUBLIC_KEY"

stage "Apply the admin-profile migration"
step "Open https://supabase.com/dashboard and select this project."
step "Open SQL Editor, paste supabase/migrations/20260817110000_create_admin_profiles.sql, and run it."
step "Confirm that public.admin_profiles exists before continuing."
pause

stage "Create the dedicated administrator"
step "Open Authentication → Users → Add user → Send invitation."
step "Invite the dedicated admin email and complete the password setup from the invitation."
step "Back in Authentication → Users, copy that user's UUID."
ask ADMIN_USER_ID "Paste the administrator UUID:"

stage "Grant and verify single-admin access"
step "In SQL Editor, run: insert into public.admin_profiles (id, is_admin) values ('$ADMIN_USER_ID', true);"
step "Run the app, sign in at /login with the invited account, and verify /dashboard loads."
step "Confirm a different authenticated user is redirected away from /dashboard."
pause

printf '\nProvisioning steps complete. The app now has the browser session variables required for Supabase Auth.\n'
