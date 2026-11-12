/**
 * Traffic Attribution & UTM Tracker
 * Automatically detects whether users came from WhatsApp, Meta Ads (FB/Insta), SEO (Google), YouTube, etc.
 * Supports UTM query parameters, platform click IDs (fbclid, gclid), and document.referrer.
 * Handles edge cases: uppercase UTMs, quotation marks, hash routing, in-app browser quirks.
 */

export interface TrafficInfo {
  trafficSource: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  referrer: string;
  landingPage: string;
  fbclid?: string;
  gclid?: string;
}

const STORAGE_KEY = 'ai_accelerator_traffic_source_v2';

/**
 * Helper to extract query parameters from full URL string (search, hash, or path)
 * Handles uppercase, quotes, and encoded characters safely.
 */
function extractParamFromUrl(url: string, paramNames: string[]): string {
  try {
    for (const name of paramNames) {
      // Matches ?param=value or &param=value or #...&param=value
      const regex = new RegExp(`(?:[?&#]|&amp;)${name}=([^&#\\s"'>]+)`, 'i');
      const match = url.match(regex);
      if (match && match[1]) {
        let val = decodeURIComponent(match[1]).trim();
        // Strip any accidental quotes or trailing punctuation
        val = val.replace(/^["']+|["']+$/g, '').trim();
        if (val) return val;
      }
    }
  } catch (e) {
    // Fallback if URL decoding fails
  }
  return '';
}

export function getTrafficAttribution(): TrafficInfo {
  if (typeof window === 'undefined') {
    return {
      trafficSource: 'Direct',
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
      utmContent: '',
      utmTerm: '',
      referrer: '',
      landingPage: '',
    };
  }

  const currentHref = window.location.href || '';
  const referrer = typeof document !== 'undefined' ? document.referrer || '' : '';
  const refLower = referrer.toLowerCase();

  // Extract params directly from full href to support all URL formats
  const rawUtmSource = extractParamFromUrl(currentHref, ['utm_source', 'source', 'src', 'ref']);
  const utmMedium = extractParamFromUrl(currentHref, ['utm_medium', 'medium']);
  const utmCampaign = extractParamFromUrl(currentHref, ['utm_campaign', 'campaign']);
  const utmContent = extractParamFromUrl(currentHref, ['utm_content']);
  const utmTerm = extractParamFromUrl(currentHref, ['utm_term']);
  const fbclid = extractParamFromUrl(currentHref, ['fbclid']);
  const gclid = extractParamFromUrl(currentHref, ['gclid']);

  const sourceLower = rawUtmSource.toLowerCase();
  const hasExplicitCampaign = Boolean(rawUtmSource || fbclid || gclid);

  // If no explicit campaign params on current URL, check if we stored a valid campaign earlier in this session
  if (!hasExplicitCampaign) {
    try {
      const cached = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed: TrafficInfo = JSON.parse(cached);
        // Only reuse cache if it actually had an identifiable source (not a stale Direct)
        if (parsed.trafficSource && parsed.trafficSource !== 'Direct') {
          return parsed;
        }
      }
    } catch {
      // Ignore cache errors
    }
  }

  let detectedSource = 'Direct';

  // 1. Check explicit UTM / source parameter first (highest priority)
  if (sourceLower) {
    if (
      sourceLower.includes('whatsapp') ||
      sourceLower === 'wa' ||
      sourceLower.includes('whats')
    ) {
      detectedSource = 'WhatsApp';
    } else if (
      sourceLower.includes('fb') ||
      sourceLower.includes('facebook') ||
      sourceLower.includes('insta') ||
      sourceLower.includes('meta') ||
      sourceLower.includes('ig')
    ) {
      detectedSource = utmMedium ? `Meta Ads (${rawUtmSource})` : 'Meta (Instagram / Facebook)';
    } else if (sourceLower.includes('google')) {
      detectedSource = (utmMedium.includes('cpc') || gclid) ? 'Google Ads' : 'SEO (Google Search)';
    } else if (sourceLower.includes('youtube') || sourceLower === 'yt') {
      detectedSource = 'YouTube';
    } else if (sourceLower.includes('linkedin')) {
      detectedSource = 'LinkedIn';
    } else if (sourceLower.includes('telegram') || sourceLower === 'tg') {
      detectedSource = 'Telegram';
    } else if (sourceLower.includes('twitter') || sourceLower === 'x') {
      detectedSource = 'Twitter / X';
    } else {
      detectedSource = rawUtmSource;
    }
  } 
  // 2. Check Facebook / Meta Click ID (appended automatically on Meta Ad clicks)
  else if (fbclid) {
    detectedSource = 'Meta Ads (Facebook/Instagram)';
  } 
  // 3. Check Google Ad Click ID
  else if (gclid) {
    detectedSource = 'Google Ads';
  } 
  // 4. Automatic HTTP Referrer detection
  else if (referrer) {
    // Ignore internal preview environment referrer
    if (refLower.includes('aistudio.google.com')) {
      detectedSource = 'Direct';
    } else if (refLower.includes('instagram.com') || refLower.includes('l.instagram.com')) {
      detectedSource = 'Meta (Instagram)';
    } else if (refLower.includes('facebook.com') || refLower.includes('fb.me') || refLower.includes('m.facebook.com')) {
      detectedSource = 'Meta (Facebook)';
    } else if (refLower.includes('whatsapp') || refLower.includes('web.whatsapp.com')) {
      detectedSource = 'WhatsApp';
    } else if (refLower.includes('google.com') || refLower.includes('google.co.in') || refLower.includes('google.')) {
      detectedSource = 'SEO (Google Search)';
    } else if (refLower.includes('bing.com') || refLower.includes('yahoo.com') || refLower.includes('duckduckgo.com')) {
      detectedSource = 'SEO (Organic Search)';
    } else if (refLower.includes('youtube.com') || refLower.includes('youtu.be')) {
      detectedSource = 'YouTube';
    } else if (refLower.includes('linkedin.com')) {
      detectedSource = 'LinkedIn';
    } else if (refLower.includes('t.me') || refLower.includes('telegram.org')) {
      detectedSource = 'Telegram';
    } else if (refLower.includes('twitter.com') || refLower.includes('x.com') || refLower.includes('t.co')) {
      detectedSource = 'Twitter / X';
    } else {
      try {
        const url = new URL(referrer);
        detectedSource = `Referral (${url.hostname})`;
      } catch {
        detectedSource = 'Referral';
      }
    }
  }

  const result: TrafficInfo = {
    trafficSource: detectedSource,
    utmSource: rawUtmSource || (fbclid ? 'meta_ad' : ''),
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm,
    referrer,
    landingPage: currentHref,
    fbclid: fbclid || undefined,
    gclid: gclid || undefined,
  };

  // Persist for session
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  } catch {
    // Ignore storage quota
  }

  return result;
}
