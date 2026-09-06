export function download(name:string, content:string, type='text/csv;charset=utf-8') {
  const url=URL.createObjectURL(new Blob([content],{type}));
  const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function csv(rows:unknown[][]) {
  return '\uFEFF'+rows.map(row=>row.map(value=>{
    let s=String(value??''); if (/^[=+\-@\t\r]/.test(s)) s="'"+s;
    return '"'+s.replaceAll('"','""')+'"';
  }).join(',')).join('\r\n');
}
export function printReport(title:string, rows:unknown[][], rtl:boolean) {
  const win=window.open('','_blank'); if (!win) throw new Error(rtl?'اسمح بالنوافذ المنبثقة للطباعة':'Allow pop-ups to open the print report.');
  const escape=(v:unknown)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
  win.document.write(`<!doctype html><html dir="${rtl?'rtl':'ltr'}" lang="${rtl?'ar':'en'}"><head><meta charset="utf-8"><title>${escape(title)}</title><style>body{font:16px system-ui;padding:24px}table{border-collapse:collapse;width:100%;font-size:13px}td,th{padding:8px;border:1px solid #bbb;text-align:start;overflow-wrap:anywhere}th{background:#eee}tr{break-inside:avoid}@media print{button{display:none}}</style></head><body><h1>${escape(title)}</h1><p>${rtl?'نموذج أولي — البيانات التجريبية لا تثبت مسؤولية المستأجر.':'Prototype — sample data does not establish renter responsibility.'}</p><p>${escape(new Date().toISOString())}</p><button id="print">${rtl?'طباعة / حفظ PDF':'Print / Save as PDF'}</button><table><thead><tr>${rows[0]?.map(v=>`<th>${escape(v)}</th>`).join('')}</tr></thead><tbody>${rows.slice(1).map(row=>`<tr>${row.map(v=>`<td>${escape(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></body></html>`);
  win.document.close();win.document.getElementById('print')!.onclick=()=>win.print();
}
