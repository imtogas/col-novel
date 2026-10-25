import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {KolNovelClient} from '../src/kolnovel-client.js';
const html=readFileSync(new URL('./fixtures/chapter-406-minimal.html',import.meta.url),'utf8');
const ok=async()=>({ok:true,headers:{get:()=> 'text/html; charset=utf-8'},text:async()=>html});
test('client reads user-supplied chapter structure with mock HTTP',async()=>{
 const client=new KolNovelClient(ok), chapter=await client.chapter('https://kolnovel.com/chapter/');
 assert.match(chapter.title,/406/);
 assert.match(chapter.text,/هذا نص/);
 assert.ok(chapter.navigation.next.endsWith('187966/'));
});
test('client refuses unrelated hosts',async()=>{
 const client=new KolNovelClient(ok);
 await assert.rejects(()=>client.chapter('https://example.org/'),/Only HTTPS KolNovel/);
});
test('client reports missing body instead of silently succeeding',async()=>{
 const client=new KolNovelClient(async()=>({ok:true,headers:{get:()=> 'text/html'},text:async()=>'<title>404</title>'}));
 await assert.rejects(()=>client.chapter('https://kolnovel.com/nope/'),/body not found/);
});
