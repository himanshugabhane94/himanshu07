import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'VERIFIED_OFFICER'].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'schemes';

    if (type === 'schemes') {
      const schemes = await prisma.scheme.findMany({
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      });

      const header = ['ID', 'Title (EN)', 'Title (HI)', 'Category', 'Benefit Type', 'Amount', 'Department', 'Status', 'Views', 'Official Link'];
      const rows = schemes.map((s) => [
        `"${s.id}"`,
        `"${(s.titleEn || '').replace(/"/g, '""')}"`,
        `"${(s.titleHi || '').replace(/"/g, '""')}"`,
        `"${(s.category?.nameEn || '').replace(/"/g, '""')}"`,
        `"${s.benefitType || ''}"`,
        `"${(s.benefitAmount || '').replace(/"/g, '""')}"`,
        `"${(s.departmentEn || '').replace(/"/g, '""')}"`,
        `"${s.status}"`,
        s.viewsCount,
        `"${s.officialLink}"`,
      ]);

      const csvContent = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="yogyasetu-schemes-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    } else if (type === 'users') {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
      });

      const header = ['ID', 'Name', 'Email', 'Mobile', 'Role', 'State', 'Gender', 'Age', 'Occupation', 'Category', 'Income', 'Created At'];
      const rows = users.map((u) => [
        `"${u.id}"`,
        `"${(u.name || '').replace(/"/g, '""')}"`,
        `"${u.email}"`,
        `"${u.mobile || ''}"`,
        `"${u.role}"`,
        `"${u.state || ''}"`,
        `"${u.gender || ''}"`,
        u.age || '',
        `"${u.occupation || ''}"`,
        `"${u.category || ''}"`,
        u.income || '',
        `"${u.createdAt.toISOString()}"`,
      ]);

      const csvContent = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="yogyasetu-citizens-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed: ' + error.message }, { status: 500 });
  }
}
