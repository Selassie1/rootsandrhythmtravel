// src/components/admin/TicketActions.tsx
'use client';

import { useState, useTransition } from 'react';
import { updateTicketStatus, deleteTicket } from '@/actions/admin';
import { Loader2, ChevronDown, Trash2 } from 'lucide-react';

export default function TicketActions({ id, currentStatus }: { id: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);

    try {
      await updateTicketStatus(id, newStatus);
    } catch (error: any) {
      alert(error.message || 'Failed to update ticket status');
      setStatus(currentStatus);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'OPEN': return 'text-red-400 border-red-400/20 bg-red-400/10';
      case 'IN_PROGRESS': return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10';
      case 'RESOLVED': return 'text-green-400 border-green-400/20 bg-green-400/10';
      case 'CLOSED': return 'text-white/40 border-white/10 bg-white/5';
      default: return 'text-white border-white/20 bg-white/10';
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <select
        value={status}
        onChange={handleStatusChange}
        disabled={loading}
        className={`appearance-none bg-transparent border rounded-full px-3 py-1 pr-8 text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer transition-colors disabled:opacity-50 ${getStatusColor(status)}`}
      >
        <option value="OPEN" className="bg-[#1A241B] text-white">Open</option>
        <option value="IN_PROGRESS" className="bg-[#1A241B] text-white">In Progress</option>
        <option value="RESOLVED" className="bg-[#1A241B] text-white">Resolved</option>
        <option value="CLOSED" className="bg-[#1A241B] text-white">Closed</option>
      </select>
      
      <div className="absolute right-2 pointer-events-none text-current opacity-70">
        {loading ? <Loader2 size={12} className="animate-spin" /> : <ChevronDown size={12} />}
      </div>
    </div>
  );
}

export function DeleteTicketAction({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this support ticket?")) return;
    
    startTransition(async () => {
       try {
         await deleteTicket(id);
       } catch (err) {
         console.error("Failed to delete ticket:", err);
         alert("Failed to delete ticket.");
       }
    });
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
      title="Delete Ticket"
    >
      {isPending ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
    </button>
  );
}
