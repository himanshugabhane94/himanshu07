import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    const q = (query || '').toLowerCase();

    let response = {
      answer: 'Investigation analysis computed based on multi-source knowledge graph topology.',
      confidence: 90,
      highlightEntityIds: ['ENT-P-01', 'ENT-P-02', 'ENT-O-01'],
      evidence: ['MCA Registry Extract', 'Customs Manifest Seizure Panchnama'],
      suggestedRoute: '/graph'
    };

    if (q.includes('bridge') || q.includes('cluster')) {
      response = {
        answer: 'Ramesh Kumar exhibits high betweenness centrality (0.84), connecting the Invoicing Cluster with the Freight Logistics Cluster.',
        confidence: 91,
        highlightEntityIds: ['ENT-P-01', 'ENT-O-01', 'ENT-O-02'],
        evidence: ['Undisclosed escrow guarantee discovered during BKC search', 'Server auth IP overlap 185.220.101.5'],
        suggestedRoute: '/hidden-bridges'
      };
    } else if (q.includes('indirect') || q.includes('path')) {
      response = {
        answer: 'Multi-hop path confirmed: Ramesh Kumar -> BKC Trident Coordination Conclave -> Apex Global Logistics -> Vikramaditya Sharma.',
        confidence: 94,
        highlightEntityIds: ['ENT-P-01', 'ENT-E-03', 'ENT-O-01', 'ENT-P-02'],
        evidence: ['CCTV surveillance log DOC-03', 'JNPT container seizure memorandum DOC-02'],
        suggestedRoute: '/indirect-connections'
      };
    }

    return NextResponse.json({
      status: 'success',
      data: response
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Invalid query payload' }, { status: 400 });
  }
}
