'use client';

import React, { useState } from 'react';
import { useInvestigation } from '@/context/InvestigationContext';
import { UniversalSearchModal } from './UniversalSearchModal';
import { 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  Bell, 
  UserCheck, 
  ChevronDown, 
  Briefcase, 
  Lock,
  Layers,
  AlertTriangle,
  FileCheck2
} from 'lucide-react';
import { UserRole } from '@/types/synapx';

export function Header() {
  const { 
    currentUser, 
    switchUserRole, 
    activeCase, 
    cases, 
    loadScenario, 
    isRedactionEnabled, 
    toggleRedaction,
    toggleAiCopilot,
    aiFindings,
    matchCandidates
  } = useInvestigation();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isCaseDropdownOpen, setIsCaseDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const pendingAnomalies = aiFindings.filter(f => f.reviewStatus === 'NEEDS_REVIEW');
  const pendingMatches = matchCandidates.filter(m => m.status === 'PENDING_HUMAN_REVIEW');
  const totalNotifications = pendingAnomalies.length + pendingMatches.length;

  return (
    <>
      <header className="h-14 bg-obsidian-850 border-b border-obsidian-700 px-4 flex items-center justify-between gap-4 shrink-0 z-20 select-none">
        
        {/* Left Side: Search Bar Trigger & Case Indicator */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex-1 flex items-center justify-between px-3 py-1.5 rounded-lg bg-obsidian-900 border border-obsidian-700 hover:border-teal-500/50 text-slate-400 hover:text-slate-200 transition-all text-xs group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-teal-400 group-hover:text-teal-300" />
              <span>Universal Search across records, entities, OCR files...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-obsidian-800 rounded border border-obsidian-700">
              Ctrl K
            </kbd>
          </button>

          {/* Quick Case Switcher */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsCaseDropdownOpen(!isCaseDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-obsidian-900 border border-obsidian-700 hover:border-obsidian-600 text-xs text-slate-200 transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-mono text-[11px] text-teal-400 font-semibold">{activeCase.caseNumber}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isCaseDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-72 bg-obsidian-800 border border-obsidian-700 rounded-lg shadow-2xl py-1 z-50">
                <div className="px-3 py-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-obsidian-700">
                  Select Active Investigation
                </div>
                {cases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      loadScenario(c.id);
                      setIsCaseDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                      activeCase.id === c.id ? 'bg-teal-500/15 text-teal-300 font-semibold' : 'text-slate-300 hover:bg-obsidian-750'
                    }`}
                  >
                    <div className="truncate font-medium">{c.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                      <span>{c.caseNumber}</span>
                      <span>•</span>
                      <span className={c.priority === 'CRITICAL' ? 'text-red-400' : 'text-amber-400'}>{c.priority}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Privacy & Redaction Shield Toggle */}
          <button
            onClick={toggleRedaction}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isRedactionEnabled
                ? 'bg-teal-950/40 border-teal-600/50 text-teal-300 hover:bg-teal-950/60'
                : 'bg-amber-950/40 border-amber-600/50 text-amber-300 hover:bg-amber-950/60'
            }`}
            title={isRedactionEnabled ? 'Data Redaction Active (PII Masked)' : 'Data Unmasked (Authorized Mode)'}
          >
            {isRedactionEnabled ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline font-mono text-[11px]">PII MASKED</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline font-mono text-[11px]">UNMASKED</span>
              </>
            )}
          </button>

          {/* AI Copilot Launcher */}
          <button
            onClick={toggleAiCopilot}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-teal-500/10 to-teal-500/20 hover:from-teal-500/20 hover:to-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-semibold shadow-glow-teal transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">AI COPILOT</span>
          </button>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 rounded-lg bg-obsidian-900 hover:bg-obsidian-750 text-slate-300 hover:text-slate-100 border border-obsidian-700 relative transition-colors"
              title="Investigation Notifications"
            >
              <Bell className="w-4 h-4 text-slate-300" />
              {totalNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-obsidian-950 font-mono font-bold text-[10px] flex items-center justify-center animate-pulse">
                  {totalNotifications}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-obsidian-800 border border-obsidian-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="p-2 border-b border-obsidian-700 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-slate-200">Investigation Alerts</span>
                  <span className="text-[10px] font-mono text-teal-400">{totalNotifications} pending items</span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-obsidian-750 py-1">
                  {pendingAnomalies.map((a) => (
                    <div key={a.id} className="p-2 hover:bg-obsidian-750 rounded text-xs transition-colors">
                      <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px] mb-0.5">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span>{a.findingType}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] line-clamp-2">{a.title}</p>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">Confidence: {a.confidence}%</span>
                    </div>
                  ))}

                  {pendingMatches.map((m) => (
                    <div key={m.id} className="p-2 hover:bg-obsidian-750 rounded text-xs transition-colors">
                      <div className="flex items-center gap-1.5 text-teal-400 font-semibold text-[11px] mb-0.5">
                        <UserCheck className="w-3 h-3 shrink-0" />
                        <span>Potential Duplicate Entity</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">
                        &quot;{m.candidateEntity.name}&quot; matches &quot;{m.primaryEntity.name}&quot; ({m.matchScore}% overlap)
                      </p>
                    </div>
                  ))}

                  {totalNotifications === 0 && (
                    <div className="p-4 text-center text-xs text-slate-400">
                      <FileCheck2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                      <span>All intelligence items reviewed.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher & Persona Badge */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-obsidian-900 hover:bg-obsidian-750 border border-obsidian-700 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-teal-500 to-amber-500 flex items-center justify-center text-obsidian-950 font-bold text-xs">
                {currentUser.name[0]}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-slate-200 leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-teal-400 font-mono flex items-center gap-1">
                  <span>{currentUser.role}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-400">{currentUser.badgeId}</span>
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-obsidian-800 border border-obsidian-700 rounded-xl shadow-2xl py-1 z-50">
                <div className="px-3 py-2 border-b border-obsidian-700">
                  <div className="text-xs font-bold text-slate-100">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-400">{currentUser.agency}</div>
                  <div className="text-[9px] font-mono text-amber-400 mt-1 uppercase">{currentUser.clearanceLevel}</div>
                </div>

                <div className="p-1">
                  <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Switch User Role (RBAC Demo)
                  </div>
                  {(['ADMIN', 'INVESTIGATOR', 'ANALYST'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        switchUserRole(r);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                        currentUser.role === r ? 'bg-teal-500/20 text-teal-300 font-semibold' : 'text-slate-300 hover:bg-obsidian-750'
                      }`}
                    >
                      <span>{r}</span>
                      {currentUser.role === r && <span className="text-[10px] text-teal-400 font-mono font-bold">Active</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Universal Search Modal */}
      <UniversalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
