'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useInvestigation } from '@/context/InvestigationContext';
import { DEMO_USERS } from '@/lib/demo-data';
import { UserRole } from '@/types/synapx';
import { 
  UserCheck, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  Key, 
  Users, 
  Building,
  Sparkles
} from 'lucide-react';

export default function UsersRolesPage() {
  const { currentUser, switchUserRole } = useInvestigation();

  const permissions = [
    { module: 'Case Creation & Modification', admin: true, investigator: true, analyst: false },
    { module: 'Interactive Graph & Time Machine', admin: true, investigator: true, analyst: true },
    { module: 'Entity Resolution & Merge Approval', admin: true, investigator: true, analyst: true },
    { module: 'AI Copilot Natural Language Query', admin: true, investigator: true, analyst: true },
    { module: 'Court Dossier Report Generation', admin: true, investigator: true, analyst: false },
    { module: 'Privacy Redaction Override / Unmask', admin: true, investigator: true, analyst: false },
    { module: 'Data Source Connectors & Configuration', admin: true, investigator: false, analyst: false },
    { module: 'Immutable Audit Trail Verification', admin: true, investigator: false, analyst: false }
  ];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-obsidian-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-teal-500/20 text-teal-400">
                <UserCheck className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-slate-100">
                Users & Role-Based Access Control (RBAC)
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Tiered permissions management for Administrators, Lead Investigators, and Cyber Intelligence Analysts.
            </p>
          </div>

          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300">
            Active: <strong className="text-teal-400 font-bold">{currentUser.name} ({currentUser.role})</strong>
          </span>
        </div>

        {/* User Persona Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {DEMO_USERS.map((user) => {
            const isActive = currentUser.id === user.id;
            return (
              <div
                key={user.id}
                className={`synapx-card p-5 bg-obsidian-850 flex flex-col justify-between space-y-4 border ${
                  isActive ? 'border-teal-500/60 shadow-glow-teal ring-1 ring-teal-500' : 'border-obsidian-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono text-teal-400 font-bold">{user.badgeId}</span>
                    {isActive ? (
                      <span className="text-[10px] font-mono font-bold uppercase bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30">
                        Active Profile
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono uppercase text-slate-400">Standby</span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-100">{user.name}</h3>
                  <div className="text-xs text-amber-400 font-mono font-semibold mt-0.5">{user.role}</div>
                  <p className="text-xs text-slate-400 mt-1">{user.agency}</p>
                  
                  <div className="mt-3 p-2 rounded bg-obsidian-900 border border-obsidian-750 text-[10px] font-mono text-slate-300">
                    Clearance: <strong className="text-teal-300">{user.clearanceLevel}</strong>
                  </div>
                </div>

                <button
                  onClick={() => switchUserRole(user.role)}
                  className={`w-full py-2 rounded-lg font-bold text-xs transition-all ${
                    isActive
                      ? 'bg-teal-600 text-obsidian-950 cursor-default'
                      : 'bg-obsidian-800 hover:bg-teal-500/20 text-slate-300 hover:text-teal-300 border border-obsidian-700'
                  }`}
                >
                  {isActive ? 'Current Active Role' : `Switch to ${user.role}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Role Permissions Matrix Table */}
        <div className="synapx-card p-6 bg-obsidian-850 space-y-4">
          <div className="pb-2 border-b border-obsidian-700">
            <h3 className="text-sm font-bold text-slate-100">Role Permissions & Guardrails Matrix</h3>
            <p className="text-xs text-slate-400 mt-0.5">Defines access privileges across operational modules.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-obsidian-900 border-b border-obsidian-700 text-slate-400 font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-3">Platform Capability / Module</th>
                  <th className="p-3 text-center">ADMINISTRATOR</th>
                  <th className="p-3 text-center">INVESTIGATOR</th>
                  <th className="p-3 text-center">ANALYST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-800 text-slate-300">
                {permissions.map((perm, idx) => (
                  <tr key={idx} className="hover:bg-obsidian-800/40">
                    <td className="p-3 font-medium text-slate-200">{perm.module}</td>
                    <td className="p-3 text-center">
                      {perm.admin ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {perm.investigator ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {perm.analyst ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
                      )}
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
