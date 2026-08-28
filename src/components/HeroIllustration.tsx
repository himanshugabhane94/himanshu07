'use client';

import React from 'react';
import {
  GraduationCap,
  Sprout,
  HeartPulse,
  Home,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function HeroIllustration() {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none flex items-center justify-center">
      {/* Ambient Glows */}
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-saffron-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-govEmerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Illustration Container */}
      <div className="relative z-10 w-full aspect-[4/3] max-w-[480px] rounded-3xl bg-gradient-to-br from-govNavy-900/90 via-govNavy-800/80 to-slate-900/90 border border-white/15 p-6 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col justify-between">
        {/* Background Grid Lines & Abstract India / Digital Mesh */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Latitude/Longitude Grid */}
          <line x1="0" y1="60" x2="400" y2="60" stroke="#94B4DF" strokeWidth="0.8" strokeDasharray="4 4" />
          <line x1="0" y1="120" x2="400" y2="120" stroke="#94B4DF" strokeWidth="0.8" strokeDasharray="4 4" />
          <line x1="0" y1="180" x2="400" y2="180" stroke="#94B4DF" strokeWidth="0.8" strokeDasharray="4 4" />
          <line x1="0" y1="240" x2="400" y2="240" stroke="#94B4DF" strokeWidth="0.8" strokeDasharray="4 4" />
          <line x1="100" y1="0" x2="100" y2="300" stroke="#94B4DF" strokeWidth="0.8" strokeDasharray="4 4" />
          <line x1="200" y1="0" x2="200" y2="300" stroke="#94B4DF" strokeWidth="0.8" strokeDasharray="4 4" />
          <line x1="300" y1="0" x2="300" y2="300" stroke="#94B4DF" strokeWidth="0.8" strokeDasharray="4 4" />

          {/* Abstract Setu / Bridge Graphic Arch */}
          <path
            d="M 40 220 C 100 120, 300 120, 360 220"
            stroke="url(#bridgeGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Bridge Vertical Suspension Cable Lines */}
          <line x1="80" y1="185" x2="80" y2="230" stroke="#FF9933" strokeWidth="1.5" strokeOpacity="0.6" />
          <line x1="120" y1="155" x2="120" y2="230" stroke="#FF9933" strokeWidth="1.5" strokeOpacity="0.6" />
          <line x1="160" y1="138" x2="160" y2="230" stroke="#FF9933" strokeWidth="1.5" strokeOpacity="0.6" />
          <line x1="200" y1="132" x2="200" y2="230" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.8" />
          <line x1="240" y1="138" x2="240" y2="230" stroke="#138808" strokeWidth="1.5" strokeOpacity="0.6" />
          <line x1="280" y1="155" x2="280" y2="230" stroke="#138808" strokeWidth="1.5" strokeOpacity="0.6" />
          <line x1="320" y1="185" x2="320" y2="230" stroke="#138808" strokeWidth="1.5" strokeOpacity="0.6" />

          {/* Gradients */}
          <defs>
            <linearGradient id="bridgeGrad" x1="40" y1="220" x2="360" y2="220" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF9933" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#138808" />
            </linearGradient>
          </defs>
        </svg>

        {/* Top Header Strip inside Card */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-saffron-500/20 border border-saffron-500/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-saffron-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white tracking-wide">YogyaSetu Intelligence Engine</p>
              <p className="text-[9px] text-slate-300">Central & State Scheme Matching</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-govEmerald-500/20 border border-govEmerald-400/30 text-govEmerald-300 text-[10px] font-bold flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-govEmerald-400 animate-ping" />
            <span>Live Portal</span>
          </span>
        </div>

        {/* Floating Interactive Badges with GovTech Motifs */}
        <div className="relative z-10 grid grid-cols-2 gap-2.5 my-2">
          {/* Badge 1: PM-KISAN */}
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:border-saffron-400/50 transition-all transform hover:-translate-y-0.5">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Sprout className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-black text-white">PM-KISAN DBT</span>
            </div>
            <p className="text-[10px] text-slate-300">₹6,000 / year direct bank credit</p>
          </div>

          {/* Badge 2: Ayushman Bharat */}
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:border-emerald-400/50 transition-all transform hover:-translate-y-0.5">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <HeartPulse className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-black text-white">PM-JAY Health</span>
            </div>
            <p className="text-[10px] text-slate-300">₹5,00,000 cashless cover</p>
          </div>

          {/* Badge 3: NSP Scholarships */}
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:border-blue-400/50 transition-all transform hover:-translate-y-0.5">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-black text-white">NSP Scholarship</span>
            </div>
            <p className="text-[10px] text-slate-300">100% tuition + maintenance</p>
          </div>

          {/* Badge 4: PMAY Housing */}
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:border-amber-400/50 transition-all transform hover:-translate-y-0.5">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Home className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-black text-white">PMAY Housing</span>
            </div>
            <p className="text-[10px] text-slate-300">₹1.20 - ₹2.50 Lakh grant</p>
          </div>
        </div>

        {/* Bottom Verification Seal */}
        <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300 font-medium">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-govEmerald-400" />
            <span>Direct Official (*.gov.in) Application</span>
          </div>
          <div className="flex items-center space-x-1 text-saffron-300 font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>Zero Middlemen</span>
          </div>
        </div>
      </div>
    </div>
  );
}
