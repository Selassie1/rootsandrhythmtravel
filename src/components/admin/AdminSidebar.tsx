// src/components/admin/AdminSidebar.tsx
'use client';

import { useTransition } from 'react';
import { LayoutDashboard, Users, CreditCard, Ticket, Settings, LogOut, Tags, Activity } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { name: 'Overview', id: 'overview', icon: LayoutDashboard },
  { name: 'Bookings', id: 'bookings', icon: CreditCard },
  { name: 'Transactions', id: 'transactions', icon: Activity },
  { name: 'Tours', id: 'tours', icon: Ticket },
  { name: 'Users', id: 'users', icon: Users },
  { name: 'Tickets', id: 'tickets', icon: Tags },
];

export default function AdminSidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  const [, startTransition] = useTransition();

  const handleTab = (id: string) => {
    // startTransition strictly keeps React 18 from halting the main thread during DOM swap
    startTransition(() => {
       setActiveTab(id);
    });
  }

  return (
    <aside className="w-full md:w-72 bg-[#1A241B] border-r border-white/5 flex flex-col pt-8 pb-8 px-6 shrink-0 z-20 h-full overflow-y-auto overflow-x-hidden">
      
      {/* Footer-Synced Brand Lockup */}
      <div className="mb-12 flex flex-col gap-4 fade-in group cursor-pointer" onClick={() => handleTab('overview')}>
        <div className="flex items-center gap-3">
          <Link href="/">
           <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
           </Link>
           <Link href="/">
           <div className="flex flex-col justify-center">
             <span className="text-[#F9B729] font-black text-sm leading-none tracking-widest uppercase">Roots &</span>
             <span className="text-[#E63931] font-black text-sm leading-none tracking-widest uppercase mt-1">Rhythm</span>
             <span className="text-[#178548] font-extrabold text-[10px] leading-none tracking-[0.3em] uppercase mt-1.5">Travels</span>
           </div>
           </Link>
        </div>
        <div className="h-[1px] w-full bg-gradient-to-r from-white/10 to-transparent mt-2" />
        <span className="text-[#F9B729]/60 text-[10px] font-black uppercase tracking-[0.2em]">Admin Dashboard</span>
      </div>

      {/* Navigation Core */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleTab(item.id)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.1em] transition-all duration-200 text-left cursor-pointer ${
                isActive
                  ? 'bg-[#B8860B] text-black shadow-[0_0_20px_rgba(184,134,11,0.2)] scale-[1.02]'
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-black' : ''} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-2 shrink-0">
        <button 
          onClick={() => handleTab('settings')}
          className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.1em] transition-all duration-200 text-left ${
            activeTab === 'settings'
              ? 'bg-[#B8860B] text-black shadow-[0_0_20px_rgba(184,134,11,0.2)] scale-[1.02]'
              : 'text-white/50 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Settings size={18} /> Settings
        </button>
        {/* <Link href="/" className="w-full flex items-center gap-4 px-4 py-3 text-white/40 hover:text-white hover:bg-white/5 rounded-xl font-bold text-xs uppercase tracking-[0.1em] transition-colors cursor-pointer justify-start">
           Return Home
        </Link> */}
        <form action="/auth/signout" method="post" className="w-full">
          <button type="submit" className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl font-bold text-xs uppercase tracking-[0.1em] transition-colors cursor-pointer justify-start">
            <LogOut size={18} /> Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
