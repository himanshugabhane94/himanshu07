'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInvestigation } from '@/context/InvestigationContext';
import { UserRole } from '@/types/synapx';
import { DEMO_USERS } from '@/lib/demo-data';
import { 
  Share2, 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  ArrowRight, 
  KeyRound, 
  CheckCircle2, 
  Building, 
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';

export default function LoginPage() {
  const { switchUserRole, currentUser } = useInvestigation();
  const router = useRouter();

  const [email, setEmail] = useState('v.rathore@synapx.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('INVESTIGATOR');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const user = DEMO_USERS.find(u => u.role === role);
    if (user) {
      setEmail(user.email);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    switchUserRole(selectedRole);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-obsidian-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Background Ambience Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-obsidian-850 border border-obsidian-700 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-obsidian-900 border-b border-obsidian-700 text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-800 flex items-center justify-center shadow-glow-teal mx-auto mb-3">
            <Share2 className="w-6 h-6 text-obsidian-950 font-bold" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="font-mono text-xl font-extrabold tracking-wider text-slate-100">
              SYNAPX
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
              SECURE ACCESS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">AI-Powered Criminal Record & Network Intelligence</p>
        </div>

        {/* 1-Click Role Persona Quick Selector */}
        <div className="p-5 border-b border-obsidian-750 bg-obsidian-850">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider mb-2 text-center">
            Quick Persona Selector (Judge & Evaluator Mode)
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['INVESTIGATOR', 'ANALYST', 'ADMIN'] as UserRole[]).map(role => {
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleSelect(role)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-glow-teal font-bold'
                      : 'bg-obsidian-900 hover:bg-obsidian-750 border-obsidian-700 text-slate-400'
                  }`}
                >
                  <div className="text-[11px] uppercase font-mono">{role}</div>
                  <div className="text-[9px] text-slate-400 mt-0.5 truncate">
                    {role === 'INVESTIGATOR' ? 'Lead Case Off.' : role === 'ANALYST' ? 'Cyber Intelligence' : 'Director Admin'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
              Official Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500 font-mono"
              />
              <UserCheck className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono uppercase text-slate-400">
                Security Password / Token
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] text-teal-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-200 absolute right-3 top-2.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Clearances */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-obsidian-900 border-obsidian-700 text-teal-500 focus:ring-0"
              />
              <span>Remember Station Token</span>
            </label>

            <span className="text-[10px] font-mono text-teal-400/90 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
              Tier-0 Clearance
            </span>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-obsidian-950 font-bold text-xs shadow-glow-teal flex items-center justify-center gap-2 transition-all mt-4"
          >
            <span>Authenticate as {selectedRole}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Security Badges */}
        <div className="p-4 bg-obsidian-900/80 border-t border-obsidian-700 flex items-center justify-center gap-4 text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-teal-400" /> AES-256 Auth
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-amber-400" /> Strict Audit Logging
          </span>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-obsidian-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-obsidian-850 border border-obsidian-700 rounded-xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between pb-2 border-b border-obsidian-700">
              <span className="text-xs font-mono font-bold uppercase text-slate-100">Reset Official Access</span>
              <button onClick={() => setShowForgotModal(false)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In production, hardware cryptographic tokens and supervisory OTP authorization are required. For this hackathon prototype, select any persona above to immediately login.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 rounded-lg bg-teal-600 text-obsidian-950 font-bold text-xs"
            >
              Return to Login
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
