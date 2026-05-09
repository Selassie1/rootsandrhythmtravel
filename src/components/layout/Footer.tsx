import React from 'react';
import { getPublicSiteSettings } from '@/actions/tours';

const Footer = async () => {
  const settings = await getPublicSiteSettings();

  const instagramUrl = settings.instagram_url || '#';
  const twitterUrl = settings.twitter_url || '#';
  const facebookUrl = settings.facebook_url || '#';

  return (
    <footer className="w-full bg-[#131A14] pt-32 pb-8 overflow-hidden relative z-0">

      {/* Absolute Noise Overlay for deep editorial paper texture */}
      <div className="absolute inset-0 opacity-[0.03] z-[-1] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">

          {/* Column 1: Brand & About */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col items-start lg:pr-12">
             <div className="flex items-center gap-4 mb-8">
                <img src="/logo.png" alt="Roots & Rhythm Travels Logo" className="w-16 h-16 object-contain" />
                <div className="flex flex-col justify-center">
                  <span className="text-[#F9B729] font-black text-xl md:text-2xl leading-none tracking-widest uppercase">Roots &</span>
                  <span className="text-[#E63931] font-black text-xl md:text-2xl leading-none tracking-widest uppercase mt-1">Rhythm</span>
                  <span className="text-[#178548] font-extrabold text-xs md:text-sm leading-none tracking-[0.3em] uppercase mt-1.5">Travels</span>
                </div>
             </div>
             <p className="text-white/60 text-sm leading-[2] mb-8 pr-4 max-w-sm font-light">
               Curating deeply authentic, immersive experiences across the Motherland. We handle the details so you can simply feel the rhythm. Come as a traveler, leave as family.
             </p>
             <div className="flex gap-4">
                <a href={instagramUrl} target={instagramUrl !== '#' ? '_blank' : undefined} rel="noopener noreferrer" aria-label="Instagram" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-[#E8D3A2] hover:text-[#1A241B] hover:border-[#E8D3A2] transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.88z"/></svg>
                </a>
                <a href={twitterUrl} target={twitterUrl !== '#' ? '_blank' : undefined} rel="noopener noreferrer" aria-label="X (formerly Twitter)" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-[#E8D3A2] hover:text-[#1A241B] hover:border-[#E8D3A2] transition-colors duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href={facebookUrl} target={facebookUrl !== '#' ? '_blank' : undefined} rel="noopener noreferrer" aria-label="Facebook" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-[#E8D3A2] hover:text-[#1A241B] hover:border-[#E8D3A2] transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </a>
             </div>
          </div>

          {/* Column 2: Journeys */}
          <div className="flex flex-col lg:col-span-2 lg:col-start-6">
            <h4 className="text-white text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-8 opacity-40">Journeys</h4>
            <ul className="flex flex-col gap-5">
              <li><a href="/tours" className="text-white/70 hover:text-[#E8D3A2] text-sm md:text-base transition-colors hover:pl-2 duration-300 inline-block">Heritage Return</a></li>
              <li><a href="/tours" className="text-white/70 hover:text-[#E8D3A2] text-sm md:text-base transition-colors hover:pl-2 duration-300 inline-block">Cultural Immersions</a></li>
              <li><a href="/tours" className="text-white/70 hover:text-[#E8D3A2] text-sm md:text-base transition-colors hover:pl-2 duration-300 inline-block">Accra Nightlife</a></li>
              <li><a href="/tours" className="text-white/70 hover:text-[#E8D3A2] text-sm md:text-base transition-colors hover:pl-2 duration-300 inline-block">Custom Group Tours</a></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col lg:col-span-2">
            <h4 className="text-white text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-8 opacity-40">Company</h4>
            <ul className="flex flex-col gap-5">
              <li><a href="/about" className="text-white/70 hover:text-[#E8D3A2] text-sm md:text-base transition-colors hover:pl-2 duration-300 inline-block">Our Philosophy</a></li>
              <li><a href="/about" className="text-white/70 hover:text-[#E8D3A2] text-sm md:text-base transition-colors hover:pl-2 duration-300 inline-block">The Team</a></li>
              <li><a href="/about" className="text-white/70 hover:text-[#E8D3A2] text-sm md:text-base transition-colors hover:pl-2 duration-300 inline-block">Stories & Reviews</a></li>
              <li><a href="/contact" className="text-white/70 hover:text-[#E8D3A2] text-sm md:text-base transition-colors hover:pl-2 duration-300 inline-block">Contact Us</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="flex flex-col lg:col-span-3">
            <h4 className="text-white text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-8 opacity-40">Connect</h4>
            <ul className="flex flex-col gap-5">
              <li className="text-white/70 text-sm md:text-base hover:text-[#E8D3A2] transition-colors cursor-pointer"><a href="mailto:support@rootsandrhythmtravel.com">support@rootsandrhythmtravel.com</a></li>
              <li className="text-white/70 text-sm md:text-base hover:text-[#E8D3A2] transition-colors cursor-pointer"><a href="tel:+233202713806">+233 (0) 20 271 3806</a></li>
              <li className="text-white/50 text-sm mt-4 tracking-wide leading-relaxed">Tse Addo, <br/>Accra, Ghana<br/>West Africa</li>
            </ul>
          </div>

        </div>

        {/* The Massive Bottom Watermark Typography */}
        <div className="w-full mt-[-20px] md:mt-[-64] relative flex flex-col">

           {/* Watermark Container (Holds text and exact center divider) */}
           <div className="relative w-full overflow-hidden flex items-center justify-center pointer-events-none select-none opacity-[0.03] z-0 mix-blend-overlay pb-6 border-none">

             {/* Center Strike Line accurately bisecting the typography horizontally */}
             <div className="absolute inset-x-0 top-[45%] h-[2px] bg-gradient-to-r from-transparent via-white to-transparent w-full z-10" />

             <span className="text-[13vw] sm:text-[11vw] md:text-[9.5vw] lg:text-[8vw] xl:text-[7.5vw] font-serif font-bold whitespace-nowrap leading-[0.8] tracking-tighter text-white">
                ROOTS & RHYTHM
             </span>
           </div>

           {/* Bottom Legal Bar */}
           <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/40 relative z-10 pt-6">
             <span>&copy; {new Date().getFullYear()} Roots & Rhythm</span>
             <div className="flex gap-6">
                <a href="/privacy" className="hover:text-[#E8D3A2] transition-colors">Privacy Policy</a>
                <a href="/terms" className="hover:text-[#E8D3A2] transition-colors">Terms of Service</a>
                <a href="/refund-policy" className="hover:text-[#E8D3A2] transition-colors">Refund Policy</a>
             </div>
             <span className="text-[#E8D3A2]/60">Curated in Ghana</span>
           </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
