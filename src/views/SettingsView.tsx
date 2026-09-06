import React, { useState } from 'react';
import { 
  Settings, 
  Sun, 
  Moon, 
  Eye, 
  Check, 
  Activity,
  Maximize2,
  Minimize2,
  SlidersHorizontal,
  Info,
  ShieldCheck,
  Cpu,
  Car,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsView: React.FC = () => {
  const {
    language,
    setLanguage,
    isRTL,
    t,
    theme,
    setTheme,
    textSize,
    setTextSize,
    displayDensity,
    setDisplayDensity,
    fleetSensitivity,
    setFleetSensitivity,
    reducedMotion,
    setReducedMotion,
    highContrast,
    setHighContrast,
  } = useApp();

  const [companyName, setCompanyName] = useState('Al-Safwa Car Rental Co.');
  const [companyNameAr, setCompanyNameAr] = useState('شركة الصفوة لتأجير السيارات');
  const [adaptiveLearning, setAdaptiveLearning] = useState(true);
  const [emergencyThermalShutdown, setEmergencyThermalShutdown] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 text-start max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-white">
          {t.settingsTitle}
        </h1>
        <p className="text-xs sm:text-sm text-[#71716A] dark:text-[#8E8E86] mt-0.5">
          {t.settingsSubtitle}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Accessibility & Display Preferences */}
        <div className="bento-card p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
            <Eye className="w-5 h-5 text-[#1A1A1A] dark:text-white" />
            <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white">
              {isRTL ? 'إمكانية الوصول وتفضيلات العرض والخط' : 'Accessibility & Display Preferences'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Language */}
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] dark:text-white mb-2">
                {t.language}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`p-2.5 rounded-lg text-xs font-semibold border text-center transition-all ${
                    language === 'en'
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] dark:bg-white dark:text-[#1A1A1A] dark:border-white'
                      : 'bg-[#F5F5F0] dark:bg-[#242420] border-[#E5E5E1] dark:border-[#2C2C27] text-[#71716A] dark:text-[#8E8E86] hover:text-[#1A1A1A] dark:hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('ar')}
                  className={`p-2.5 rounded-lg text-xs font-semibold border text-center transition-all ${
                    language === 'ar'
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] dark:bg-white dark:text-[#1A1A1A] dark:border-white'
                      : 'bg-[#F5F5F0] dark:bg-[#242420] border-[#E5E5E1] dark:border-[#2C2C27] text-[#71716A] dark:text-[#8E8E86] hover:text-[#1A1A1A] dark:hover:text-white'
                  }`}
                >
                  العربية
                </button>
              </div>
            </div>

            {/* Theme */}
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] dark:text-white mb-2">
                {t.theme}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-semibold border transition-all ${
                    theme === 'light'
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-[#F5F5F0] dark:bg-[#242420] border-[#E5E5E1] dark:border-[#2C2C27] text-[#71716A] dark:text-[#8E8E86] hover:text-[#1A1A1A]'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  <span>{t.lightMode}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-semibold border transition-all ${
                    theme === 'dark'
                      ? 'bg-white text-[#1A1A1A] border-white'
                      : 'bg-[#F5F5F0] dark:bg-[#242420] border-[#E5E5E1] dark:border-[#2C2C27] text-[#71716A] dark:text-[#8E8E86] hover:text-white'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span>{t.darkMode}</span>
                </button>
              </div>
            </div>

            {/* Text Size Scaling */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#1A1A1A] dark:text-white">
                  {isRTL ? 'حجم الخط في كامل المنصة' : 'Platform Typography Scaling'}
                </label>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#F5F5F0] dark:bg-[#242420] text-[#1A1A1A] dark:text-white border border-[#E5E5E1] dark:border-[#2C2C27]">
                  {textSize === 'small' 
                    ? (isRTL ? '١٤ بكسل (مدمج)' : '14px (Compact)') 
                    : textSize === 'medium' 
                      ? (isRTL ? '١٦ بكسل (قياسي)' : '16px (Default)') 
                      : (isRTL ? '١٨ بكسل (مكبر)' : '18px (Spacious)')}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2.5 text-start">
                {([
                  { 
                    id: 'small', 
                    letterSize: 'text-sm font-normal',
                    titleAr: 'مدمج (صغير)', 
                    titleEn: 'Small', 
                    descAr: '١٤ بكسل — شاشات الجوال والميدان', 
                    descEn: '14px — Dense data view' 
                  },
                  { 
                    id: 'medium', 
                    letterSize: 'text-base font-semibold',
                    titleAr: 'قياسي (متوسط)', 
                    titleEn: 'Medium', 
                    descAr: '١٦ بكسل — توازن مثالي معتمد', 
                    descEn: '16px — Standard balance' 
                  },
                  { 
                    id: 'large', 
                    letterSize: 'text-xl font-bold',
                    titleAr: 'كبير (واضح)', 
                    titleEn: 'Large', 
                    descAr: '١٨ بكسل — قراءة سريعة ومريحة', 
                    descEn: '18px — High legibility' 
                  },
                ] as const).map((item) => {
                  const isActive = textSize === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTextSize(item.id)}
                      className={`p-3 rounded-xl border text-start flex flex-col justify-between transition-all ${
                        isActive
                          ? 'bg-white dark:bg-[#1B1B18] border-[#1A1A1A] dark:border-white shadow-xs ring-1 ring-[#1A1A1A] dark:ring-white'
                          : 'bg-[#F9F9F7] dark:bg-[#242420] border-[#E5E5E1] dark:border-[#2C2C27] text-[#71716A] dark:text-[#8E8E86] hover:border-[#71716A]'
                      }`}
                    >
                      <div className="flex items-start justify-between w-full mb-1">
                        <span className={`inline-block font-serif ${item.letterSize} ${isActive ? 'text-[#1A1A1A] dark:text-white' : 'text-[#71716A]'}`}>
                          Aa
                        </span>
                        {isActive && (
                          <span className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <span className={`text-xs font-bold block ${isActive ? 'text-[#1A1A1A] dark:text-white' : 'text-[#71716A] dark:text-[#8E8E86]'}`}>
                        {isRTL ? item.titleAr : item.titleEn}
                      </span>
                      <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block mt-0.5 leading-tight">
                        {isRTL ? item.descAr : item.descEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display Layout Density */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#1A1A1A] dark:text-white">
                  {isRTL ? 'كثافة مساحات العرض والهوامش' : 'Layout Density & Padding'}
                </label>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#F5F5F0] dark:bg-[#242420] text-[#1A1A1A] dark:text-white border border-[#E5E5E1] dark:border-[#2C2C27]">
                  {displayDensity === 'compact' 
                    ? (isRTL ? 'مضغوط (مكثف)' : 'Compact Density')
                    : (isRTL ? 'مريح (قياسي)' : 'Comfortable Density')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <button
                  type="button"
                  onClick={() => setDisplayDensity('comfortable')}
                  className={`p-3 rounded-xl border text-start flex flex-col justify-between transition-all ${
                    displayDensity === 'comfortable'
                      ? 'bg-white dark:bg-[#1B1B18] border-[#1A1A1A] dark:border-white shadow-xs ring-1 ring-[#1A1A1A] dark:ring-white'
                      : 'bg-[#F9F9F7] dark:bg-[#242420] border-[#E5E5E1] dark:border-[#2C2C27] text-[#71716A] dark:text-[#8E8E86] hover:border-[#71716A]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <div className="p-1 rounded bg-[#F5F5F0] dark:bg-[#20201D] text-[#1A1A1A] dark:text-white">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                    {displayDensity === 'comfortable' && (
                      <span className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <span className={`font-bold text-xs block ${displayDensity === 'comfortable' ? 'text-[#1A1A1A] dark:text-white' : 'text-[#71716A] dark:text-[#8E8E86]'}`}>
                    {isRTL ? 'مريح (هوامش قياسية واسعة)' : 'Comfortable (Spacious)'}
                  </span>
                  <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block mt-0.5 leading-tight">
                    {isRTL ? 'مسافات رحبة وقراءة سهلة للبطاقات' : 'Generous card padding & breathing room'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setDisplayDensity('compact')}
                  className={`p-3 rounded-xl border text-start flex flex-col justify-between transition-all ${
                    displayDensity === 'compact'
                      ? 'bg-white dark:bg-[#1B1B18] border-[#1A1A1A] dark:border-white shadow-xs ring-1 ring-[#1A1A1A] dark:ring-white'
                      : 'bg-[#F9F9F7] dark:bg-[#242420] border-[#E5E5E1] dark:border-[#2C2C27] text-[#71716A] dark:text-[#8E8E86] hover:border-[#71716A]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <div className="p-1 rounded bg-[#F5F5F0] dark:bg-[#20201D] text-[#1A1A1A] dark:text-white">
                      <Minimize2 className="w-3.5 h-3.5" />
                    </div>
                    {displayDensity === 'compact' && (
                      <span className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <span className={`font-bold text-xs block ${displayDensity === 'compact' ? 'text-[#1A1A1A] dark:text-white' : 'text-[#71716A] dark:text-[#8E8E86]'}`}>
                    {isRTL ? 'مضغوط (بيانات مكثفة بالجدول)' : 'Compact (Dense Data)'}
                  </span>
                  <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block mt-0.5 leading-tight">
                    {isRTL ? 'تقليص الحواشي لعرض أقصى عدد صفوف' : 'Minimal padding to view more fleet rows'}
                  </span>
                </button>
              </div>
            </div>

            {/* Toggles: High contrast & Reduced motion */}
            <div className="sm:col-span-2 pt-2 border-t border-[#E5E5E1] dark:border-[#2C2C27] grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center justify-between p-3 rounded-lg bg-[#F5F5F0]/60 dark:bg-[#242420]/60 border border-[#E5E5E1] dark:border-[#2C2C27] cursor-pointer">
                <div>
                  <span className="block text-xs font-semibold text-[#1A1A1A] dark:text-white">
                    {isRTL ? 'وضع التباين العالي' : 'High Contrast Mode'}
                  </span>
                  <span className="text-[11px] text-[#71716A] dark:text-[#8E8E86]">
                    {isRTL ? 'حدود عريضة وتباين حاد لتحسين الرؤية في الميدان' : 'Sharpen borders and outlines for outdoor sunlight viewing'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1A1A1A] dark:text-white focus:ring-1 focus:ring-[#1A1A1A]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-[#F5F5F0]/60 dark:bg-[#242420]/60 border border-[#E5E5E1] dark:border-[#2C2C27] cursor-pointer">
                <div>
                  <span className="block text-xs font-semibold text-[#1A1A1A] dark:text-white">
                    {isRTL ? 'تقليل الحركة والانتقالات' : 'Reduced Motion'}
                  </span>
                  <span className="text-[11px] text-[#71716A] dark:text-[#8E8E86]">
                    {isRTL ? 'تعطيل الحركات لتجربة استخدام فائقة السرعة' : 'Disable transition animations for instant response'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={(e) => setReducedMotion(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1A1A1A] dark:text-white focus:ring-1 focus:ring-[#1A1A1A]"
                />
              </label>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="pt-4 border-t border-[#E5E5E1] dark:border-[#2C2C27]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#71716A] dark:text-[#8E8E86] uppercase tracking-wider">
                {isRTL ? 'معاينة فورية لتأثير الخط والمساحات' : 'Live Interactive Typography & Layout Preview'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] font-bold">
                {isRTL ? 'مطبق حالياً' : 'Active'}
              </span>
            </div>
            
            <div className="p-4 rounded-xl border border-[#E5E5E1] dark:border-[#2C2C27] bg-[#F9F9F7] dark:bg-[#141412] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-white dark:bg-[#1B1B18] border border-[#E5E5E1] dark:border-[#2C2C27]">
                  <Car className="w-5 h-5 text-[#1A1A1A] dark:text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1A1A1A] dark:text-white">
                      {isRTL ? 'تويوتا كامري ٢٠٢٤' : 'Toyota Camry 2024'}
                    </span>
                    <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-[#10B981]/15 text-[#10B981]">
                      {isRTL ? 'جاهزة للتأجير' : 'Available'}
                    </span>
                  </div>
                  <p className="text-[#71716A] dark:text-[#8E8E86] text-xs mt-0.5">
                    {isRTL ? 'لوحة: أ ب ج ١٢٣٤ • فرع المطار • حرارة المحرك: ٩١°م' : 'Plate: 1234 ABC • Airport Branch • Coolant: 91°C'}
                  </p>
                </div>
              </div>
              <div className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-white dark:bg-[#1B1B18] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white">
                12.6V • 98% Health
              </div>
            </div>
          </div>
        </div>

        <div className="bento-card p-6 leading-7"><h2 className="font-bold mb-3">{isRTL ? 'حدود النموذج الأولي' : 'Prototype capabilities'}</h2><p>{isRTL ? 'تُحفظ تفضيلات العرض تلقائياً على هذا الجهاز. البيانات الفنية والتنبؤات الحالية أمثلة تجريبية؛ لم تُربط معايرة المصنّع أو نماذج التعلم الآلي أو التحكم عن بعد بالمركبة.' : 'Display preferences save automatically on this device. Current diagnostic data and predictions are examples; manufacturer calibration, machine learning models and remote vehicle control are not connected.'}</p></div>
      </form>
    </div>
  );
};
