import {inspectionConditionLabel, inspectionTypeLabel, inspectionErrorMessage, type InspectionField} from '../../lib/inspectionLabels';
import React,{useState,useEffect,useRef} from 'react';
import {X} from 'lucide-react';
import {useApp} from '../../context/AppContext';
import {contractsFor} from '../../lib/rental';
import type {InspectionRecord,InspectionCondition} from '../../types';
export const InspectionModal:React.FC=()=>{
 const {isInspectionModalOpen,setIsInspectionModalOpen,vehicles,selectedVehicle,addInspectionRecord,isRTL}=useApp();
 const [vehicleId,setVehicleId]=useState('');const [type,setType]=useState<InspectionRecord['type']>('routine');
 const [inspector,setInspector]=useState('');const [mileage,setMileage]=useState('');const [fuel,setFuel]=useState('');const [notes,setNotes]=useState('');const [faults,setFaults]=useState('');const [photos,setPhotos]=useState<string[]>([]);const [reading,setReading]=useState(false);const [error,setError]=useState('');
 const [condition,setCondition]=useState({exterior:'good',interior:'clean',tires:'optimal',lights:'all_functional'});
 const dialog=useRef<HTMLDialogElement>(null);
 const tr=(ar:string,en:string)=>isRTL?ar:en;
 const vehicle=vehicles.find(v=>v.id===vehicleId);
 const contract=vehicle?contractsFor(vehicle).find(c=>c.status===(type==='before_rental'?'draft':'active')):undefined;
 useEffect(()=>{if(isInspectionModalOpen){setVehicleId(selectedVehicle?.id||vehicles[0]?.id||'');setError('');setInspector('');setNotes('');dialog.current?.showModal();}else dialog.current?.close();},[isInspectionModalOpen]);
 useEffect(()=>{if(!vehicle)return;setMileage(String(vehicle.mileageKm));setFuel(String(vehicle.sensorData.fuelLevel));setFaults(vehicle.activeFaults.map(f=>f.code).join(', '));setPhotos([]);setCondition({exterior:'good',interior:'clean',tires:'optimal',lights:'all_functional'});const open=contractsFor(vehicle).find(c=>['active','draft'].includes(c.status));setType(open?.status==='draft'?'before_rental':open?.status==='active'?'post_rental':'routine');},[vehicleId,isInspectionModalOpen]);
 async function loadPhotos(files:FileList|null){
  if(!files)return;setError('');setReading(true);
  try{if(files.length+photos.length>4)throw new Error(tr('الحد الأقصى ٤ صور لكل فحص.','Maximum four photos per inspection.'));
   const loaded:string[]=[];
   for(const file of Array.from(files)){
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>4*1024*1024)throw new Error(tr('اختر صور JPG أو PNG أو WebP أقل من ٤ ميجابايت.','Use JPG, PNG or WebP images below 4 MB.'));
    const data=await new Promise<string>((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=()=>reject(new Error('Image read failed'));r.readAsDataURL(file);});
    const img=await new Promise<HTMLImageElement>((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('Invalid image'));im.src=data;});
    const scale=Math.min(1,1200/Math.max(img.width,img.height));const canvas=document.createElement('canvas');canvas.width=img.width*scale;canvas.height=img.height*scale;canvas.getContext('2d')!.drawImage(img,0,0,canvas.width,canvas.height);loaded.push(canvas.toDataURL('image/jpeg',0.8));
   }setPhotos(p=>[...p,...loaded]);
  }catch(e){setError((e as Error).message);}finally{setReading(false);}
 }
 return <dialog ref={dialog} onCancel={()=>setIsInspectionModalOpen(false)} className="m-auto p-0 w-[min(95vw,650px)] max-h-[90vh] rounded-2xl bg-white dark:bg-[#1b1b18] text-neutral-900 dark:text-white backdrop:bg-black/60" aria-labelledby="inspection-title">
  <div className="p-5 border-b flex justify-between items-center"><h2 id="inspection-title" className="text-xl font-bold">{tr('تسجيل فحص المركبة','Record vehicle inspection')}</h2><button aria-label={tr('إغلاق','Close')} onClick={()=>setIsInspectionModalOpen(false)}><X/></button></div>
  <form className="p-5 space-y-4" onSubmit={e=>{e.preventDefault();if(!vehicle)return;try{
   const codes=faults.split(/[,،\s]+/).map(s=>s.trim().toUpperCase()).filter(Boolean);if(codes.some(c=>! /^[PBCU][0-3][0-9A-F]{3}$/.test(c)))throw new Error(tr('أدخل أكواد أعطال صحيحة، مثل P0301.','Enter valid fault codes such as P0301.'));
   addInspectionRecord({vehicleId:vehicle.id,rentalId:type==='routine'?undefined:contract?.id,type,date:new Date().toISOString(),inspectorName:inspector.trim(),mileage:Number(mileage),healthScore:vehicle.healthScore,condition:{...condition as Pick<InspectionCondition,'exterior'|'interior'|'tires'|'lights'>,fuelLevel:Number(fuel),mileage:Number(mileage),healthScore:vehicle.healthScore,warningLights:codes,activeFaultsCount:codes.length},notes:notes.trim(),notesAr:notes.trim(),faultsDetected:codes,photos});setIsInspectionModalOpen(false);
  }catch(err){setError((err as Error).message);}}}>
   <label className="block">{tr('المركبة','Vehicle')}<select className="athar-field" value={vehicleId} onChange={e=>setVehicleId(e.target.value)}>{vehicles.map(v=><option key={v.id} value={v.id}>{v.make} {v.model} · {v.plateNumber}</option>)}</select></label>
   <label className="block">{tr('نوع الفحص','Inspection type')}<select className="athar-field" value={type} onChange={e=>setType(e.target.value as InspectionRecord['type'])}><option value="routine">{inspectionTypeLabel('routine',isRTL)}</option><option value="before_rental">{inspectionTypeLabel('before_rental',isRTL)}</option><option value="post_rental">{inspectionTypeLabel('post_rental',isRTL)}</option></select></label>
   {type!=='routine'&&<p>{tr('العقد','Contract')}: {contract?.id||tr('أنشئ عقداً أولاً من العمليات.','Create a contract in Operations first.')}</p>}
   <label className="block">{tr('اسم الفاحص','Inspector name')}<input className="athar-field" required maxLength={120} value={inspector} onChange={e=>setInspector(e.target.value)}/></label>
   <div className="grid sm:grid-cols-2 gap-4"><label>{tr('قراءة العداد الفعلية (كم)','Actual odometer (km)')}<input type="number" required min={vehicle?.mileageKm||0} step="1" className="athar-field" value={mileage} onChange={e=>setMileage(e.target.value)}/></label><label>{tr('الوقود الفعلي (%)','Actual fuel (%)')}<input type="number" required min="0" max="100" className="athar-field" value={fuel} onChange={e=>setFuel(e.target.value)}/></label></div>
   <p className="text-sm text-neutral-500 dark:text-neutral-400">{tr('تحقق من القراءات المقترحة وأدخل القياسات الفعلية. لا يوجد اتصال مباشر بجهاز المركبة.','Verify the prefilled readings and enter actual measurements. No vehicle device is connected.')}</p>
   <div className="grid sm:grid-cols-2 gap-4">{[
    {key:'exterior',label:tr('الهيكل','Exterior'),options:[['good',tr('سليم','Good')],['minor_scratches',tr('خدوش طفيفة','Minor scratches')],['damage_noted',tr('ضرر مسجل','Damage noted')]]},
    {key:'interior',label:tr('المقصورة','Interior'),options:[['clean',tr('نظيفة','Clean')],['fair',tr('متوسطة','Fair')],['needs_cleaning',tr('تحتاج تنظيف','Needs cleaning')]]},
    {key:'tires',label:tr('الإطارات','Tires'),options:[['optimal',tr('جيدة','Good')],['moderate_wear',tr('تآكل متوسط','Moderate wear')],['attention_needed',tr('تحتاج مراجعة','Needs review')]]},
    {key:'lights',label:tr('الأنوار','Lights'),options:[['all_functional',tr('تعمل','Functional')],['bulb_fault',tr('عطل إنارة','Light fault')]]}
   ].map(f=><label key={f.key}>{f.label}<select className="athar-field" value={condition[f.key as keyof typeof condition]} onChange={e=>setCondition({...condition,[f.key]:e.target.value})}>{f.options.map(([v,l])=><option key={v} value={v}>{inspectionConditionLabel(f.key as InspectionField,v,isRTL)}</option>)}</select></label>)}</div>
   <label className="block">{tr('أكواد الأعطال المرصودة (تفصل بفاصلة)','Observed fault codes (comma separated)')}<input className="athar-field" value={faults} onChange={e=>setFaults(e.target.value)}/></label>
   <label className="block">{tr('الملاحظات','Notes')}<textarea className="athar-field" maxLength={2000} value={notes} onChange={e=>setNotes(e.target.value)}/></label>
   <label className="block">{tr('صور الحالة (حتى ٤ صور، ٤ ميجابايت للصورة)','Condition photos (up to 4, 4 MB each)')}<input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={reading} onChange={e=>{void loadPhotos(e.target.files);e.target.value='';}} className="athar-field"/></label>
   <div className="flex gap-2 flex-wrap">{photos.map((src,i)=><div key={i}><img src={src} className="w-24 h-24 object-cover" alt={tr('صورة حالة المركبة','Vehicle condition photo')}/><button type="button" className="text-sm underline" onClick={()=>setPhotos(photos.filter((_,n)=>n!==i))}>{tr('إزالة','Remove')}</button></div>)}</div>
   {error&&<p role="alert" className="text-red-600">{inspectionErrorMessage(error,isRTL)}</p>}
   <button disabled={reading||(type!=='routine'&&!contract)} className="athar-primary disabled:opacity-50">{reading?tr('جارٍ تجهيز الصور…','Preparing photos…'):tr('حفظ الفحص','Save inspection')}</button>
  </form>
 </dialog>;
};
