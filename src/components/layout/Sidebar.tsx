'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useInvestigation } from '@/context/InvestigationContext';
import { 
  LayoutDashboard, 
  Briefcase, 
  Share2, 
  Clock, 
  MapPin, 
  Sparkles, 
  Users, 
  AlertTriangle, 
  Network, 
  BarChart3, 
  FileSpreadsheet, 
  FileSearch, 
  Link2, 
  Dna, 
  CheckCircle2, 
  Database, 
  Vault, 
  FileText, 
  History, 
  UserCheck, 
  ShieldCheck, 
  Settings, 
  PlayCircle, 
  RefreshCw, 
  Maximize2,
  Cpu,
  ChevronDown,
  Layers
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
  highlight?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const { 
    activeCase, 
    cases, 
    loadScenario, 
    resetDemoData, 
    startJudgeMode, 
    isJudgeModeActive,
    aiFindings,
    matchCandidates
  } = useInvestigation();

  const [isScenarioDropdownOpen, setIsScenarioDropdownOpen] = useState(false);

  const pendingAnomaliesCount = aiFindings.filter(f => f.reviewStatus === 'NEEDS_REVIEW').length;
  const pendingMatchesCount = matchCandidates.filter(m => m.status === 'PENDING_HUMAN_REVIEW').length;

  const navSections: NavSection[] = [
    {
      title: 'COMMAND CENTER',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'INVESTIGATION',
      items: [
        { label: 'Cases', href: '/cases', icon: Briefcase },
        { label: 'Network Graph', href: '/graph', icon: Share2 },
        { label: 'Timeline', href: '/timeline', icon: Clock },
        { label: 'Geo Intelligence', href: '/geo-intelligence', icon: MapPin },
        { label: 'Focus Mode', href: '/graph?focus=true', icon: Maximize2 }
      ]
    },
    {
      title: 'AI & ANALYTICS',
      items: [
        { label: 'AI Copilot', href: '/ai-copilot', icon: Sparkles },
        { label: 'Entity Resolution', href: '/entity-resolution', icon: Users, badge: pendingMatchesCount > 0 ? `${pendingMatchesCount}` : undefined },
        { label: 'Anomaly Detection', href: '/anomaly-detection', icon: AlertTriangle, badge: pendingAnomaliesCount > 0 ? `${pendingAnomaliesCount}` : undefined, badgeColor: 'bg-amber-500/20 text-amber-300' },
        { label: 'Hidden Bridges', href: '/hidden-bridges', icon: Network },
        { label: 'Network Analytics', href: '/analytics', icon: BarChart3 }
      ]
    },
    {
      title: 'RECORD INTELLIGENCE',
      items: [
        { label: 'Record Manager', href: '/records', icon: FileSpreadsheet },
        { label: 'Document Intelligence', href: '/document-intelligence', icon: FileSearch },
        { label: 'Related Cases', href: '/related-cases', icon: Link2 },
        { label: 'Case DNA', href: '/case-dna', icon: Dna, highlight: true },
        { label: 'Record Quality', href: '/record-quality', icon: CheckCircle2 }
      ]
    },
    {
      title: 'DATA & EVIDENCE',
      items: [
        { label: 'Data Sources', href: '/data-sources', icon: Database },
        { label: 'Evidence Vault', href: '/evidence-vault', icon: Vault },
        { label: 'Reports', href: '/reports', icon: FileText },
        { label: 'Audit Trail', href: '/audit-trail', icon: History }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Users & Roles', href: '/users-roles', icon: UserCheck },
        { label: 'Privacy & Security', href: '/privacy-redaction', icon: ShieldCheck },
        { label: 'Architecture', href: '/architecture', icon: Cpu },
        { label: 'Settings', href: '/settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-obsidian-850 border-r border-obsidian-700 flex flex-col h-screen shrink-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-4 border-b border-obsidian-700 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-teal-800 flex items-center justify-center shadow-glow-teal">
            <Share2 className="w-5 h-5 text-obsidian-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-base font-extrabold tracking-wider text-slate-100 group-hover:text-teal-400 transition-colors">
                SYNAPX
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                v2.6
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-tight">Records → Relations → Intelligence</p>
          </div>
        </Link>
      </div>

      {/* Active Case Selector Quick Badge */}
      <div className="px-3 pt-3 pb-1">
        <div className="relative">
          <button
            onClick={() => setIsScenarioDropdownOpen(!isScenarioDropdownOpen)}
            className="w-full text-left p-2 rounded-md bg-obsidian-900 border border-obsidian-700 hover:border-teal-600/50 transition-all flex items-center justify-between group"
          >
            <div className="truncate mr-1">
              <div className="text-[10px] font-mono uppercase text-teal-400 tracking-wider">Active Investigation</div>
              <div className="text-xs font-semibold text-slate-200 truncate group-hover:text-teal-300">
                {activeCase.title.split(':')[0]}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-400 shrink-0" />
          </button>

          {isScenarioDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-obsidian-800 border border-obsidian-700 rounded-md shadow-xl z-50 py-1 max-h-56 overflow-y-auto">
              <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider">Switch Investigation Scenario</div>
              {cases.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    loadScenario(c.id);
                    setIsScenarioDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs transition-colors flex flex-col ${
                    activeCase.id === c.id ? 'bg-teal-500/15 text-teal-300 font-semibold' : 'text-slate-300 hover:bg-obsidian-700'
                  }`}
                >
                  <span className="truncate">{c.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{c.caseNumber} • {c.priority}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-0.5">
            <div className="px-2.5 py-1 text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
              {section.title}
            </div>
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                      : item.highlight
                      ? 'text-amber-300 hover:bg-amber-500/10 hover:text-amber-200'
                      : 'text-slate-300 hover:bg-obsidian-750 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${item.badgeColor || 'bg-teal-500/20 text-teal-300'}`}>
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !item.badge && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      DNA
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Actions: Judge Mode & Demo Generator */}
      <div className="p-3 border-t border-obsidian-700 space-y-2 bg-obsidian-900/50">
        <button
          onClick={startJudgeMode}
          className={`w-full py-2 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            isJudgeModeActive
              ? 'bg-amber-500 text-obsidian-950 shadow-glow-amber'
              : 'bg-gradient-to-r from-amber-500/20 to-amber-600/30 border border-amber-500/50 text-amber-300 hover:bg-amber-500 hover:text-obsidian-950 hover:shadow-glow-amber'
          }`}
        >
          <PlayCircle className="w-4 h-4 animate-pulse" />
          <span>JUDGE DEMO MODE</span>
        </button>

        <button
          onClick={resetDemoData}
          className="w-full py-1.5 px-3 rounded-md text-xs font-medium text-slate-400 hover:text-slate-200 bg-obsidian-800 hover:bg-obsidian-750 border border-obsidian-700 flex items-center justify-center gap-1.5 transition-colors"
          title="Reset all synthetic entities, links and logs to clean benchmark baseline"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Demo Investigation</span>
        </button>
      </div>
    </aside>
  );
}
