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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        state: true,
        gender: true,
        age: true,
        occupation: true,
        income: true,
        category: true,
        education: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Fetch profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name: body.name !== undefined ? body.name.trim() : undefined,
        mobile: body.mobile !== undefined ? body.mobile.trim() : undefined,
        state: body.state !== undefined ? body.state : undefined,
        gender: body.gender !== undefined ? body.gender : undefined,
        age: body.age !== undefined && body.age !== null ? parseInt(String(body.age), 10) : undefined,
        occupation: body.occupation !== undefined ? body.occupation : undefined,
        income: body.income !== undefined && body.income !== null ? parseFloat(String(body.income)) : undefined,
        category: body.category !== undefined ? body.category : undefined,
        education: body.education !== undefined ? body.education : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        state: true,
        gender: true,
        age: true,
        occupation: true,
        income: true,
        category: true,
        education: true,
      },
    });

    return NextResponse.json({ user: updated, message: 'Profile updated successfully' });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile: ' + error.message }, { status: 500 });
  }
}
