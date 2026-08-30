import { NextResponse } from 'next/server';
import { INITIAL_AI_FINDINGS } from '@/lib/demo-data';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    data: INITIAL_AI_FINDINGS
  });
}
