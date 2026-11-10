import Footer from '@/components/layout/Footer';
import { guides } from './data';

export const metadata = {
  title: 'Ghana Heritage Travel Guides | Roots & Rhythm Travels',
  description:
    'Short guides to Ghana heritage sites, including Elmina Castle, Assin Manso Ancestral Slave River Park and Kumasi, from Roots & Rhythm Travels.',
  alternates: { canonical: '/guides' },
  openGraph: {
    type: 'website',
    url: '/guides',
    title: 'Ghana Heritage Travel Guides | Roots & Rhythm Travels',
    description:
      'Short guides to Ghana heritage sites, including Elmina Castle, Assin Manso and Kumasi.',
    images: [{ url: '/images/kintampo.jpg', alt: 'Ghana heritage travel guides' }],
  },
};

export default function GuidesIndex() {
  return (
    <main className="min-h-screen bg-[#131A14] pt-28 text-white">
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8860B]">Heritage guides</p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Ghana heritage travel guides</h1>
        <ul className="mt-10 space-y-6">
          {guides.map((g) => (
            <li key={g.slug} className="rounded-2xl border border-white/10 p-6">
              <a href={`/guides/${g.slug}`} className="font-serif text-2xl text-white hover:text-[#B8860B]">
                {g.h1}
              </a>
              <p className="mt-2 text-sm text-white/70">{g.description}</p>
            </li>
          ))}
        </ul>
      </section>
      <Footer />
    </main>
  );
}