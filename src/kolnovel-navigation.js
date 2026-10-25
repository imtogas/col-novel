/** KolNovel navigation helpers — target public pages, no stored chapter copies. */
import {toText} from './kolnovel-parser.js';
const ROOT='https://kolnovel.com/';
function safeUrl(href,base=ROOT){
  try {const u=new URL(href,base); if(u.protocol!=='https:'||u.hostname!=='kolnovel.com') return null;u.hash='';return u.href;} catch{return null;}
}
/** Finds previous/next and book links from KolNovel chapter page. */
export function extractNavigation(html,base=ROOT){
 const found={previous:null,next:null,series:null};
 for(const m of String(html).matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)){
   const href=m[1].match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
   const url=href&&safeUrl(href,base), label=toText(m[2]).trim();
   if(!url)continue;
   if(/^(?:السابق|السابق\s*الفصل|previous)$/iu.test(label))found.previous??=url;
   else if(/^(?:التالي|الفصل\s*التالي|next)$/iu.test(label))found.next??=url;
   else if(/(?:صفحة الرواية|قائمة الفصول|الفصول)/u.test(label)&&new URL(url).pathname.startsWith('/series/')) found.series??=url;
 }
 return found;
}
/** Scan a public book listing for chapter anchors (index structure needs live validation). */
export function extractSeriesChapters(html,base=ROOT){
 const out=[],seen=new Set();
 for(const m of String(html).matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)){
  const href=m[1].match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
  const url=href&&safeUrl(href,base), label=toText(m[2]).trim();
  if(!url||seen.has(url)||!/الفصل\s*[\d٠-٩]+/u.test(label))continue;
  seen.add(url);
  out.push({title:label,url});
 }
 return out;
}
