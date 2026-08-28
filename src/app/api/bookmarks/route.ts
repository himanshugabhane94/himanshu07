import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ bookmarks: [] });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        scheme: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const schemes = bookmarks.map((b) => ({
      ...b.scheme,
      isBookmarked: true,
      bookmarkedAt: b.createdAt,
    }));

    return NextResponse.json({ schemes });
  } catch (error: any) {
    console.error('Fetch bookmarks error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Sign in required to bookmark schemes' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { schemeId } = body;

    if (!schemeId) {
      return NextResponse.json({ error: 'Scheme ID is required' }, { status: 400 });
    }

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_schemeId: { userId, schemeId },
      },
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ bookmarked: false, message: 'Bookmark removed' });
    } else {
      await prisma.bookmark.create({
        data: { userId, schemeId },
      });
      return NextResponse.json({ bookmarked: true, message: 'Scheme saved successfully' });
    }
  } catch (error: any) {
    console.error('Toggle bookmark error:', error);
    return NextResponse.json({ error: 'Failed to update bookmark: ' + error.message }, { status: 500 });
  }
}
