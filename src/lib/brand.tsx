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

export default ArielMC;
