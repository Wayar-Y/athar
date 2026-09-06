import type {Vehicle,TimelineEvent,FaultCode} from '../types';
import {contractsFor} from './rental';
export interface TelemetryInput {vehicleId:string;timestamp:string;rpm:number;speed:number;coolantTemp:number;batteryVoltage:number;fuelLevel:number;faultCodes:string[]}
export function applyTelemetry(vehicle:Vehicle,raw:unknown):Vehicle {
 const r=raw as TelemetryInput;
 if(!r || r.vehicleId!==vehicle.id || typeof r.timestamp!=='string' || !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(r.timestamp) || !Number.isFinite(Date.parse(r.timestamp)) || Date.parse(r.timestamp)>Date.now()+60000)throw new Error('Invalid vehicle or timestamp / المركبة أو الوقت غير صالح');
 const ranges={rpm:[0,12000],speed:[0,350],coolantTemp:[-50,200],batteryVoltage:[0,32],fuelLevel:[0,100]};
 for(const [key,[min,max]] of Object.entries(ranges)){const n=r[key as keyof TelemetryInput];if(typeof n!=='number'||!Number.isFinite(n)||n<min||n>max)throw new Error(`Invalid ${key}`);}
 if(!Array.isArray(r.faultCodes)||r.faultCodes.some(c=>typeof c!=='string'||!/^[PBCU][0-3][0-9A-F]{3}$/.test(c)))throw new Error('Invalid diagnostic codes');
 const time=new Date(r.timestamp).toISOString();
 if(vehicle.timeline.some(e=>e.meta?.source==='obd-import'&&e.timestamp===time))throw new Error('This reading already exists / القراءة موجودة');
 const latest=vehicle.timeline.filter(e=>e.meta?.source==='obd-import').map(e=>Date.parse(e.timestamp!));
 if(latest.length&&Date.parse(time)<Math.max(...latest))throw new Error('Import readings in chronological order / استورد القراءات بالترتيب الزمني');
 const contracts=contractsFor(vehicle).filter(c=>['active','returned'].includes(c.status)&&Date.parse(time)>=Date.parse(c.startDate)&&Date.parse(time)<=Date.parse(c.returnedAt||c.expectedReturnDate));
 const rentalId=contracts.length===1?contracts[0].id:undefined;
 const codes=[...new Set(r.faultCodes)];
 const newCodes=codes.filter(code=>!vehicle.activeFaults.some(f=>f.code===code));
 const faults:FaultCode[]=newCodes.map(code=>({id:crypto.randomUUID(),code,title:`Imported fault ${code}`,titleAr:`عطل مستورد ${code}`,description:'Code reported in imported OBD reading; technician review required.',descriptionAr:'كود مسجل في قراءة مستوردة؛ يلزم تفسيره بواسطة فني.',severity:'medium',firstDetected:time,lastDetected:time,occurrences:1,isRecurring:false,status:'active',recommendedAction:'Confirm code and inspect vehicle',recommendedActionAr:'تحقق من الكود وافحص المركبة',system:'unknown'}));
 const observation:TimelineEvent={id:crypto.randomUUID(),rentalId,timestamp:time,date:time.slice(0,10),time:time.slice(11,16),type:newCodes.length?'fault_detected':'device_event',title:'Imported OBD reading',titleAr:'قراءة OBD مستوردة',description:`RPM ${r.rpm}; ${r.speed} km/h; ${r.coolantTemp} °C; ${r.batteryVoltage} V; DTC ${codes.join(', ')||'none'}`,descriptionAr:`دورة/د ${r.rpm}؛ السرعة ${r.speed}؛ الحرارة ${r.coolantTemp}؛ الجهد ${r.batteryVoltage}؛ الأكواد ${codes.join(', ')||'لا يوجد'}`,meta:{source:'obd-import'}};
 // A transparent demonstration rule, not an OEM specification or prediction model.
 const highTemp=r.coolantTemp>115;
 return {...vehicle,sensorData:{...vehicle.sensorData,rpm:r.rpm,speed:r.speed,coolantTemp:r.coolantTemp,batteryVoltage:r.batteryVoltage,fuelLevel:r.fuelLevel,lastUpdated:time,freshness:'offline',freshnessText:'Imported reading — no live connection'},activeFaults:[...faults,...vehicle.activeFaults.map(f=>codes.includes(f.code)?{...f,lastDetected:time,occurrences:f.occurrences+1,isRecurring:true}:f)],
  earlyWarnings:highTemp?[{id:crypto.randomUUID(),title:'Imported temperature exceeds prototype review threshold',titleAr:'الحرارة المستوردة تتجاوز حد المراجعة التجريبي',parameter:'Coolant temperature',parameterAr:'حرارة سائل التبريد',currentValue:`${r.coolantTemp} °C`,baselineValue:'Prototype rule: >115 °C',anomalyDescription:'Single imported reading exceeds the illustrative threshold; confirm with a technician.',anomalyDescriptionAr:'قراءة واحدة تتجاوز حداً توضيحياً؛ يلزم تحقق فني.',detectedDate:time,recommendedAction:'Review reading and inspect cooling system',recommendedActionAr:'راجع القراءة وافحص نظام التبريد'},...vehicle.earlyWarnings]:vehicle.earlyWarnings,
  timeline:[...(highTemp?[{...observation,id:crypto.randomUUID(),type:'sensor_anomaly' as const,title:'Temperature review alert',titleAr:'تنبيه مراجعة الحرارة',severity:'high' as const}]:[]),observation,...vehicle.timeline]};
}
