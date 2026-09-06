import React,{useState} from 'react';
import {useApp} from '../../context/AppContext';
import {importLocations} from '../../lib/tracking';
import {download} from '../../lib/export';
export function LocationHistory(){
 const {vehicles,updateVehicle,isRTL}=useApp();const [vehicleId,setVehicleId]=useState(vehicles[0]?.id||'');const [message,setMessage]=useState('');
 const v=vehicles.find(v=>v.id===vehicleId);const tr=(ar:string,en:string)=>isRTL?ar:en;
 return <details className="bento-card p-5"><summary className="font-semibold cursor-pointer">{tr('المواقع وسجل التتبع المستورد','Locations and imported tracking history')}</summary>
 <p className="my-4 leading-7">{tr('لا يوجد مصدر GPS مباشر متصل. استورد ملف المواقع لمراجعة الإحداثيات والوقت؛ تُربط النقاط بالعقد فقط إذا طابقت فترة عقد واحدة.','No live GPS source is connected. Import a location file to review coordinates and timestamps; points are linked only when they match exactly one rental period.')}</p>
 <div className="flex flex-wrap gap-4"><label>{tr('المركبة','Vehicle')}<select className="athar-field" value={vehicleId} onChange={e=>setVehicleId(e.target.value)}>{vehicles.map(v=><option key={v.id} value={v.id}>{v.make} {v.model} · {v.plateNumber}</option>)}</select></label>
 <label className="flex-1">{tr('استيراد GPS بصيغة JSON (حتى ٢ ميجابايت)','Import GPS JSON (up to 2 MB)')}<input className="athar-field" type="file" accept="application/json,.json" onChange={async e=>{const f=e.target.files?.[0];e.target.value='';if(!f)return;try{if(f.size>2*1024*1024)throw new Error(tr('الملف كبير جداً','File is too large'));const result=importLocations(vehicles,JSON.parse(await f.text()));result.forEach(updateVehicle);setMessage(tr('تمت إضافة سجل المواقع.','Location history added.'));}catch(err){setMessage((err as Error).message);}}}/></label></div>
 <button className="underline my-4" onClick={()=>download('athar-gps-example.json',JSON.stringify([{vehicleId,latitude:24.7136,longitude:46.6753,timestamp:new Date().toISOString()}],null,2),'application/json')}>{tr('تنزيل مثال تنسيق — إحداثيات تجريبية','Download format example — sample coordinates')}</button>
 {message&&<p role="status">{message}</p>}
 {!v?.locations?.length?<p>{tr('لا توجد مواقع مسجلة لهذه المركبة.','No locations recorded for this vehicle.')}</p>:<div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr>{[tr('الوقت','Time'),tr('خط العرض','Latitude'),tr('خط الطول','Longitude'),tr('المصدر','Source'),tr('الخريطة','Map')].map(h=><th className="text-start p-2" key={h}>{h}</th>)}</tr></thead><tbody>{v.locations.slice(0,100).map((r,i)=><tr key={i}><td className="p-2">{new Date(r.timestamp).toLocaleString(isRTL?'ar-SA':'en-GB')}</td><td>{r.latitude}</td><td>{r.longitude}</td><td>{tr('ملف مستورد','Imported file')}</td><td><a target="_blank" rel="noopener noreferrer" className="underline" href={`https://www.openstreetmap.org/?mlat=${r.latitude}&mlon=${r.longitude}#map=16/${r.latitude}/${r.longitude}`}>{tr('عرض الموقع','View location')}</a></td></tr>)}</tbody></table><p className="mt-3">{tr('عرض أحدث ١٠٠ نقطة كحد أقصى.','Showing up to the latest 100 points.')}</p></div>}
 </details>;
}
