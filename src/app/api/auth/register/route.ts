import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      mobile,
      password,
      state,
      gender,
      age,
      occupation,
      income,
      category,
      education,
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email address are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check existing email
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email address already exists' },
        { status: 409 }
      );
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : null;

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        mobile: mobile ? mobile.trim() : null,
        passwordHash,
        role: 'USER',
        state: state || null,
        gender: gender || null,
        age: age ? parseInt(String(age), 10) : null,
        occupation: occupation || null,
        income: income ? parseFloat(String(income)) : null,
        category: category || null,
        education: education || null,
        isActive: true,
      },
    });

    // Create a welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'SYSTEM',
        titleEn: 'Welcome to YogyaSetu!',
        titleHi: 'योग्यसेतु में आपका स्वागत है!',
        messageEn: 'Complete your profile to unlock personalized AI welfare recommendations.',
        messageHi: 'व्यक्तिगत AI कल्याणकारी सिफारिशें प्राप्त करने के लिए अपनी प्रोफ़ाइल पूरी करें।',
        link: '/dashboard',
        read: false,
      },
    });

    return NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create user account: ' + (error.message || 'Internal server error') },
      { status: 500 }
    );
  }
}
