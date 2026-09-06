import type {Vehicle,TimelineEvent} from '../types';
import {contractsFor} from './rental';
export interface LocationRecord {vehicleId:string;latitude:number;longitude:number;timestamp:string}
export function importLocations(vehicles:Vehicle[], data:unknown):Vehicle[] {
 if(!Array.isArray(data)||!data.length||data.length>2000)throw new Error('Expected 1–2000 location records / يلزم من ١ إلى ٢٠٠٠ سجل موقع');
 const rows=data as LocationRecord[];
 for(const r of rows){if(!r||!vehicles.some(v=>v.id===r.vehicleId)||typeof r.latitude!=='number'||!Number.isFinite(r.latitude)||Math.abs(r.latitude)>90||typeof r.longitude!=='number'||!Number.isFinite(r.longitude)||Math.abs(r.longitude)>180||typeof r.timestamp!=='string'||!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(r.timestamp)||!Number.isFinite(Date.parse(r.timestamp))||Date.parse(r.timestamp)>Date.now()+60000)throw new Error('Invalid vehicle, coordinates or timestamp / بيانات المركبة أو الإحداثيات أو الوقت غير صحيحة');}
 return vehicles.map(v=>{
  const known=new Set((v.locations||[]).map(r=>`${new Date(r.timestamp).toISOString()}|${r.latitude}|${r.longitude}`));
  const additions=rows.filter(r=>r.vehicleId===v.id).map(r=>({...r,timestamp:new Date(r.timestamp).toISOString(),source:'Imported GPS file'})).filter(r=>{const key=`${r.timestamp}|${r.latitude}|${r.longitude}`;if(known.has(key))return false;known.add(key);return true;});
  const events:TimelineEvent[]=additions.map(r=>{
   const matched=contractsFor(v).filter(c=>c.status!=='cancelled'&&c.status!=='draft'&&Date.parse(r.timestamp)>=Date.parse(c.startDate)&&Date.parse(r.timestamp)<=Date.parse(c.returnedAt||c.expectedReturnDate));
   return {id:crypto.randomUUID(),timestamp:r.timestamp,date:r.timestamp.slice(0,10),time:r.timestamp.slice(11,16),rentalId:matched.length===1?matched[0].id:undefined,type:'device_event',title:'Imported GPS location',titleAr:'موقع مستورد من ملف GPS',description:`${r.latitude}, ${r.longitude} · Imported file`,descriptionAr:`${r.latitude}, ${r.longitude} · ملف مستورد`};
  });
  return {...v,locations:[...(v.locations||[]),...additions].sort((a,b)=>Date.parse(b.timestamp)-Date.parse(a.timestamp)),timeline:[...events,...v.timeline]};
 });
}
