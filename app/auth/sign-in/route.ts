import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const next = requestUrl.searchParams.get('next');
  const safeNext = next?.startsWith('/') ? next : '/';

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${requestUrl.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(new URL('/selected-members-only', requestUrl.origin));
  }

  return NextResponse.redirect(data.url);
}
