'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useInvestigation } from '@/context/InvestigationContext';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck, 
  BarChart3, 
  ArrowRight, 
  FileText, 
  Database,
  Activity,
  Layers
} from 'lucide-react';
import Link from 'next/link';

export default function RecordQualityPage() {
  const { entities, documents, activeCase } = useInvestigation();

  const avgQualityScore = Math.round(
    entities.reduce((acc, curr) => acc + curr.qualityScore, 0) / (entities.length || 1)
  );

  const verifiedCount = entities.filter(e => e.verificationStatus === 'VERIFIED').length;
  const unverifiedCount = entities.filter(e => e.verificationStatus !== 'VERIFIED').length;

  const recommendations = [
    {
      title: 'Missing Date on Event Sub-records',
      desc: '3 event sub-records lack standardized ISO timestamps. Recommend correlating with telecom CDR logs.',
      severity: 'MEDIUM',
      actionUrl: '/timeline',
      actionText: 'Review Timeline Events'
    },
    {
      title: 'Unverified Offshore Remittance Source',
      desc: 'SWIFT MT-103 wire certificate for Al-Zahra General Trading LLC ($6.2M) requires bilateral consular authentication.',
      severity: 'HIGH',
      actionUrl: '/evidence-vault',
      actionText: 'Inspect Evidence Vault'
    },
    {
      title: 'Possible Duplicate Identity Candidate',
      desc: 'Ramesh Kumar vs R. Kumar (92% match score) detected across MCA and Port Authority files.',
      severity: 'CRITICAL',
      actionUrl: '/entity-resolution',
      actionText: 'Resolve Duplicate Match'
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-obsidian-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-teal-500/20 text-teal-400">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-slate-100">
                Record Quality Score & Completeness Audit
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Automated data integrity audit measuring completeness, missing metadata, and evidentiary provenance.
            </p>
          </div>

          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300">
            Overall Quality: <strong className="text-teal-400 font-bold">{avgQualityScore}%</strong>
          </span>
        </div>

        {/* Quality Score Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="synapx-card p-5 bg-obsidian-850 space-y-2">
            <div className="text-[10px] font-mono uppercase text-slate-400">Data Completeness</div>
            <div className="text-2xl font-mono font-bold text-teal-400">{activeCase.qualityCompletenessScore}%</div>
            <p className="text-[11px] text-slate-400">Essential investigation fields filled across all dossiers.</p>
          </div>

          <div className="synapx-card p-5 bg-obsidian-850 space-y-2">
            <div className="text-[10px] font-mono uppercase text-slate-400">Human Verification Ratio</div>
            <div className="text-2xl font-mono font-bold text-emerald-400">{activeCase.verificationPercentage}%</div>
            <p className="text-[11px] text-slate-400">{verifiedCount} of {entities.length} records verified by authorized officers.</p>
          </div>

          <div className="synapx-card p-5 bg-obsidian-850 space-y-2">
            <div className="text-[10px] font-mono uppercase text-slate-400">Evidentiary Provenance</div>
            <div className="text-2xl font-mono font-bold text-amber-400">96%</div>
            <p className="text-[11px] text-slate-400">Direct source documents and court-admissible certificates mapped.</p>
          </div>

          <div className="synapx-card p-5 bg-obsidian-850 space-y-2">
            <div className="text-[10px] font-mono uppercase text-slate-400">Duplicate Risk Index</div>
            <div className="text-2xl font-mono font-bold text-teal-300">Low (8%)</div>
            <p className="text-[11px] text-slate-400">Only 2 candidate duplicate pairs currently flagged in review queue.</p>
          </div>

        </div>

        {/* Actionable Recommendations */}
        <div className="synapx-card p-6 bg-obsidian-850 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-obsidian-700">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-slate-100">Actionable Data Quality Recommendations</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">3 Corrective Items</span>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-obsidian-900 border border-obsidian-750 flex items-center justify-between gap-4 flex-wrap"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded ${
                      rec.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      rec.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                    }`}>
                      {rec.severity}
                    </span>
                    <h4 className="text-sm font-bold text-slate-200">{rec.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400">{rec.desc}</p>
                </div>

                <Link
                  href={rec.actionUrl}
                  className="px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-semibold text-xs border border-teal-500/40 flex items-center gap-1 transition-colors"
                >
                  <span>{rec.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Entity Quality Distribution Table */}
        <div className="synapx-card p-6 bg-obsidian-850 space-y-4">
          <h3 className="text-sm font-bold text-slate-100">Entity Quality Breakdown</h3>
          <div className="space-y-2">
            {entities.slice(0, 6).map(ent => (
              <div key={ent.id} className="p-3 rounded-lg bg-obsidian-900 border border-obsidian-750 flex items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-200">{ent.name}</span>
                  <span className="text-slate-400 ml-2">({ent.roleOrDesignation})</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-obsidian-950 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400" style={{ width: `${ent.qualityScore}%` }} />
                  </div>
                  <span className="font-mono text-teal-400 font-bold w-8">{ent.qualityScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
