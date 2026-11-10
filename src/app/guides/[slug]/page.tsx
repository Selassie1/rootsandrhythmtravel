import { notFound } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import { guides, getGuide } from '../data';

const SITE_URL = 'https://www.rootsandrhythmtravel.com';

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  const path = `/guides/${guide.slug}`;
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      url: path,
      title: guide.title,
      description: guide.description,
      images: [{ url: '/images/kintampo.jpg', alt: guide.h1 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.description,
      images: ['/images/kintampo.jpg'],
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.h1,
    description: guide.description,
    url: `${SITE_URL}/guides/${guide.slug}`,
    image: `${SITE_URL}/images/kintampo.jpg`,
    author: { '@type': 'Organization', name: 'Roots & Rhythm Travel', url: `${SITE_URL}/` },
    publisher: {
      '@type': 'Organization',
      name: 'Roots & Rhythm Travel',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
  };

  return (
    <main className="min-h-screen bg-[#131A14] pt-28 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <article className="mx-auto max-w-3xl px-6 pb-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8860B]">Heritage guide</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">{guide.h1}</h1>
        <div
          className="mt-8 text-base leading-relaxed text-white/85 [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-white [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_a]:text-[#B8860B] [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: guide.bodyHtml }}
        />
        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <a href={guide.relatedTours[0]} className="rounded-full bg-[#B8860B] px-6 py-3 text-center text-sm font-semibold text-black">
            See the tour
          </a>
          <a href="https://wa.me/233549796875" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/30 px-6 py-3 text-center text-sm font-semibold text-white">
            Message us on WhatsApp
          </a>
        </div>
      </article>
      <Footer />
    </main>
  );
}