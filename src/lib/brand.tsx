import React from 'react';

/**
 * ============================================================================
 * BRAND MANDATORY RULE
 * ============================================================================
 * We can ONLY write ArielMC (Bold) in this way:
 *
 *   ✅ Mandatory: ArielMC (Bold: <strong>ArielMC</strong> or font-bold normal-case)
 *   ❌ Strictly Prohibited: Arielmc, ARIELMC, arielmc, Ariel MC & all other variants
 *
 * This utility provides:
 * 1. <ArielMC /> component: Drop-in JSX element strictly rendering "ArielMC" in bold.
 * 2. renderBrandText(text): Parses any text string and renders any mention of the brand
 *    as <strong className="font-bold normal-case" style={{ textTransform: 'none' }}>ArielMC</strong>,
 *    ensuring that parent CSS rules like `uppercase` do not alter the brand casing.
 * 3. sanitizeBrandString(str): String-level replacement ensuring exact "ArielMC" casing.
 * ============================================================================
 */

export interface ArielMCProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Canonical <ArielMC /> component.
 * Guaranteed bold, normal-case (defeats parent CSS `uppercase`), and correct casing.
 */
export const ArielMC: React.FC<ArielMCProps> = ({ className = '', style }) => (
  <strong
    className={`font-bold normal-case tracking-normal ${className}`}
    style={{ textTransform: 'none', ...style }}
  >
    ArielMC
  </strong>
);

/**
 * Formats any string into React nodes, converting any case or spacing variation of
 * "ArielMC", "ARIELMC", "Arielmc", "arielmc", "Ariel MC" into the mandatory bold ArielMC.
 */
export const renderBrandText = (text: string | null | undefined): React.ReactNode => {
  if (!text) return null;
  const regex = /(ariel\s*mc|arielmc)/gi;
  const parts = text.split(regex);
  if (parts.length === 1) {
    return text;
  }
  return parts.map((part, index) => {
    if (regex.test(part)) {
      return (
        <strong
          key={index}
          className="font-bold normal-case tracking-normal inline-block"
          style={{ textTransform: 'none' }}
        >
          ArielMC
        </strong>
      );
    }
    return part;
  });
};

/**
 * Sanitizes plain string text to enforce the exact "ArielMC" capitalization.
 */
export const sanitizeBrandString = (str: string): string => {
  if (!str) return '';
  return str.replace(/ariel\s*mc|arielmc/gi, 'ArielMC');
};

/**
 * ============================================================================
 * OFFICIAL SYSTEM BRAND & COPYRIGHT MARK
 * ============================================================================
 * Canonical institutional brand lockup:
 * Line 1: ArielMC™ Enterprise Resource Planning System
 * Line 2: © Ariel Marketing & Communications Limited | All Right Reserve
 */
export interface ArielMcErpSystemBrandProps {
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
  showCopyright?: boolean;
  align?: 'left' | 'center' | 'right';
  size?: 'xs' | 'sm' | 'base' | 'lg';
}

export const ArielMcErpSystemBrand: React.FC<ArielMcErpSystemBrandProps> = ({
  className = '',
  theme = 'light',
  showCopyright = true,
  align = 'center',
  size = 'sm',
}) => {
  const isDark = theme === 'dark';

  const alignClass =
    align === 'left'
      ? 'text-left items-start'
      : align === 'right'
      ? 'text-right items-end'
      : 'text-center items-center';

  const titleSizeClass =
    size === 'xs'
      ? 'text-[11px]'
      : size === 'sm'
      ? 'text-xs sm:text-sm'
      : size === 'base'
      ? 'text-sm sm:text-base'
      : 'text-base sm:text-lg';

  const subSizeClass =
    size === 'xs'
      ? 'text-[9px]'
      : size === 'sm'
      ? 'text-[10px] sm:text-[11px]'
      : size === 'base'
      ? 'text-[11px] sm:text-xs'
      : 'text-xs sm:text-sm';

  return (
    <div className={`flex flex-col ${alignClass} ${className} select-none leading-normal`}>
      <div className={`font-heading font-bold ${titleSizeClass} tracking-tight flex items-baseline gap-1`}>
        <span className={isDark ? 'text-[#93C5FD] font-black' : 'text-[#003177] font-black'}>
          ArielMC
        </span>
        <sup className={`text-[0.65em] font-bold ${isDark ? 'text-[#93C5FD]' : 'text-[#003177]'} -top-0.5`}>
          ™
        </sup>
        <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Enterprise Resource Planning System
        </span>
      </div>
      {showCopyright && (
        <div
          className={`font-medium ${subSizeClass} ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          } mt-0.5 flex flex-wrap items-center gap-1`}
        >
          <span>©</span>
          <span className={isDark ? 'text-slate-300 font-semibold' : 'text-[#003177] font-semibold'}>
            Ariel Marketing & Communications Limited
          </span>
          <span className="opacity-60">|</span>
          <span>All Right Reserve</span>
        </div>
      )}
    </div>
  );
};

export default ArielMC;
