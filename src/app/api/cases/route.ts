import { NextResponse } from 'next/server';
import { INITIAL_CASES } from '@/lib/demo-data';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    data: INITIAL_CASES
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      status: 'success',
      message: 'Case created successfully (Demo Mode)',
      data: {
        id: `CASE-2026-${Date.now().toString().slice(-4)}`,
        ...body,
        createdDate: new Date().toISOString().split('T')[0]
      }
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Invalid payload' }, { status: 400 });
  }
}
