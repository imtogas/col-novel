/** Experimental text-to-page conversion for image-first readers like Paperback.
 * This module returns self-contained SVG data URLs. Paperback 0.8 support for
 * data:image/svg+xml URLs is NOT verified and may require a hosted renderer.
 */
function escapeXml(value) {
  return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}
function wrap(text, max=38) {
  const lines=[];
  let line='';
  for(const word of text.trim().split(/\s+/u)) {
    if(line && (line+' '+word).length>max) {lines.push(line);line=word;}
    else line=line?line+' '+word:word;
  }
  if(line)lines.push(line);
  return lines;
}
export function paginateArabicText(input,{title='KolNovel',maxLines=25,maxCharacters=38,width=900,height=1450}={}) {
  if(typeof input!=='string'|| !input.trim())return [];
  if(maxLines<2||maxLines>100||maxCharacters<5||maxCharacters>120) throw new RangeError('Invalid pagination limits');
  const lines=[];
  for(const paragraph of input.split(/\n+/)) {
    if(!paragraph.trim())continue;
    lines.push(...wrap(paragraph,maxCharacters),'');
  }
  const pages=[];
  for(let start=0;start<lines.length;start+=maxLines) {
    const pageLines=lines.slice(start,start+maxLines);
    const body=pageLines.map((line,i)=>'<text x="'+(width-54)+'" y="'+(150+i*44)+'" direction="rtl" text-anchor="start" font-size="29">'+escapeXml(line)+'</text>').join('');
    const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+width+' '+height+'" width="'+width+'" height="'+height+'"><rect width="100%" height="100%" fill="#faf7ef"/><g font-family="sans-serif" fill="#242424"><text x="'+(width-54)+'" y="75" text-anchor="start" direction="rtl" font-size="34" font-weight="bold">'+escapeXml(title)+'</text>'+body+'</g></svg>';
    pages.push('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg));
  }
  return pages;
}
