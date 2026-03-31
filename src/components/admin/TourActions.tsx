// src/components/admin/TourActions.tsx
"use client";

import { useTransition } from "react";
import { deleteTour } from "@/actions/admin";
import { Loader2, Trash2 } from "lucide-react";

export function DeleteTourAction({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this tour? This will remove the tour manifest and any associated metadata permanently.")) return;
    
    startTransition(async () => {
       try {
         await deleteTour(id);
       } catch (err) {
         console.error("Failed to delete tour:", err);
         alert("Failed to delete tour. Check console for details.");
       }
    });
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
      title="Delete Tour"
    >
      {isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
    </button>
  );
}
