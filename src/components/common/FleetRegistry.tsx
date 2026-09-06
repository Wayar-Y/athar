import React,{useState} from 'react';
import {useApp} from '../../context/AppContext';
import type {Vehicle} from '../../types';
export function FleetRegistry(){
 const {vehicles,saveVehicle,isRTL}=useApp(); const [id,setId]=useState('');const [error,setError]=useState('');const tr=(ar:string,en:string)=>isRTL?ar:en;
 const selected=vehicles.find(v=>v.id===id);
 return <details className="bento-card p-5"><summary className="font-semibold cursor-pointer">{tr('إضافة مركبة أو تعديل بياناتها','Add or edit vehicle')}</summary>
 <label className="block mt-4">{tr('السجل','Record')}<select className="athar-field" value={id} onChange={e=>{setId(e.target.value);setError('');}}><option value="">{tr('مركبة جديدة','New vehicle')}</option>{vehicles.map(v=><option key={v.id} value={v.id}>{v.make} {v.model} · {v.plateNumber}</option>)}</select></label>
 <form key={id} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4" onSubmit={e=>{e.preventDefault();const f=new FormData(e.currentTarget);const str=(key:string)=>String(f.get(key)||'').trim();try{
  const mileage=Number(f.get('mileage'));if(mileage<(selected?.mileageKm||0))throw new Error(tr('لا يمكن تقليل قراءة العداد.','Odometer cannot decrease.'));
  const base:Vehicle=selected||{id:crypto.randomUUID(),make:'',model:'',year:2026,plateNumber:'',plateNumberAr:'',vin:'',branch:'',branchAr:'',healthScore:0,healthStatus:'attention',healthTrend:[],healthScoreChangeReason:'No diagnostic reading recorded',healthScoreChangeReasonAr:'لم تسجل قراءة تشخيصية',status:'inspection',riskScore:0,riskLevel:'low',primaryRiskIssue:'Inspection required before first rental',primaryRiskIssueAr:'يلزم فحص قبل أول تأجير',mileageKm:mileage,nextMaintenanceDate:'',nextMaintenanceKm:0,deviceId:'',deviceStatus:'offline',rentalContext:{isCurrentlyRented:false,branch:'',branchAr:'',pastRentalsCount:0,cleanReturnsCount:0,issuesReportedCount:0},sensorData:{rpm:0,speed:0,coolantTemp:0,coolantTempBaseline:{min:0,max:0},engineLoad:0,fuelLevel:0,batteryVoltage:0,batteryVoltageBaseline:{min:0,max:0},throttlePosition:0,intakeTemp:0,odometerKm:mileage,lastUpdated:'No reading',freshness:'offline',freshnessText:'No device connected'},activeFaults:[],resolvedFaults:[],aiPredictions:[],earlyWarnings:[],maintenanceList:[],inspections:[],timeline:[],contracts:[]};
  saveVehicle({...base,make:str('make'),model:str('model'),year:Number(str('year')),plateNumber:str('plate'),plateNumberAr:str('plateAr')||str('plate'),vin:str('vin').toUpperCase(),branch:str('branch'),branchAr:str('branchAr')||str('branch'),mileageKm:mileage,rentalContext:{...base.rentalContext,branch:str('branch'),branchAr:str('branchAr')||str('branch')},sensorData:{...base.sensorData,odometerKm:mileage}});setError(tr('تم حفظ بيانات المركبة. للمركبة الجديدة: أكمل فحصاً دورياً ثم اعتمد الجاهزية من العمليات.','Vehicle saved. For a new vehicle, complete a routine inspection and approve availability in Operations.'));
 }catch(err){setError((err as Error).message);}}}>
 {[
 ['make',tr('الصانع','Make'),selected?.make],['model',tr('الطراز','Model'),selected?.model],['plate',tr('اللوحة بالإنجليزية','Plate (English)'),selected?.plateNumber],['plateAr',tr('اللوحة بالعربية','Plate (Arabic)'),selected?.plateNumberAr],['vin',tr('رقم الهيكل VIN','VIN'),selected?.vin],['branch',tr('الفرع بالإنجليزية','Branch (English)'),selected?.branch],['branchAr',tr('الفرع بالعربية','Branch (Arabic)'),selected?.branchAr]
 ].map(([name,label,value])=><label key={name}>{label}<input name={name} defaultValue={value||''} required={!['plateAr','branchAr'].includes(name)} maxLength={name==='vin'?17:100} minLength={name==='vin'?17:1} pattern={name==='vin'?'[A-HJ-NPR-Za-hj-npr-z0-9]{17}':undefined} className="athar-field"/></label>)}
 <label>{tr('سنة الصنع','Year')}<input name="year" type="number" required min="1980" max={new Date().getFullYear()+1} defaultValue={selected?.year||new Date().getFullYear()} className="athar-field"/></label>
 <label>{tr('العداد (كم)','Odometer (km)')}<input name="mileage" type="number" required min={selected?.mileageKm||0} defaultValue={selected?.mileageKm||0} className="athar-field"/></label>
 <button className="athar-primary">{tr('حفظ المركبة','Save vehicle')}</button>
 </form>{error&&<p role="status" className="mt-3">{error}</p>}
 </details>;
}
