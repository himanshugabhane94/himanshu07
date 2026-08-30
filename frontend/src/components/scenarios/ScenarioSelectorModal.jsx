import React, { useState, useEffect } from 'react';
import { 
  Sparkles, X, ArrowRight, Shield, CheckCircle2, 
  ChevronRight, ChevronLeft, Play, Eye, Flame,
  Compass, Network, GitPullRequest, Cpu, Scale
} from 'lucide-react';
import { api } from '../../services/api';

export default function ScenarioSelectorModal({ onSelectScenario, onClose }) {
  const [scenarios, setScenarios] = useState([]);
  const [selectedId, setSelectedId] = useState('scenario_hidden_network');
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    api.getScenarios().then(data => {
      setScenarios(data);
      if (data.length > 0) {
        setSelectedId(data[0].id);
      }
    }).catch(err => {
      console.error("Failed to load scenarios:", err);
    });
  }, []);

  const activeScenario = scenarios.find(s => s.id === selectedId) || scenarios[0];
  const guidedSteps = activeScenario?.guided_steps || [];
  const currentStep = guidedSteps[activeStepIndex] || guidedSteps[0];

  const handleLaunchScenario = () => {
    if (activeScenario && onSelectScenario) {
      onSelectScenario(activeScenario.case_id, 'graph');
      onClose();
    }
  };

  const handleExecuteStep = (step) => {
    if (step && onSelectScenario) {
      onSelectScenario(step.target_case_id, step.target_tab, step.highlight_node_id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-5xl bg-[#141210] border border-[#3a352d] rounded-3xl shadow-dossier overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 bg-[#0f0e0d] border-b border-[#3a352d] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-[#24211d] border border-[#d68a1f]/50 flex items-center justify-center text-[#f5c074] shadow-sm">
              <Sparkles className="w-5 h-5 text-[#d68a1f]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-[#ece7de] font-cinzel tracking-wide">
                  Flagship Scenarios & Interactive Judge Demonstrations
                </h3>
                <span className="seal-badge-high">
                  SIH26189 Live Evaluator
                </span>
              </div>
              <p className="text-xs text-[#8a8478] font-serif italic mt-0.5">
                Curated multi-crime intelligence pathways demonstrating real-time cross-case triangulation, serial pattern matching, and network disruption.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1c1a17] hover:bg-[#24211d] text-[#8a8478] hover:text-[#ece7de] transition-all border border-[#3a352d]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Scenario Cards Grid + Guided Step-by-Step Inspector */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 scrollbar-thin scrollbar-thumb-[#3a352d]">
          
          {/* Scenario Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {scenarios.map((sc) => {
              const isSelected = selectedId === sc.id;
              const isFlagship = sc.id === 'scenario_hidden_network';

              return (
                <div
                  key={sc.id}
                  onClick={() => {
                    setSelectedId(sc.id);
                    setActiveStepIndex(0);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 relative shadow-sm ${
                    isSelected
                      ? 'bg-[#24211d] border-[#d68a1f] shadow-dossier ring-1 ring-[#d68a1f]/40'
                      : isFlagship
                      ? 'bg-[#1c1a17] border-[#d68a1f]/40 hover:border-[#d68a1f]'
                      : 'bg-[#0f0e0d] hover:bg-[#1c1a17] border-[#3a352d]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      isFlagship 
                        ? 'bg-[#241a18] text-[#e27d75] border border-[#a5342a]/40' 
                        : 'bg-[#0f0e0d] text-[#d68a1f] border border-[#3a352d]'
                    }`}>
                      {sc.badge}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-[#ece7de] leading-snug font-serif line-clamp-2">
                    {sc.title.split(':')[1] || sc.title}
                  </h4>
                  <div className="text-[10px] font-mono text-[#8a8478] truncate">{sc.fir_number}</div>
                </div>
              );
            })}
          </div>

          {/* Active Scenario Master Detail Card */}
          {activeScenario && (
            <div className="p-5 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] space-y-4 shadow-dossier">
              
              {/* Header Title & Description */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#d68a1f]">{activeScenario.fir_number}</span>
                  <span className="seal-badge-medium">{activeScenario.badge}</span>
                </div>
                <h4 className="font-bold text-base text-[#f5c074] font-serif">{activeScenario.title}</h4>
                <p className="text-xs text-[#ece7de] font-serif leading-relaxed">{activeScenario.description}</p>
              </div>

              {/* SPECIAL FEATURE: 5-STEP GUIDED INTERACTIVE WALKTHROUGH */}
              {guidedSteps.length > 0 ? (
                <div className="p-4 rounded-2xl bg-[#141210] border border-[#d68a1f]/40 space-y-4">
                  
                  {/* Stepper Header & Navigation Pills */}
                  <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-[#2a2620]">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#d68a1f]" />
                      <span className="text-xs font-bold font-mono text-[#ece7de] uppercase tracking-wider">
                        Interactive Guided Demo Walkthrough (Step {activeStepIndex + 1} of {guidedSteps.length})
                      </span>
                    </div>

                    {/* Step Pills */}
                    <div className="flex items-center gap-1 bg-[#0f0e0d] p-1 rounded-xl border border-[#3a352d]">
                      {guidedSteps.map((st, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => setActiveStepIndex(sIdx)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                            activeStepIndex === sIdx
                              ? 'bg-[#24211d] text-[#f5c074] border border-[#d68a1f]/50'
                              : 'text-[#8a8478] hover:text-[#ece7de]'
                          }`}
                        >
                          Step {sIdx + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active Step Content Card */}
                  {currentStep && (
                    <div className="p-4 rounded-xl bg-[#0f0e0d] border border-[#3a352d] space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold text-[#f5c074] font-serif">
                            {currentStep.title}
                          </div>
                          <div className="text-[11px] text-[#8a8478] font-mono mt-0.5">
                            Target View: <strong className="text-[#ece7de] uppercase">{currentStep.target_tab}</strong> • Target Node: <strong className="text-[#ece7de]">{currentStep.highlight_node_id}</strong>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-lg bg-[#1c1a17] text-[#f5c074] border border-[#d68a1f]/40 text-xs font-mono font-bold">
                          Step {currentStep.step} / {guidedSteps.length}
                        </span>
                      </div>

                      {/* Narrative Text */}
                      <p className="text-xs text-[#ece7de] font-serif leading-relaxed bg-[#1c1a17] p-3 rounded-xl border border-[#2a2620]">
                        {currentStep.narrative}
                      </p>

                      {/* Action Prompt Directive */}
                      <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
                        <div className="text-[11px] text-[#8a8478] font-mono flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-[#d68a1f]" />
                          <span>{currentStep.action_prompt}</span>
                        </div>

                        {/* Direct 1-Click Launch Button for this specific step */}
                        <button
                          onClick={() => handleExecuteStep(currentStep)}
                          className="px-4 py-1.5 rounded-xl bg-[#24211d] border border-[#d68a1f]/60 hover:border-[#d68a1f] text-[#f5c074] text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                        >
                          <Play className="w-3 h-3 text-[#d68a1f] fill-current" />
                          <span>Jump to Step {currentStep.step} View</span>
                        </button>
                      </div>

                    </div>
                  )}

                  {/* Stepper Controls */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      disabled={activeStepIndex === 0}
                      onClick={() => setActiveStepIndex(prev => Math.max(0, prev - 1))}
                      className="px-3 py-1.5 rounded-xl bg-[#0f0e0d] border border-[#3a352d] text-xs font-mono text-[#8a8478] hover:text-[#ece7de] disabled:opacity-40 transition-all flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Previous Step</span>
                    </button>

                    <button
                      disabled={activeStepIndex === guidedSteps.length - 1}
                      onClick={() => setActiveStepIndex(prev => Math.min(guidedSteps.length - 1, prev + 1))}
                      className="px-3 py-1.5 rounded-xl bg-[#0f0e0d] border border-[#3a352d] text-xs font-mono text-[#8a8478] hover:text-[#ece7de] disabled:opacity-40 transition-all flex items-center gap-1"
                    >
                      <span>Next Step</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ) : (
                /* What to show judges checklist for regular scenarios */
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
              )}

            </div>
          )}

        </div>

        {/* Footer Action */}
        <div className="p-4 bg-[#0f0e0d] border-t border-[#3a352d] flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs text-[#8a8478] font-mono">
            Loads full synthetic intelligence knowledge graph into SUTRA with immutable blockchain audit trail.
          </span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleLaunchScenario}
              className="px-5 py-2.5 rounded-xl bg-[#d68a1f] hover:bg-[#e59b2d] text-[#0f0e0d] text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <span>Load Full Scenario Dataset</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
