import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { evaluateEligibility } from '@/lib/eligibilityEngine';
import { EligibilityCheckInput } from '@/types';

export async function POST(request: Request) {
  try {
    const input: EligibilityCheckInput = await request.json();

    const schemes = await prisma.scheme.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        category: {
          select: {
            id: true,
            nameEn: true,
            nameHi: true,
            slug: true,
            icon: true,
          },
        },
      },
    });

    const evaluated = schemes.map((scheme: any) => {
      const result = evaluateEligibility(scheme, input);
      return {
        ...scheme,
        matchScore: result.matchPercentage,
        isEligible: result.isEligible,
        isPartial: result.isPartial,
        matchReasons: result.reasons,
        unmatchedReasons: result.missingCriteria,
      };
    });

    // Sort descending by match score
    evaluated.sort((a, b) => b.matchScore - a.matchScore);

    // AI summary message
    const highlyEligibleCount = evaluated.filter((s) => s.matchScore >= 75).length;
    const partialCount = evaluated.filter((s) => s.matchScore >= 50 && s.matchScore < 75).length;

    const summaryEn = `Based on your profile, you strongly qualify for ${highlyEligibleCount} welfare schemes, and partially meet criteria for ${partialCount} additional programs.`;
    const summaryHi = `आपकी प्रोफ़ाइल के अनुसार, आप ${highlyEligibleCount} सरकारी योजनाओं के लिए पूरी तरह पात्र हैं, तथा ${partialCount} अन्य योजनाओं के अधिकांश मानदंडों को पूरा करते हैं।`;

    return NextResponse.json({
      schemes: evaluated,
      summary: {
        en: summaryEn,
        hi: summaryHi,
        highlyEligibleCount,
        partialCount,
        totalEvaluated: evaluated.length,
      },
    });
  } catch (error: any) {
    console.error('Eligibility evaluation error:', error);
    return NextResponse.json({ error: 'Failed to evaluate eligibility: ' + error.message }, { status: 500 });
  }
}
