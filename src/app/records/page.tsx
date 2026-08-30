'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useInvestigation } from '@/context/InvestigationContext';
import { VerificationStatus } from '@/types/synapx';
import { 
  FileSpreadsheet, 
  Search, 
  Filter, 
  Plus, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  Copy, 
  Eye, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import { ProvenanceBadge, EntityTypeBadge } from '@/components/common/ProvenanceBadge';
import { RedactedText } from '@/components/common/RedactedText';

export default function RecordsPage() {
  const { entities, updateEntityVerification, activeCase } = useInvestigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filteredEntities = entities.filter(ent => {
    if (statusFilter !== 'ALL' && ent.verificationStatus !== statusFilter) return false;
    if (typeFilter !== 'ALL' && ent.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ent.name.toLowerCase().includes(q) ||
        ent.roleOrDesignation.toLowerCase().includes(q) ||
        ent.sourceProvenance.toLowerCase().includes(q) ||
        ent.aliases.some(a => a.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-obsidian-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-teal-500/20 text-teal-400">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-slate-100">
                Criminal Record Intelligence & Entity Registry
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Synthetic criminal record repository with verification tracking, data completeness scores, and provenance attribution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300">
              {entities.length} Intelligence Records
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="synapx-card p-4 bg-obsidian-850 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-teal-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search records by name, role, registration ID, or provenance source..."
              className="w-full bg-transparent border-none text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-mono text-[10px]">VERIFICATION:</span>
            {['ALL', 'VERIFIED', 'NEEDS_REVIEW', 'UNVERIFIED'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}

            <span className="text-slate-400 font-mono text-[10px] ml-2">TYPE:</span>
            {['ALL', 'PERSON', 'ORGANIZATION', 'LOCATION', 'DIGITAL_ENTITY'].map(tp => (
              <button
                key={tp}
                onClick={() => setTypeFilter(tp)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  typeFilter === tp
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tp.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Records Table */}
        <div className="synapx-card bg-obsidian-850 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-obsidian-900 border-b border-obsidian-700 text-slate-400 font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-3.5">Record / Entity Name</th>
                  <th className="p-3.5">Type & Role</th>
                  <th className="p-3.5">Metadata (Protected)</th>
                  <th className="p-3.5">Quality Score</th>
                  <th className="p-3.5">Verification Status</th>
                  <th className="p-3.5">Evidentiary Provenance</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-800 text-slate-300">
                {filteredEntities.map((ent) => (
                  <tr key={ent.id} className="hover:bg-obsidian-800/60 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-100 text-xs">{ent.name}</div>
                      {ent.aliases.length > 0 && (
                        <div className="text-[10px] text-slate-400">
                          Alias: {ent.aliases.slice(0, 2).join(', ')}
                        </div>
                      )}
                    </td>

                    <td className="p-3.5">
                      <EntityTypeBadge type={ent.type} />
                      <div className="text-[11px] text-slate-400 mt-1">{ent.roleOrDesignation}</div>
                    </td>

                    <td className="p-3.5 space-y-0.5 text-[11px]">
                      {ent.metadata.phone && (
                        <div><RedactedText value={ent.metadata.phone} type="phone" /></div>
                      )}
                      {ent.metadata.taxIdOrAadhaar && (
                        <div><RedactedText value={ent.metadata.taxIdOrAadhaar} type="taxId" /></div>
                      )}
                      {ent.metadata.cryptoWallet && (
                        <div><RedactedText value={ent.metadata.cryptoWallet} type="crypto" /></div>
                      )}
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 bg-obsidian-950 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${ent.qualityScore > 85 ? 'bg-teal-400' : 'bg-amber-400'}`}
                            style={{ width: `${ent.qualityScore}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-bold text-slate-200">{ent.qualityScore}%</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <ProvenanceBadge verificationStatus={ent.verificationStatus} confidenceScore={ent.confidenceScore} />
                    </td>

                    <td className="p-3.5 max-w-xs">
                      <p className="text-[10px] text-slate-400 line-clamp-2" title={ent.sourceProvenance}>
                        {ent.sourceProvenance}
                      </p>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          const nextStatus: VerificationStatus = ent.verificationStatus === 'VERIFIED' ? 'NEEDS_REVIEW' : 'VERIFIED';
                          updateEntityVerification(ent.id, nextStatus);
                        }}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors ${
                          ent.verificationStatus === 'VERIFIED'
                            ? 'bg-obsidian-800 text-slate-400 border-obsidian-700 hover:text-slate-200'
                            : 'bg-teal-500/20 text-teal-300 border-teal-500/40 hover:bg-teal-500/30'
                        }`}
                      >
                        {ent.verificationStatus === 'VERIFIED' ? 'Reopen Review' : 'Verify'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
