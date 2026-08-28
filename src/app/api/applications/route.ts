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
      return NextResponse.json({ trackers: [] });
    }

    const trackers = await prisma.applicationTracker.findMany({
      where: { userId },
      include: {
        scheme: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ trackers });
  } catch (error: any) {
    console.error('Fetch applications error:', error);
    return NextResponse.json({ error: 'Failed to fetch application records' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { schemeId, status, notes } = body;

    if (!schemeId) {
      return NextResponse.json({ error: 'Scheme ID is required' }, { status: 400 });
    }

    const tracker = await prisma.applicationTracker.upsert({
      where: {
        userId_schemeId: { userId, schemeId },
      },
      update: {
        status: status || 'APPLIED',
        notes: notes !== undefined ? notes : undefined,
      },
      create: {
        userId,
        schemeId,
        status: status || 'APPLIED',
        notes: notes || '',
      },
      include: {
        scheme: true,
      },
    });

    // Create a notification about the tracker update
    await prisma.notification.create({
      data: {
        userId,
        type: 'STATUS_UPDATE',
        titleEn: 'Application Status Updated',
        titleHi: 'आवेदन की स्थिति अपडेट हुई',
        messageEn: `Status for "${tracker.scheme.titleEn}" set to ${tracker.status}.`,
        messageHi: `"${tracker.scheme.titleHi}" के लिए स्थिति ${tracker.status} पर सेट की गई।`,
        link: '/dashboard',
        read: false,
      },
    });

    return NextResponse.json({ tracker });
  } catch (error: any) {
    console.error('Update application tracker error:', error);
    return NextResponse.json({ error: 'Failed to update application tracker: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Tracker ID is required' }, { status: 400 });
    }

    await prisma.applicationTracker.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Tracker entry removed successfully' });
  } catch (error: any) {
    console.error('Delete application tracker error:', error);
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
  }
}
