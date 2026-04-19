// src/components/admin/TourForm.tsx
"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Loader2, Image as ImageIcon, ChevronDown, Calendar, Users, MapPin, Tag, X, Upload, CheckCircle } from "lucide-react";
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
  experience: z.enum(['CELEBRATION', 'DIASPORA', 'SPIRITUAL', 'ADVENTURE', 'EDUCATIONAL']).default('DIASPORA'),
  ideal_for: z.enum(['SOLO', 'COUPLE', 'FAMILY', 'SMALL_GROUP', 'LARGE_GROUP']).default('SMALL_GROUP'),
  travel_window: z.string().optional(),
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
      experience: "DIASPORA",
      ideal_for: "SMALL_GROUP",
      travel_window: new Date().toISOString().split('T')[0],
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
    <form onSubmit={form.handleSubmit(onSubmit as any)} className="w-full max-w-7xl mx-auto flex flex-col gap-6 pb-20">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      {/* Identifiers & Hero */}
      <div className="bg-[#1A241B] border border-white/5 rounded-2xl p-8 space-y-6">
        <h2 className="text-[#B8860B] font-bold text-xs uppercase tracking-[0.2em] mb-4">Core Identity</h2>
        
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
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Hero Branding</label>
            <div className="flex items-start gap-6">
               <div className="w-32 h-32 rounded-xl bg-black/20 border border-dashed border-white/20 flex flex-col items-center justify-center shrink-0 overflow-hidden relative group">
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
                      {uploading ? 'Processing Image...' : 'Select File'}
                    </div>
                  </div>
                  <p className="text-white/30 text-[10px] mt-2 italic">Standard aspect ratio (16:9 or 4:3) recommended.</p>
                  <input type="hidden" {...form.register("hero_image_url")} />
               </div>
            </div>
          </div>

          <div className="space-y-4">
              <div>
                <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Primary Region</label>
                <PremiumSelector 
                   value={form.watch("region")} 
                   onChange={(v) => form.setValue("region", v as any)} 
                   options={REGIONS}
                />
              </div>

              <div>
                <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Physical Location</label>
                <input 
                  {...form.register("location")} 
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#B8860B]/50 transition-colors"
                  placeholder="e.g. Kumasi City, Ashanti"
                />
              </div>
          </div>
        </div>
      </div>

      {/* Targeting & Schedule */}
      <div className="bg-[#1A241B] border border-white/5 rounded-2xl p-8 space-y-6">
        <h2 className="text-[#B8860B] font-bold text-xs uppercase tracking-[0.2em] mb-4">Targeting & Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Tour Type</label>
            <PremiumSelector 
               value={form.watch("experience")} 
               onChange={(v) => form.setValue("experience", v as any)} 
               options={EXPERIENCES}
            />
          </div>

          <div>
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Ideal Audience</label>
            <PremiumSelector 
               value={form.watch("ideal_for")} 
               onChange={(v) => form.setValue("ideal_for", v as any)} 
               options={CATEGORIES}
            />
          </div>

          <div>
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Travel Window / Date</label>
            <div className="relative">
              <input 
                type="date"
                {...form.register("travel_window")}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#B8860B] transition-colors appearance-none"
              />
              <Calendar className="absolute right-4 top-3 text-white/20 pointer-events-none" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Financials & Logistics */}
      <div className="bg-[#1A241B] border border-white/5 rounded-2xl p-8 space-y-6">
        <h2 className="text-[#B8860B] font-bold text-xs uppercase tracking-[0.2em] mb-4">Pricing & Timeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Package Price ($)</label>
            <input 
              type="number"
              {...form.register("price", { valueAsNumber: true })} 
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#B8860B] transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Reservation Deposit ($)</label>
            <input 
              type="number"
              {...form.register("deposit", { valueAsNumber: true })} 
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#B8860B] transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Total Duration (Days)</label>
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
        <h2 className="text-[#B8860B] font-bold text-xs uppercase tracking-[0.2em] mb-4">Marketing Layout</h2>
        <div>
          <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Display Heading</label>
          <input 
            {...form.register("description_heading")} 
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#B8860B]/50 transition-colors"
            placeholder="e.g. A Deep Dive into Culture"
          />
        </div>
        <div>
          <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Curated Description</label>
          <textarea 
            {...form.register("description_body")} 
            rows={5}
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#B8860B]/50 transition-colors resize-none"
            placeholder="Describe the aesthetic and soul of this journey..."
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
                </div>
                <div className="md:col-span-3">
                  <label className="block text-white/50 text-[10px] uppercase tracking-wider mb-2">Day Title</label>
                  <input
                    {...form.register(`itinerary.${index}.title` as const)}
                    className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#B8860B]/30 text-sm transition-colors"
                    placeholder="e.g. Arrival & Welcome Dinner"
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="block text-white/50 text-[10px] uppercase tracking-wider mb-2">Full Details</label>
                  <textarea
                    {...form.register(`itinerary.${index}.details` as const)}
                    rows={4}
                    className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-3 text-white/80 focus:outline-none focus:border-[#B8860B]/30 text-sm transition-colors resize-none"
                    placeholder="Details about activities for the day..."
                  />
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

      <div className="flex items-center justify-between bg-black/20 p-6 rounded-2xl border border-white/5">
        <div className="flex items-center gap-4">
           <input 
             type="checkbox" 
             id="is_active" 
             {...form.register("is_active")}
             className="w-6 h-6 accent-[#B8860B] rounded border-white/20 bg-black/50"
           />
           <label htmlFor="is_active" className="text-white font-bold text-sm cursor-pointer select-none">
             Public Availability
           </label>
        </div>
        <div className="flex items-center gap-4">
           <button 
             type="button" 
             onClick={() => onCancel ? onCancel() : router.back()}
             className="px-6 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest text-white/50 hover:text-white transition-colors"
           >
             Discard
           </button>
           <button 
             type="submit" 
             disabled={isPending || uploading}
             className="px-10 py-4 bg-[#B8860B] hover:bg-[#D4AF37] text-black rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-lg disabled:opacity-50 transition-all flex items-center gap-3"
           >
             {isPending ? <Loader2 className="animate-spin" size={16}/> : (initialData ? 'Update Record' : 'Publish Tour')}
           </button>
        </div>
      </div>
    </form>
  );
}

