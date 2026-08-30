import { NextResponse } from 'next/server';
import { INITIAL_DOCUMENTS } from '@/lib/demo-data';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    data: INITIAL_DOCUMENTS
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      status: 'success',
      message: 'Simulated OCR & NER complete',
      data: {
        id: `DOC-${Date.now().toString().slice(-4)}`,
        title: body.fileName || 'Uploaded_Seizure_File.pdf',
        ocrConfidence: 97,
        extractedEntitiesCount: 4,
        status: 'REVIEW_REQUIRED'
      }
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Invalid file payload' }, { status: 400 });
  }
}
