'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AiCopilotDrawer } from '@/components/layout/AiCopilotDrawer';
import { JudgeModeModal } from '@/components/layout/JudgeModeModal';
import { useInvestigation } from '@/context/InvestigationContext';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-obsidian-900 text-slate-100 font-sans select-text">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-obsidian-900 bg-grid-pattern">
          {children}
        </main>
      </div>

      {/* Slide-out AI Investigation Copilot */}
      <AiCopilotDrawer />

      {/* 15-Step Judge Mode Demonstration Overlay */}
      <JudgeModeModal />
    </div>
  );
}
