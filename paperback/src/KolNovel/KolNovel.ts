import {
 Chapter, ChapterDetails, ContentRating, MangaProviding, PagedResults,
 SearchRequest, SearchResultsProviding, SourceInfo, SourceIntents,
 SourceManga, ChapterProviding
} from '@paperback/types'
import * as cheerio from 'cheerio'

const ROOT='https://kolnovel.com'
const SERIES='/series/البداية-بعد-النهاية/'
export const KolNovelInfo: SourceInfo={
 name:'KolNovel (Experimental)',
 version:'0.1.3',
 description:'Arabic novel proof of concept. Not yet verified in Paperback 0.8.',
 author:'imtogas / community',
 icon:'icon.svg',
 contentRating:ContentRating.EVERYONE,
 websiteBaseURL:ROOT,
 intents:SourceIntents.MANGA_CHAPTERS
}
function absolute(href:string):string {
 const raw=href.trim()
 if(!raw) throw Error('Empty URL')
 if(raw.startsWith('//')) throw Error('Protocol-relative URLs are not allowed')
 if(/^https?:\/\//i.test(raw)){
  if(!/^https:\/\/kolnovel\.com(?=\/|$|\?|#)/i.test(raw)) throw Error('Invalid host')
  return raw
 }
 if(/^[a-z][a-z0-9+.-]*:/i.test(raw)) throw Error('Invalid URL scheme')
 if(raw.startsWith('#')) throw Error('Fragment-only URL')
 const path=raw.startsWith('/')?raw:'/'+raw
 return ROOT+path
}
function escapeXml(text:string):string {
 return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
function textPages(text:string,title:string):string[] {
 const words=text.split(/\s+/).filter(Boolean), lines:string[]=[]
 let line=''
 for(const word of words){
  if(line.length+word.length>39 && line){lines.push(line);line=word}
  else line+=(line?' ':'')+word
 }
 if(line)lines.push(line)
 const pages:string[]=[]
 for(let i=0;i<lines.length;i+=22){
  const segment=lines.slice(i,i+22)
  const rows=segment.map((l,j)=>'<text x="840" y="'+(155+j*50)+'" text-anchor="start" direction="rtl" font-size="31">'+escapeXml(l)+'</text>').join('')
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1450" viewBox="0 0 900 1450"><rect width="900" height="1450" fill="#faf7ef"/><g fill="#252525" font-family="sans-serif"><text x="840" y="80" direction="rtl" text-anchor="start" font-size="30">'+escapeXml(title)+'</text>'+rows+'</g></svg>'
  pages.push('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg))
 }
 return pages
}
export class KolNovel implements MangaProviding, ChapterProviding, SearchResultsProviding {
 requestManager=App.createRequestManager({requestsPerSecond:1,requestTimeout:20000})
 async fetchDocument(url:string){
  const response=await this.requestManager.schedule(App.createRequest({url:absolute(url),method:'GET'}),1)
  return cheerio.load(String(response.data))
 }
 async getSearchResults(query:SearchRequest,_metadata:any):Promise<PagedResults>{
  // Limited fixture search. Real site-wide search endpoint remains to be verified.
  const term=(query.title||'').trim()
  const matches=!term || 'البداية بعد النهاية'.includes(term)
  return App.createPagedResults({results:matches?[App.createPartialSourceManga({
   mangaId:SERIES,title:'البداية بعد النهاية',image:''
  })]:[]})
 }
 async getMangaDetails(mangaId:string):Promise<SourceManga>{
  const $=await this.fetchDocument(mangaId)
  const title=$('h1').first().text().trim()||$('title').first().text().trim()||'KolNovel'
  const image=$('meta[property="og:image"]').attr('content')||''
  return App.createSourceManga({id:mangaId,mangaInfo:App.createMangaInfo({
   titles:[title],image,desc:$('meta[name="description"]').attr('content')||'',status:'ONGOING'
  })})
 }
 async getChapters(mangaId:string):Promise<Chapter[]>{
  // KolNovel groups chapter rows by volume. The landing page only exposes two teaser links.
  const volumes=[
   'المجلد 1 [ السنوات المبكرة ]','المجلد 2 [ أفاق جديدة ]',
   'المجلد 3 [ المصير ]','المجلد 4 [ حافة الأفق ]',
   'المجلد 5 [ التقارب ]','المجلد 6 [ التعالي ]',
   'المجلد 7 [ الإنقسام ]','فصول خاصة [ منظور إيلي ]',
   'المجلد 8 [ الصعود ]','المجلد 8.5: قصة جانبية',
   'المجلد 9 [ الحساب ]','الفصول','المجلد 10 [ القصاص ]',
   'المجلد 11','المجلد 12','رواية الكاتب الجديدة',
   'المجلد 12.5 الإضافي [منظور إيلي]'
  ]
  const chapters:Chapter[]=[]
  const seen=new Set<string>()
  let fallback=1
  const add=($:any)=>{
   $('a[href]').each((_:any,el:any)=>{
    const href=String($(el).attr('href')||'')
    const name=String($(el).text()||'').replace(/\\s+/g,' ').trim()
    if(!href || !/(?:الفصل|فصل)\\s*[\\d٠-٩]+/.test(name)) return
    let url:string
    try{url=absolute(href)}catch{return}
    if(seen.has(url) || url.indexOf('/series/')>=0) return
    seen.add(url)
    const m=name.match(/(?:الفصل|فصل)\\s*([\\d٠-٩]+)/)
    const num=m?Number(m[1].replace(/[٠-٩]/g,(digit:string)=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))):fallback++
    chapters.push(App.createChapter({id:url,name,chapNum:num,langCode:'🇸🇦'}))
   })
  }
  add(await this.fetchDocument(mangaId))
  // Each query loads one volume; fetch a second page for long volumes.
  for(const volume of volumes){
   for(let page=1;page<=2;page++){
    const separator=mangaId.includes('?')?'&':'?'
    const url=mangaId+separator+'chapter_volume='+encodeURIComponent(volume)+'&chapter_page='+page
    try{
     const before=chapters.length
     add(await this.fetchDocument(url))
     if(chapters.length===before)break
    }catch{break}
   }
  }
  return chapters.sort((a,b)=>a.chapNum-b.chapNum)
 }
 async getChapterDetails(mangaId:string,chapterId:string):Promise<ChapterDetails>{
  const $=await this.fetchDocument(chapterId)
  const text=$('#kol_content').find('p').map((_,el)=>$(el).text().trim()).get().filter(Boolean).join('\n\n')
  if(!text)throw new Error('KolNovel chapter content is missing')
  const title=$('h1').first().text().trim()||$('title').first().text().trim()
  const pages=textPages(text,title)
  if(!pages.length)throw new Error('Could not build reading pages')
  // NEEDS ON-DEVICE CHECK: Paperback may reject data:image/svg+xml pages.
  return App.createChapterDetails({id:chapterId,mangaId,pages})
 }
}
