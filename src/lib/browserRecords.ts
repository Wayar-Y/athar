export interface StoredRecord<T=unknown> {value:T|null;revision:number}
export function openRecords(name:string):Promise<IDBDatabase> {
 return new Promise((resolve,reject)=>{
  const request=indexedDB.open(name,1);
  request.onupgradeneeded=()=>request.result.createObjectStore('records');
  request.onsuccess=()=>{request.result.onversionchange=()=>request.result.close();resolve(request.result);};
  request.onerror=()=>reject(new Error('Browser storage is unavailable. Allow site storage and reload. / اسمح بتخزين بيانات الموقع ثم أعد التحميل.'));
  request.onblocked=()=>reject(new Error('Close other Athar tabs and reload. / أغلق نوافذ أثر الأخرى وأعد التحميل.'));
 });
}
export async function readBrowserRecord(db:IDBDatabase,key:string):Promise<StoredRecord> {
 return new Promise((resolve,reject)=>{
  const request=db.transaction('records','readonly').objectStore('records').get(key);
  request.onsuccess=()=>resolve(request.result??{value:null,revision:0});
  request.onerror=()=>reject(request.error);
 });
}
export async function writeBrowserRecord(db:IDBDatabase,key:string,value:unknown,revision:number):Promise<number> {
 return new Promise((resolve,reject)=>{
  const tx=db.transaction('records','readwrite');const store=tx.objectStore('records');
  let conflict=false;
  const request=store.get(key);
  request.onsuccess=()=>{
   if((request.result?.revision??0)!==revision){conflict=true;tx.abort();return;}
   store.put({value,revision:revision+1},key);
  };
  tx.oncomplete=()=>resolve(revision+1);
  tx.onabort=()=>reject(new Error(conflict?'Records changed in another tab. Preserve unsaved input and reload. / تغيرت البيانات في نافذة أخرى؛ احفظ المدخلات وأعد التحميل.':'Could not save in this browser. Storage may be full or disabled. / تعذر الحفظ؛ قد تكون مساحة التخزين ممتلئة أو معطلة.'));
  tx.onerror=()=>{}; // onabort reports both request and transaction failures
 });
}
