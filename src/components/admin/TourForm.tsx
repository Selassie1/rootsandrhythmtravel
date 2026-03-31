// src/components/admin/TourForm.tsx
"use client";

import { useState, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Loader2, Image as ImageIcon, ChevronDown } from "lucide-react";
import { createTour, updateTour, uploadTourImage } from "@/actions/admin";
import { useRouter } from "next/navigation";

const getSlug = (title: string) => title.toLowerCase().trim().replace(/[\s\W-]+/g, '-');

const tourSchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z.string().min(3, "Slug is required"),
  description_heading: z.string().optional(),
  description_body: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  deposit: z.number().min(0, "Deposit must be positive"),
  duration_days: z.number().min(1, "Duration must be at least 1 day"),
  region: z.enum([
    'GREATER_ACCRA', 'ASHANTI', 'VOLTA', 'CENTRAL', 'EASTERN', 
    'WESTERN', 'NORTHERN', 'UPPER_EAST', 'UPPER_WEST', 'SAVANNAH', 
    'BONO', 'BONO_EAST', 'AHAFO', 'NORTH_EAST', 'OTI', 
    'WESTERN_NORTH', 'MULTIPLE'
  ]).default('GREATER_ACCRA'),
  location: z.string().optional(),
  hero_image_url: z.string().optional(),
  is_active: z.boolean().default(true),
  curated_inclusions: z.array(z.string()).default([]),
  itinerary: z.array(
    z.object({
      day: z.number(),
      title: z.string().min(1, "Title is required"),
      details: z.string().min(1, "Details are required"),
    })
  ).default([]),
});

type TourFormValues = z.infer<typeof tourSchema>;

