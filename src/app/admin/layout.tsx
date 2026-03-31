// src/app/admin/layout.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Brutal Server-Side Authentication ensuring zero-trust entry to the gateway
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role?.toLowerCase() !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="bg-[#131A14] font-sans h-screen w-full">
         {children}
    </div>
  );
}
