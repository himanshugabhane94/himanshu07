'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useInvestigation } from '@/context/InvestigationContext';
import { 
  Database, 
  CheckCircle2, 
  Activity, 
  RefreshCw, 
  Server, 
  ShieldCheck, 
  Link2, 
  Lock,
  ArrowRight
} from 'lucide-react';

export default function DataSourcesPage() {
  const sources = [
    {
      name: 'Ministry of Corporate Affairs (MCA21 Portal)',
      type: 'REST API / XBRL XML Feed',
      status: 'OPERATIONAL',
      recordsSynced: '14,280 Filings',
      latency: '24ms',
      description: 'Ingests Articles of Association, Form ADT-1 Auditor filings, and annual shareholding patterns.',
      color: 'text-teal-400'
    },
    {
      name: 'ICEGATE Customs Electronic Data Interchange (EDI)',
      type: 'SFTP Automated Manifest Stream',
      status: 'OPERATIONAL',
      recordsSynced: '42,190 Manifests',
      latency: '38ms',
      description: 'Continuous ingest of Bill of Entry declarations, Container weight sheets, and CHA broker filings.',
      color: 'text-amber-400'
    },
    {
      name: 'Financial Intelligence Unit (FIU-IND STR Gateway)',
      type: 'Encrypted HL7 / XML Financial Feed',
      status: 'OPERATIONAL',
      recordsSynced: '1,420 Suspicious Wires',
      latency: '18ms',
      description: 'Real-time ingestion of Red Flag Alerts, structured threshold transactions, and high-frequency remittances.',
      color: 'text-cyan-400'
    },
    {
      name: 'Indian Cyber Crime Coordination Centre (I4C)',
      type: 'Kafka Telemetry Cluster',
      status: 'OPERATIONAL',
      recordsSynced: '8,900 Proxy Logs',
      latency: '12ms',
      description: 'Tor exit relay telemetry, SIM-box IMEI registrations, and compromised UPI beneficiary accounts.',
      color: 'text-purple-400'
    },
    {
      name: 'Telecom CDR / IPDR Ingestion Gateway',
      type: 'Subpoena Automation Stream',
      status: 'STANDBY',
      recordsSynced: '128,000 Tower Dumps',
      latency: '45ms',
      description: 'Correlates cell tower handoffs, VoIP session overlaps, and international roaming records.',
      color: 'text-yellow-400'
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-obsidian-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-teal-500/20 text-teal-400">
                <Database className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-slate-100">
                Data Sources & Ingestion Connectors
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Real-time telemetry and API connectivity across inter-agency regulatory repositories.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>5 Data Pipelines Healthy</span>
            </span>
          </div>
        </div>

        {/* Data Connectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sources.map((src, idx) => (
            <div
              key={idx}
              className="synapx-card p-5 bg-obsidian-850 border border-obsidian-700 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400">{src.type}</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    {src.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-100">{src.name}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{src.description}</p>
              </div>

              <div className="pt-3 border-t border-obsidian-750 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Ingested: <strong className="text-slate-200">{src.recordsSynced}</strong></span>
                <span>Latency: <strong className="text-teal-400">{src.latency}</strong></span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </AppLayout>
  );
}
