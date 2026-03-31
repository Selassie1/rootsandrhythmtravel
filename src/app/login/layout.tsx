import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If already authenticated, completely eject the user into the portal environment natively
  if (user) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
