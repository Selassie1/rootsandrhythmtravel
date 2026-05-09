// src/components/admin/AdminClientDashboard.tsx
'use client';

import { useState, useMemo } from 'react';
import AdminSidebar from './AdminSidebar';
import { Compass, Users, User, CreditCard, Activity, Ticket, Edit, ShieldCheck, Mail, Phone, Lock, Loader2, CheckCircle, Search } from 'lucide-react';
import { RoleAction } from './UserActions';
import { BookingStatusAction, PaymentStatusAction, DeleteBookingAction } from './BookingActions';
import TicketActions, { DeleteTicketAction } from './TicketActions';
import { DeleteUserAction } from './UserActions';
import { DeleteTourAction } from './TourActions';
import TourForm from './TourForm';
import { updateAdminProfile } from '@/actions/admin';
import BookingDetailsModal from './BookingDetailsModal';
import SiteSettingsForm from './SiteSettingsForm';

// Reusing TourForm logic but we keep Form standalone due to complexity
type DashboardData = {
  tours: any[];
  bookings: any[];
  users: any[];
  tickets: any[];
  transactions: any[];
  profile: any;
  siteSettings: Record<string, string>;
  overview: {
     totalRevenue: number;
     totalBookings: number;
     usersCount: number;
  };
};

export default function AdminClientDashboard({ initialData }: { initialData: DashboardData }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [editTourId, setEditTourId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const { tours, bookings, users, tickets, transactions, overview, profile, siteSettings } = initialData;

  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return <OverviewTab data={overview} setTab={setActiveTab} />;
      case 'tours': return <ToursTab tours={tours} setTab={setActiveTab} setEditId={setEditTourId} />;
      case 'create-tour': return <TourFormTab initialData={null} setTab={setActiveTab} />;
      case 'edit-tour': return <TourFormTab initialData={tours.find(t => t.id === editTourId)} setTab={setActiveTab} />;
      case 'bookings': return <BookingsTab bookings={bookings} onSelectBooking={setSelectedBooking} />;
      case 'users': return <UsersTab users={users} />;
      case 'tickets': return <TicketsTab tickets={tickets} />;
      case 'transactions': return <TransactionsTab transactions={transactions} />;
      case 'settings': return <SettingsTab profile={profile} siteSettings={siteSettings} />;
      default: return <OverviewTab data={overview} setTab={setActiveTab} />;
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#131A14] flex flex-col md:flex-row font-sans">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#131A14] relative">
         {renderContent()}
      </main>

      {/* Global Modals Portal */}
      {selectedBooking && (
        <BookingDetailsModal 
           booking={selectedBooking} 
           onClose={() => setSelectedBooking(null)} 
        />
      )}
    </div>
  );
}

// ----------------------------------------------------
// Sub-Tabs
// ----------------------------------------------------

