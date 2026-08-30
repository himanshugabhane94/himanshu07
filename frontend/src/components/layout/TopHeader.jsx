import React, { useState } from 'react';
import { 
  Layers, ChevronDown, Bell, ShieldAlert, 
  Sparkles, CheckCircle2, AlertTriangle, 
  Flame, Scale, ShieldCheck, Database, Search
} from 'lucide-react';

export default function TopHeader({
  cases = [],
  selectedCaseId,
  onSelectCase,
  blockchainValid,
  onOpenScenarios,
  onOpenPriorityQueue,
  onOpenIntegrityModal,
  onNavigateToTab,
  crossCaseAlertsCount = 5,
  criticalTriageCount = 3
}) {
  const [showCaseMenu, setShowCaseMenu] = useState(false);

  const selectedCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  return (
    <header className="h-14 bg-[#141210] border-b border-[#3a352d] px-4 flex items-center justify-between gap-4 select-none z-20 shadow-md">
      
      {/* Left: Active Case Selector & Quick Status */}
      <div className="flex items-center gap-3">
        
        {/* Active Case Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowCaseMenu(!showCaseMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1c1a17] border border-[#3a352d] hover:border-[#d68a1f]/60 text-xs text-[#ece7de] transition-all shadow-sm group"
          >
            <Layers className="w-3.5 h-3.5 text-[#d68a1f] shrink-0" />
            <div className="text-left max-w-[200px] sm:max-w-[280px] truncate">
              <span className="font-mono text-[#f5c074] font-semibold">{selectedCase?.fir_number || 'All Cases'}</span>
              <span className="hidden md:inline text-[#8a8478] text-[11px]"> — {selectedCase?.title}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8a8478] group-hover:text-[#ece7de] ml-0.5 shrink-0" />
          </button>

          {showCaseMenu && (
            <div className="absolute left-0 mt-2 w-84 rounded-2xl bg-[#1c1a17] border border-[#3a352d] shadow-2xl z-50 p-2 space-y-1 shadow-dossier animate-in fade-in slide-in-from-top-1">
              
              {/* Priority Queue Quick Launcher */}
              <button
                onClick={() => {
                  setShowCaseMenu(false);
                  onOpenPriorityQueue?.();
                }}
                className="w-full mb-1.5 flex items-center justify-between px-3 py-2 rounded-xl bg-[#241a18] border border-[#a5342a]/60 text-xs text-[#e27d75] hover:bg-[#2e1d1a] transition-all font-mono font-bold"
              >
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#e27d75] animate-pulse" />
                  <span>View Priority Triage Queue</span>
                </span>
                <span className="text-[9px] bg-[#0f0e0d] px-1.5 py-0.5 rounded border border-[#a5342a]/40">
                  {criticalTriageCount} Urgent
                </span>
              </button>

              <div className="px-2 py-1 text-[10px] font-bold text-[#8a8478] uppercase tracking-wider font-mono">
                Active Criminal Investigations ({cases.length})
              </div>

              <div className="max-h-72 overflow-y-auto space-y-0.5 scrollbar-thin scrollbar-thumb-[#3a352d]">
                {cases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCase(c.id);
                      setShowCaseMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all ${
                      c.id === selectedCaseId
                        ? 'bg-[#24211d] border border-[#d68a1f]/50 text-[#f5c074]'
                        : 'hover:bg-[#24211d] text-[#ece7de]'
                    }`}
                  >
                    <div className="font-mono font-bold text-[#ece7de]">{c.fir_number}</div>
                    <div className="text-[11px] text-[#8a8478] truncate font-serif">{c.title}</div>
                    <div className="mt-1 flex items-center gap-1.5 font-mono text-[9px] flex-wrap">
                      <span className="px-1.5 py-0.2 bg-[#0f0e0d] text-[#d68a1f] rounded border border-[#3a352d]">
                        {c.crime_category || c.case_type || 'Crime'}
                      </span>
                      <span className="px-1.5 py-0.2 bg-[#1c1a17] text-[#8a8478] rounded border border-[#3a352d]">
                        {c.agency.split('/')[0]}
                      </span>
                      <span className="text-[#8a8478]">
                        {c.node_count || 10}+ Entities
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Case Status Badge */}
        {selectedCase && (
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-mono text-[#8a8478] bg-[#0f0e0d] border border-[#3a352d]">
            {selectedCase.status || 'Active Investigation'}
          </span>
        )}

      </div>

      {/* Right: Security & Alert Badges + Quick Tools */}
      <div className="flex items-center gap-2">
        
        {/* Blockchain Evidence Integrity Audit Badge */}
        <button
          onClick={onOpenIntegrityModal}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all active:scale-95 ${
            blockchainValid
              ? 'bg-[#152018] border-[#5c7a5c]/60 text-[#9fc49f] hover:border-[#5c7a5c]'
              : 'bg-[#241a18] border-[#a5342a]/60 text-[#e27d75] hover:border-[#a5342a]'
          }`}
          title="Section 65B Indian Evidence Act Blockchain Audit Trail"
        >
          {blockchainValid ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-[#5c7a5c] shrink-0" />
              <span className="hidden lg:inline">Sec 65B:</span>
              <span className="font-bold">Chain Valid</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-[#e27d75] shrink-0 animate-bounce" />
              <span className="font-bold">Integrity Alert!</span>
            </>
          )}
        </button>

        {/* Victim Safety Network Alert Badge */}
        <button
          onClick={() => onNavigateToTab?.('analytics')}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#241a18] border border-[#a5342a]/60 hover:border-[#e27d75] text-xs font-mono transition-all text-[#e27d75] active:scale-95"
          title="Victim Safety Network: 2 Repeat Offenders Detected"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-[#e27d75] shrink-0 animate-pulse" />
          <span className="font-bold hidden xl:inline">Victim Safety:</span>
          <span className="font-bold">2 Repeaters</span>
        </button>

        {/* Inter-State Alerts Notification Bell */}
        <button
          onClick={() => onNavigateToTab?.('crosscase')}
          className="relative p-2 rounded-xl bg-[#1c1a17] border border-[#3a352d] hover:border-[#d68a1f]/60 text-[#ece7de] transition-all"
          title="Inter-State Cross-Case Intelligence Alerts"
        >
          <Bell className="w-4 h-4 text-[#d68a1f]" />
          {crossCaseAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#a5342a] text-[9px] font-bold text-white font-mono">
              {crossCaseAlertsCount}
            </span>
          )}
        </button>

        {/* Priority Triage Queue Quick Button */}
        <button
          onClick={onOpenPriorityQueue}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1c1a17] border border-[#d68a1f]/40 hover:border-[#d68a1f] text-[#f5c074] text-xs font-bold transition-all active:scale-95"
          title="Automated Case Priority & Triage Queue"
        >
          <Flame className="w-3.5 h-3.5 text-[#e27d75] animate-pulse" />
          <span className="hidden xl:inline">Triage Queue</span>
        </button>

        {/* 1-Click Demo Scenarios Button for Judges */}
        <button
          onClick={onOpenScenarios}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#24211d] border border-[#d68a1f]/60 hover:border-[#d68a1f] text-[#f5c074] text-xs font-bold transition-all active:scale-95 shadow-sm"
          title="Flagship Demo Scenarios for SIH Judges"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#d68a1f]" />
          <span className="hidden sm:inline">Judge Scenarios</span>
        </button>

      </div>

    </header>
  );
}
