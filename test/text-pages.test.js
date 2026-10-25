import test from 'node:test';
import assert from 'node:assert/strict';
import {paginateArabicText} from '../src/text-pages.js';
test('Arabic text is split into SVG pages',()=>{
 const urls=paginateArabicText('هذا نص تجريبي من فصل عربي. '.repeat(35),{title:'الفصل 406',maxLines:5,maxCharacters:15});
 assert.ok(urls.length>1);
 const svg=decodeURIComponent(urls[0].split(',')[1]);
 assert.match(svg,/direction="rtl"/);
 assert.match(svg,/الفصل 406/);
});
test('HTML injection in text is escaped',()=>{
 const svg=decodeURIComponent(paginateArabicText('<script>alert(1)</script>')[0].split(',')[1]);
 assert.ok(!svg.includes('<script>'));
 assert.ok(svg.includes('&lt;script&gt;'));
});
test('empty chapters generate zero pages',()=>assert.deepEqual(paginateArabicText(' \n '),[]));
