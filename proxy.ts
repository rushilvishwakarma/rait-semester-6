import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

function isSolvedQuestionBankPath(pathname: string) {
  return /\/docs\/core\/curated\/[^/]+\/.+QB(?:\/|$)/i.test(pathname);
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const { supabase, response } = await updateSession(request);

  if (!isSolvedQuestionBankPath(pathname)) {
    return response;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const signInUrl = request.nextUrl.clone();
    signInUrl.pathname = '/auth/sign-in';
    signInUrl.searchParams.set('next', `${pathname}${search}`);
    return NextResponse.redirect(signInUrl);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('enabled_access')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.enabled_access) {
    const blockedUrl = request.nextUrl.clone();
    blockedUrl.pathname = '/selected-members-only';
    blockedUrl.searchParams.set('next', `${pathname}${search}`);
    return NextResponse.redirect(blockedUrl);
  }

  return response;
}

export const config = {
  matcher: ['/docs/core/curated/:path*'],
};
