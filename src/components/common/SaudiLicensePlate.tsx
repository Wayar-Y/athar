import React from 'react';

// Saudi License Plate Letter Map (English to Arabic)
const EN_TO_AR_LETTER_MAP: Record<string, string> = {
  A: 'أ',
  B: 'ب',
  D: 'د',
  G: 'ق',
  H: 'ح',
  J: 'ح', // or 'ج'
  K: 'ك',
  L: 'ل',
  M: 'م',
  N: 'ن',
  R: 'ر',
  S: 'س',
  T: 'ط',
  U: 'و',
  V: 'ى',
  X: 'ص',
  Y: 'ي',
  Z: 'ع',
  E: 'ع',
};

// Western Digits to Eastern Arabic Digits
const EN_TO_AR_DIGIT_MAP: Record<string, string> = {
  '0': '٠',
  '1': '١',
  '2': '٢',
  '3': '٣',
  '4': '٤',
  '5': '٥',
  '6': '٦',
  '7': '٧',
  '8': '٨',
  '9': '٩',
};

export interface SaudiLicensePlateProps {
  plateNumber?: string;
  plateNumberAr?: string;
  letters?: string;
  numbers?: string;
  lettersAr?: string;
  numbersAr?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  className?: string;
  fontSize?: string | number;
}

/**
 * Parses any incoming license plate string into discrete Letters and Numbers
 * Examples supported: "ADN-1596", "AMR 7667", "HHK-1234", "1596 ADN", "أ د ن ١٥٩٦"
 */
function parsePlate(
  plateNumber?: string,
  plateNumberAr?: string,
  customLetters?: string,
  customNumbers?: string,
  customLettersAr?: string,
  customNumbersAr?: string
) {
  let enLetters = customLetters || '';
  let enNumbers = customNumbers || '';
  let arLetters = customLettersAr || '';
  let arNumbers = customNumbersAr || '';

  if (!enLetters || !enNumbers) {
    const raw = (plateNumber || '').trim();
    const lettersOnly = raw.replace(/[^A-Za-z]/g, '').toUpperCase();
    const digitsOnly = raw.replace(/\D/g, '');
    if (lettersOnly) enLetters = lettersOnly;
    if (digitsOnly) enNumbers = digitsOnly;
  }

  // If we have Arabic plate string, extract Arabic letters and Arabic/Hindi numbers
  if (!arLetters || !arNumbers) {
    if (plateNumberAr) {
      const rawAr = plateNumberAr.trim();
      const arLettersOnly = rawAr.replace(/[^\u0621-\u064A\u0671-\u06D3]/g, '');
      const arDigitsOnly = rawAr.replace(/[^\u0660-\u06690-9]/g, '');
      if (arLettersOnly) arLetters = arLettersOnly;
      if (arDigitsOnly) arNumbers = arDigitsOnly;
    }
  }

  // Fallback conversion from English if Arabic is missing
  if (!arLetters && enLetters) {
    arLetters = enLetters
      .split('')
      .map((ch) => EN_TO_AR_LETTER_MAP[ch] || ch)
      .join('');
  }

  if (!arNumbers && enNumbers) {
    arNumbers = enNumbers
      .split('')
      .map((d) => EN_TO_AR_DIGIT_MAP[d] || d)
      .join('');
  }

  // Ensure any western digits in arNumbers are converted to Eastern Arabic digits (٠-٩)
  if (arNumbers) {
    arNumbers = arNumbers
      .split('')
      .map((d) => EN_TO_AR_DIGIT_MAP[d] || d)
      .join('');
  }

  // Clean and format with evenly spaced glyphs for maximum legibility
  const formattedEnLetters = enLetters.split('').join(' ');
  const formattedEnNumbers = enNumbers.split('').join(' ');
  const formattedArLetters = arLetters.split('').join(' ');
  const formattedArNumbers = arNumbers.split('').join(' ');

  return {
    enLetters: formattedEnLetters || 'A D N',
    enNumbers: formattedEnNumbers || '1 5 9 6',
    arLetters: formattedArLetters || 'أ د ن',
    arNumbers: formattedArNumbers || '١ ٥ ٩ ٦',
  };
}

