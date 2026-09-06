import React from 'react';
import { ArrowLeft, ArrowRight, Car, ClipboardCheck, FileText, Activity, Wrench, MapPin, Moon, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AtharLogo } from '../components/common/AtharLogo';

export const LandingPageView: React.FC = () => {
  const {isRTL,language,setLanguage,theme,setTheme,setViewMode,setActiveSection}=useApp();
  const tr=(ar:string,en:string)=>isRTL?ar:en;
  const Arrow=isRTL?ArrowLeft:ArrowRight;
  const enter=()=>{setActiveSection('operations');setViewMode('app');};
  const features=[
    {icon:FileText,title:tr('العقود والمركبات','Contracts and vehicles'),body:tr('أنشئ عقداً مرتبطاً بالمركبة والمستأجر، وحدد فترة التأجير وتابع التسليم والإرجاع.','Create a contract linked to a vehicle and renter, record the rental period, and follow handoff and return.')},
    {icon:ClipboardCheck,title:tr('فحص التسليم والإرجاع','Handoff and return inspections'),body:tr('سجّل حالة الهيكل والمقصورة والإطارات والأنوار، مع قراءة العداد والوقود والصور والملاحظات.','Record bodywork, interior, tires and lights, together with odometer and fuel readings, photos and notes.')},
    {icon:Activity,title:tr('سجل لكل فترة تأجير','A record for each rental'),body:tr('اجمع الفحوصات والملاحظات الفنية في سجل مؤرخ مرتبط بالعقد، ثم راجع ما تغيّر عند الإرجاع.','Keep inspections and mechanical observations in a dated contract record, then review what changed at return.')},
    {icon:Wrench,title:tr('متابعة الصيانة','Maintenance follow-up'),body:tr('راجع الأعطال المسجلة، وأنشئ أوامر الصيانة وتابع تقدمها داخل المنصة.','Review recorded faults, create maintenance work orders and track their progress in the platform.')},
    {icon:MapPin,title:tr('الموقع والبيانات الفنية','Location and diagnostic data'),body:tr('استعرض سجل المواقع المستورد وأمثلة البيانات التشخيصية. الاتصال المباشر بأجهزة المركبات ضمن مرحلة التكامل.','Review imported location history and sample diagnostic data. Direct vehicle-device connectivity is part of the integration phase.')},
    {icon:Car,title:tr('تقارير الإرجاع','Return reports'),body:tr('قارن فحصَي العقد نفسه، واعرض تغيرات الحالة والعداد والوقود والأعطال للمراجعة قبل إتاحة المركبة.','Compare inspections from the same contract and review changes in condition, mileage, fuel and faults before releasing the vehicle.')},
  ];
  return <div className="min-h-screen bg-[#F9F9F7] dark:bg-[#141412] text-[#1A1A1A] dark:text-white text-start">
    <nav aria-label={tr('التنقل الرئيسي','Main navigation')} className="sticky top-0 z-40 bg-white/95 dark:bg-[#181816]/95 backdrop-blur border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <AtharLogo variant="full" size="sm" className="h-10" />
        <div className="flex flex-wrap gap-4 text-sm items-center">
          <a href="#about">{tr('من نحن','About us')}</a><a href="#features">{tr('ما يقدمه أثر','What Athar offers')}</a><a href="#how-it-works">{tr('رحلة التأجير','Rental workflow')}</a>
          <button onClick={()=>setLanguage(language==='ar'?'en':'ar')} className="border rounded-lg px-3 py-2" aria-label={tr('التبديل إلى الإنجليزية','Switch to Arabic')}>{tr('English','العربية')}</button>
          <button onClick={()=>setTheme(theme==='dark'?'light':'dark')} aria-label={tr('تغيير المظهر','Change theme')} className="p-2 border rounded-lg">{theme==='dark'?<Sun size={20}/>:<Moon size={20}/>}</button>
          <button onClick={enter} className="athar-primary">{tr('تجربة المنصة','Explore the prototype')}</button>
        </div>
      </div>
    </nav>
    <main>
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-[#197C8C] dark:text-[#A7E6F6] font-semibold mb-5">{tr('أثر | إدارة التأجير وسجل المركبة','ATHAR | Rental management and vehicle history')}</p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-[1.3]">{tr('كل عقد تأجير، مرتبط بسجل مركبته.','Every rental, connected to its vehicle’s history.')}</h1>
          <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-300">{tr('نطوّر أثر لمساعدة مكاتب تأجير السيارات على جمع العقود والفحوصات والصيانة في مكان واحد، ومتابعة حالة المركبة من التسليم حتى الإرجاع.','We are developing Athar to help car rental offices bring contracts, inspections and maintenance together, and follow vehicle condition from handoff to return.')}</p>
          <button onClick={enter} className="athar-primary mt-8 inline-flex gap-3 items-center">{tr('استعرض رحلة التأجير','Explore the rental workflow')}<Arrow size={19}/></button>
          <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">{tr('نموذج أولي ببيانات تجريبية. لا توجد مركبات متصلة مباشرة في هذه النسخة.','Prototype with sample data. This version has no live vehicle connection.')}</p>
        </div>
        <div className="rounded-3xl bg-[#172B30] p-6 sm:p-10 text-white shadow-xl">
          <p className="text-[#A7E6F6] text-sm mb-6">{tr('رحلة المركبة في أثر','The vehicle’s journey in Athar')}</p>
          {[
            [tr('قبل التسليم','Before handoff'),tr('عقد واضح وفحص يوثّق الحالة','A rental contract and a recorded condition baseline')],
            [tr('أثناء التأجير','During the rental'),tr('أحداث وملاحظات مرتبطة بالعقد والوقت','Dated events and observations linked to the contract')],
            [tr('عند الإرجاع','At return'),tr('فحص مقابل ومراجعة التغيّرات','A return inspection and a review of changes')]
          ].map(([title,body],i)=><div key={title} className="flex gap-4 py-6 border-t border-white/15"><span className="text-[#A7E6F6] font-mono">0{i+1}</span><div><h2 className="text-xl font-semibold">{title}</h2><p className="mt-2 text-neutral-300 leading-7">{body}</p></div></div>)}
          <p className="text-sm text-neutral-400 mt-5">{tr('السجل يساعد في مراجعة الوقائع؛ ظهور عطل أثناء العقد لا يثبت مسؤولية المستأجر وحده.','The record supports review; a fault appearing during a rental does not by itself establish renter responsibility.')}</p>
        </div>
      </section>
      <section id="about" className="border-y border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1B1B18] scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 grid md:grid-cols-2 gap-10">
          <div><p className="text-[#197C8C] dark:text-[#A7E6F6] font-semibold mb-3">{tr('من نحن','About us')}</p><h2 className="text-3xl font-bold leading-relaxed">{tr('فريق أثر. نبدأ من عمل مكاتب التأجير اليومي.','The Athar team. Starting with the everyday work of rental offices.')}</h2></div>
          <div className="space-y-5 leading-8 text-neutral-600 dark:text-neutral-300"><p>{tr('نحن فريق مشروع أثر، ونعمل على تطوير منصة لإدارة عمليات تأجير المركبات. بدأنا بفهم سير العمل والتحديات من خلال التواصل مع مكاتب التأجير، وتحليل السوق والحلول المتاحة، ثم تطوير النموذج الأولي.','We are the team behind Athar, a project to develop a vehicle rental operations platform. Our work began with conversations with rental offices about their workflows and challenges, market and competitor analysis, and development of the prototype.')}</p><p>{tr('نركّز على المكاتب الصغيرة والمتوسطة التي تعتمد على العمليات اليدوية أو أنظمة متفرقة. هدفنا أن تكون بيانات العقد وحالة المركبة وسجل الصيانة متاحة معاً، ليسهل على موظف الفرع متابعة كل عملية.','Our focus is small and medium rental offices using manual processes or separate systems. We want contract details, vehicle condition and maintenance history to be available together so branch staff can follow each rental.')}</p></div>
        </div>
      </section>
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-8 py-16 scroll-mt-28"><h2 className="text-3xl font-bold mb-8">{tr('ما يقدمه أثر','What Athar brings together')}</h2><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">{features.map(f=><article key={f.title} className="bento-card p-6"><f.icon className="text-[#197C8C] dark:text-[#A7E6F6] mb-5" size={26}/><h3 className="text-xl font-semibold mb-3">{f.title}</h3><p className="leading-7 text-neutral-600 dark:text-neutral-300">{f.body}</p></article>)}</div></section>
      <section id="how-it-works" className="bg-[#123A43] text-white scroll-mt-28"><div className="max-w-7xl mx-auto px-4 sm:px-8 py-16"><h2 className="text-3xl font-bold mb-9">{tr('من فتح العقد إلى إغلاقه','From opening a contract to completing a return')}</h2><div className="grid md:grid-cols-3 gap-8">{[
        [tr('١. جهّز العقد','1. Prepare the contract'),tr('اختر المركبة المتاحة وأدخل بيانات المستأجر والفترة والسعر، ثم أكمل فحص التسليم لبدء التأجير.','Choose an available vehicle, enter the renter, dates and rate, then complete the handoff inspection to start the rental.')],
        [tr('٢. تابع السجل','2. Follow the record'),tr('راجع حالة المركبة وسجّل الملاحظات الفنية على العقد. في النموذج الأولي تُدخل البيانات يدوياً أو تُستورد من ملف.','Review vehicle condition and record mechanical observations against the contract. Prototype data is entered manually or imported from a file.')],
        [tr('٣. افحص وراجع','3. Inspect and review'),tr('أدخل قراءات الإرجاع وقارنها بالتسليم. راجع الفروقات وحدد جاهزية المركبة أو حاجتها للصيانة.','Enter return readings and compare them with handoff. Review differences and decide whether the vehicle is ready or needs maintenance.')]
      ].map(([title,body])=><div key={title}><h3 className="text-xl font-semibold mb-3">{title}</h3><p className="leading-8 text-[#D7F1F5]">{body}</p></div>)}</div></div></section>
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16"><h2 className="text-3xl font-bold mb-5">{tr('مرحلتنا الحالية والخطوة القادمة','Where we are and what comes next')}</h2><p className="max-w-3xl leading-8 text-neutral-600 dark:text-neutral-300">{tr('أثر في مرحلة تطوير النموذج الأولي. خطتنا التالية هي تجربة المنصة على أسطول حقيقي مع شركاء من قطاع التأجير، واختبار الأجهزة والتكاملات، وقياس القيمة التشغيلية قبل التوسع التدريجي في السوق السعودي.','Athar is at the prototype development stage. Our next step is a pilot with rental-sector partners on a real fleet, testing devices and integrations and measuring operational value before expanding gradually in Saudi Arabia.')}</p>
      <div className="grid md:grid-cols-3 gap-5 mt-8">{[
        [tr('إدارة التأجير','Rental management'),tr('باقة أساسية مخططة للعقود والمركبات.','A planned basic package for contracts and vehicles.')],
        [tr('الفحص والتتبع','Inspections and tracking'),tr('باقة متقدمة مخططة تضيف الفحص والتتبع.','A planned advanced package adding inspections and tracking.')],
        [tr('الأجهزة والسجل الميكانيكي','Devices and mechanical history'),tr('إضافة اختيارية مخططة للأجهزة والتكاملات.','A planned optional add-on for devices and integrations.')]
      ].map(([title,body])=><div key={title} className="bento-card p-6"><h3 className="font-semibold text-lg mb-2">{title}</h3><p className="leading-7">{body}</p></div>)}</div><p className="mt-5 text-sm text-neutral-500 dark:text-neutral-400">{tr('نموذج الاشتراك المقترح يعتمد على عدد المركبات وحجم الأسطول. لم تُعتمد الأسعار، ولا توجد اشتراكات مدفوعة في هذا النموذج.','The proposed subscription model depends on vehicle count and fleet size. Prices are not finalized, and this prototype has no paid subscriptions.')}</p></section>
    </main>
    <footer className="border-t border-neutral-200 dark:border-neutral-800 px-4 sm:px-8 py-8"><div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4"><AtharLogo variant="full" size="sm" className="h-9"/><p className="text-sm">{tr('أثر — منصة إدارة التأجير وسجل المركبة | فريق أثر','Athar — Rental management and vehicle history | The Athar team')}</p><button onClick={enter} className="text-[#197C8C] dark:text-[#A7E6F6] font-semibold">{tr('استعرض النموذج الأولي','Explore the prototype')}</button></div></footer>
  </div>;
};
