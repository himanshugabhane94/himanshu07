import React from 'react';

/**
 * Standardized SUTRA Badge Component
 * Strict hierarchy:
 * - 'critical': Brick red (urgent alerts, tamper warnings, high risk)
 * - 'primary': Saffron gold (branding, top kingpin, major highlights)
 * - 'info': Muted slate-teal (informational tags, counts, GIS, ML badges)
 * - 'neutral': Neutral charcoal (secondary metadata, state tags)
 */
export default function Badge({ 
  children, 
  variant = 'neutral', 
  size = 'sm', 
  className = '',
  icon: Icon
}) {
  const variantStyles = {
    critical: 'bg-[#241a18] text-[#e27d75] border-[#a5342a]/50',
    primary: 'bg-[#242018] text-[#f5c074] border-[#d68a1f]/45',
    info: 'bg-[#182226] text-[#94a9b3] border-[#4a6670]/45',
    neutral: 'bg-[#1a1815] text-[#b5aea1] border-[#3a352d]'
  };

  const sizeStyles = {
    xs: 'text-[9px] px-1.5 py-0.5',
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1'
  };

  return (
    <span 
      className={`inline-flex items-center gap-1 font-mono font-bold uppercase tracking-wider rounded-md border shrink-0 ${variantStyles[variant] || variantStyles.neutral} ${sizeStyles[size] || sizeStyles.sm} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