export default function TourForm({ initialData, onSuccess, onCancel }: { initialData?: any, onSuccess?: () => void, onCancel?: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // We explicitly cast the resolver as any to prevent strict Zod enum typing mismatching with generic hook-form inference over undefined/defaults
  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourSchema) as any,
    defaultValues: initialData || {
      title: "",
      slug: "",
      description_heading: "",
      description_body: "",
      price: 0,
      deposit: 0,
      duration_days: 1,
      region: "GREATER_ACCRA",
      location: "",
      hero_image_url: "",
      is_active: true,
      curated_inclusions: [""],
      itinerary: [{ day: 1, title: "", details: "" }],
    },
  });

  const { fields: inclusionFields, append: appendInclusion, remove: removeInclusion } = useFieldArray({
    control: form.control,
    name: "curated_inclusions" as never,
  });

  const { fields: itineraryFields, append: appendItinerary, remove: removeItinerary } = useFieldArray({
    control: form.control,
    name: "itinerary",
  });

  // Watch title to auto-generate slug for new tours
  const title = form.watch("title");
  if (!initialData && title && !form.formState.dirtyFields.slug) {
    form.setValue("slug", getSlug(title));
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError(null);
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      // Execute Secure Server Node-Bridge bypassing standard Frontend RLS Blockages
      const result = await uploadTourImage(formData);

      if (!result.success) throw new Error(result.error || "Storage rejected the upload.");

      form.setValue("hero_image_url", result.url!);
    } catch (err: any) {
      setError(err.message || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data: TourFormValues) => {
    setError(null);
    startTransition(async () => {
      try {
        if (initialData) {
          const result = await updateTour(initialData.id, data);
          if (!result.success) {
            setError(result.error || "Unknown error occurred.");
            return;
          }
          if (onSuccess) onSuccess();
          else {
            router.refresh();
            router.push("/admin/tours");
          }
        } else {
          const result = await createTour(data);
          if (!result.success) {
            setError(result.error || "Unknown error occurred.");
            return;
          }
          if (onSuccess) onSuccess();
          else {
            router.refresh();
            router.push("/admin/tours");
          }
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      }
    });
  };

  const currentImageUrl = form.watch("hero_image_url");

  return (
    <form onSubmit={form.handleSubmit(onSubmit as any)} className="w-full max-w-7xl mx-auto flex flex-col gap-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      {/* Core Details */}
      <div className="bg-[#1A241B] border border-white/5 rounded-2xl p-8 space-y-6">
        <h2 className="text-[#B8860B] font-bold text-xs uppercase tracking-[0.2em] mb-4">Core Identifier</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Tour Title</label>
            <input 
              {...form.register("title")} 
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#B8860B] transition-colors"
              placeholder="e.g. 10-Day Ghana Heritage Tour"
            />
            {form.formState.errors.title && <p className="text-red-400 text-xs mt-1">{form.formState.errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">URL Slug</label>
            <input 
              {...form.register("slug")} 
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white/50 focus:outline-none focus:border-[#B8860B] transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
           <div>
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Hero Image</label>
            
            <div className="flex items-start gap-6">
               <div 
                 className="w-32 h-32 rounded-xl bg-black/20 border border-dashed border-white/20 flex flex-col items-center justify-center shrink-0 overflow-hidden relative group"
               >
                 {currentImageUrl ? (
                    <img src={currentImageUrl} alt="Tour Hero" className="w-full h-full object-cover" />
                 ) : (
                    <ImageIcon className="text-white/20 mb-2" size={24} />
                 )}
                 {uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                       <Loader2 className="animate-spin text-[#B8860B]" size={24} />
                    </div>
                 )}
               </div>
               
               <div className="flex-1">
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                    />
                    <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white text-sm text-center transition-colors">
                      {uploading ? 'Uploading to Supabase...' : 'Browse Native File'}
                    </div>
                  </div>
                  <p className="text-white/30 text-xs mt-3 leading-relaxed">Ensure you have created an 'images' bucket in Supabase storage and set it to public.</p>
                  <input type="hidden" {...form.register("hero_image_url")} />
               </div>
            </div>
          </div>

          <div className="space-y-6">
              <div className="relative z-20">
                <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Ghana Region Profile</label>
                <PremiumRegionSelector 
                   value={form.watch("region")} 
                   onChange={(v) => form.setValue("region", v as any)} 
                />
              </div>

              <div>
                <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Location Descriptor</label>
                <input 
                  {...form.register("location")} 
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#B8860B]/50 transition-colors"
                  placeholder="e.g. Kumasi City & Palace"
                />
              </div>

              <div className="flex items-center gap-4 bg-black/20 px-4 py-3 rounded-xl border border-white/10">
                 <input 
                   type="checkbox" 
                   id="is_active" 
                   {...form.register("is_active")}
                   className="w-5 h-5 accent-[#B8860B] rounded border-white/20 bg-black/50"
                 />
                 <label htmlFor="is_active" className="text-white text-sm cursor-pointer select-none">
                   Tour is Active (Visible to public)
                 </label>
              </div>
          </div>
        </div>
      </div>

      {/* Pricing & Duration */}
      <div className="bg-[#1A241B] border border-white/5 rounded-2xl p-8 space-y-6">
        <h2 className="text-[#B8860B] font-bold text-xs uppercase tracking-[0.2em] mb-4">Pricing & Duration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Total Price ($)</label>
            <input 
              type="number"
              {...form.register("price", { valueAsNumber: true })} 
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#B8860B] transition-colors"
            />
            {form.formState.errors.price && <p className="text-red-400 text-xs mt-1">{form.formState.errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Required Deposit ($)</label>
            <input 
              type="number"
              {...form.register("deposit", { valueAsNumber: true })} 
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#B8860B] transition-colors"
            />
          </div>

          <div>
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Duration (Days)</label>
            <input 
              type="number"
              {...form.register("duration_days", { valueAsNumber: true })} 
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#B8860B] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Copywriting */}
      <div className="bg-[#1A241B] border border-white/5 rounded-2xl p-8 space-y-6">
        <h2 className="text-[#B8860B] font-bold text-xs uppercase tracking-[0.2em] mb-4">Marketing Copy</h2>
        <div>
          <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Description Heading</label>
          <input 
            {...form.register("description_heading")} 
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#B8860B]/50 transition-colors"
            placeholder="e.g. Journey into the heart of Accra"
          />
        </div>
        <div>
          <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Description Body</label>
          <textarea 
            {...form.register("description_body")} 
            rows={5}
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#B8860B]/50 transition-colors resize-none"
            placeholder="Detailed description of the experience..."
          />
        </div>
      </div>

      {/* Dynamic Arrays - Inclusions */}
      <div className="bg-[#1A241B] border border-white/5 rounded-2xl p-8 space-y-6">
        <h2 className="text-[#B8860B] font-bold text-xs uppercase tracking-[0.2em] mb-4">Curated Inclusions</h2>
        <div className="space-y-4">
          {inclusionFields.map((field, index) => (
            <div key={field.id} className="flex gap-4">
              <input
                {...form.register(`curated_inclusions.${index}` as const)}
                className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#B8860B]/50 transition-colors"
                placeholder="e.g. 5-Star Luxury Accommodation"
              />
              <button 
                type="button" 
                onClick={() => removeInclusion(index)}
                className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors border border-red-500/20"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendInclusion("")}
            className="flex items-center gap-2 text-[#B8860B] text-sm font-bold uppercase tracking-wider hover:text-[#D4AF37] transition-colors py-2"
          >
            <Plus size={16} /> Add Inclusion
          </button>
        </div>
      </div>

      {/* Dynamic Arrays - Itinerary */}
      <div className="bg-[#1A241B] border border-white/5 rounded-2xl p-8 space-y-6">
        <h2 className="text-[#B8860B] font-bold text-xs uppercase tracking-[0.2em] mb-4">Daily Itinerary Matrix</h2>
        <div className="space-y-8">
          {itineraryFields.map((field, index) => (
            <div key={field.id} className="bg-black/20 border border-white/5 rounded-xl p-6 relative">
              <div className="absolute top-6 right-6">
                <button 
                  type="button" 
                  onClick={() => removeItinerary(index)}
                  className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pr-12">
                <div className="md:col-span-1">
                  <label className="block text-white/50 text-[10px] uppercase tracking-wider mb-2">Day No.</label>
                  <input
                    type="number"
                    {...form.register(`itinerary.${index}.day` as const, { valueAsNumber: true })}
                    className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2 text-white focus:outline-none text-sm"
                  />
                  {form.formState.errors.itinerary?.[index]?.day && <p className="text-red-400 text-xs mt-1">Invalid.</p>}
                </div>
                <div className="md:col-span-3">
                  <label className="block text-white/50 text-[10px] uppercase tracking-wider mb-2">Day Title</label>
                  <input
                    {...form.register(`itinerary.${index}.title` as const)}
                    className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#B8860B]/30 text-sm transition-colors"
                    placeholder="e.g. Arrival & Welcome Dinner"
                  />
                  {form.formState.errors.itinerary?.[index]?.title && <p className="text-red-400 text-xs mt-1">Required.</p>}
                </div>
                <div className="md:col-span-4">
                  <label className="block text-white/50 text-[10px] uppercase tracking-wider mb-2">Full Details</label>
                  <textarea
                    {...form.register(`itinerary.${index}.details` as const)}
                    rows={4}
                    className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-3 text-white/80 focus:outline-none focus:border-[#B8860B]/30 text-sm transition-colors resize-none"
                    placeholder="Details about activities for the day..."
                  />
                  {form.formState.errors.itinerary?.[index]?.details && <p className="text-red-400 text-xs mt-1">Required.</p>}
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendItinerary({ day: itineraryFields.length + 1, title: "", details: "" })}
            className="flex items-center justify-center w-full py-4 border border-dashed border-white/10 rounded-xl text-white/50 hover:text-[#B8860B] hover:border-[#B8860B]/30 hover:bg-[#B8860B]/5 transition-all gap-2 text-sm font-bold uppercase tracking-wider"
          >
            <Plus size={16} /> Add Itinerary Day
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4">
         <button 
           type="button" 
           onClick={() => onCancel ? onCancel() : router.back()}
           className="px-6 py-4 rounded-xl font-bold uppercase text-xs tracking-wider text-white/50 hover:text-white transition-colors"
         >
           Cancel
         </button>
         <button 
           type="submit" 
           disabled={isPending || uploading}
           className="px-8 py-4 bg-[#B8860B] hover:bg-[#D4AF37] text-black rounded-xl font-bold uppercase text-xs tracking-[0.1em] shadow-[0_0_20px_rgba(184,134,11,0.2)] hover:shadow-[0_0_30px_rgba(184,134,11,0.4)] disabled:opacity-50 transition-all flex items-center gap-2"
         >
           {isPending ? <><Loader2 className="animate-spin" size={16}/> Saving...</> : (initialData ? 'Update Tour' : 'Publish Tour')}
         </button>
      </div>
    </form>
  );
}

// ----------------------------------------------------
// Custom Glassmorphic Internal UI Component
// ----------------------------------------------------

const REGIONS = [
  { value: 'GREATER_ACCRA', label: 'Greater Accra' },
  { value: 'ASHANTI', label: 'Ashanti' },
  { value: 'VOLTA', label: 'Volta' },
  { value: 'CENTRAL', label: 'Central' },
  { value: 'EASTERN', label: 'Eastern' },
  { value: 'WESTERN', label: 'Western' },
  { value: 'NORTHERN', label: 'Northern' },
  { value: 'UPPER_EAST', label: 'Upper East' },
  { value: 'UPPER_WEST', label: 'Upper West' },
  { value: 'SAVANNAH', label: 'Savannah' },
  { value: 'BONO', label: 'Bono' },
  { value: 'BONO_EAST', label: 'Bono East' },
  { value: 'AHAFO', label: 'Ahafo' },
  { value: 'NORTH_EAST', label: 'North East' },
  { value: 'OTI', label: 'Oti' },
  { value: 'WESTERN_NORTH', label: 'Western North' },
  { value: 'MULTIPLE', label: 'Multiple / Cross-Country' }
];

function PremiumRegionSelector({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const current = REGIONS.find(r => r.value === value) || REGIONS[0];

  return (
    <div className="relative">
      <button 
        type="button" 
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#B8860B] transition-colors"
      >
        <span>{current.label}</span>
        <ChevronDown size={16} className={`text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
        <div className="fixed inset-0 z-10 cursor-default" onClick={() => setOpen(false)} />
        <div className="absolute top-full left-0 w-full mt-2 bg-[#1A241B] border border-white/10 rounded-xl overflow-hidden z-20 shadow-[-10px_20px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <div className="max-h-60 overflow-y-auto flex flex-col py-2">
            {REGIONS.map(r => (
               <button
                 key={r.value}
                 type="button"
                 onClick={() => { onChange(r.value); setOpen(false); }}
                 className={`text-left px-4 py-3 text-sm transition-colors ${value === r.value ? 'bg-[#B8860B]/10 text-[#B8860B] font-bold border-l-2 border-[#B8860B]' : 'text-white/60 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}
               >
                 {r.label}
               </button>
            ))}
          </div>
        </div>
        </>
      )}
    </div>
  )
}
