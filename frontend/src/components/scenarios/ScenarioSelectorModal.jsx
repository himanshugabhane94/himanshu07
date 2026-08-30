import React, { useState, useEffect } from 'react';
import { Sparkles, X, ArrowRight, Shield, CheckCircle2, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';

export default function ScenarioSelectorModal({ onSelectScenario, onClose }) {
  const [scenarios, setScenarios] = useState([]);
  const [selectedId, setSelectedId] = useState('scenario_hawala');

  useEffect(() => {
    api.getScenarios().then(data => {
      setScenarios(data);
    }).catch(err => {
      console.error("Failed to load scenarios:", err);
    });
  }, []);

  const activeScenario = scenarios.find(s => s.id === selectedId) || scenarios[0];

  const handleLaunch = () => {
    if (activeScenario && onSelectScenario) {
      onSelectScenario(activeScenario.case_id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-[#1c1a17] border border-[#3a352d] rounded-3xl shadow-dossier overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-[#0f0e0d] border-b border-[#3a352d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1c1a17] border border-[#3a352d] flex items-center justify-center text-[#d68a1f] shadow-sm">
              <Sparkles className="w-5 h-5 text-[#d68a1f]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-[#ece7de] font-serif">
                  SIH Pre-Built Demonstration Scenarios
                </h3>
                <span className="seal-badge-high">
                  Hackathon Ready
                </span>
              </div>
              <p className="text-xs text-[#8a8478] font-serif italic">
                1-Click demonstration datasets curated specifically for Smart India Hackathon Problem Statement SIH26189.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#24211d] hover:bg-[#2d2924] text-[#8a8478] hover:text-[#ece7de] transition-all border border-[#3a352d]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content: 3 Scenario Cards & Judge Focus Preview */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Scenario Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {scenarios.map((sc) => {
              const isSelected = selectedId === sc.id;
              return (
                <div
                  key={sc.id}
                  onClick={() => setSelectedId(sc.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 relative shadow-sm ${
                    isSelected
                      ? 'bg-[#24211d] border-[#d68a1f] shadow-dossier'
                      : 'bg-[#0f0e0d] hover:bg-[#0f0e0d]/80 border-[#3a352d]'
                  }`}
                >
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#1c1a17] text-[#d68a1f] border border-[#3a352d]">
                    {sc.badge}
                  </span>
                  <h4 className="font-bold text-sm text-[#ece7de] leading-snug font-serif">{sc.title.split(':')[1] || sc.title}</h4>
                  <div className="text-[11px] font-mono text-[#8a8478]">{sc.fir_number}</div>
                </div>
              );
            })}
          </div>

          {/* Active Scenario Detail & Judge Focus */}
          {activeScenario && (
            <div className="p-5 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] space-y-4 shadow-dossier">
              <div className="space-y-1">
                <h4 className="font-bold text-base text-[#f5c074] font-serif">{activeScenario.title}</h4>
                <p className="text-xs text-[#ece7de] font-serif leading-relaxed">{activeScenario.description}</p>
              </div>

              {/* What to show judges checklist */}
              <div className="space-y-2 pt-2 border-t border-[#2a2620]">
                <div className="text-xs font-bold text-[#d68a1f] uppercase tracking-wider font-mono">
                  Key Capabilities to Demonstrate to Judges:
                </div>
                <div className="space-y-1.5">
                  {activeScenario.judge_focus?.map((focus, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#ece7de] font-serif">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5c7a5c] shrink-0" />
                      <span>{focus}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Action */}
        <div className="p-4 bg-[#0f0e0d] border-t border-[#3a352d] flex items-center justify-between">
          <span className="text-xs text-[#8a8478] font-mono">
            Loads instant synthetic dataset into SUTRA Knowledge Graph & Ledger.
          </span>
          <button
            onClick={handleLaunch}
            className="px-5 py-2.5 rounded-xl bg-[#d68a1f] hover:bg-[#e59b2d] text-[#0f0e0d] text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <span>Load & Explore Scenario</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
