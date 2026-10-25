import test from 'node:test';
import assert from 'node:assert/strict';
import {extractNavigation,extractSeriesChapters} from '../src/kolnovel-navigation.js';
test('chapter navigation matches saved chapter 406 button captions',()=>{
 const html='<a class="kol-ui-button" href="/chapter-405/">السابق</a><a href="/series/البداية-بعد-النهاية/">الفصول</a><a href="/chapter-407/">التالي</a>';
 assert.deepEqual(extractNavigation(html),{previous:'https://kolnovel.com/chapter-405/',next:'https://kolnovel.com/chapter-407/',series:'https://kolnovel.com/series/%D8%A7%D9%84%D8%A8%D8%AF%D8%A7%D9%8A%D8%A9-%D8%A8%D8%B9%D8%AF-%D8%A7%D9%84%D9%86%D9%87%D8%A7%D9%8A%D8%A9/'});
});
test('series chapter links deduplicate and ignore other domains',()=>{
 const html='<a href="/chapter-497/">المجلد 12 الفصل 497</a><a href="/chapter-497/">الفصل 497</a><a href="https://evil.example/c">الفصل 496</a>';
 assert.deepEqual(extractSeriesChapters(html),[{title:'المجلد 12 الفصل 497',url:'https://kolnovel.com/chapter-497/'}]);
});
