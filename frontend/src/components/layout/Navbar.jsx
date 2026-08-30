import React, { useState } from 'react';
import { 
  Network, Cpu, FileText, Database, 
  Sparkles, AlertTriangle, CheckCircle2, 
  ChevronDown, Layers, Binary,
  GitPullRequest, Bell, UserCheck, LogOut
} from 'lucide-react';
import SutraEmblem from './SutraEmblem';

export default function Navbar({
  activeTab,
  setActiveTab,
  cases,
  selectedCaseId,
  onSelectCase,
  currentUser,
  onSwitchRole,
  onLogout,
  blockchainValid,
  onOpenScenarios,
  onOpenReport,
  onOpenHandover,
  onOpenIntegrityModal,
  crossCaseAlertsCount = 5,
  stats
}) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showCaseMenu, setShowCaseMenu] = useState(false);

  const selectedCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  const navItems = [
    { id: 'graph', label: 'Graph Canvas', icon: Network },
    { id: 'analytics', label: 'AI Analytics Lab', icon: Cpu, badge: 'ML' },
    { id: 'crosscase', label: 'Cross-Case Linker', icon: GitPullRequest, badge: 'Inter-State' },
    { id: 'ingestion', label: 'NLP & Ingestion', icon: Binary },
    { id: 'blockchain', label: 'Blockchain Vault', icon: Database, badge: 'Sec 65B' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0f0e0d]/95 backdrop-blur-md border-b border-[#3a352d] shadow-dossier">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Title — SUTRA Federal Archive Branding */}
          <div className="flex items-center gap-3.5">
            <div className="flex items-center justify-center p-1 rounded-xl bg-[#1c1a17] border border-[#3a352d]">
              <SutraEmblem size={34} />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-wider font-cinzel text-[#ece7de]">
                  SUTRA
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 font-bold tracking-widest uppercase bg-[#1c1a17] text-[#f5c074] border border-[#d68a1f]/40 rounded">
                  MHA SIH26189
                </span>
              </div>
              <p className="text-[11px] text-[#8a8478] tracking-tight hidden sm:block font-serif italic">
                Federal Criminal Network Analytics & Judicial Chain-of-Custody System
              </p>
            </div>
          </div>

          {/* Active Case Selector */}
          <div className="relative">
            <button
              onClick={() => setShowCaseMenu(!showCaseMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1c1a17] border border-[#3a352d] hover:border-[#d68a1f]/60 text-xs text-[#ece7de] transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-[#d68a1f]" />
              <div className="text-left max-w-[180px] sm:max-w-[260px] truncate">
                <span className="font-mono text-[#f5c074] font-semibold">{selectedCase?.fir_number || 'All Cases'}</span>
                <span className="hidden md:inline text-[#8a8478] text-[11px]"> — {selectedCase?.title}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#8a8478] ml-1" />
            </button>

            {showCaseMenu && (
              <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-[#1c1a17] border border-[#3a352d] shadow-2xl z-50 p-2 space-y-1 shadow-dossier">
                <div className="px-2 py-1 text-[10px] font-bold text-[#8a8478] uppercase tracking-wider font-mono">
                  Active Criminal Investigations
                </div>
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
            )}
          </div>

          {/* Navigation Tabs (Underline + Saffron accent, no glowing pill) */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#1c1a17] p-1 rounded-2xl border border-[#3a352d]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-[#24211d] text-[#f5c074] border border-[#d68a1f]/50 font-bold'
                      : 'text-[#8a8478] hover:text-[#ece7de] hover:bg-[#24211d]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#d68a1f]' : 'text-[#8a8478]'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                      isActive 
                        ? 'bg-[#0f0e0d] text-[#f5c074] border border-[#d68a1f]/40' 
                        : 'bg-[#0f0e0d] text-[#8a8478] border border-[#3a352d]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#d68a1f] rounded-full"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Bell, Scenarios, Audit Badge, Handover, Dossier, Persona */}
          <div className="flex items-center gap-2">
            
            {/* Inter-State Alerts Notification Bell */}
            <button
              onClick={() => setActiveTab('crosscase')}
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

            {/* 1-Click Demo Scenarios Button for Judges */}
            <button
              onClick={onOpenScenarios}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1c1a17] border border-[#d68a1f]/40 hover:border-[#d68a1f] text-[#f5c074] text-xs font-bold transition-all active:scale-95"
              title="Quick Pre-built Scenarios for SIH Judges"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d68a1f]" />
              <span className="hidden sm:inline">Judge Scenarios</span>
            </button>

            {/* Blockchain Evidence Integrity Ledger Status Badge */}
            <button
              onClick={onOpenIntegrityModal}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all active:scale-95 ${
                blockchainValid
                  ? 'bg-[#1c1a17] text-[#8eb38e] border-[#5c7a5c]/60 hover:bg-[#24211d]'
                  : 'bg-[#1c1a17] text-[#e27d75] border-[#a5342a] hover:bg-[#24211d] animate-pulse'
              }`}
              title="Click to Run Real-Time Cryptographic System Audit (Sec 65B)"
            >
              {blockchainValid ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5c7a5c]" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-[#a5342a]" />
              )}
              <span className="hidden sm:inline">
                {blockchainValid ? 'Audit: Verified' : 'Audit: Tampered'}
              </span>
            </button>

            {/* Case Handover Briefing Modal Button */}
            <button
              onClick={onOpenHandover}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1c1a17] border border-[#3a352d] hover:border-[#d68a1f]/50 text-[#ece7de] text-xs font-semibold transition-all hover:bg-[#24211d]"
              title="Generate Officer Transfer & Case Handover Briefing"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#d68a1f]" />
              <span className="hidden md:inline">Handover Briefing</span>
            </button>

            {/* Legal Dossier Modal Button */}
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1c1a17] border border-[#3a352d] hover:border-[#d68a1f]/50 text-[#ece7de] text-xs font-semibold transition-all hover:bg-[#24211d]"
              title="Export Court-Admissible Dossier"
            >
              <FileText className="w-3.5 h-3.5 text-[#d68a1f]" />
              <span className="hidden sm:inline">Court Dossier</span>
            </button>

            {/* User Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#1c1a17] border border-[#3a352d] hover:border-[#8a8478] text-xs text-[#ece7de]"
              >
                <div className="w-6 h-6 rounded-full bg-[#d68a1f] flex items-center justify-center text-[10px] font-bold text-[#0f0e0d] uppercase">
                  {currentUser?.role?.[0] || 'I'}
                </div>
                <div className="text-left hidden xl:block">
                  <div className="font-bold leading-tight text-[#ece7de]">{currentUser?.full_name?.split(' ')[1] || 'Mehra'}</div>
                  <div className="text-[10px] text-[#d68a1f] font-mono">{currentUser?.role || 'Investigator'}</div>
                </div>
                <ChevronDown className="w-3 h-3 text-[#8a8478]" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#1c1a17] border border-[#3a352d] shadow-2xl z-50 p-2 space-y-1 shadow-dossier">
                  <div className="px-2 py-1 text-[10px] font-bold text-[#8a8478] uppercase tracking-wider font-mono">
                    Switch Active RBAC Persona
                  </div>
                  {[
                    { role: 'Investigator', name: 'Insp. Rajesh Mehra', badge: 'MHA-SP-8821', desc: 'Full Search & Ingestion' },
                    { role: 'Analyst', name: 'Pooja Iyer (Read-Only)', badge: 'MHA-AN-4402', desc: 'AI Graph & Link Models' },
                    { role: 'Admin', name: 'DIG Vikramaditya Singh', badge: 'MHA-HQ-0012', desc: 'Master Authority & Audit' }
                  ].map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        onSwitchRole(r.role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs transition-all ${
                        currentUser?.role === r.role
                          ? 'bg-[#24211d] border border-[#d68a1f]/40 text-[#f5c074] font-semibold'
                          : 'hover:bg-[#24211d] text-[#ece7de]'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{r.role}</span>
                        <span className="text-[9px] font-mono text-[#8a8478]">{r.badge}</span>
                      </div>
                      <div className="text-[10px] text-[#8a8478]">{r.name}</div>
                    </button>
                  ))}

                  {/* Log Out Option */}
                  {onLogout && (
                    <div className="pt-1.5 mt-1 border-t border-[#3a352d]">
                      <button
                        onClick={() => {
                          setShowRoleMenu(false);
                          onLogout();
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs transition-all text-[#e27d75] hover:bg-[#a5342a]/20 flex items-center gap-1.5 font-bold font-mono"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out / Lock Session</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
