import React, { useState } from 'react';
import { 
  LayoutDashboard, Network, Cpu, Fingerprint, 
  GitPullRequest, MapPin, ShieldAlert, Scale, 
  Flame, FileCheck, Binary, Database, 
  FileText, Sparkles, Activity, ChevronLeft, 
  ChevronRight, UserCheck, LogOut, ChevronDown,
  Layers, Shield, AlertTriangle
} from 'lucide-react';
import SutraEmblem from './SutraEmblem';

export default function LeftSidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  currentUser,
  onSwitchRole,
  onLogout,
  onOpenPriorityQueue,
  onOpenScenarios,
  onOpenReport,
  onOpenHandover,
  crossCaseAlertsCount = 5,
  criticalTriageCount = 3
}) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const navigationGroups = [
    {
      group: 'OVERVIEW',
      items: [
        { id: 'overview', label: 'Command Center', icon: LayoutDashboard, badge: 'Live' },
      ]
    },
    {
      group: 'INVESTIGATION',
      items: [
        { id: 'graph', label: 'Graph Canvas', icon: Network },
        { id: 'analytics', label: 'AI Analytics Lab', icon: Cpu, badge: 'ML' },
        { id: 'serial_mo', label: 'Serial MO Detector', icon: Fingerprint, badge: 'Pattern' },
        { id: 'crosscase', label: 'Cross-Case Linker', icon: GitPullRequest, badge: `${crossCaseAlertsCount} Alerts` },
        { id: 'geomap', label: 'Geo-Spatial Map', icon: MapPin, badge: 'GIS' },
      ]
    },
    {
      group: 'CASE MANAGEMENT',
      items: [
        { id: 'priority_queue', label: 'Priority Triage Queue', icon: Scale, badge: `${criticalTriageCount} Urgent`, isAction: true },
        { id: 'victim_safety', label: 'Victim Safety Network', icon: ShieldAlert, badge: 'Sec 398', isAction: true },
        { id: 'handover', label: 'Handover Briefing', icon: FileCheck, isAction: true },
      ]
    },
    {
      group: 'DATA & EVIDENCE',
      items: [
        { id: 'ingestion', label: 'NLP & Ingestion Studio', icon: Binary },
        { id: 'blockchain', label: 'Blockchain Vault', icon: Database, badge: 'Sec 65B' },
        { id: 'court_dossier', label: 'Court Dossier PDF', icon: FileText, isAction: true },
      ]
    },
    {
      group: 'SYSTEM',
      items: [
        { id: 'scenarios', label: 'Judge Scenarios', icon: Sparkles, badge: 'Demo', isAction: true },
        { id: 'activity_log', label: 'Recent Activity Feed', icon: Activity, isAction: true },
      ]
    }
  ];

  const handleItemClick = (item) => {
    if (item.id === 'priority_queue') {
      onOpenPriorityQueue?.();
    } else if (item.id === 'victim_safety') {
      setActiveTab('analytics');
    } else if (item.id === 'serial_mo') {
      setActiveTab('analytics');
    } else if (item.id === 'handover') {
      onOpenHandover?.();
    } else if (item.id === 'court_dossier') {
      onOpenReport?.();
    } else if (item.id === 'scenarios') {
      onOpenScenarios?.();
    } else if (item.id === 'activity_log') {
      setActiveTab('blockchain');
    } else {
      setActiveTab(item.id);
    }
  };

  return (
    <aside
      className={`relative h-screen bg-[#0f0e0d] border-r border-[#3a352d] flex flex-col justify-between transition-all duration-300 z-30 shadow-2xl select-none ${
        isCollapsed ? 'w-[72px]' : 'w-64 lg:w-68'
      }`}
    >
      {/* Top Branding Section */}
      <div className="p-4 border-b border-[#3a352d] flex items-center justify-between gap-2 bg-[#141210]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center p-1 rounded-xl bg-[#1c1a17] border border-[#3a352d] shrink-0">
            <SutraEmblem size={isCollapsed ? 28 : 32} />
          </div>
          
          {!isCollapsed && (
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-wider font-cinzel text-[#ece7de]">
                  SUTRA
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 font-bold uppercase bg-[#1c1a17] text-[#f5c074] border border-[#d68a1f]/40 rounded">
                  SIH26189
                </span>
              </div>
              <p className="text-[10px] text-[#8a8478] tracking-tight font-serif italic truncate">
                Federal Criminal Intelligence
              </p>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-xl bg-[#1c1a17] border border-[#3a352d] hover:border-[#d68a1f] text-[#8a8478] hover:text-[#ece7de] transition-all shrink-0"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar (Icon Only)"}
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Navigation Groups List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-thin scrollbar-thumb-[#3a352d]">
        {navigationGroups.map((grp, gIdx) => (
          <div key={gIdx} className="space-y-1">
            
            {/* Section Header */}
            {!isCollapsed ? (
              <div className="px-3 py-1 text-[10px] font-bold text-[#b5aea1] uppercase tracking-wider font-mono">
                {grp.group}
              </div>
            ) : (
              <div className="w-full h-[1px] bg-[#2a2620] my-2" />
            )}

            {/* Nav Items */}
            <div className="space-y-0.5">
              {grp.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all relative group ${
                      isActive
                        ? 'bg-[#24211d] text-[#f5c074] border-l-2 border-l-[#d68a1f] border-r border-t border-b border-[#d68a1f]/40 font-bold shadow-md'
                        : 'text-[#c8c2b7] hover:text-[#ece7de] hover:bg-[#1c1a17] border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#d68a1f]' : 'text-[#9e988c] group-hover:text-[#ece7de]'
                    }`} />

                    {!isCollapsed && (
                      <div className="flex-1 flex items-center justify-between overflow-hidden">
                        <span className="truncate text-left font-serif">{item.label}</span>
                        {item.badge && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-bold tracking-wide uppercase shrink-0 ml-1.5 border ${
                            isActive
                              ? 'bg-[#0f0e0d] text-[#f5c074] border-[#d68a1f]/50'
                              : item.id === 'priority_queue'
                              ? 'bg-[#241a18] text-[#e27d75] border-[#a5342a]/50'
                              : 'bg-[#182226] text-[#94a9b3] border-[#4a6670]/40'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Collapsed Tooltip Indicator */}
                    {isCollapsed && item.badge && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#d68a1f]" />
                    )}
                  </button>
                );
              })}
            </div>

          </div>
        ))}
      </div>

      {/* Sidebar Footer: User Persona Profile & Role Switcher */}
      <div className="p-3 border-t border-[#3a352d] bg-[#141210]">
        {!isCollapsed ? (
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-[#1c1a17] border border-[#3a352d] hover:border-[#d68a1f] transition-all text-left group"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-xl bg-[#24211d] border border-[#d68a1f]/40 flex items-center justify-center text-[#f5c074] shrink-0 font-bold font-mono text-xs">
                  {currentUser?.role ? currentUser.role[0] : 'I'}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-[#ece7de] truncate font-serif">
                    {currentUser?.full_name?.split('(')[0] || 'Investigator'}
                  </div>
                  <div className="text-[10px] text-[#8a8478] font-mono truncate">
                    {currentUser?.role} • {currentUser?.badge_number || 'SP-8821'}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#8a8478] group-hover:text-[#ece7de] shrink-0" />
            </button>

            {/* Persona Switch Menu */}
            {showRoleMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-full rounded-2xl bg-[#1c1a17] border border-[#3a352d] shadow-2xl p-2 space-y-1 shadow-dossier z-50 animate-in fade-in slide-in-from-bottom-2">
                <div className="px-2 py-1 text-[10px] font-bold text-[#8a8478] uppercase font-mono">
                  Switch Active Persona
                </div>
                {['Investigator', 'Supervisory Officer', 'Forensic Auditor', 'Public Prosecutor'].map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      onSwitchRole?.(role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      currentUser?.role === role
                        ? 'bg-[#24211d] text-[#f5c074] border border-[#d68a1f]/50 font-bold'
                        : 'text-[#8a8478] hover:text-[#ece7de] hover:bg-[#24211d]'
                    }`}
                  >
                    {role}
                  </button>
                ))}
                <div className="pt-1 border-t border-[#2a2620]">
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono text-[#e27d75] hover:bg-[#241a18] transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setIsCollapsed(false)}
              className="w-9 h-9 rounded-xl bg-[#1c1a17] border border-[#3a352d] hover:border-[#d68a1f] flex items-center justify-center text-[#f5c074] font-bold font-mono text-xs shadow-sm"
              title={`${currentUser?.full_name} (${currentUser?.role})`}
            >
              {currentUser?.role ? currentUser.role[0] : 'I'}
            </button>
          </div>
        )}
      </div>

    </aside>
  );
}
