import React from 'react';
import { useApp } from '../../context/AppContext';

interface AtharLogoProps {
  variant?: 'full' | 'mark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  themeOverride?: 'light' | 'dark';
  useOriginalBackground?: boolean;
}

/**
 * Athar Official Brand Logo Component
 * Renders the authentic logo image provided by the user.
 * Available assets in /public:
 * - /athar-logo-original.png (with dark background matching uploaded image)
 * - /athar-logo-dark.png (crisp white typography, neon icons, transparent background)
 * - /athar-logo-light.png (obsidian typography, vibrant icons, transparent background)
 * - /athar-mark-dark.png (mark-only variant for dark surfaces)
 * - /athar-mark-light.png (mark-only variant for light surfaces)
 */
export const AtharLogo: React.FC<AtharLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  themeOverride,
  useOriginalBackground = false,
}) => {
  const { theme } = useApp();

  // Determine effective theme
  const effectiveTheme = themeOverride || (theme === 'dark' ? 'dark' : 'light');
  const isDark = effectiveTheme === 'dark';

  // Standard sizes for responsive headers, sidebars, and landing pages
  const sizeStyles = {
    xs: { height: 28 },
    sm: { height: 38 },
    md: { height: 48 },
    lg: { height: 64 },
    xl: { height: 88 },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  // Resolve the appropriate image source
  let imageSrc = '/athar-logo.png';

  if (useOriginalBackground) {
    imageSrc = '/athar-logo-original.png';
  } else if (variant === 'mark') {
    imageSrc = isDark ? '/athar-mark-dark.png' : '/athar-mark-light.png';
  } else {
    imageSrc = isDark ? '/athar-logo-dark.png' : '/athar-logo-light.png';
  }

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ height: currentSize.height }}
      title="Athar | أثر"
    >
      <img
        src={import.meta.env.BASE_URL + imageSrc.slice(1)}
        alt="Athar Telematics Logo | شعار أثر"
        className="h-full w-auto max-w-full object-contain pointer-events-none"
        style={{ height: currentSize.height }}
        draggable={false}
      />
    </div>
  );
};
