import { SchemeItem } from '@/types';

export interface BenefitBreakdownItem {
  id: string;
  titleEn: string;
  titleHi: string;
  amountFormatted: string;
  amountNumeric: number;
  benefitType: string;
  isRecurringAnnual: boolean;
}

export interface TotalBenefitSummary {
  totalEstimatedAmount: number;
  formattedTotal: string;
  schemeCount: number;
  breakdown: BenefitBreakdownItem[];
}

/**
 * Extracts a numeric INR value from a scheme's benefit amount string or description
 */
export function extractNumericBenefit(benefitText?: string): { amount: number; isMonthly: boolean; formatted: string } {
  if (!benefitText) return { amount: 0, isMonthly: false, formatted: 'Direct Welfare' };

  const clean = benefitText.replace(/,/g, '').toLowerCase();

  // Check for Lakhs / Crores
  const lakhMatch = clean.match(/(?:rs\.?|₹)?\s*(\d+(?:\.\d+)?)\s*lakh/i);
  if (lakhMatch) {
    const lakhVal = parseFloat(lakhMatch[1]) * 100000;
    return { amount: lakhVal, isMonthly: false, formatted: `₹${lakhMatch[1]} Lakh` };
  }

  const croreMatch = clean.match(/(?:rs\.?|₹)?\s*(\d+(?:\.\d+)?)\s*crore/i);
  if (croreMatch) {
    const crVal = parseFloat(croreMatch[1]) * 10000000;
    return { amount: crVal, isMonthly: false, formatted: `₹${croreMatch[1]} Cr` };
  }

  // Monthly patterns (e.g. ₹1,500/month or ₹1250 per month)
  const monthlyMatch = clean.match(/(?:rs\.?|₹)?\s*(\d{3,6})\s*(?:\/|\s*per\s*)(?:mo|month|mahina)/i);
  if (monthlyMatch) {
    const monthlyVal = parseInt(monthlyMatch[1], 10);
    const annualVal = monthlyVal * 12;
    return {
      amount: annualVal,
      isMonthly: true,
      formatted: `₹${monthlyVal.toLocaleString('en-IN')}/mo (₹${annualVal.toLocaleString('en-IN')}/yr)`,
    };
  }

  // Regular rupee amounts (e.g. ₹78000, ₹6000, ₹25000)
  const rupeeMatch = clean.match(/(?:rs\.?|₹)\s*(\d{3,8})/i);
  if (rupeeMatch) {
    const val = parseInt(rupeeMatch[1], 10);
    return { amount: val, isMonthly: false, formatted: `₹${val.toLocaleString('en-IN')}` };
  }

  // Standalone numbers
  const numberMatch = clean.match(/(\d{4,7})/);
  if (numberMatch) {
    const val = parseInt(numberMatch[1], 10);
    return { amount: val, isMonthly: false, formatted: `₹${val.toLocaleString('en-IN')}` };
  }

  return { amount: 0, isMonthly: false, formatted: benefitText };
}

/**
 * Calculates total estimated benefit potential across all eligible schemes for user
 */
export function calculateTotalBenefits(schemes: SchemeItem[]): TotalBenefitSummary {
  if (!schemes || schemes.length === 0) {
    return {
      totalEstimatedAmount: 0,
      formattedTotal: '₹0',
      schemeCount: 0,
      breakdown: [],
    };
  }

  let total = 0;
  const breakdown: BenefitBreakdownItem[] = [];

  for (const scheme of schemes) {
    const textToScan = scheme.benefitAmount || scheme.benefitsEn || '';
    const { amount, formatted, isMonthly } = extractNumericBenefit(textToScan);

    if (amount > 0) {
      total += amount;
      breakdown.push({
        id: scheme.id,
        titleEn: scheme.titleEn,
        titleHi: scheme.titleHi,
        amountFormatted: formatted,
        amountNumeric: amount,
        benefitType: scheme.benefitType || 'Financial',
        isRecurringAnnual: isMonthly,
      });
    }
  }

  // Sort breakdown from highest value to lowest
  breakdown.sort((a, b) => b.amountNumeric - a.amountNumeric);

  let formattedTotal = `₹${total.toLocaleString('en-IN')}`;
  if (total >= 10000000) {
    formattedTotal = `₹${(total / 10000000).toFixed(2)} Crore`;
  } else if (total >= 100000) {
    formattedTotal = `₹${(total / 100000).toFixed(2)} Lakh`;
  }

  return {
    totalEstimatedAmount: total,
    formattedTotal,
    schemeCount: breakdown.length,
    breakdown,
  };
}
