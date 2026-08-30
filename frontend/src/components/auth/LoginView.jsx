import React, { useState } from 'react';
import { 
  Shield, Lock, Key, UserCheck, ArrowRight, 
  Sparkles, CheckCircle2, AlertTriangle, Eye, 
  Layers, Landmark, FileText, Cpu, LogIn
} from 'lucide-react';
import SutraEmblem from '../layout/SutraEmblem';

export default function LoginView({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('Investigator');
  const [username, setUsername] = useState('rajesh.mehra');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const personas = [
    {
      id: 'investigator',
      role: 'Investigator',
      name: 'Inspector Rajesh Kumar (Mehra)',
      badge: 'MHA-SP-8821',
      agency: 'MHA Special Cyber & Financial Crimes Cell',
      designation: 'Lead Investigating Officer',
      badgeClass: 'seal-badge-high',
      badgeText: 'Full Operational Clearance',
      description: 'Full investigation rights: Ingest CDR/FIR data, commit knowledge graph entities, edit evidence, and export Section 65B dossiers.',
      capabilities: [
        'Full Graph Ingestion & Manual Entity Commit',
        'Blockchain Evidence Ledger Writing',
        'Case Handover Dossier Generation',
        'Direct Wiretap & Suspect Triangulation'
      ],
      defaultUser: {
        id: "USR-INV-001",
        username: "rajesh.mehra",
        full_name: "Inspector Rajesh Kumar (Mehra)",
        role: "Investigator",
        badge_number: "MHA-SP-8821",
        agency: "Ministry of Home Affairs — Special Cyber & Crime Cell"
      }
    },
    {
      id: 'supervisor',
      role: 'Admin',
      name: 'DIG Vikramaditya Singh',
      badge: 'MHA-HQ-0012',
      agency: 'National Investigation Agency (NIA) / MHA HQ',
      designation: 'Supervisory Officer / Director',
      badgeClass: 'seal-badge-critical',
      badgeText: 'Executive & Supervisory Clearance',
      description: 'Executive oversight & statutory command: Case re-assignment, tamper simulation audit, consensus recovery, and inter-state liaison approval.',
      capabilities: [
        'All Investigator Capabilities Included',
        'Blockchain Consensus Restoration & Tamper Auditing',
        'Multi-State Case Transfer Approval',
        'System Integrity Diagnostic Override'
      ],
      defaultUser: {
        id: "USR-ADM-001",
        username: "vikram.singh",
        full_name: "DIG Vikramaditya Singh",
        role: "Admin",
        badge_number: "MHA-HQ-0012",
        agency: "National Investigation Agency (NIA) / MHA Special Task Force"
      }
    },
    {
      id: 'analyst',
      role: 'Analyst',
      name: 'Pooja Iyer (Dr. Ananya Sen)',
      badge: 'MHA-AN-4402',
      agency: 'Financial Intelligence Unit (FIU-IND)',
      designation: 'Senior Intelligence Analyst (Read-Only)',
      badgeClass: 'seal-badge-medium',
      badgeText: 'Read-Only Intelligence Clearance',
      description: 'Read-only intelligence analysis: Explore knowledge graph, run PageRank & community detection, and query NL AI. (Evidence modification is disabled).',
      capabilities: [
        'Graph Exploration & Natural Language Search',
        'AI Centrality & Louvain Gang Detection',
        'Link Prediction & Shortest Path Reasoning',
        '🔒 Read-Only (Cannot Commit Nodes or Alter Ledger)'
      ],
      defaultUser: {
        id: "USR-ANA-001",
        username: "pooja.iyer",
        full_name: "Pooja Iyer (Senior Analyst)",
        role: "Analyst",
        badge_number: "MHA-AN-4402",
        agency: "Financial Intelligence Unit (FIU-IND)"
      }
    }
  ];

  const handleSelectPersona = (p) => {
    setSelectedRole(p.role);
    setUsername(p.defaultUser.username);
  };

  const handlePersonaDirectLogin = (p) => {
    setLoading(true);
    setTimeout(() => {
      onLogin(p.defaultUser);
      setLoading(false);
    }, 300);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const activePersona = personas.find(p => p.role === selectedRole) || personas[0];
    setTimeout(() => {
      onLogin(activePersona.defaultUser);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#0f0e0d] bg-dossier-grid text-[#ece7de] flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans select-none antialiased relative">
      
      {/* Top Sovereign Clearance Header */}
      <header className="max-w-6xl w-full mx-auto flex flex-wrap items-center justify-between gap-4 py-3 border-b border-[#3a352d]">
        <div className="flex items-center gap-3">
          <SutraEmblem size={38} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-wider font-cinzel text-[#ece7de]">
                SUTRA
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 font-bold uppercase bg-[#1c1a17] text-[#f5c074] border border-[#d68a1f]/40 rounded">
                MHA SIH26189
              </span>
            </div>
            <p className="text-[11px] text-[#8a8478] font-serif italic">
              Ministry of Home Affairs • Sovereign Criminal Network & Case Intelligence System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#8a8478]">
          <Shield className="w-3.5 h-3.5 text-[#d68a1f]" />
          <span>RBAC LEVEL-4 GRID</span>
          <span className="text-[#3a352d]">|</span>
          <span className="text-[#5c7a5c] font-bold">SECURE CHANNEL</span>
        </div>
      </header>

      {/* Main Authentication Area */}
      <main className="max-w-6xl w-full mx-auto my-6 sm:my-10 space-y-8">
        
        {/* Banner Notice */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1a17] border border-[#3a352d] text-[#f5c074] text-xs font-mono">
            <Lock className="w-3.5 h-3.5 text-[#d68a1f]" />
            <span>ROLE-BASED ACCESS CONTROL (RBAC) PORTAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#ece7de] font-serif">
            Select Your Authorized Investigative Persona
          </h1>
          <p className="text-xs sm:text-sm text-[#8a8478] font-serif">
            Demonstrate multi-tier security clearances in SUTRA. Choose a role below for instant authentication.
          </p>
        </div>

        {/* 3 Pre-Configured Persona Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {personas.map((p) => {
            const isSelected = selectedRole === p.role;
            return (
              <div
                key={p.id}
                onClick={() => handleSelectPersona(p)}
                className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 shadow-dossier relative group ${
                  isSelected
                    ? 'bg-[#1c1a17] border-[#d68a1f] shadow-dossier'
                    : 'bg-[#141311] hover:bg-[#1c1a17]/80 border-[#3a352d] hover:border-[#8a8478]'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badge */}
                  <div className="flex items-center justify-between">
                    <span className={p.badgeClass}>
                      {p.role}
                    </span>
                    <span className="text-[10px] font-mono text-[#8a8478]">{p.badge}</span>
                  </div>

                  {/* Officer Name & Designation */}
                  <div>
                    <h3 className="font-bold text-base text-[#ece7de] font-serif group-hover:text-[#f5c074] transition-colors">
                      {p.name}
                    </h3>
                    <div className="text-xs text-[#8a8478] font-mono mt-0.5">{p.designation}</div>
                    <div className="text-[10px] text-[#666157] font-serif italic mt-0.5">{p.agency}</div>
                  </div>

                  <p className="text-xs text-[#8a8478] font-serif leading-relaxed pt-1 border-t border-[#2a2620]">
                    {p.description}
                  </p>

                  {/* Capability Checklist */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] font-mono font-bold text-[#d68a1f] uppercase tracking-wider">
                      Role Permissions:
                    </div>
                    {p.capabilities.map((cap, cIdx) => (
                      <div key={cIdx} className="flex items-start gap-1.5 text-[11px] text-[#ece7de] font-mono">
                        <CheckCircle2 className={`w-3 h-3 shrink-0 mt-0.5 ${cap.includes('🔒') ? 'text-[#a5342a]' : 'text-[#5c7a5c]'}`} />
                        <span className={cap.includes('🔒') ? 'text-[#e27d75] italic' : ''}>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 1-Click Login Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePersonaDirectLogin(p);
                  }}
                  disabled={loading}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 ${
                    isSelected
                      ? 'bg-[#d68a1f] hover:bg-[#e59b2d] text-[#0f0e0d]'
                      : 'bg-[#24211d] hover:bg-[#2d2924] text-[#ece7de] border border-[#3a352d]'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Enter as {p.role}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Quick Credentials Form Box */}
        <div className="max-w-md mx-auto p-5 rounded-2xl bg-[#1c1a17] border border-[#3a352d] shadow-dossier space-y-4">
          <div className="flex items-center justify-between border-b border-[#2a2620] pb-2 text-xs">
            <span className="font-bold text-[#ece7de] font-serif">Quick Credential Verification</span>
            <span className="font-mono text-[#d68a1f] text-[10px]">Active Role: {selectedRole}</span>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-3 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-[10px] text-[#8a8478] uppercase">Investigator ID / Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#0f0e0d] border border-[#3a352d] text-xs text-[#ece7de] font-mono focus:border-[#d68a1f] outline-none"
                placeholder="Username..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#8a8478] uppercase">Cryptographic Key / Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#0f0e0d] border border-[#3a352d] text-xs text-[#ece7de] font-mono focus:border-[#d68a1f] outline-none"
                placeholder="Password..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#d68a1f] hover:bg-[#e59b2d] text-[#0f0e0d] text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{loading ? 'Authenticating Clearance...' : `Authorize & Enter System`}</span>
            </button>
          </form>
        </div>

      </main>

      {/* Sovereign Legal Footer */}
      <footer className="max-w-6xl w-full mx-auto py-3 border-t border-[#3a352d] flex flex-wrap items-center justify-between gap-2 text-[11px] font-serif text-[#8a8478]">
        <div>
          Official System of the Ministry of Home Affairs • Smart India Hackathon PS SIH26189
        </div>
        <div className="font-mono text-[10px]">
          Section 65B IEA & Bharatiya Sakshya Adhiniyam 2023 Compliant
        </div>
      </footer>

    </div>
  );
}
