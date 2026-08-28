import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, otp, type = 'EMAIL' } = body;

    if (!identifier || !otp) {
      return NextResponse.json(
        { error: 'Identifier and OTP code are required.' },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Find the latest active unverified OTP for this identifier
    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        identifier: cleanIdentifier,
        type,
        verified: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'No active OTP request found. Please request a new code.' },
        { status: 404 }
      );
    }

    // Check expiration (10-minute validity)
    if (new Date() > new Date(otpRecord.expiresAt)) {
      return NextResponse.json(
        { error: 'This verification code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check rate limit on attempts (max 5 attempts)
    if (otpRecord.attempts >= 5) {
      return NextResponse.json(
        { error: 'Too many incorrect attempts. Please request a fresh OTP.' },
        { status: 429 }
      );
    }

    // Increment attempts
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { attempts: { increment: 1 } },
    });

    // Validate OTP using bcrypt
    const isValid = await bcrypt.compare(otp.trim(), otpRecord.otpHash);

    if (!isValid) {
      const remaining = 4 - otpRecord.attempts;
      return NextResponse.json(
        {
          error: remaining > 0
            ? `Invalid OTP. You have ${remaining} attempts remaining.`
            : 'Invalid OTP. Maximum attempts exceeded.',
        },
        { status: 400 }
      );
    }

    // Mark as verified
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully.',
    });
  } catch (err: any) {
    console.error('Error in verify OTP route:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred during OTP verification.' },
      { status: 500 }
    );
  }
}