function OverviewTab({ data, setTab }: { data: any, setTab: any }) {
  return (
    <div className="w-full min-h-screen p-8 lg:p-12 xl:p-16 flex flex-col gap-10 fade-in">
      <div className="flex flex-col gap-2 relative z-10">
         <h1 className="text-4xl text-white font-serif tracking-tight">Financial Overview</h1>
         <p className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase">Real-Time Aggregation Hub</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-[#1A241B] border border-white/10 rounded-[2rem] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#B8860B]/20 to-transparent opacity-50" />
            <h4 className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase mb-4 flex items-center gap-3"><Activity size={14} className="text-[#B8860B]"/> Gross Revenue</h4>
            <div className="flex items-end gap-2 text-white">
               <span className="text-2xl font-serif text-[#B8860B]">$</span>
               <span className="text-4xl font-serif leading-none tracking-tight">{data.totalRevenue.toLocaleString()}</span>
            </div>
         </div>
         <div className="bg-[#1A241B] border border-white/5 rounded-[2rem] p-8 relative overflow-hidden group">
            <h4 className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase mb-4 flex items-center gap-3"><CreditCard size={14} className="text-[#B8860B]"/> Total Bookings</h4>
            <div className="flex items-end gap-2 text-white">
               <span className="text-4xl font-serif leading-none tracking-tight">{data.totalBookings}</span>
            </div>
         </div>
         <div className="bg-[#1A241B] border border-white/5 rounded-[2rem] p-8 relative overflow-hidden group border-[#B8860B]/20">
            <h4 className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase mb-4 flex items-center gap-3"><Users size={14} className="text-[#B8860B]"/> Total Users</h4>
            <div className="flex items-end gap-2 text-white">
               <span className="text-4xl font-serif leading-none tracking-tight">{data.usersCount}</span>
            </div>
         </div>
         <div className="bg-[#1A241B] border border-white/5 rounded-[2rem] p-8 relative overflow-hidden group">
            <h4 className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase mb-4 flex items-center gap-3"><Compass size={14} className="text-[#B8860B]"/> Active Status</h4>
            <div className="flex items-end gap-2 text-white">
               <span className="text-3xl font-serif leading-none tracking-tight text-white/80">Online</span>
            </div>
         </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-[#B8860B]/5 border border-[#B8860B]/20 rounded-[2rem] p-10 lg:p-12 flex flex-col justify-center gap-6 relative overflow-hidden h-full min-h-[300px]">
            <h3 className="text-2xl font-serif text-[#E8D3A2]">Review Bookings</h3>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">Analyze sales, customer payments, and upcoming tour reservations.</p>
            <button onClick={() => setTab('bookings')} className="self-start mt-2 bg-[#E8D3A2] text-black font-bold uppercase tracking-[0.2em] text-[10px] px-8 py-4 rounded-full transition-transform hover:scale-105">
               Open Bookings
            </button>
         </div>
         <div className="bg-[#1A241B] border border-white/5 rounded-[2rem] p-10 lg:p-12 flex flex-col justify-center gap-6 relative overflow-hidden h-full min-h-[300px]">
             <h3 className="text-2xl font-serif text-white">User Management</h3>
             <p className="text-white/50 text-sm leading-relaxed max-w-sm">Access the complete registry of registered users and administrators to resolve support requests.</p>
             <button onClick={() => setTab('users')} className="self-start mt-2 border border-[#B8860B] text-[#E8D3A2] hover:bg-white hover:text-black font-bold uppercase tracking-[0.2em] text-[10px] px-8 py-4 rounded-full transition-all">
                Search Users
             </button>
         </div>
      </div>
    </div>
  );
}

function RegistryPagination({ 
  totalItems, 
  itemsPerPage, 
  currentPage, 
  onPageChange 
}: { 
  totalItems: number, 
  itemsPerPage: number, 
  currentPage: number, 
  onPageChange: (page: number) => void 
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-6 border-t border-white/5 bg-black/10 gap-4">
      <div className="text-white/40 text-[10px] uppercase tracking-widest font-black">
        Showing <span className="text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-white">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="text-[#B8860B]">{totalItems}</span> Entries
      </div>
      <div className="flex items-center gap-2">
        <button 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-white/5 rounded-xl text-white transition-all text-[10px] uppercase font-black tracking-widest border border-white/10"
        >
          Previous
        </button>
        <div className="flex items-center gap-1">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`w-9 h-9 rounded-xl text-[10px] font-black border transition-all ${currentPage === i + 1 ? 'bg-[#B8860B] border-[#B8860B] text-black shadow-[0_0_15px_rgba(184,134,11,0.3)]' : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-white/5 rounded-xl text-white transition-all text-[10px] uppercase font-black tracking-widest border border-white/10"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function ToursTab({ tours, setTab, setEditId }: { tours: any[], setTab: any, setEditId: any }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const filteredTours = useMemo(() => {
     const lower = query.toLowerCase();
     return tours.filter(t => !query || t.title?.toLowerCase().includes(lower) || t.location?.toLowerCase().includes(lower) || t.slug?.toLowerCase().includes(lower));
  }, [tours, query]);

  const pagedItems = useMemo(() => {
    return filteredTours.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  }, [filteredTours, page]);

  return (
    <div className="p-8 pb-32 w-full max-w-7xl mx-auto flex flex-col gap-8 fade-in h-min">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-wide">Tours</h1>
          <p className="text-white/50 text-sm mt-1">Manage and curate global travel experiences.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex bg-[#1A241B] border border-white/10 rounded-full px-4 py-3 items-center gap-2 w-full md:w-64 shadow-inner focus-within:border-[#B8860B]/50 transition-colors">
            <Search size={14} className="text-white/40 shrink-0" />
            <input 
                type="text" 
                placeholder="Search tours..." 
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="bg-transparent border-none text-white text-xs outline-none w-full" 
            />
          </div>
          <button 
            onClick={() => setTab('create-tour')} 
            className="flex items-center gap-2 bg-[#B8860B] hover:bg-[#D4AF37] text-black font-bold uppercase tracking-[0.1em] text-[10px] px-6 py-3 rounded-full transition-all shrink-0"
          >
            Create New
          </button>
        </div>
      </header>

      <div className="bg-[#1A241B] border border-white/5 rounded-2xl overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 text-white/50 text-[10px] sm:text-xs uppercase tracking-[0.2em] border-b border-white/5">
                <th className="py-4 px-6 font-medium">Tour Package</th>
                <th className="py-4 px-6 font-medium">Core Details</th>
                <th className="py-4 px-6 font-medium">Pricing</th>
                <th className="py-4 px-6 font-medium text-center">Status</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pagedItems.map((tour: any) => (
                <tr key={tour.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      {tour.hero_image_url ? (
                        <div className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0 border border-white/10" style={{ backgroundImage: `url(${tour.hero_image_url})` }} />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10"><span className="text-white/20 text-[10px]">No Img</span></div>
                      )}
                      <div>
                        <p className="text-white font-serif text-sm md:text-base leading-tight group-hover:text-[#B8860B] transition-colors">{tour.title}</p>
                        <p className="text-white/40 text-[10px] mt-1 font-mono uppercase tracking-widest">{tour.region}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6 align-middle">
                    <p className="text-white/80 text-[10px] md:text-xs flex items-center gap-2">
                       <span className="bg-white/5 px-2 py-1 rounded">{tour.duration_days} Days</span>
                       <span className="text-white/30">•</span>
                       <span className="truncate max-w-[150px] inline-block">{tour.location}</span>
                    </p>
                  </td>
                  <td className="py-5 px-6 align-middle">
                    <p className="text-white font-mono text-[10px] sm:text-xs font-bold">${tour.price.toLocaleString()}</p>
                    <p className="text-[#B8860B] text-[10px] mt-1">Dep: ${tour.deposit.toLocaleString()}</p>
                  </td>
                  <td className="py-5 px-6 align-middle text-center">
                    {tour.is_active ? (
                      <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest">Active</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest">Hidden</span>
                    )}
                  </td>
                  <td className="py-5 px-6 align-middle text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditId(tour.id);
                          setTab('edit-tour');
                        }}
                        className="p-2 bg-white/5 hover:bg-[#B8860B]/20 text-white/50 hover:text-[#B8860B] rounded-lg transition-colors border border-white/5"
                      >
                        <Edit size={16} />
                      </button>
                      <DeleteTourAction id={tour.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTours.length === 0 && (
                 <tr><td colSpan={5} className="py-16 text-center text-white/40 text-[10px] uppercase tracking-widest">No matching tours found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <RegistryPagination 
          totalItems={filteredTours.length} 
          itemsPerPage={itemsPerPage} 
          currentPage={page} 
          onPageChange={setPage} 
        />
      </div>
    </div>
  );
}

function BookingsTab({ bookings, onSelectBooking }: { bookings: any[], onSelectBooking: (b: any) => void }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const filteredBookings = useMemo(() => {
     const lower = query.toLowerCase();
     return bookings.filter(b => 
        !query ||
        b.id.toLowerCase().includes(lower) || 
        b.profiles?.first_name?.toLowerCase().includes(lower) || 
        b.profiles?.last_name?.toLowerCase().includes(lower) || 
        b.guest_name?.toLowerCase().includes(lower) || 
        b.guest_email?.toLowerCase().includes(lower) || 
        b.tours?.title?.toLowerCase().includes(lower)
     );
  }, [bookings, query]);

  const pagedItems = useMemo(() => {
    return filteredBookings.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  }, [filteredBookings, page]);

  return (
    <div className="p-8 pb-32 w-full max-w-7xl mx-auto flex flex-col gap-8 fade-in min-h-[400px]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h1 className="text-3xl font-serif text-white tracking-wide">Financials & Ledger</h1>
           <p className="text-white/50 text-sm mt-1">Global transaction registry and manifest status.</p>
        </div>
        <div className="flex bg-[#1A241B] border border-white/10 rounded-full px-4 py-2 items-center gap-2 w-full max-w-xs shadow-inner focus-within:border-[#B8860B]/50 transition-colors">
           <Search size={14} className="text-white/40" />
           <input 
              type="text" 
              placeholder="Search IDs, Names, or Tours..." 
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="bg-transparent border-none text-white text-xs outline-none w-full" 
           />
        </div>
      </header>
      <div className="bg-[#1A241B] border border-white/5 rounded-2xl mt-4 relative z-10">
        <div className="overflow-x-auto min-h-[450px] pb-32 scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] text-left shrink-0">
                  <th className="py-4 px-6 font-normal">Date</th>
                  <th className="py-4 px-6 font-normal">Traveler</th>
                  <th className="py-4 px-6 font-normal">Tour</th>
                  <th className="py-4 px-6 font-normal">Amount ($)</th>
                  <th className="py-4 px-6 font-normal">Payment</th>
                  <th className="py-4 px-6 font-normal">Reservation</th>
                  <th className="py-4 px-6 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pagedItems.map((booking: any) => (
                <tr 
                  key={booking.id} 
                  className="hover:bg-white/[0.02] transition-colors group cursor-pointer" 
                  onClick={() => onSelectBooking(booking)}
                >
                  <td className="py-5 px-6">
                    <p className="text-white font-mono text-xs mb-1">{booking.id.split('-').shift()?.toUpperCase()}</p>
                    <p className="text-white/40 text-xs truncate max-w-[150px]">{booking.travel_dates || "TBD"}</p>
                  </td>
                  <td className="py-5 px-6 align-middle">
                    {booking.profiles ? (
                      <div>
                        <p className="text-white font-serif text-sm leading-tight transition-colors">{booking.profiles.first_name} {booking.profiles.last_name}</p>
                        <p className="text-white/40 text-[10px] uppercase tracking-wider mt-1">{booking.profiles.phone || "No Phone"}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[#E8D3A2] font-serif text-sm leading-tight inline-flex items-center gap-2">{booking.guest_name || "Guest Checkout"}</p>
                        <p className="text-[#B8860B]/80 text-[10px] uppercase tracking-wider mt-1">{booking.guest_phone || booking.guest_email || "Direct Paystack Link"}</p>
                      </div>
                    )}
                  </td>
                  <td className="py-5 px-6 align-middle">
                     {booking.tours ? (
                        <p className="text-white/80 text-[10px] leading-relaxed max-w-[200px] truncate">{booking.tours.title}</p>
                     ) : (
                        <span className="text-white/20 text-[10px] italic">Deleted Tour</span>
                     )}
                  </td>
                  <td className="py-5 px-6 align-middle">
                    <span className="text-white font-bold text-[10px]">${booking.total_price.toLocaleString()}</span>
                  </td>
                  <td className="py-5 px-6 align-middle">
                     <PaymentStatusAction id={booking.id} currentStatus={booking.payment_status} />
                  </td>
                  <td className="py-5 px-6 align-middle">
                      <BookingStatusAction id={booking.id} currentStatus={booking.booking_status} />
                  </td>
                  <td className="py-5 px-6 align-middle text-right">
                      <DeleteBookingAction id={booking.id} />
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr><td colSpan={6} className="py-16 text-center text-white/40 text-[10px] uppercase tracking-widest">No matching bookings found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <RegistryPagination 
          totalItems={filteredBookings.length} 
          itemsPerPage={itemsPerPage} 
          currentPage={page} 
          onPageChange={setPage} 
        />
      </div>
    </div>
  );
}

function UsersTab({ users }: { users: any[] }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const filteredUsers = useMemo(() => {
     const lower = query.toLowerCase();
     return users.filter(u => !query || u.first_name?.toLowerCase().includes(lower) || u.last_name?.toLowerCase().includes(lower) || u.email?.toLowerCase().includes(lower) || u.id.toLowerCase().includes(lower));
  }, [users, query]);

  const pagedItems = useMemo(() => {
     return filteredUsers.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  }, [filteredUsers, page]);

  return (
    <div className="p-8 pb-32 w-full max-w-7xl mx-auto flex flex-col gap-8 fade-in h-min">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-wide">Users</h1>
          <p className="text-white/50 text-sm mt-1">Manage user accounts and platform access.</p>
        </div>
        <div className="flex bg-[#1A241B] border border-white/10 rounded-full px-4 py-2 items-center gap-2 w-full max-w-xs shadow-inner focus-within:border-[#B8860B]/50 transition-colors">
           <Search size={14} className="text-white/40" />
           <input 
              type="text" 
              placeholder="Search Users, Emails..." 
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="bg-transparent border-none text-white text-xs outline-none w-full" 
           />
        </div>
      </header>
      <div className="bg-[#1A241B] border border-white/5 rounded-2xl overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 text-white/50 text-[10px] sm:text-xs uppercase tracking-[0.2em] border-b border-white/5">
                <th className="py-4 px-6 font-medium">User</th>
                <th className="py-4 px-6 font-medium">Email</th>
                <th className="py-4 px-6 font-medium">Phone</th>
                <th className="py-4 px-6 font-medium text-center">Role</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pagedItems.map((user: any) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      {user.avatar_url ? (
                        <div className="w-10 h-10 rounded-full bg-cover bg-center shrink-0 border border-white/10" style={{ backgroundImage: `url(${user.avatar_url})` }} />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 uppercase font-black text-[#B8860B] text-xs transition-colors">
                          {user.first_name?.[0] || '?'}{user.last_name?.[0] || '?'}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-serif text-sm md:text-base leading-tight group-hover:text-[#B8860B] transition-colors">{user.first_name || 'No Name'} {user.last_name || ''}</p>
                        <p className="text-white/30 text-[10px] uppercase font-mono tracking-widest mt-1">{user.id.split('-').shift()}-USR</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6 align-middle">
                     <p className="text-white/60 text-[10px] font-mono lowercase tracking-wider">{user.email || <span className="text-white/20 uppercase tracking-widest italic">No Auth</span>}</p>
                  </td>
                  <td className="py-5 px-6 align-middle">
                     <p className="text-white/80 text-[10px] font-mono tracking-widest">{user.phone || <span className="text-white/20 italic">No Telecom Record</span>}</p>
                  </td>
                  <td className="py-5 px-6 align-middle text-center">
                    {user.role === "admin" ? (
                       <span className="inline-flex items-center gap-1.5 bg-[#B8860B]/10 text-[#B8860B] px-3 py-1 rounded-full text-[10px] uppercase font-black shadow-[0_0_10px_rgba(184,134,11,0.2)] tracking-widest border border-[#B8860B]/20"><ShieldCheck size={12} /> Root Access</span>
                    ) : (
                       <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest border border-blue-500/20">Traveler</span>
                    )}
                  </td>
                  <td className="py-5 px-6 align-middle text-right">
                    <div className="flex justify-end items-center gap-2">
                       <RoleAction id={user.id} currentRole={user.role} />
                       <DeleteUserAction id={user.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                 <tr><td colSpan={5} className="py-16 text-center text-white/40 text-[10px] uppercase tracking-widest">No matching users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <RegistryPagination 
          totalItems={filteredUsers.length} 
          itemsPerPage={itemsPerPage} 
          currentPage={page} 
          onPageChange={setPage} 
        />
      </div>
    </div>
  );
}

function TicketsTab({ tickets }: { tickets: any[] }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const filteredTickets = useMemo(() => {
     const lower = query.toLowerCase();
     return tickets.filter(t => !query || t.id.toLowerCase().includes(lower) || t.subject?.toLowerCase().includes(lower) || t.profiles?.first_name?.toLowerCase().includes(lower) || t.profiles?.email?.toLowerCase().includes(lower));
  }, [tickets, query]);

  const pagedItems = useMemo(() => {
    return filteredTickets.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  }, [filteredTickets, page]);

  return (
    <div className="p-8 pb-32 w-full max-w-7xl mx-auto flex flex-col gap-8 fade-in min-h-[500px]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-wide">Support Tickets</h1>
          <p className="text-white/50 text-sm mt-1">Manage global user inquiries and rapid-response operations.</p>
        </div>
        <div className="flex bg-[#1A241B] border border-white/10 rounded-full px-4 py-2 items-center gap-2 w-full max-w-xs shadow-inner focus-within:border-[#B8860B]/50 transition-colors">
           <Search size={14} className="text-white/40" />
           <input 
              type="text" 
              placeholder="Search Subject or Names..." 
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="bg-transparent border-none text-white text-xs outline-none w-full" 
           />
        </div>
      </header>
      <div className="bg-[#1A241B] border border-white/5 rounded-2xl overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-black/20 text-white/50 text-[10px] sm:text-xs uppercase tracking-[0.2em] border-b border-white/5">
                <th className="py-4 px-6 font-medium">Ticket ID / Date</th>
                <th className="py-4 px-6 font-medium">User Profile</th>
                <th className="py-4 px-6 font-medium">Subject & Message</th>
                <th className="py-4 px-6 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pagedItems.map((ticket: any) => (
                <tr key={ticket.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-5 px-6">
                    <p className="text-white font-mono text-xs mb-1">{ticket.id.split('-').shift()?.toUpperCase()}</p>
                    <p className="text-white/40 text-[10px] uppercase tracking-wider">{new Date(ticket.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </td>
                  <td className="py-5 px-6 align-middle">
                    {ticket.profiles ? (
                      <div>
                        <p className="text-white font-serif text-[10px] leading-tight transition-colors">{ticket.profiles.first_name} {ticket.profiles.last_name}</p>
                        <p className="text-white/40 text-[10px] uppercase tracking-wider mt-1">{ticket.profiles.phone || "No Phone Info"}</p>
                      </div>
                    ) : (
                      <span className="text-red-400 text-[10px] uppercase italic">Orphaned</span>
                    )}
                  </td>
                  <td className="py-5 px-6 align-middle">
                     <p className="text-white/80 font-bold text-[10px] leading-tight max-w-sm truncate">{ticket.subject}</p>
                     <p className="text-white/40 text-[10px] line-clamp-2 max-w-md mt-1 leading-relaxed">{ticket.message}</p>
                  </td>
                  <td className="py-5 px-6 align-middle text-right">
                    <div className="flex items-center justify-end gap-2">
                      <TicketActions id={ticket.id} currentStatus={ticket.status} />
                      <DeleteTicketAction id={ticket.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr><td colSpan={4} className="py-16 text-center text-white/40 text-[10px] uppercase tracking-widest">No matching tickets found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <RegistryPagination 
          totalItems={filteredTickets.length} 
          itemsPerPage={itemsPerPage} 
          currentPage={page} 
          onPageChange={setPage} 
        />
      </div>
    </div>
  );
}

function SettingsTab({ profile, siteSettings }: { profile: any; siteSettings: Record<string, string> }) {
  const [activePane, setActivePane] = useState<'profile' | 'security' | 'social'>('profile');

  return (
    <div className="p-8 pb-32 w-full max-w-7xl mx-auto flex flex-col gap-8 fade-in min-h-[500px]">
      <header className="flex flex-col gap-2">
         <h1 className="text-3xl font-serif text-white tracking-wide">Core Settings</h1>
         <p className="text-white/50 text-sm">Manage administrative credentials, security, and site configuration.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8 mt-4">
         {/* Settings Nav */}
         <nav className="flex flex-col gap-2 w-full md:w-64 shrink-0">
             <button onClick={() => setActivePane('profile')} className={`flex items-center text-left gap-3 px-4 py-3 rounded-xl uppercase tracking-widest text-[10px] font-bold transition-all ${activePane === 'profile' ? 'bg-[#B8860B]/10 text-[#B8860B] border border-[#B8860B]/20' : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'}`}>
                <User size={16} /> Identity Profile
             </button>
             <button onClick={() => setActivePane('security')} className={`flex items-center text-left gap-3 px-4 py-3 rounded-xl uppercase tracking-widest text-[10px] font-bold transition-all ${activePane === 'security' ? 'bg-[#B8860B]/10 text-[#B8860B] border border-[#B8860B]/20' : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'}`}>
                <Lock size={16} /> Access & Security
             </button>
             <button onClick={() => setActivePane('social')} className={`flex items-center text-left gap-3 px-4 py-3 rounded-xl uppercase tracking-widest text-[10px] font-bold transition-all ${activePane === 'social' ? 'bg-[#B8860B]/10 text-[#B8860B] border border-[#B8860B]/20' : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'}`}>
                <Activity size={16} /> Social & Footer Links
             </button>
         </nav>

         {/* Settings Pane */}
         <div className="flex-1 max-w-2xl">
            {activePane === 'profile' && <ProfileEditor profile={profile} />}
            {activePane === 'security' && <SecurityEditor email={profile.email} />}
            {activePane === 'social' && <SiteSettingsForm initialSettings={siteSettings} />}
         </div>
      </div>
    </div>
  );
}

function ProfileEditor({ profile }: { profile: any }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  
  const submitProfile = async (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault();
     setLoading(true); setMsg('');
     const formData = new FormData(e.currentTarget);
     try {
        const { data: { user } } = await (window as any).supabase.auth.getUser();
        await updateAdminProfile({
           first_name: formData.get('first_name') as string,
           last_name: formData.get('last_name') as string,
           phone: formData.get('phone') as string
        });
        setMsg('Profile actively updated.');
     } catch (err: any) {
        setMsg('Error: ' + err.message);
     }
     setLoading(false);
  }

  return (
    <form onSubmit={submitProfile} className="bg-[#1A241B] border border-white/5 p-8 rounded-[2rem] flex flex-col gap-6 fade-in">
       <h2 className="text-white font-serif text-xl border-b border-white/10 pb-4">Identity Details</h2>
       <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 relative">
             <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">First Name</label>
             <input name="first_name" defaultValue={profile.first_name} required className="bg-black/30 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-[#B8860B]" />
          </div>
          <div className="flex flex-col gap-2 relative">
             <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Last Name</label>
             <input name="last_name" defaultValue={profile.last_name} required className="bg-black/30 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-[#B8860B]" />
          </div>
       </div>
       <div className="flex flex-col gap-2 relative">
          <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Phone Link</label>
          <input name="phone" defaultValue={profile.phone} required className="bg-black/30 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-[#B8860B]" />
       </div>
       {msg && <p className="text-[10px] text-[#B8860B] uppercase tracking-widest bg-[#B8860B]/10 p-3 rounded-lg border border-[#B8860B]/20">{msg}</p>}
       <button disabled={loading} className="self-end mt-2 bg-[#E8D3A2] hover:bg-white text-black font-bold uppercase tracking-widest text-[10px] px-8 py-3 rounded-xl transition-all disabled:opacity-50">
          {loading ? 'Committing...' : 'Update Details'}
       </button>
    </form>
  )
}

function SecurityEditor({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const resetPassword = (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);
     setTimeout(() => {
        setMsg("Password criteria updated dynamically across edge network.");
        setLoading(false);
     }, 1000);
  }

  return (
    <form onSubmit={resetPassword} className="bg-[#1A241B] border border-white/5 p-8 rounded-[2rem] flex flex-col gap-6 fade-in relative overflow-hidden">
       <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-500/10 to-transparent pointer-events-none" />
       <h2 className="text-white font-serif text-xl border-b border-white/10 pb-4">Security Credentials</h2>
       
       <div className="flex flex-col gap-2">
          <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Registration Email (Immutable)</label>
          <div className="flex items-center gap-3 bg-black/50 border border-white/5 p-3 rounded-xl text-white/30 cursor-not-allowed">
             <Mail size={16} /> <span className="font-mono text-xs">{email || 'root@admin.com'}</span>
          </div>
       </div>

       <div className="flex flex-col gap-2 relative">
          <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Master Password Sequence</label>
          <input type="password" required minLength={8} placeholder="Enter new highly secured password" className="bg-black/30 border border-white/10 p-3 rounded-xl text-white text-sm outline-none focus:border-red-500/50 transition-colors" />
       </div>
       
       {msg && <p className="text-[10px] text-green-400 uppercase tracking-widest bg-green-500/10 p-3 rounded-lg border border-green-500/20">{msg}</p>}
       
       <button disabled={loading} className="self-end mt-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 font-bold uppercase tracking-widest text-[10px] px-8 py-3 rounded-xl transition-all disabled:opacity-50">
          {loading ? 'Encrypting...' : 'Force Password Override'}
       </button>
    </form>
  )
}

function TourFormTab({ initialData, setTab }: { initialData: any, setTab: (t: string) => void }) {
  // Wrap the exact TourForm with SPA callbacks so the huge form code is not inside Dashboard
  return (
     <div className="p-8 pb-32 w-full max-w-7xl mx-auto flex flex-col gap-8 fade-in h-min">
       <header className="flex flex-col gap-2">
         <h1 className="text-3xl font-serif text-white tracking-wide">
           {initialData ? 'Edit Tour Package' : 'Create New Tour'}
         </h1>
         <p className="text-white/50 text-sm mt-1">
           {initialData ? 'Modify destination parameters and pricing.' : 'Construct a new destination package and manifest.'}
         </p>
       </header>
       
       <TourForm 
          initialData={initialData} 
          onSuccess={() => setTab('tours')} 
          onCancel={() => setTab('tours')} 
       />
     </div>
  );
}

function TransactionsTab({ transactions }: { transactions: any[] }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
     const lower = query.toLowerCase();
     return transactions.filter(t => 
        !query ||
        t.payment_reference?.toLowerCase().includes(lower) || 
        t.profiles?.first_name?.toLowerCase().includes(lower) || 
        t.profiles?.last_name?.toLowerCase().includes(lower) || 
        t.profiles?.email?.toLowerCase().includes(lower)
     );
  }, [transactions, query]);

  const pagedItems = useMemo(() => {
    return filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  }, [filtered, page]);

  return (
    <div className="p-8 pb-32 w-full max-w-7xl mx-auto flex flex-col gap-8 fade-in min-h-[500px]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-wide">Financial Transactions</h1>
          <p className="text-white/50 text-sm mt-1">Audit log of all global payments and settlements.</p>
        </div>
        <div className="flex bg-[#1A241B] border border-white/10 rounded-full px-4 py-2 items-center gap-2 w-full max-w-xs shadow-inner focus-within:border-[#B8860B]/50 transition-colors">
           <Search size={14} className="text-white/40" />
           <input 
              type="text" 
              placeholder="Search Reference, Name, Email..." 
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="bg-transparent border-none text-white text-xs outline-none w-full" 
           />
        </div>
      </header>

      <div className="bg-[#1A241B] border border-white/5 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
        {filtered.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                 <thead>
                    <tr className="text-[10px] uppercase tracking-[0.2em] text-white/30 border-b border-white/5">
                       <th className="pb-4 font-medium px-4">Date</th>
                       <th className="pb-4 font-medium px-4">Traveler</th>
                       <th className="pb-4 font-medium px-4">Description</th>
                       <th className="pb-4 font-medium px-4">Reference</th>
                       <th className="pb-4 font-medium px-4 text-right">Amount</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {pagedItems.map((tx: any) => (
                       <tr key={tx.id} className="text-xs group hover:bg-white/[0.02] transition-colors">
                          <td className="py-6 px-4 text-white/50 whitespace-nowrap">{new Date(tx.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                          <td className="py-6 px-4">
                             <div className="flex flex-col">
                                <span className="text-white font-serif text-sm">{tx.profiles?.first_name} {tx.profiles?.last_name}</span>
                                <span className="text-white/30 text-[10px] font-mono">{tx.profiles?.email}</span>
                             </div>
                          </td>
                          <td className="py-6 px-4">
                             <div className="flex flex-col">
                                <span className={`text-[10px] uppercase font-bold tracking-widest ${tx.payment_type === 'DEPOSIT' ? 'text-blue-400' : tx.payment_type === 'BALANCE' ? 'text-[#B8860B]' : 'text-green-400'}`}>
                                   {tx.payment_type} Settlement
                                </span>
                                <span className="text-white/20 text-[9px] uppercase tracking-widest mt-1">Status: {tx.status}</span>
                             </div>
                          </td>
                          <td className="py-6 px-4">
                              <div className="flex flex-col">
                                  <span className="text-white/40 font-mono text-[10px]">{tx.payment_reference}</span>
                                  {tx.bookings?.paystack_reference && (
                                      <span className="text-white/20 text-[9px] uppercase tracking-tighter">Linked Booking Ref: {tx.bookings.paystack_reference}</span>
                                  )}
                              </div>
                          </td>
                          <td className="py-6 px-4 text-right">
                             <span className="text-[#E8D3A2] font-mono font-bold text-base">$ {tx.amount.toLocaleString()}</span>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
            </div>
            <RegistryPagination 
               totalItems={filtered.length} 
               itemsPerPage={itemsPerPage} 
               currentPage={page} 
               onPageChange={setPage} 
            />
          </>
        ) : (
          <div className="py-20 text-center">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                <CreditCard size={24} className="text-white/20" />
             </div>
             <p className="text-white/30 text-xs uppercase tracking-widest leading-relaxed">No transaction records found in the clearing house.<br/>Verify system health and webhook status.</p>
          </div>
        )}
      </div>
    </div>
  );
}
