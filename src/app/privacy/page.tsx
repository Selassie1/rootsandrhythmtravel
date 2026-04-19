// frontend/src/app/privacy/page.tsx
import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#131A14] pt-24 pb-8">
      <div className="w-full bg-[#1A241B] py-16 px-6 lg:px-12 border-b border-white/5 relative overflow-hidden">
        <div className="max-w-4xl mx-auto pt-10 relative z-10">
          <span className="text-[#B8860B] tracking-[0.3em] text-[10px] font-bold uppercase mb-2 block drop-shadow-sm">
            Legal & Compliance
          </span>
          <h1 className="text-3xl md:text-5xl font-serif text-[#FAFAF8] leading-tight mb-2">
            Privacy Policy
          </h1>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16 text-white/70 font-light leading-relaxed space-y-8 text-sm">
        <p>Roots & Rhythm Travels is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, then you can be assured that it will only be used in accordance with this privacy statement.</p>
        
        <h2 className="text-xl font-serif text-white mt-8 mb-4">1. Information We Collect</h2>
        <p>We may collect your name, contact information including email address, demographic information such as postcode, preferences and interests, and other information relevant to customer surveys and/or offers.</p>
        
        <h2 className="text-xl font-serif text-white mt-8 mb-4">2. What We Do With the Information</h2>
        <p>We require this information to understand your needs and provide you with a better service, in particular for internal record keeping, improving our products and services, and periodically sending promotional emails about new tours, special offers or other information.</p>
        
        <h2 className="text-xl font-serif text-white mt-8 mb-4">3. Security</h2>
        <p>We are committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure, we have put in place suitable physical, electronic and managerial procedures to safeguard and secure the information we collect online.</p>
        
        <p className="pt-8 text-white/40 italic">Last Updated: April 2026</p>
      </div>
    </div>
  );
}
