import type {Vehicle, RentalContract, InspectionRecord, TimelineEvent} from '../types';
export function contractsFor(v: Vehicle): RentalContract[] {
  if (v.contracts) return v.contracts;
  const r = v.rentalContext;
  return r.rentalId ? [{id:r.rentalId, renterName:r.renterReference || 'Sample customer', startDate:r.rentalStartDate || '', expectedReturnDate:r.expectedReturnDate || '', dailyRate:0, status:r.isCurrentlyRented ? 'active' : 'returned'}] : [];
}
export function createContract(v: Vehicle, c: RentalContract): Vehicle {
  if (contractsFor(v).some(r => r.status === 'active' || r.status === 'draft') || v.status !== 'available') throw new Error('Choose an available vehicle with no open contract. / اختر مركبة متاحة بلا عقد مفتوح.');
  if (!c.id.trim() || !c.renterName.trim() || !Number.isFinite(c.dailyRate) || c.dailyRate < 0 || !Number.isFinite(Date.parse(c.startDate)) || !Number.isFinite(Date.parse(c.expectedReturnDate)) || Date.parse(c.expectedReturnDate) <= Date.parse(c.startDate)) throw new Error('Check the customer, rate and rental dates. / تحقق من العميل والسعر وتواريخ العقد.');
  return {...v, contracts:[...contractsFor(v), {...c,status:'draft'}]};
}
export function recordInspection(v: Vehicle, record: InspectionRecord): Vehicle {
  if (!record.inspectorName.trim() || !Number.isFinite(record.mileage) || record.mileage < v.mileageKm || !Number.isFinite(record.condition.fuelLevel) || record.condition.fuelLevel < 0 || record.condition.fuelLevel > 100) throw new Error('Enter inspector, valid odometer and fuel (0–100). / أدخل الفاحص وقراءة عداد صحيحة والوقود.');
  const contracts = contractsFor(v);
  const contract = contracts.find(c => c.id === record.rentalId);
  if (record.type !== 'routine') {
    const expected = record.type === 'before_rental' ? 'draft' : 'active';
    if (!contract || contract.status !== expected) throw new Error('Select a matching open contract. / اختر العقد المفتوح المناسب للفحص.');
    if (Date.parse(record.date) < Date.parse(contract.startDate)) throw new Error('Inspection cannot precede the contract start. / الفحص يسبق بداية العقد.');
  }
  const stamp = new Date(record.date);
  if (!Number.isFinite(stamp.getTime())) throw new Error('Invalid inspection date');
  const completed = record.type === 'post_rental';
  const handoff = record.type === 'before_rental';
  const event: TimelineEvent = {id:crypto.randomUUID(), rentalId:record.rentalId, timestamp:stamp.toISOString(), date:stamp.toISOString().slice(0,10), time:stamp.toISOString().slice(11,16), type:'inspection',title:handoff?'Handoff inspection':completed?'Return inspection':'Routine inspection',titleAr:handoff?'فحص التسليم':completed?'فحص الإرجاع':'فحص دوري',description:`${record.inspectorName} · ${record.mileage} km · ${record.rentalId || '—'}`,descriptionAr:`${record.inspectorName} · ${record.mileage} كم · ${record.rentalId || '—'}`};
  return {...v, contracts:contracts.map(c=>c.id===record.rentalId ? {...c,status:handoff?'active':completed?'returned':c.status,returnedAt:completed?record.date:c.returnedAt} : c),
    status:handoff?'rented':completed?'inspection':v.status,
    mileageKm:record.mileage, sensorData:{...v.sensorData,odometerKm:record.mileage,fuelLevel:record.condition.fuelLevel},
    rentalContext:{...v.rentalContext,isCurrentlyRented:handoff?true:completed?false:v.rentalContext.isCurrentlyRented,
      ...(contract ? {rentalId:contract.id,renterReference:contract.renterName,rentalStartDate:contract.startDate,expectedReturnDate:contract.expectedReturnDate}:{}),
      pastRentalsCount:v.rentalContext.pastRentalsCount+(completed?1:0)},
    inspections:[record,...v.inspections], timeline:[event,...v.timeline]};
}
export function compareRental(v: Vehicle, rentalId:string) {
  const records = v.inspections.filter(i=>i.rentalId===rentalId).sort((a,b)=>Date.parse(a.date)-Date.parse(b.date));
  const before=records.find(i=>i.type==='before_rental');
  const after=records.find(i=>i.type==='post_rental' && (!before || Date.parse(i.date)>=Date.parse(before.date)));
  const changes=before && after ? (['exterior','interior','tires','lights'] as const).filter(k=>before.condition[k]!==after.condition[k]).map(k=>({field:k,before:before.condition[k],after:after.condition[k]})) : [];
  return {before,after,changes,distance:before&&after?after.mileage-before.mileage:null,fuelDelta:before&&after?after.condition.fuelLevel-before.condition.fuelLevel:null,newFaults:before&&after?after.faultsDetected.filter(c=>!before.faultsDetected.includes(c)):[],events:v.timeline.filter(e=>e.rentalId===rentalId)};
}
