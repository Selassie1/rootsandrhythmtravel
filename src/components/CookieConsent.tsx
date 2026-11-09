'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

const GA_ID = 'G-GY7NK89JLT';
const STORAGE_KEY = 'rr-analytics-consent';
type Choice = 'granted' | 'denied';

function clearAnalyticsCookies() {
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim();
    if (name.startsWith('_ga')) {
      const host = window.location.hostname;
      const base = host.replace(/^www\./, '');
      ['', `; domain=${host}`, `; domain=.${base}`].forEach((d) => {
        document.cookie = `${name}=; Max-Age=0; path=/${d}`;
      });
    }
  });
}

export default function CookieConsent() {
  const [choice, setChoice] = useState<Choice | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'granted' || saved === 'denied') {
      setChoice(saved);
    } else {
      setShowBanner(true);
    }
    const open = () => setShowBanner(true);
    window.addEventListener('open-cookie-settings', open);
    return () => window.removeEventListener('open-cookie-settings', open);
  }, []);

  const save = (value: Choice) => {
    const previous = localStorage.getItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, value);
    setShowBanner(false);
    if (value === 'denied' && previous === 'granted') {
      clearAnalyticsCookies();
      window.location.reload();
      return;
    }
    setChoice(value);
  };

  return (
    <>
      {choice === 'granted' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', {
  allow_google_signals: false,
  allow_ad_personalization_signals: false
});`}
          </Script>
        </>
      )}

      {showBanner && (
        <div
          role="dialog"
          aria-label="Cookie preferences"
          className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-2xl rounded-2xl border border-white/10 bg-[#131A14] p-5 text-white shadow-2xl sm:p-6"
        >
          <p className="text-sm leading-relaxed text-white/80">
            We use Google Analytics cookies to understand how visitors use our site so we can
            improve it. They are only turned on if you accept. You can change your choice any
            time under &quot;Cookie settings&quot; at the bottom of the page.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={() => save('denied')}
              className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white"
            >
              Reject
            </button>
            <button
              onClick={() => save('granted')}
              className="rounded-full bg-[#B8860B] px-5 py-2 text-sm font-semibold text-black"
            >
              Accept
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
      className="text-white/50 text-sm hover:text-[#E8D3A2] transition-colors"
    >
      Cookie settings
    </button>
  );
}