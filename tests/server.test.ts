import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
const directory=mkdtempSync(path.join(tmpdir(),'athar-test-'));
async function start(){const child=spawn(process.execPath,['--import','tsx','server/index.ts'],{env:{...process.env,ATHAR_DATA_DIR:directory},stdio:['ignore','pipe','pipe']});await new Promise<void>((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Server startup timeout')),10000);child.once('exit',c=>{clearTimeout(timer);reject(new Error(`Server exited ${c}`));});child.stdout.on('data',chunk=>{if(String(chunk).includes('server ready')){clearTimeout(timer);resolve();}});});return child;}
async function stop(child:ReturnType<typeof spawn>){const exited=new Promise(r=>child.once('exit',r));child.kill();await exited;}
test('SQLite records survive restart; stale writes and foreign origins rejected',async()=>{
 let child=await start();const url='http://127.0.0.1:3001/api/records/fleet';
 try{
  assert.deepEqual(await (await fetch(url)).json(),{value:null,revision:0});
  const payload={value:[{id:'persisted-test-record',contracts:[{id:'C-1'}]}],revision:0};
  const write=()=>fetch(url,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  assert.equal((await write()).status,200);assert.equal((await write()).status,409);
  assert.equal((await fetch(url,{headers:{Origin:'https://untrusted.example'}})).status,403);
  await stop(child);child=await start();const data=await (await fetch(url)).json();assert.equal(data.revision,1);assert.equal(data.value[0].contracts[0].id,'C-1');
  assert.equal((await fetch('http://127.0.0.1:3001/api/records/unknown')).status,404);
 }finally{await stop(child);rmSync(directory,{recursive:true,force:true});}
});
