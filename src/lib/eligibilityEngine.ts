import { EligibilityCriteria, EligibilityCheckInput, EligibilityResult, SchemeItem } from '@/types';

export function evaluateEligibility(
  scheme: SchemeItem,
  input: EligibilityCheckInput
): EligibilityResult {
  let criteria: EligibilityCriteria = {};
  try {
    criteria = JSON.parse(scheme.eligibilityJson || '{}');
  } catch (e) {
    criteria = {};
  }

  const reasons: string[] = [];
  const missingCriteria: string[] = [];

  let totalWeight = 0;
  let earnedScore = 0;

  // 1. Gender Filter (Weight: 20)
  const genderWeight = 20;
  totalWeight += genderWeight;
  const targetGender = criteria.gender || 'All';

  if (targetGender === 'All') {
    earnedScore += genderWeight;
    reasons.push('Open to all genders');
  } else if (input.gender) {
    if (input.gender.toLowerCase() === targetGender.toLowerCase()) {
      earnedScore += genderWeight;
      reasons.push(`Matches specified gender requirement (${targetGender})`);
    } else {
      missingCriteria.push(`Scheme is exclusively for ${targetGender} citizens`);
    }
  } else {
    // No input provided, neutral
    earnedScore += genderWeight * 0.7;
  }

  // 2. Age Filter (Weight: 20)
  const ageWeight = 20;
  totalWeight += ageWeight;
  const minAge = criteria.minAge !== undefined && criteria.minAge !== null ? criteria.minAge : 0;
  const maxAge = criteria.maxAge !== undefined && criteria.maxAge !== null ? criteria.maxAge : 120;

  if (input.age !== undefined && input.age !== null) {
    if (input.age >= minAge && input.age <= maxAge) {
      earnedScore += ageWeight;
      reasons.push(`Age ${input.age} qualifies (Eligible age: ${minAge} - ${maxAge} years)`);
    } else if (Math.abs(input.age - minAge) <= 2 || Math.abs(input.age - maxAge) <= 2) {
      earnedScore += ageWeight * 0.5;
      missingCriteria.push(`Age ${input.age} is slightly outside age bracket (${minAge} - ${maxAge} years)`);
    } else {
      missingCriteria.push(`Age ${input.age} does not meet criteria (${minAge} - ${maxAge} years)`);
    }
  } else {
    earnedScore += ageWeight * 0.8;
  }

  // 3. State Filter (Weight: 20)
  const stateWeight = 20;
  totalWeight += stateWeight;
  const states = criteria.states || ['All'];

  if (states.includes('All') || states.length === 0) {
    earnedScore += stateWeight;
    reasons.push('Nationwide scheme valid across all 28 States and 8 UTs');
  } else if (input.state) {
    if (states.includes(input.state)) {
      earnedScore += stateWeight;
      reasons.push(`Directly available in ${input.state}`);
    } else {
      missingCriteria.push(`Not currently notified in ${input.state}`);
    }
  } else {
    earnedScore += stateWeight * 0.7;
  }

  // 4. Income Filter (Weight: 15)
  const incomeWeight = 15;
  totalWeight += incomeWeight;
  const maxIncome = criteria.maxIncome;

  if (maxIncome === null || maxIncome === undefined) {
    earnedScore += incomeWeight;
    reasons.push('No family income ceiling restriction');
  } else if (input.income !== undefined && input.income !== null) {
    if (input.income <= maxIncome) {
      earnedScore += incomeWeight;
      reasons.push(`Annual income ₹${input.income.toLocaleString('en-IN')} is within ₹${maxIncome.toLocaleString('en-IN')} ceiling`);
    } else if (input.income <= maxIncome * 1.2) {
      earnedScore += incomeWeight * 0.4;
      missingCriteria.push(`Income slightly exceeds maximum cap of ₹${maxIncome.toLocaleString('en-IN')}`);
    } else {
      missingCriteria.push(`Family income exceeds the scheme maximum cap of ₹${maxIncome.toLocaleString('en-IN')}`);
    }
  } else {
    earnedScore += incomeWeight * 0.7;
  }

  // 5. Social Category / Reservation (Weight: 10)
  const categoryWeight = 10;
  totalWeight += categoryWeight;
  const categories = criteria.categories || ['All'];

  if (categories.includes('All') || categories.length === 0) {
    earnedScore += categoryWeight;
    reasons.push('Applicable to all social categories (General / OBC / SC / ST / EWS)');
  } else if (input.category) {
    if (categories.includes(input.category)) {
      earnedScore += categoryWeight;
      reasons.push(`Matches social category priority (${input.category})`);
    } else {
      missingCriteria.push(`Restricted to ${categories.join(', ')}`);
    }
  } else {
    earnedScore += categoryWeight * 0.7;
  }

  // 6. Occupation (Weight: 10)
  const occupationWeight = 10;
  totalWeight += occupationWeight;
  const occupations = criteria.occupations || ['All'];

  if (occupations.includes('All') || occupations.length === 0) {
    earnedScore += occupationWeight;
    reasons.push('Open to all professional occupations');
  } else if (input.occupation) {
    if (occupations.includes(input.occupation)) {
      earnedScore += occupationWeight;
      reasons.push(`Matches target occupation (${input.occupation})`);
    } else {
      missingCriteria.push(`Targeted specifically for: ${occupations.join(', ')}`);
    }
  } else {
    earnedScore += occupationWeight * 0.7;
  }

  // 7. Education (Weight: 5)
  const educationWeight = 5;
  totalWeight += educationWeight;
  const educationList = criteria.education || ['All'];

  if (educationList.includes('All') || educationList.length === 0) {
    earnedScore += educationWeight;
  } else if (input.education) {
    if (educationList.includes(input.education)) {
      earnedScore += educationWeight;
      reasons.push(`Matches education eligibility level (${input.education})`);
    } else {
      missingCriteria.push(`Targeted for education level: ${educationList.join(', ')}`);
    }
  } else {
    earnedScore += educationWeight * 0.8;
  }

  const rawMatch = (earnedScore / totalWeight) * 100;
  const matchPercentage = Math.round(Math.min(100, Math.max(0, rawMatch)));

  const isEligible = matchPercentage >= 75 && missingCriteria.length === 0;
  const isPartial = matchPercentage >= 50 && matchPercentage < 75;

  return {
    scheme,
    matchPercentage,
    isEligible,
    isPartial,
    reasons,
    missingCriteria,
  };
}

export function rankSchemesByEligibility(
  schemes: SchemeItem[],
  input: EligibilityCheckInput
): EligibilityResult[] {
  const results = schemes.map((scheme) => evaluateEligibility(scheme, input));

  // Sort descending by match percentage
  results.sort((a, b) => b.matchPercentage - a.matchPercentage);
  return results;
}
