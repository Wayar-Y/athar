import type { InspectionRecord } from '../types';

export type InspectionField = 'exterior' | 'interior' | 'tires' | 'lights';
type LabelPair = readonly [arabic: string, english: string];

// Translate at display time. Never replace the stored condition codes with labels.
const conditionLabels: Record<InspectionField, Record<string, LabelPair>> = {
  exterior: {
    good: ['سليم', 'Good'],
    excellent: ['ممتاز', 'Excellent'],
    fair: ['حالة مقبولة', 'Fair'],
    minor_scratches: ['خدوش طفيفة', 'Minor scratches'],
    damage_noted: ['ضرر مسجل', 'Damage noted'],
  },
  interior: {
    clean: ['نظيفة', 'Clean'],
    sanitized_clean: ['نظيفة ومعقمة', 'Clean and sanitized'],
    excellent: ['ممتازة', 'Excellent'],
    good: ['جيدة', 'Good'],
    fair: ['حالة مقبولة', 'Fair'],
    needs_cleaning: ['تحتاج إلى تنظيف', 'Needs cleaning'],
    needs_wash: ['تحتاج إلى تنظيف', 'Needs cleaning'],
  },
  tires: {
    optimal: ['جيدة', 'Good'],
    excellent: ['ممتازة', 'Excellent'],
    good: ['جيدة', 'Good'],
    fair: ['حالة مقبولة', 'Fair'],
    moderate_wear: ['تآكل متوسط', 'Moderate wear'],
    uneven_wear: ['تآكل غير متساوٍ', 'Uneven wear'],
    attention_needed: ['تحتاج إلى فحص', 'Needs inspection'],
    attention: ['تحتاج إلى فحص', 'Needs inspection'],
  },
  lights: {
    all_functional: ['تعمل جميعها', 'All functional'],
    excellent: ['تعمل جميعها', 'All functional'],
    good: ['تعمل بصورة سليمة', 'Good'],
    fair: ['تحتاج إلى مراجعة', 'Needs review'],
    bulb_fault: ['عطل في أحد المصابيح', 'Bulb fault'],
  },
};

export function inspectionConditionLabel(field: InspectionField, value: unknown, isRTL: boolean): string {
  if (value === null || value === undefined || String(value).trim() === '') return isRTL ? 'غير مسجلة' : 'Not recorded';
  const key = String(value).trim().toLowerCase().replace(/[\s-]+/g, '_');
  const pair = conditionLabels[field][key];
  if (pair) return pair[isRTL ? 0 : 1];
  // Older Arabic values remain readable; unknown codes must not imply good condition.
  if (isRTL && /[\u0600-\u06ff]/.test(String(value))) return String(value);
  return isRTL ? 'حالة غير معروفة' : String(value).replace(/_/g, ' ');
}

export function inspectionTypeLabel(type: string, isRTL: boolean): string {
  const labels: Record<string, LabelPair> = {
    before_rental: ['فحص ما قبل التأجير', 'Pre-rental inspection'],
    post_rental: ['فحص الاستلام بعد التأجير', 'Return inspection'],
    routine: ['فحص دوري', 'Routine inspection'],
  };
  return labels[type]?.[isRTL ? 0 : 1] || (isRTL ? 'فحص غير محدد' : 'Unspecified inspection');
}

export function inspectionNotes(record: Pick<InspectionRecord, 'notes' | 'notesAr'> | undefined, isRTL: boolean): string {
  if (!record) return '—';
  // Free-form operator notes are retained verbatim if no translation was supplied.
  const primary = isRTL ? record.notesAr : record.notes;
  const fallback = isRTL ? record.notes : record.notesAr;
  return primary?.trim() || fallback?.trim() || (isRTL ? 'لا توجد ملاحظات' : 'No notes');
}

export function rentalStatusLabel(status: string, isRTL: boolean): string {
  const labels: Record<string, LabelPair> = {
    draft: ['بانتظار التسليم', 'Awaiting handoff'],
    active: ['نشط', 'Active'],
    returned: ['مُعاد', 'Returned'],
    cancelled: ['ملغي', 'Cancelled'],
  };
  return labels[status]?.[isRTL ? 0 : 1] || (isRTL ? 'حالة غير معروفة' : 'Unknown status');
}

export function inspectionErrorMessage(message: string, isRTL: boolean): string {
  const bilingual = message.split(' / ');
  if (bilingual.length > 1) return isRTL ? bilingual.slice(1).join(' / ') : bilingual[0];
  if (!isRTL || /[\u0600-\u06ff]/.test(message)) return message;
  const errors: Record<string, string> = {
    'Invalid inspection date': 'تاريخ الفحص غير صالح.',
    'Vehicle not found': 'لم يتم العثور على المركبة.',
    'Image read failed': 'تعذرت قراءة الصورة.',
    'Invalid image': 'الصورة غير صالحة.',
  };
  return errors[message] || 'تعذر إتمام العملية. تحقق من البيانات وحاول مرة أخرى.';
}
