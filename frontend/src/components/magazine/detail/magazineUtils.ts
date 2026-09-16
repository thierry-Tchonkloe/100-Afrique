// src/components/magazine/detail/magazineUtils.ts
import type { Magazine } from '@/services/Dashboard/magazineService';

const KNOWN_IFRAME_BLOCKERS = [
  "aviationweek.com", "mymauritius.travel", "tourismupdate.co.za",
  "traveller.com.au", "lonelyplanet.com", "tripadvisor.com",
  "booking.com", "airbnb.com", "skyscanner.com",
];

export function isDomainBlocked(url?: string | null) {
  if (!url) return false;
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return KNOWN_IFRAME_BLOCKERS.some((b) => hostname.endsWith(b));
  } catch { return false; }
}

export function stripHtml(input?: string | null) {
  return (input || "")
    .replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&").replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
}

export const isDocumentUrl = (url?: string | null) => /\.(pdf|doc|docx|ppt|pptx)$/i.test(url || "");
export const isIssuuUrl    = (url?: string | null) => /issuu\.com/i.test(url || "");
export const isFlipHtmlUrl = (url?: string | null) => /fliphtml5\.com/i.test(url || "");

export function getEmbedPreviewUrl(magazine: Magazine) {
  const raw = magazine.embedUrl || magazine.previewUrl || magazine.readOnlineUrl || magazine.url;
  if (!raw) return "";
  if (isDocumentUrl(raw)) return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(raw)}`;
  if (isIssuuUrl(raw)) return raw.includes("/embed") ? raw : `${raw.replace(/\/$/, "")}/embed`;
  if (isFlipHtmlUrl(raw)) return raw;
  return raw;
}

export function getDownloadHref(m: Magazine) {
  return [m.downloadUrl, m.url, m.readOnlineUrl].find(isDocumentUrl) || "";
}

export function getDescription(m: Magazine) {
  return stripHtml(m.content) || stripHtml(m.excerpt);
}

export type SharePlatform = "facebook" | "linkedin" | "whatsapp";