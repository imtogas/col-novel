import {extractTitle,extractChapterText} from './kolnovel-parser.js';
import {extractNavigation,extractSeriesChapters} from './kolnovel-navigation.js';
import {paginateArabicText} from './text-pages.js';
const ORIGIN='https://kolnovel.com';
function allowed(input) {
 const u=new URL(input,ORIGIN);
 if(u.protocol!=='https:'||u.hostname!=='kolnovel.com')throw new TypeError('Only HTTPS KolNovel URLs are supported');
 u.hash='';return u.href;
}
/** Adapter for a future Paperback extension; it is not a Paperback API source yet. */
export class KolNovelClient {
 constructor(fetchImpl=globalThis.fetch) {
  if(typeof fetchImpl!=='function')throw new TypeError('A fetch implementation is required');
  this.fetch=fetchImpl;
 }
 async load(url){
  const address=allowed(url);
  const response=await this.fetch(address,{headers:{Accept:'text/html'}});
  if(!response.ok)throw new Error('KolNovel returned HTTP '+response.status);
  const contentType=response.headers?.get?.('content-type')||'';
  if(contentType && !/html/i.test(contentType))throw new Error('Expected HTML, received '+contentType);
  return {address,html:await response.text()};
 }
 async chapter(url){
  const {address,html}=await this.load(url);
  const text=extractChapterText(html);
  if(!text)throw new Error('Chapter body not found: KolNovel markup may have changed');
  return {url:address,title:extractTitle(html),text,navigation:extractNavigation(html,address)};
 }
 async chapterPages(url, options = {}) {
  const chapter = await this.chapter(url);
  return {...chapter, pages: paginateArabicText(chapter.text, {title: chapter.title, ...options})};
 }
 async series(url) {
  const {address,html}=await this.load(url);
  return {url:address,title:extractTitle(html),chapters:extractSeriesChapters(html,address)};
 }
}
