// src/components/admin/UserActions.tsx
"use client";

import { useTransition } from "react";
import { updateUserRole, deleteUser } from "@/actions/admin";
import { Loader2, Trash2 } from "lucide-react";

export function RoleAction({ id, currentRole }: { id: string, currentRole: string }) {
  const [isPending, startTransition] = useTransition();

  const toggleRole = () => {
    const newRole = currentRole === "admin" ? "traveler" : "admin";
    startTransition(async () => {
       try {
         await updateUserRole(id, newRole);
       } catch (err) {
         console.error("Failed to update role");
       }
    });
  };

  return (
    <button 
      onClick={toggleRole}
      disabled={isPending}
      className={`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest flex items-center gap-2 transition-colors border ${
        currentRole === "admin" 
          ? "bg-[#B8860B]/10 text-[#B8860B] border-[#B8860B]/20 hover:bg-[#B8860B]/20" 
          : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10"
      }`}
    >
      {isPending && <Loader2 size={10} className="animate-spin" />}
      {currentRole === "admin" ? "Demote to Traveler" : "Promote to Admin"}
    </button>
  );
}

export function DeleteUserAction({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Are you absolutely sure you want to delete this user? This action is irreversible and will remove their authentication record.")) return;
    
    startTransition(async () => {
       try {
         await deleteUser(id);
       } catch (err) {
         console.error("Failed to delete user:", err);
         alert("Failed to delete user. Check console for details.");
       }
    });
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
      title="Delete User"
    >
      {isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
    </button>
  );
}
