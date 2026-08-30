'use client';

import React from 'react';
import { VerificationStatus, EntityType, CasePriority, CaseStatus } from '@/types/synapx';
import { ShieldCheck, AlertCircle, Clock, Copy, User, Building, Calendar, MapPin, Hash, FileText } from 'lucide-react';

interface ProvenanceBadgeProps {
  source?: string;
  timestamp?: string;
  verificationStatus: VerificationStatus;
  confidenceScore?: number;
  className?: string;
}

export function ProvenanceBadge({
  source,
  timestamp,
  verificationStatus,
  confidenceScore,
  className = ''
}: ProvenanceBadgeProps) {
  const getStatusDisplay = () => {
    switch (verificationStatus) {
      case 'VERIFIED':
        return {
          icon: <ShieldCheck className="w-3 h-3 text-emerald-400" />,
          label: 'Human Verified',
          classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        };
      case 'NEEDS_REVIEW':
        return {
          icon: <AlertCircle className="w-3 h-3 text-amber-400" />,
          label: 'Needs Review',
          classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        };
      case 'DUPLICATE_CANDIDATE':
        return {
          icon: <Copy className="w-3 h-3 text-purple-400" />,
          label: 'Duplicate Candidate',
          classes: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
        };
      default:
        return {
          icon: <Clock className="w-3 h-3 text-slate-400" />,
          label: 'Unverified Source',
          classes: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
        };
    }
  };

  const status = getStatusDisplay();

  return (
    <div className={`inline-flex items-center gap-2 flex-wrap text-xs ${className}`}>
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-medium ${status.classes}`}>
        {status.icon}
        {status.label}
      </span>
      {confidenceScore !== undefined && (
        <span className="text-[11px] font-mono text-slate-400 bg-obsidian-950 px-1.5 py-0.5 rounded border border-obsidian-700">
          Confidence: <strong className="text-teal-400">{confidenceScore}%</strong>
        </span>
      )}
      {source && (
        <span className="text-[11px] text-slate-400 truncate max-w-[200px]" title={source}>
          Src: {source}
        </span>
      )}
    </div>
  );
}

export function EntityTypeBadge({ type }: { type: EntityType }) {
  const getBadgeConfig = () => {
    switch (type) {
      case 'PERSON':
        return { icon: <User className="w-3 h-3" />, label: 'Person', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' };
      case 'ORGANIZATION':
        return { icon: <Building className="w-3 h-3" />, label: 'Organization', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'EVENT':
        return { icon: <Calendar className="w-3 h-3" />, label: 'Event', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };
      case 'LOCATION':
        return { icon: <MapPin className="w-3 h-3" />, label: 'Location', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' };
      case 'DIGITAL_ENTITY':
        return { icon: <Hash className="w-3 h-3" />, label: 'Digital Entity', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
      case 'DOCUMENT':
        return { icon: <FileText className="w-3 h-3" />, label: 'Document', color: 'bg-slate-500/10 text-slate-300 border-slate-500/20' };
      default:
        return { icon: <Hash className="w-3 h-3" />, label: type, color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
    }
  };

  const config = getBadgeConfig();
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: CasePriority }) {
  switch (priority) {
    case 'CRITICAL':
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30 animate-pulse">CRITICAL</span>;
    case 'HIGH':
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">HIGH</span>;
    case 'MEDIUM':
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/30">MEDIUM</span>;
    case 'LOW':
    default:
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/30">LOW</span>;
  }
}

export function StatusBadge({ status }: { status: CaseStatus }) {
  switch (status) {
    case 'VERIFIED':
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">VERIFIED</span>;
    case 'UNDER_REVIEW':
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">UNDER REVIEW</span>;
    case 'OPEN':
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-500/10 text-teal-400 border border-teal-500/20">OPEN</span>;
    case 'ARCHIVED':
    default:
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">ARCHIVED</span>;
  }
}
