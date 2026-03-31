// src/app/admin/page.tsx
import { createClient } from '@/utils/supabase/server';
import { getAdminTours, getAllBookings, getAllUsers, getAllTickets, getAllTransactions } from '@/actions/admin';
import AdminClientDashboard from '@/components/admin/AdminClientDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminMasterApp() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null; // Handled by layout

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Parallel Raw Data Fetches using our Admin supersession keys
  const [tours, bookings, users, tickets, transactions] = await Promise.all([
     getAdminTours(),
     getAllBookings(),
     getAllUsers(),
     getAllTickets(),
     getAllTransactions()
  ]);

  // Derive Overview Metrics
  const usersCount = users.length;
  let totalRevenue = 0;
  let totalBookings = bookings?.length || 0;

  if (bookings) {
    bookings.forEach((b: any) => {
      if (
        b.payment_status === "FULLY_PAID" ||
        b.payment_status === "DEPOSIT_PAID" ||
        b.payment_status === "COMPLETED"
      ) {
        totalRevenue += b.total_price;
      }
    });
  }

  const initialData = {
     tours,
     bookings,
     users,
     tickets,
     transactions,
     profile: { ...profile, email: user.email },
     overview: {
        totalRevenue,
        totalBookings,
        usersCount
     }
  };

  return <AdminClientDashboard initialData={initialData} />;
}
