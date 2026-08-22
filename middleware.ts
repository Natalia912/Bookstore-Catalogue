import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_LOGIN_PATH, isSupabaseUserAdmin } from '@/src/entities/auth';
import { createAuthMiddlewareClient } from '@/src/shared/configs/supabase/auth-client';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const supabase = createAuthMiddlewareClient(request, response);

  if (!supabase) {
    return redirectToLogin(request);
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !(await isSupabaseUserAdmin(supabase, user.id))) {
    return redirectToLogin(request);
  }

  return response;
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
  loginUrl.searchParams.set('error', 'unauthorized');
  return NextResponse.redirect(loginUrl);
}

export const config = { matcher: ['/dashboard/:path*'] };
