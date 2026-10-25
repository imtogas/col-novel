import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {extractTitle,extractChapterText} from '../src/kolnovel-parser.js';
import {extractNavigation} from '../src/kolnovel-navigation.js';
const html=readFileSync(new URL('./fixtures/chapter-406-minimal.html',import.meta.url),'utf8');
test('real chapter-406 structural fixture extracts chapter text',()=>{
 const s=extractChapterText(html);
 assert.match(s,/هذا نص عربي/);
 assert.match(s,/فقرة تجريبية ثانية/);
});
test('real chapter-406 structural fixture extracts title',()=>assert.match(extractTitle(html),/البداية بعد النهاية 406/));
test('real chapter-406 structural fixture returns actual next/previous chapter URLs',()=>{
 const n=extractNavigation(html);
 assert.ok(n.previous?.endsWith('187518/'));
 assert.ok(n.next?.endsWith('187966/'));
 assert.ok(n.series?.includes('/series/'));
});
