const YOUTUBE_EMBED_URL = 'https://www.youtube.com/embed/LokaFVH5w2c?rel=0&modestbranding=1';

export default function ThreadsVideoSection() {
  return (
    <section className="w-full bg-[#0E1510] py-24 md:py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B8860B]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col items-center text-center gap-6">

        <span className="text-[#B8860B] text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] animate-pulse" />
          Watch & Learn
        </span>

        <h2 className="text-3xl md:text-5xl font-serif text-[#FAFAF8] leading-tight">
          How to Book Your Journey
        </h2>

        <p className="text-white/50 text-sm md:text-base max-w-xl leading-relaxed">
          A quick walkthrough on how to browse tours, select your dates, and secure your spot.
        </p>

        {/* 16:9 responsive video container */}
        <div className="w-full mt-4 rounded-2xl overflow-hidden border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.6)] relative" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={YOUTUBE_EMBED_URL}
            className="absolute inset-0 w-full h-full border-0"
            title="How to Book a Tour — Roots & Rhythm Travels"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

      </div>
    </section>
  );
}
