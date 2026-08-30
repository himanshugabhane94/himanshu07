import React from 'react';

export default function NetworkLoader({ label = "Synthesizing Sovereign Intelligence Grid...", size = "md" }) {
  const isSm = size === "sm";

  return (
    <div className="flex flex-col items-center justify-center gap-3 select-none">
      <div className={`relative ${isSm ? 'w-10 h-10' : 'w-16 h-16'}`}>
        <svg viewBox="0 0 64 64" className="w-full h-full">
          {/* Subtle connecting lines */}
          <line x1="32" y1="12" x2="16" y2="44" stroke="#4a6670" strokeWidth="1.2" className="line-flow" />
          <line x1="32" y1="12" x2="48" y2="44" stroke="#d68a1f" strokeWidth="1.2" className="line-flow" />
          <line x1="16" y1="44" x2="48" y2="44" stroke="#3a352d" strokeWidth="1.2" />
          <line x1="32" y1="12" x2="32" y2="34" stroke="#5c7a5c" strokeWidth="1.2" />
          <line x1="32" y1="34" x2="16" y2="44" stroke="#3a352d" strokeWidth="1" />
          <line x1="32" y1="34" x2="48" y2="44" stroke="#3a352d" strokeWidth="1" />

          {/* Network Nodes */}
          {/* Top Hub Node */}
          <circle cx="32" cy="12" r="4.5" fill="#1c1a17" stroke="#d68a1f" strokeWidth="1.5" className="node-pulse-1" />
          {/* Center Bridge Node */}
          <circle cx="32" cy="34" r="3.5" fill="#1c1a17" stroke="#ece7de" strokeWidth="1.2" className="node-pulse-2" />
          {/* Bottom Left Node */}
          <circle cx="16" cy="44" r="4" fill="#1c1a17" stroke="#4a6670" strokeWidth="1.5" className="node-pulse-3" />
          {/* Bottom Right Node */}
          <circle cx="48" cy="44" r="4" fill="#1c1a17" stroke="#a5342a" strokeWidth="1.5" className="node-pulse-4" />
        </svg>
      </div>

      {label && (
        <div className="flex items-center gap-2 font-mono text-xs text-[#8a8478]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#d68a1f] animate-ping"></span>
          <span>{label}</span>
        </div>
      )}
    </div>
  );
}
