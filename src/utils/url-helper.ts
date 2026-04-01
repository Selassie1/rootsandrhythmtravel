// src/utils/url-helper.ts
import { headers } from 'next/headers';

/**
 * Dynamically determines the site's base URL.
 * 
 * Logic flow:
 * 1. Returns NEXT_PUBLIC_SITE_URL if configured in environment.
 * 2. If on server, uses the 'host' header to determine the domain.
 * 3. If on client, uses window.location.origin.
 * 4. Defaults to http://localhost:3000 as final fallback.
 */
export async function getSiteURL() {
  // 1. Explicit environment variable check
  let url = process.env.NEXT_PUBLIC_SITE_URL;

  if (url) {
    // Ensure URL has protocol
    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }
    // Remove trailing slash
    return url.replace(/\/$/, "");
  }

  // 2. Server-side context (Server Actions, API Routes, SSR)
  try {
    const headerList = await headers();
    const host = headerList.get('host');
    if (host) {
      const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
      return `${protocol}://${host}`;
    }
  } catch (e) {
    // headers() might throw in client components or static generation in some Next.js versions
  }

  // 3. Client-side fallback
  if (typeof window !== 'undefined' && window.location) {
    return window.location.origin;
  }

  // 4. Default fallback
  return 'http://localhost:3000';
}
