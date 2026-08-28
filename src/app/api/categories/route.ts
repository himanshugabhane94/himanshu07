import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { schemes: { where: { status: 'PUBLISHED' } } },
        },
      },
      orderBy: { nameEn: 'asc' },
    });

    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error('Fetch categories error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
