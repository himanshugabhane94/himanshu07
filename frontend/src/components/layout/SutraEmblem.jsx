import React from 'react';

export default function SutraEmblem({ className = "w-8 h-8", size }) {
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg 
      className={`${className} shrink-0`} 
      style={sizeStyle}
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Institutional Seal Rings */}
      <circle cx="24" cy="24" r="22" stroke="#d68a1f" strokeWidth="1.2" strokeOpacity="0.8" />
      <circle cx="24" cy="24" r="19.5" stroke="#3a352d" strokeWidth="0.8" strokeDasharray="2 2" />
      
      {/* Thread Connection Lines (Sutra Geometry) */}
      <line x1="24" y1="12" x2="13" y2="28" stroke="#4a6670" strokeWidth="1.2" />
      <line x1="24" y1="12" x2="35" y2="28" stroke="#4a6670" strokeWidth="1.2" />
      <line x1="13" y1="28" x2="35" y2="28" stroke="#3a352d" strokeWidth="1" />
      <line x1="24" y1="12" x2="24" y2="34" stroke="#d68a1f" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="13" y1="28" x2="24" y2="34" stroke="#3a352d" strokeWidth="1" />
      <line x1="35" y1="28" x2="24" y2="34" stroke="#3a352d" strokeWidth="1" />

      {/* Investigative Lens Motif Overlay */}
      <circle cx="24" cy="22" r="9" stroke="#ece7de" strokeWidth="1.2" strokeOpacity="0.85" fill="#1c1a17" fillOpacity="0.8" />
      <line x1="30.5" y1="28.5" x2="36" y2="34" stroke="#ece7de" strokeWidth="1.8" strokeLinecap="round" />

      {/* Sovereign Nodes (Graph Vertices) */}
      <circle cx="24" cy="12" r="2.8" fill="#1c1a17" stroke="#d68a1f" strokeWidth="1.4" />
      <circle cx="13" cy="28" r="2.8" fill="#1c1a17" stroke="#4a6670" strokeWidth="1.4" />
      <circle cx="35" cy="28" r="2.8" fill="#1c1a17" stroke="#a5342a" strokeWidth="1.4" />
      <circle cx="24" cy="34" r="2.2" fill="#1c1a17" stroke="#5c7a5c" strokeWidth="1.2" />
      <circle cx="24" cy="22" r="2" fill="#d68a1f" />
    </svg>
  );
}
