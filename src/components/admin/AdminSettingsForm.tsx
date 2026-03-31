// src/components/admin/AdminSettingsForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Mail, Phone, User, CheckCircle } from 'lucide-react';
import { updateAdminProfile } from '@/actions/admin';

const profileSchema = z.object({
  first_name: z.string().min(2, "First name is too short"),
  last_name: z.string().min(2, "Last name is too short"),
  phone: z.string().min(8, "Phone number is too short"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function AdminSettingsForm({ initialData, email }: { initialData: any, email: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: initialData.first_name || '',
      last_name: initialData.last_name || '',
      phone: initialData.phone || '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    setSuccess(false);
    setErrorMsg('');

    try {
      await updateAdminProfile(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to update profile settings.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl bg-[#1A241B] border border-white/5 p-8 rounded-[2rem] flex flex-col gap-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#B8860B]/20 to-transparent opacity-50 pointer-events-none" />

      {/* Read Only Email */}
      <div className="flex flex-col gap-2">
        <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Account Email</label>
        <div className="flex items-center gap-3 bg-black/20 p-4 border border-white/5 rounded-xl text-white/50 cursor-not-allowed">
           <Mail size={18} />
           <span className="font-mono text-sm">{email}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2 relative">
          <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">First Name</label>
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              {...register('first_name')}
              type="text"
              placeholder="Enter first name"
              className="w-full bg-black/30 border border-white/10 p-4 pl-12 rounded-xl text-white text-sm outline-none focus:border-[#B8860B] transition-colors"
            />
          </div>
          {errors.first_name && <span className="text-red-400 text-xs">{errors.first_name.message}</span>}
        </div>

        <div className="flex flex-col gap-2 relative">
          <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Last Name</label>
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              {...register('last_name')}
              type="text"
              placeholder="Enter last name"
              className="w-full bg-black/30 border border-white/10 p-4 pl-12 rounded-xl text-white text-sm outline-none focus:border-[#B8860B] transition-colors"
            />
          </div>
          {errors.last_name && <span className="text-red-400 text-xs">{errors.last_name.message}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-2 relative">
        <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Phone Number</label>
        <div className="relative">
          <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            {...register('phone')}
            type="text"
            placeholder="e.g. +233 24 123 4567"
            className="w-full bg-black/30 border border-white/10 p-4 pl-12 rounded-xl text-white text-sm outline-none focus:border-[#B8860B] transition-colors"
          />
        </div>
        {errors.phone && <span className="text-red-400 text-xs">{errors.phone.message}</span>}
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">
          {errorMsg}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm flex items-center gap-3">
          <CheckCircle size={18} /> Settings saved successfully.
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 bg-[#E8D3A2] text-black font-bold uppercase tracking-widest text-xs px-8 py-5 rounded-2xl transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3"
      >
        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Save Changes'}
      </button>

    </form>
  );
}
