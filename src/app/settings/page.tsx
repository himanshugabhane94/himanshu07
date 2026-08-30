'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useInvestigation } from '@/context/InvestigationContext';
import { 
  Settings, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  EyeOff, 
  Key, 
  Sliders
} from 'lucide-react';

export default function SettingsPage() {
  const { resetDemoData, isRedactionEnabled, toggleRedaction, activeCase } = useInvestigation();
  const [minConfidence, setMinConfidence] = useState<number>(75);
  const [enforceHumanInLoop, setEnforceHumanInLoop] = useState<boolean>(true);
  const [autoRedactPii, setAutoRedactPii] = useState<boolean>(true);

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-obsidian-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-teal-500/20 text-teal-400">
                <Settings className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-slate-100">
                System Configuration & AI Trust Guardrails
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Parameters governing AI confidence thresholds, decision-support guardrails, and data privacy enforcement.
            </p>
          </div>

          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300">
            SIH26189 Policy: Active
          </span>
        </div>

        {/* AI Safety & Trust Guardrails */}
        <div className="synapx-card p-6 bg-obsidian-850 space-y-6 border border-obsidian-700">
          <div className="flex items-center gap-2 pb-3 border-b border-obsidian-700">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-mono font-bold uppercase text-slate-100">
              AI Decision-Support & Safety Guardrails
            </h3>
          </div>

          {/* Min Confidence Threshold Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold">Minimum Confidence Threshold for AI Finding Alerts:</span>
              <strong className="text-teal-400">{minConfidence}%</strong>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={minConfidence}
              onChange={(e) => setMinConfidence(parseInt(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer h-2 bg-obsidian-950 rounded-lg"
            />
            <p className="text-[11px] text-slate-400">
              Hypotheses with confidence below {minConfidence}% will be suppressed from the primary alert feed to minimize investigator cognitive fatigue.
            </p>
          </div>

          {/* Toggle 1: Enforce Human in the loop */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-obsidian-900 border border-obsidian-750">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Enforce Mandatory Human Investigator Confirmation</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Disallows automatic merging of candidate duplicate entities or records without officer approval.
              </p>
            </div>
            <input
              type="checkbox"
              checked={enforceHumanInLoop}
              onChange={(e) => setEnforceHumanInLoop(e.target.checked)}
              className="rounded bg-obsidian-950 border-obsidian-700 text-teal-500 w-4 h-4"
            />
          </div>

          {/* Toggle 2: Data Redaction */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-obsidian-900 border border-obsidian-750">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                <span>Automatic PII Redaction Shield</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Masks phone numbers, Aadhaar, PAN, and bank accounts by default.
              </p>
            </div>
            <input
              type="checkbox"
              checked={isRedactionEnabled}
              onChange={toggleRedaction}
              className="rounded bg-obsidian-950 border-obsidian-700 text-teal-500 w-4 h-4"
            />
          </div>
        </div>

        {/* Demo Data Reset */}
        <div className="synapx-card p-6 bg-obsidian-850 space-y-4 border border-red-500/30">
          <div className="flex items-center gap-2 pb-2 border-b border-obsidian-700 text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-sm font-mono font-bold uppercase">Reset Demonstration Workspace</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Resets all entities, relationships, OCR extractions, and timeline events back to their initial benchmark state.
          </p>
          <button
            onClick={() => {
              resetDemoData();
              alert('Investigation workspace reset to pristine synthetic demonstration baseline.');
            }}
            className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs border border-red-500/40 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo Investigation Data</span>
          </button>
        </div>

      </div>
    </AppLayout>
  );
}
