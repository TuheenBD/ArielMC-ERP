import { VoucherCurrency } from '@/types/voucher';

/**
 * Converts numbers into official financial text (Amount in Words).
 * Supports both Bangladeshi Taka format (Lakh, Crore) and International Currency format (USD, GBP, EUR, AUD).
 */

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertLessThanOneThousand(n: number): string {
  if (n === 0) return '';
  if (n < 20) return ONES[n];
  if (n < 100) {
    const ten = Math.floor(n / 10);
    const rest = n % 10;
    return `${TENS[ten]}${rest ? `-${ONES[rest]}` : ''}`;
  }
  const hundred = Math.floor(n / 100);
  const rest = n % 100;
  return `${ONES[hundred]} Hundred${rest ? ` and ${convertLessThanOneThousand(rest)}` : ''}`;
}

/**
 * Converts an integer into Bangladeshi numbering format:
 * Crore (10,000,000), Lakh (100,000), Thousand (1,000), Hundred (100)
 */
function convertBdtNumber(num: number): string {
  if (num === 0) return 'Zero';

  let result = '';
  const crore = Math.floor(num / 10000000);
  let rem = num % 10000000;

  if (crore > 0) {
    result += `${convertBdtNumber(crore)} Crore `;
  }

  const lakh = Math.floor(rem / 100000);
  rem = rem % 100000;

  if (lakh > 0) {
    result += `${convertLessThanOneThousand(lakh)} Lakh `;
  }

  const thousand = Math.floor(rem / 1000);
  rem = rem % 1000;

  if (thousand > 0) {
    result += `${convertLessThanOneThousand(thousand)} Thousand `;
  }

  if (rem > 0) {
    result += convertLessThanOneThousand(rem);
  }

  return result.trim();
}

/**
 * Converts an integer into International numbering format:
 * Billion (1,000,000,000), Million (1,000,000), Thousand (1,000)
 */
function convertInternationalNumber(num: number): string {
  if (num === 0) return 'Zero';

  let result = '';
  const billion = Math.floor(num / 1000000000);
  let rem = num % 1000000000;

  if (billion > 0) {
    result += `${convertLessThanOneThousand(billion)} Billion `;
  }

  const million = Math.floor(rem / 1000000);
  rem = rem % 1000000;

  if (million > 0) {
    result += `${convertLessThanOneThousand(million)} Million `;
  }

  const thousand = Math.floor(rem / 1000);
  rem = rem % 1000;

  if (thousand > 0) {
    result += `${convertLessThanOneThousand(thousand)} Thousand `;
  }

  if (rem > 0) {
    result += convertLessThanOneThousand(rem);
  }

  return result.trim();
}

/**
 * Converts any numeric amount into standard financial text in words.
 * e.g.
 * amountToWords(195000, 'BDT') => "Taka One Lakh Ninety-Five Thousand Only"
 * amountToWords(4500.50, 'USD') => "US Dollars Four Thousand Five Hundred and Cents Fifty Only"
 */
export function amountToWords(amount: number, currency: VoucherCurrency = 'BDT'): string {
  if (isNaN(amount) || amount === 0) {
    return currency === 'BDT' ? 'Taka Zero Only' : `${currency} Zero Only`;
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const integerPart = Math.floor(absAmount);
  const decimalPart = Math.round((absAmount - integerPart) * 100);

  let prefix = '';
  let words = '';
  let decimalSuffix = '';

  if (currency === 'BDT') {
    prefix = 'Taka ';
    words = convertBdtNumber(integerPart);
    if (decimalPart > 0) {
      decimalSuffix = ` and Paisa ${convertLessThanOneThousand(decimalPart)}`;
    }
  } else if (currency === 'USD') {
    prefix = 'US Dollars ';
    words = convertInternationalNumber(integerPart);
    if (decimalPart > 0) {
      decimalSuffix = ` and Cents ${convertLessThanOneThousand(decimalPart)}`;
    }
  } else if (currency === 'GBP') {
    prefix = 'Pounds Sterling ';
    words = convertInternationalNumber(integerPart);
    if (decimalPart > 0) {
      decimalSuffix = ` and Pence ${convertLessThanOneThousand(decimalPart)}`;
    }
  } else if (currency === 'AUD') {
    prefix = 'Australian Dollars ';
    words = convertInternationalNumber(integerPart);
    if (decimalPart > 0) {
      decimalSuffix = ` and Cents ${convertLessThanOneThousand(decimalPart)}`;
    }
  } else {
    prefix = 'Euros ';
    words = convertInternationalNumber(integerPart);
    if (decimalPart > 0) {
      decimalSuffix = ` and Cents ${convertLessThanOneThousand(decimalPart)}`;
    }
  }

  return `${isNegative ? 'Negative ' : ''}${prefix}${words}${decimalSuffix} Only`;
}
