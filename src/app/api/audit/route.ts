import { NextResponse } from 'next/server';
import { INITIAL_AUDIT_LOGS } from '@/lib/demo-data';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    data: INITIAL_AUDIT_LOGS
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      status: 'success',
      data: {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        ...body,
        status: 'SUCCESS'
      }
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Invalid audit payload' }, { status: 400 });
  }
}
