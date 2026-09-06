import 'fake-indexeddb/auto';
import test from 'node:test';
import assert from 'node:assert/strict';
import {openRecords,readBrowserRecord,writeBrowserRecord} from '../src/lib/browserRecords';
test('browser records survive reopening, including photos',async()=>{
 const name=crypto.randomUUID();let db=await openRecords(name);
 assert.deepEqual(await readBrowserRecord(db,'fleet'),{value:null,revision:0});
 const value=[{id:'vehicle-1',contracts:[{id:'C1'}],photos:['data:image/jpeg;base64,example']}];
 assert.equal(await writeBrowserRecord(db,'fleet',value,0),1);db.close();db=await openRecords(name);
 assert.deepEqual(await readBrowserRecord(db,'fleet'),{value,revision:1});db.close();
});
test('concurrent browser writes reject stale revisions without losing saved data',async()=>{
 const db=await openRecords(crypto.randomUUID());
 const results=await Promise.allSettled([writeBrowserRecord(db,'fleet',['first'],0),writeBrowserRecord(db,'fleet',['second'],0)]);
 assert.equal(results.filter(r=>r.status==='fulfilled').length,1);assert.equal(results.filter(r=>r.status==='rejected').length,1);
 assert.equal((await readBrowserRecord(db,'fleet')).revision,1);db.close();
});
test('repository databases and work orders remain independent',async()=>{
 const db1=await openRecords('test-one-'+crypto.randomUUID());const db2=await openRecords('test-two-'+crypto.randomUUID());
 await writeBrowserRecord(db1,'workorders',[{id:'WO1'}],0);
 assert.equal((await readBrowserRecord(db2,'workorders')).value,null);
 assert.equal((await readBrowserRecord(db1,'fleet')).value,null);db1.close();db2.close();
});
