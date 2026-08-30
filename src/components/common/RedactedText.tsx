'use client';

import React from 'react';
import { useInvestigation } from '@/context/InvestigationContext';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

interface RedactedTextProps {
  value?: string;
  type?: 'phone' | 'taxId' | 'bank' | 'crypto' | 'email' | 'generic';
  className?: string;
}

export function RedactedText({ value, type = 'generic', className = '' }: RedactedTextProps) {
  const { isRedactionEnabled } = useInvestigation();

  if (!value) return <span className="text-slate-500 italic">Not available</span>;

  if (!isRedactionEnabled) {
    return (
      <span className={`inline-flex items-center gap-1 font-mono ${className}`}>
        {value}
        <span className="text-[10px] text-amber-400/80 bg-amber-500/10 px-1 py-0.2 rounded border border-amber-500/20" title="Unredacted (Authorized View)">
          UNMASKED
        </span>
      </span>
    );
  }

  // Masking logic
  let masked = value;
  if (type === 'phone' || value.startsWith('+91')) {
    masked = value.length > 7 ? `${value.slice(0, 7)} •••••` : '••••••••••';
  } else if (type === 'taxId' || /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value)) {
    masked = value.length >= 8 ? `${value.slice(0, 3)}•••••${value.slice(-2)}` : '••••••••';
  } else if (type === 'bank' || value.includes('-')) {
    const parts = value.split('-');
    masked = parts.length > 1 ? `${parts[0]}-••••••••` : `${value.slice(0, 4)}••••`;
  } else if (type === 'crypto' || value.startsWith('0x')) {
    masked = value.length > 10 ? `${value.slice(0, 6)}••••••••${value.slice(-4)}` : '0x••••••••';
  } else if (type === 'email' || value.includes('@')) {
    const [name, domain] = value.split('@');
    masked = `${name.slice(0, 2)}••••@${domain}`;
  } else {
    masked = value.length > 6 ? `${value.slice(0, 3)}••••${value.slice(-2)}` : '••••••';
  }

  return (
    <span className={`inline-flex items-center gap-1 font-mono text-slate-300 ${className}`} title="Masked by Privacy & Redaction Shield">
      <span className="bg-obsidian-950 px-1.5 py-0.5 rounded border border-obsidian-700 text-teal-300/90 text-xs">
        {masked}
      </span>
      <ShieldCheck className="w-3 h-3 text-teal-400 shrink-0" />
    </span>
  );
}
