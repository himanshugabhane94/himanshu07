import { NextResponse } from 'next/server';
import { INITIAL_ENTITIES, INITIAL_RELATIONSHIPS } from '@/lib/demo-data';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    data: {
      entities: INITIAL_ENTITIES,
      relationships: INITIAL_RELATIONSHIPS
    }
  });
}
