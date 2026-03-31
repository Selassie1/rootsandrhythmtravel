// src/components/admin/BookingActions.tsx
"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { updateBookingStatus, updatePaymentStatus, deleteBooking } from "@/actions/admin";
import { Loader2, Trash2, ChevronDown, Check } from "lucide-react";

/**
 * A premium, glassmorphism dropdown that stops propagation to prevent modal triggers.
 */
function CustomDropdown({ value, options, onChange, isPending, variant = 'default' }: { 
  value: string, 
  options: string[], 
  onChange: (val: string) => void, 
  isPending: boolean,
  variant?: 'default' | 'gold'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPending) setIsOpen(!isOpen);
  };

  const handleSelect = (option: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg border transition-all text-[10px] font-bold uppercase tracking-widest min-w-[140px] ${
          variant === 'gold' 
            ? 'bg-[#B8860B]/10 border-[#B8860B]/30 text-[#B8860B] hover:bg-[#B8860B]/20' 
            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
        } ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className="truncate">{value.replace("_", " ")}</span>
        {isPending ? <Loader2 size={10} className="animate-spin" /> : <ChevronDown size={10} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#1A241B] border border-white/10 shadow-3xl z-[150] overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={(e) => handleSelect(option, e)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  value === option ? 'bg-[#B8860B] text-black' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                {option.replace("_", " ")}
                {value === option && <Check size={10} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function BookingStatusAction({ id, currentStatus }: { id: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition();
  const statuses = ["PENDING_APPROVAL", "CONFIRMED", "CANCELLED", "COMPLETED"];

  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      try {
        await updateBookingStatus(id, newStatus);
      } catch (err) {
        console.error("Status Update Failed", err);
      }
    });
  };

  return (
    <CustomDropdown 
      value={currentStatus} 
      options={statuses} 
      onChange={handleStatusChange} 
      isPending={isPending} 
    />
  );
}

export function PaymentStatusAction({ id, currentStatus }: { id: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition();
  const statuses = ["PENDING", "DEPOSIT_PAID", "FULLY_PAID", "REFUNDED", "FAILED"];

  const handlePaymentChange = (newStatus: string) => {
    startTransition(async () => {
      try {
        await updatePaymentStatus(id, newStatus);
      } catch (err) {
        console.error("Payment Update Failed", err);
      }
    });
  };

  return (
    <CustomDropdown 
      value={currentStatus} 
      options={statuses} 
      onChange={handlePaymentChange} 
      isPending={isPending}
      variant="gold"
    />
  );
}

export function DeleteBookingAction({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Confirm removal of this booking ledger?")) return;
    
    startTransition(async () => {
       try {
         await deleteBooking(id);
       } catch (err) {
         console.error("Deletion failed", err);
       }
    });
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/20 shadow-lg"
      title="Delete Booking"
    >
      {isPending ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
    </button>
  );
}