export const SaudiLicensePlate: React.FC<SaudiLicensePlateProps> = ({
  plateNumber,
  plateNumberAr,
  letters,
  numbers,
  lettersAr,
  numbersAr,
  size = 'md',
  showLabel = false,
  className = '',
  fontSize,
}) => {
  const parsed = parsePlate(
    plateNumber,
    plateNumberAr,
    letters,
    numbers,
    lettersAr,
    numbersAr
  );

  // Scalable font-size configs in rem (dynamically scales with root font-size setting & browser zoom)
  const sizeConfig: Record<
    string,
    {
      fontSize: string;
      labelSize: string;
    }
  > = {
    xs: {
      fontSize: '0.75rem',
      labelSize: 'text-[10px] mb-0.5',
    },
    sm: {
      fontSize: '0.85rem',
      labelSize: 'text-[11px] mb-1',
    },
    md: {
      fontSize: '0.95rem',
      labelSize: 'text-xs mb-1.5',
    },
    lg: {
      fontSize: '1.15rem',
      labelSize: 'text-xs mb-1.5',
    },
    xl: {
      fontSize: '1.35rem',
      labelSize: 'text-sm mb-2',
    },
  };

  const current = sizeConfig[size] || sizeConfig.md;
  const activeFontSize = fontSize ?? current.fontSize;

  return (
    <div
      className={`inline-flex flex-col items-center justify-center select-none shrink-0 ${className}`}
      style={{ fontSize: activeFontSize }}
    >
      {/* Optional "رقم اللوحة" header label matching user image */}
      {showLabel && (
        <span
          className={`font-bold text-[#1A1A1A] dark:text-white flex items-center gap-1.5 whitespace-nowrap ${current.labelSize}`}
          dir="rtl"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block shrink-0" />
          رقم اللوحة
        </span>
      )}

      {/* Saudi License Plate Box (Reflective white plate with black ink and fully visible quadrants that never clip) */}
      <div
        className="relative bg-white text-neutral-950 shadow-xs border-[1.5px] border-neutral-700/80 dark:border-neutral-300 rounded-[0.4em] overflow-hidden inline-flex shrink-0 w-fit transition-transform"
        dir="ltr"
      >
        {/* Left Column: Letters (Arabic on top, English on bottom) */}
        <div className="flex flex-col border-e border-neutral-400/80 min-w-[3.6em] shrink-0">
          {/* Top-Left: Arabic Letters (e.g., أ د ن) */}
          <div className="flex items-center justify-center border-b border-neutral-400/80 px-[0.55em] py-[0.18em] bg-neutral-50/70 whitespace-nowrap overflow-visible">
            <span
              className="font-bold text-[1.05em] leading-none text-neutral-950 whitespace-nowrap"
              dir="rtl"
            >
              {parsed.arLetters}
            </span>
          </div>

          {/* Bottom-Left: English Letters (e.g., A D N) */}
          <div className="flex items-center justify-center px-[0.55em] py-[0.18em] bg-white whitespace-nowrap overflow-visible">
            <span className="font-bold font-mono text-[0.95em] leading-none text-neutral-900 whitespace-nowrap tracking-wide">
              {parsed.enLetters}
            </span>
          </div>
        </div>

        {/* Right Column: Numbers (Arabic-Indic on top, English on bottom) */}
        <div className="flex flex-col min-w-[4.8em] shrink-0">
          {/* Top-Right: Arabic-Indic Digits (e.g., ١ ٥ ٩ ٦) */}
          <div className="flex items-center justify-center border-b border-neutral-400/80 px-[0.65em] py-[0.18em] bg-neutral-50/70 whitespace-nowrap overflow-visible">
            <span
              className="font-bold text-[1.05em] leading-none text-neutral-950 whitespace-nowrap font-sans"
              dir="rtl"
            >
              {parsed.arNumbers}
            </span>
          </div>

          {/* Bottom-Right: English Digits (e.g., 1 5 9 6) */}
          <div className="flex items-center justify-center px-[0.65em] py-[0.18em] bg-white whitespace-nowrap overflow-visible">
            <span className="font-bold font-mono text-[0.95em] leading-none text-neutral-900 whitespace-nowrap tracking-wide">
              {parsed.enNumbers}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
