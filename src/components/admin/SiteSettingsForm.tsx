'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Instagram, Twitter, Facebook, CheckCircle, Link } from 'lucide-react';
import { updateSiteSettings } from '@/actions/admin';

const siteSettingsSchema = z.object({
  instagram_url: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  twitter_url: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  facebook_url: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
});

type SiteSettingsValues = z.infer<typeof siteSettingsSchema>;

export default function SiteSettingsForm({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SiteSettingsValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      instagram_url: initialSettings.instagram_url || '',
      twitter_url: initialSettings.twitter_url || '',
      facebook_url: initialSettings.facebook_url || '',
    },
  });

  const onSubmit = async (data: SiteSettingsValues) => {
    setIsSubmitting(true);
    setSuccess(false);
    setErrorMsg('');
    try {
      const payload: Record<string, string> = {
        instagram_url: data.instagram_url || '',
        twitter_url: data.twitter_url || '',
        facebook_url: data.facebook_url || '',
      };
      const result = await updateSiteSettings(payload);
      if (!result.success) throw new Error(result.error || 'Failed to save settings.');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl bg-[#1A241B] border border-white/5 p-8 rounded-[2rem] flex flex-col gap-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#B8860B]/20 to-transparent opacity-50 pointer-events-none" />

      <div className="flex flex-col gap-1 mb-2">
        <h3 className="text-white font-bold text-lg">Social Links</h3>
        <p className="text-white/40 text-xs">These URLs appear in the footer of the public website.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Instagram URL</label>
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.88z"/></svg>
          <input
            {...register('instagram_url')}
            type="url"
            placeholder="https://instagram.com/rootsandrhythmtravels"
            className="w-full bg-black/30 border border-white/10 p-4 pl-12 rounded-xl text-white text-sm outline-none focus:border-[#B8860B] transition-colors"
          />
        </div>
        {errors.instagram_url && <span className="text-red-400 text-xs">{errors.instagram_url.message}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">X (Twitter) URL</label>
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          <input
            {...register('twitter_url')}
            type="url"
            placeholder="https://x.com/rootsandrhythm"
            className="w-full bg-black/30 border border-white/10 p-4 pl-12 rounded-xl text-white text-sm outline-none focus:border-[#B8860B] transition-colors"
          />
        </div>
        {errors.twitter_url && <span className="text-red-400 text-xs">{errors.twitter_url.message}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Facebook URL</label>
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
          <input
            {...register('facebook_url')}
            type="url"
            placeholder="https://facebook.com/rootsandrhythmtravels"
            className="w-full bg-black/30 border border-white/10 p-4 pl-12 rounded-xl text-white text-sm outline-none focus:border-[#B8860B] transition-colors"
          />
        </div>
        {errors.facebook_url && <span className="text-red-400 text-xs">{errors.facebook_url.message}</span>}
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">
          {errorMsg}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm flex items-center gap-3">
          <CheckCircle size={18} /> Social links saved. Footer updated.
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 bg-[#E8D3A2] text-black font-bold uppercase tracking-widest text-xs px-8 py-5 rounded-2xl transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3"
      >
        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Save Social Links'}
      </button>
    </form>
  );
}
