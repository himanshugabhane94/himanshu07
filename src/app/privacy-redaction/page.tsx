'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useInvestigation } from '@/context/InvestigationContext';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertTriangle, 
  History, 
  Sparkles,
  KeyRound
} from 'lucide-react';
import { RedactedText } from '@/components/common/RedactedText';

export default function PrivacyRedactionPage() {
  const { isRedactionEnabled, toggleRedaction, entities, currentUser } = useInvestigation();

  const sensitiveEntities = entities.filter(
    e => e.metadata.phone || e.metadata.taxIdOrAadhaar || e.metadata.bankAccount || e.metadata.cryptoWallet
  );

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-obsidian-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-teal-500/20 text-teal-400">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-slate-100">
                Privacy Controls & Smart Data Redaction Shield
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Automated detection and masking of personally identifiable information (PII) with supervisory authorization audit trails.
            </p>
          </div>

          <button
            onClick={toggleRedaction}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
              isRedactionEnabled
                ? 'bg-teal-500 text-obsidian-950 shadow-glow-teal border-teal-400'
                : 'bg-amber-500 text-obsidian-950 shadow-glow-amber border-amber-400'
            }`}
          >
            {isRedactionEnabled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{isRedactionEnabled ? 'Redaction Shield: ACTIVE (Masked)' : 'Authorized Unmasked View'}</span>
          </button>
        </div>

        {/* Status Banner */}
        <div className={`synapx-card p-6 border ${
          isRedactionEnabled ? 'bg-teal-950/20 border-teal-500/40' : 'bg-amber-950/20 border-amber-500/40'
        } space-y-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isRedactionEnabled ? (
                <ShieldCheck className="w-5 h-5 text-teal-400" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-amber-400" />
              )}
              <h3 className="text-base font-bold text-slate-100">
                {isRedactionEnabled
                  ? '7 Sensitive PII Attributes Detected & Masked'
                  : 'Authorized Investigative Unmasking Active'}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              User: <strong className="text-slate-200">{currentUser.name}</strong> ({currentUser.role})
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
            {isRedactionEnabled
              ? 'All Aadhaar numbers, Permanent Account Numbers (PAN), personal phone numbers, bank accounts, and cryptographic key identifiers are automatically masked with secure redaction tokens across the entire application interface.'
              : 'You are currently viewing unmasked intelligence data under Tier-0 investigative clearance. Every unmasked view action is recorded in the permanent immutable audit ledger.'}
          </p>
        </div>

        {/* Protected Entities Inventory */}
        <div className="synapx-card p-6 bg-obsidian-850 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-obsidian-700">
            <h3 className="text-sm font-bold text-slate-100">
              Protected Entities & Sensitive Metadata Inventory ({sensitiveEntities.length} Entities)
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Automatic Masking Engine</span>
          </div>

          <div className="space-y-3">
            {sensitiveEntities.map((ent) => (
              <div
                key={ent.id}
                className="p-4 rounded-xl bg-obsidian-900 border border-obsidian-750 flex items-center justify-between gap-4 flex-wrap text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100">{ent.name}</span>
                    <span className="text-[10px] font-mono text-teal-400">{ent.type}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{ent.roleOrDesignation}</p>
                </div>

                {/* Masked Attributes Preview */}
                <div className="flex items-center gap-4 flex-wrap text-[11px]">
                  {ent.metadata.phone && (
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 uppercase block font-mono">Phone:</span>
                      <RedactedText value={ent.metadata.phone} type="phone" />
                    </div>
                  )}

                  {ent.metadata.taxIdOrAadhaar && (
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 uppercase block font-mono">Tax ID/PAN:</span>
                      <RedactedText value={ent.metadata.taxIdOrAadhaar} type="taxId" />
                    </div>
                  )}

                  {ent.metadata.bankAccount && (
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 uppercase block font-mono">Bank Account:</span>
                      <RedactedText value={ent.metadata.bankAccount} type="bank" />
                    </div>
                  )}

                  {ent.metadata.cryptoWallet && (
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 uppercase block font-mono">Crypto Address:</span>
                      <RedactedText value={ent.metadata.cryptoWallet} type="crypto" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
