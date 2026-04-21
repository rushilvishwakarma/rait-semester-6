'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import { Loader2, Instagram } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';

function BlockedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/';
  const supabase = createClient();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setChecking(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('enabled_access')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.enabled_access) {
        router.replace(nextUrl);
      } else {
        setChecking(false);
      }
    };

    checkAccess();
    intervalId = setInterval(checkAccess, 3000);

    return () => clearInterval(intervalId);
  }, [router, nextUrl, supabase]);

  return (
    <div className="max-w-xl w-full rounded-2xl border bg-fd-card p-8 text-center space-y-4">
      <h1 className="text-2xl font-semibold text-fd-foreground">
        Available for Selected members. Contact Admin.
      </h1>
      <div className="flex flex-col items-center justify-center gap-2 text-fd-muted-foreground text-sm pt-4">
        <Loader2 className="size-5 animate-spin text-fd-primary" />
        <p>Waiting for admin approval... Keep this page open.</p>
      </div>
      <div className="pt-4">
        <a 
          href="https://www.instagram.com/whyfeverdream/" 
          target="_blank" 
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'outline', className: 'gap-2' }))}
        >
          <Instagram className="size-4" />
          Contact Admin
        </a>
      </div>
    </div>
  );
}

export default function SelectedMembersOnlyPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <Suspense fallback={
        <div className="max-w-xl w-full rounded-2xl border bg-fd-card p-8 text-center space-y-4">
          <Loader2 className="size-8 animate-spin text-fd-primary mx-auto" />
        </div>
      }>
        <BlockedContent />
      </Suspense>
    </main>
  );
}
