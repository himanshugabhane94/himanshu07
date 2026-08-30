'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useInvestigation } from '@/context/InvestigationContext';
import { 
  History, 
  ShieldCheck, 
  Search, 
  Filter, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  UserCheck 
} from 'lucide-react';

export default function AuditTrailPage() {
  const { auditLogs } = useInvestigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter(log => {
    if (categoryFilter !== 'ALL' && log.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return log.details.toLowerCase().includes(q) || log.user.toLowerCase().includes(q) || log.action.toLowerCase().includes(q);
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
                <History className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-slate-100">
                Immutable Evidentiary Audit Trail
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Cryptographically timestamped activity ledger recording all entity resolutions, record merges, dossier exports, and access events.
            </p>
          </div>

          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Immutable Ledger: Tamper-Proof</span>
          </span>
        </div>

        {/* Filters */}
        <div className="synapx-card p-4 bg-obsidian-850 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-teal-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit logs by officer, action code, or case reference..."
              className="w-full bg-transparent border-none text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs flex-wrap">
            <span className="text-slate-400 font-mono text-[10px]">CATEGORY:</span>
            {['ALL', 'ENTITY_RESOLUTION', 'RECORD_MERGE', 'CASE_BRIEF', 'CASE_MODIFICATION', 'REDACTION_TOGGLE', 'SECURITY'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  categoryFilter === cat
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="synapx-card bg-obsidian-850 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-obsidian-900 border-b border-obsidian-700 text-slate-400 font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-3.5">Timestamp (UTC+5:30)</th>
                  <th className="p-3.5">Officer / Persona</th>
                  <th className="p-3.5">Action Code</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Details & Case Association</th>
                  <th className="p-3.5">Station IP</th>
                  <th className="p-3.5 text-right">Integrity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-800 text-slate-300">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-obsidian-800/60 transition-colors">
                    <td className="p-3.5 font-mono text-slate-400 whitespace-nowrap text-[11px]">
                      {log.timestamp}
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-100">{log.user}</div>
                      <span className="text-[10px] font-mono text-teal-400">{log.userRole}</span>
                    </td>

                    <td className="p-3.5 font-mono text-amber-400 font-bold text-[11px] whitespace-nowrap">
                      {log.action}
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-obsidian-950 text-slate-300 border border-obsidian-750 text-[10px] font-mono whitespace-nowrap">
                        {log.category}
                      </span>
                    </td>

                    <td className="p-3.5 max-w-md">
                      <div className="text-slate-200">{log.details}</div>
                      {log.caseNumber && (
                        <div className="text-[10px] font-mono text-teal-400 mt-0.5">Ref: {log.caseNumber}</div>
                      )}
                    </td>

                    <td className="p-3.5 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      {log.ipAddress}
                    </td>

                    <td className="p-3.5 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        {log.status}
                      </span>
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
