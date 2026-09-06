import {openRecords,readBrowserRecord,writeBrowserRecord} from './browserRecords';
export const browserStorage = import.meta.env.VITE_STORAGE_MODE !== 'server';
let database:Promise<IDBDatabase>|undefined;
function getDatabase(){
 // Isolate repositories hosted under the same username.github.io origin.
 const sitePath=new URL(import.meta.env.BASE_URL,window.location.href).pathname;
 return database??=openRecords(`athar-records-v1:${sitePath}`);
}
export async function loadRecord(key:string){
 if(browserStorage)return readBrowserRecord(await getDatabase(),key);
 const response=await fetch(`/api/records/${key}`);
 if(!response.ok)throw new Error('Cannot load records. Start the local server and reload.');
 return response.json();
}
export async function saveRecord(key:string,value:unknown,revision:number){
 if(browserStorage)return writeBrowserRecord(await getDatabase(),key,value,revision);
 const response=await fetch(`/api/records/${key}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value,revision})});
 if(!response.ok)throw new Error(response.status===409?'Records changed in another window. Preserve input and reload.':'Changes could not be saved. Preserve input before reloading.');
 return (await response.json()).revision as number;
}