// ----------------------------------------------------
// UI Constants & Components
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
  { value: 'MULTIPLE', label: 'Multiple Locations' }
];

const EXPERIENCES = [
  { value: 'CELEBRATION', label: 'Celebration' },
  { value: 'DIASPORA', label: 'Diaspora Return' },
  { value: 'SPIRITUAL', label: 'Spiritual' },
  { value: 'ADVENTURE', label: 'Adventure' },
  { value: 'EDUCATIONAL', label: 'Educational' }
];

const CATEGORIES = [
  { value: 'SOLO', label: 'Solo Traveler' },
  { value: 'COUPLE', label: 'Couples' },
  { value: 'FAMILY', label: 'Families' },
  { value: 'SMALL_GROUP', label: 'Small Groups' },
  { value: 'LARGE_GROUP', label: 'Large Groups' }
];



function PremiumSelector({ value, onChange, options }: { value: string, onChange: (v: string) => void, options: {value: string, label: string}[] }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropUp, setDropUp] = useState(false);
  const current = options.find(r => r.value === value) || options[0];

  useEffect(() => {
    if (open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 260) { 
        setDropUp(true);
      } else {
        setDropUp(false);
      }
    }
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button 
        type="button" 
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#B8860B] transition-all hover:bg-black/50 group"
      >
        <span className="truncate group-hover:text-[#B8860B] transition-colors">{current.label}</span>
        <ChevronDown size={14} className={`text-white/40 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
        <div className="fixed inset-0 z-[9998] cursor-default" onClick={() => setOpen(false)} />
        <div className={`absolute left-0 w-full mb-2 mt-2 bg-[#1A241B]/95 border border-white/10 rounded-xl overflow-hidden z-[9999] shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200 ${dropUp ? 'bottom-full origin-bottom' : 'top-full origin-top'}`}>
          <div className="max-h-60 overflow-y-auto flex flex-col py-2 scrollbar-hide">
            {options.map(r => (
               <button
                 key={r.value}
                 type="button"
                 onClick={() => { onChange(r.value); setOpen(false); }}
                 className={`text-left px-4 py-3 text-[10px] uppercase font-black tracking-widest transition-all ${value === r.value ? 'bg-[#B8860B]/20 text-[#B8860B] font-bold' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
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
