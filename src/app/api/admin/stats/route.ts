import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'VERIFIED_OFFICER'].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const [
      totalSchemes,
      publishedSchemes,
      draftSchemes,
      verifiedSchemes,
      totalUsers,
      totalBookmarks,
      totalTrackedApplications,
      categoriesWithCount,
      topViewedSchemes,
    ] = await Promise.all([
      prisma.scheme.count(),
      prisma.scheme.count({ where: { status: 'PUBLISHED' } }),
      prisma.scheme.count({ where: { status: 'DRAFT' } }),
      prisma.scheme.count({ where: { status: 'VERIFIED' } }),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.bookmark.count(),
      prisma.applicationTracker.count(),
      prisma.category.findMany({
        select: {
          id: true,
          nameEn: true,
          nameHi: true,
          icon: true,
          _count: { select: { schemes: true } },
        },
      }),
      prisma.scheme.findMany({
        take: 5,
        orderBy: { viewsCount: 'desc' },
        select: {
          id: true,
          titleEn: true,
          titleHi: true,
          viewsCount: true,
          status: true,
          benefitType: true,
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalSchemes,
        publishedSchemes,
        draftSchemes,
        verifiedSchemes,
        totalUsers,
        totalBookmarks,
        totalTrackedApplications,
        categories: categoriesWithCount,
        topViewedSchemes,
      },
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin statistics' }, { status: 500 });
  }
}
