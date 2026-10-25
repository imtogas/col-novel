/**
 * Site-agnostic HTML extraction helpers for the experimental KolNovel adapter.
 * NOT an installable Paperback extension. All selectors require validation
 * against a real, authorized KolNovel page before release.
 */
export function decodeEntities(s = '') {
  const entities = {amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' ',hellip:'…',mdash:'—',laquo:'«',raquo:'»'};
  return String(s).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, key) => {
    const k = key.toLowerCase();
    if (k.startsWith('#')) {
      const point = k[1] === 'x' ? parseInt(k.slice(2), 16) : parseInt(k.slice(1), 10);
      return Number.isFinite(point) && point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : m;
    }
    return entities[k] ?? m;
  });
}
export function toText(html = '') {
  return decodeEntities(String(html)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ')
    .replace(/<br\s*\/?\s*>/gi,'\n')
    .replace(/<\/(?:p|div|h[1-6]|li)>/gi,'\n')
    .replace(/<[^>]+>/g,' '))
    .replace(/[ \t]+/g,' ').replace(/\n[ \t]+/g,'\n').replace(/\n{3,}/g,'\n\n').trim();
}
export function extractTitle(html = '') {
  const source = String(html);
  const og = source.match(/<meta\s+[^>]*property\s*=\s*["']og:title["'][^>]*>/i)?.[0]
    ?? source.match(/<meta\s+[^>]*content\s*=\s*["'][^"']+["'][^>]*property\s*=\s*["']og:title["'][^>]*>/i)?.[0];
  const content = og?.match(/content\s*=\s*["']([^"']+)["']/i)?.[1];
  const title = content || source.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]
    || source.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '';
  return toText(title);
}
export function extractChapterLinks(html = '', baseUrl = 'https://kolnovel.com/') {
  const results = [], seen = new Set();
  const anchors = String(html).matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi);
  for (const match of anchors) {
    const href = match[1].match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
    const title = toText(match[2]);
    if (!href || !title || !/(?:الفصل|chapter|ch\.?\s*\d+)/iu.test(title)) continue;
    try {
      const url = new URL(decodeEntities(href), baseUrl);
      if (!['https:','http:'].includes(url.protocol) || url.hostname !== new URL(baseUrl).hostname) continue;
      const canonical = url.href.split('#')[0];
      if (seen.has(canonical)) continue;
      seen.add(canonical);
      results.push({title,url:canonical});
    } catch {}
  }
  return results;
}
export function extractChapterText(html = '') {
  const source = String(html);
  // Generic candidates, not verified for KolNovel's live markup.
  const selectors = [
    /<(?:div|article|section)\b[^>]*(?:id|class)\s*=\s*["'][^"']*(?:chapter-content|entry-content|reading-content|text-content)[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|article|section)>/i,
    /<article\b[^>]*>([\s\S]*?)<\/article>/i
  ];
  for (const pattern of selectors) {
    const match = source.match(pattern);
    if (match) { const text = toText(match[1]); if (text.length >= 50) return text; }
  }
  return '';
}
