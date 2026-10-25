import test from 'node:test';
import assert from 'node:assert/strict';
import {decodeEntities,toText,extractTitle,extractChapterLinks,extractChapterText} from '../src/kolnovel-parser.js';
test('Arabic text and entities',()=>assert.equal(toText('<p dir="rtl">مرحباً &amp; أهلاً</p>'),'مرحباً & أهلاً'));
test('detects title',()=>assert.equal(extractTitle('<meta property="og:title" content="رواية الاختبار">'),'رواية الاختبار'));
test('extracts unique local chapter links only',()=>{
  const html='<a href="/novel/ch-1">الفصل 1</a><a href="/novel/ch-1">الفصل 1</a><a href="https://other.com/ch-2">الفصل 2</a>';
  assert.deepEqual(extractChapterLinks(html),[{title:'الفصل 1',url:'https://kolnovel.com/novel/ch-1'}]);
});
test('extracts common WordPress-like chapter markup',()=>{
  const body='هذا نص تجريبي لفصل رواية عربية يستعمل فقط لاختبار طريقة قراءة النص داخل العنصر المناسب.';
  assert.equal(extractChapterText('<div class="entry-content"><p>'+body+'</p></div>'),body);
});
test('does not fabricate chapter content when selectors fail',()=>assert.equal(extractChapterText('<html><body>hello</body></html>'),''));

test('recognizes KolNovel-style chapter URL supplied for integration',()=>{
  const href='/shaag24البداية-بعد-النهايةz435ggye-187678/';
  const html='<a href="'+href+'">فصل 187</a>';
  assert.deepEqual(extractChapterLinks(html),[{title:'فصل 187',url:new URL(href,'https://kolnovel.com/').href}]);
});
