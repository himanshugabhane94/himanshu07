'use client';

import React, { useState } from 'react';
import { useInvestigation } from '@/context/InvestigationContext';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Eye, 
  ArrowRight, 
  ShieldAlert, 
  HelpCircle, 
  CheckCircle,
  Network,
  Clock,
  Layers,
  FileText
} from 'lucide-react';
import { ExplainableAiCard } from '@/components/common/ExplainableAiCard';

export function AiCopilotDrawer() {
  const { 
    isAiCopilotOpen, 
    setIsAiCopilotOpen, 
    activeCase, 
    entities, 
    relationships, 
    aiFindings, 
    highlightEntitiesOnGraph 
  } = useInvestigation();
  const router = useRouter();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Array<{
    id: string;
    sender: 'USER' | 'AI';
    text: string;
    timestamp: string;
    highlightEntityIds?: string[];
    suggestedRoute?: string;
    confidence?: number;
    evidence?: string[];
  }>>([
    {
      id: 'msg-01',
      sender: 'AI',
      text: `Hello Inspector. I am the SYNAPX AI Investigation Copilot. I have analyzed active case **${activeCase.title}** (${activeCase.caseNumber}).\n\nHow can I assist your network intelligence analysis today?`,
      timestamp: 'Just now'
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  if (!isAiCopilotOpen) return null;

  const quickPrompts = [
    { label: 'Show strongest indirect connections', query: 'Show the strongest indirect connections between the financial shell firms and freight forwarders.' },
    { label: 'Which entities connect multiple clusters?', query: 'Which entities connect multiple clusters or act as potential hidden bridges?' },
    { label: 'What changed during 2024-2025?', query: 'What network changes and volume surges occurred during the 2024 to 2025 period?' },
    { label: 'Show records needing verification', query: 'Show all unverified records and pending entity duplicate candidates requiring human verification.' },
    { label: 'Summarize active case', query: 'Generate an executive summary of Operation Falcon Nexus with key evidence points.' },
    { label: 'Find potentially related cases', query: 'Which other investigations share infrastructure or digital wallets with this case?' }
  ];

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || inputQuery).trim();
    if (!q) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'USER' as const,
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      let aiResponse: {
        text: string;
        highlightEntityIds?: string[];
        suggestedRoute?: string;
        confidence?: number;
        evidence?: string[];
      };

      const queryLower = q.toLowerCase();

      if (queryLower.includes('indirect') || queryLower.includes('path') || queryLower.includes('between')) {
        aiResponse = {
          text: `**Strongest Indirect Connection Identified:**\n\n1. **Ramesh Kumar** (Surya Bullion) is indirectly linked to **Vikramaditya Sharma** (Apex Logistics) via:\n   • **Trident BKC Surveillance Conclave** (Physical Attendance)\n   • **Private Escrow Undertaking** (Discovered in BKC Search)\n   • **Shared Cyber Proxy Relay** (185.220.101.5)\n\nThis creates a multi-hop evidentiary chain connecting the ₹89 Cr bullion invoicing ring to physical customs clearance at JNPT Port.`,
          highlightEntityIds: ['ENT-P-01', 'ENT-P-02', 'ENT-O-01', 'ENT-O-02', 'ENT-E-03'],
          suggestedRoute: '/indirect-connections',
          confidence: 89,
          evidence: ['CCTV surveillance logbook (DOC-03)', 'Server authentication logs for 185.220.101.5', 'Private loan guarantee covenant']
        };
      } else if (queryLower.includes('bridge') || queryLower.includes('cluster') || queryLower.includes('connect multiple')) {
        aiResponse = {
          text: `**Bridge Entity Candidate:**\n\n**Ramesh Kumar** exhibits a betweenness centrality score of **0.84**, bridging the **Invoicing Cluster** (Surya Bullion, GreenHorizon Agro) and the **Maritime Freight Cluster** (Apex Global Logistics, JNPT Terminal).\n\nWithout Ramesh Kumar's undisclosed guarantee, these two sub-networks appear completely disconnected in public statutory filings.`,
          highlightEntityIds: ['ENT-P-01', 'ENT-O-01', 'ENT-O-02'],
          suggestedRoute: '/hidden-bridges',
          confidence: 91,
          evidence: ['Undisclosed beneficial ownership covenant', 'Cross-remittance advance schedules', 'Joint corporate email domain registration']
        };
      } else if (queryLower.includes('2024') || queryLower.includes('changed') || queryLower.includes('timeline') || queryLower.includes('period')) {
        aiResponse = {
          text: `**Key Temporal Evolutions (2024–2025):**\n\n• **Nov 2024:** Sudden surge of 18 rapid wire remittances ($2.4M USD) routed to Swiss escrow sub-account #CH-88.\n• **Early 2025:** High-volume Tether (USDT) off-ramp executed via Ananya Iyer OTC desk.\n• **March 2025:** BKC Trident Hotel physical coordination meeting.\n• **Nov 2025:** Interception of misdeclared scrap container at JNPT Berth 4 recovering ₹24.5 Cr unmanifested gold.`,
          highlightEntityIds: ['ENT-E-01', 'ENT-E-02', 'ENT-E-03', 'ENT-D-01'],
          suggestedRoute: '/time-machine',
          confidence: 94,
          evidence: ['FIU Red Flag Alert RFA-2024-1109', 'TRC-20 Blockchain transaction history', 'DRI Panchnama 492']
        };
      } else if (queryLower.includes('verification') || queryLower.includes('unverified') || queryLower.includes('duplicate')) {
        aiResponse = {
          text: `**Records & Entities Requiring Verification:**\n\n1. **Ramesh Kumar vs R. Kumar (92% match score)**: Candidate duplicate detected across Surya Bullion and Apex Freight filings.\n2. **Al-Zahra General Trading LLC (NEEDS REVIEW)**: Offshore SWIFT wire documentation pending certified consular confirmation.\n3. **ByteStream Telematics FZE (UNVERIFIED)**: VPN hosting front entity pending overseas subpoena response.`,
          highlightEntityIds: ['ENT-P-01', 'ENT-O-05', 'ENT-O-04'],
          suggestedRoute: '/entity-resolution',
          confidence: 92,
          evidence: ['Shared phone number +91 98201 44812', 'Matching Permanent Account Numbers in MCA registry']
        };
      } else if (queryLower.includes('related') || queryLower.includes('cases') || queryLower.includes('shadow') || queryLower.includes('emerald')) {
        aiResponse = {
          text: `**Potentially Related Investigations Detected:**\n\n1. **Project Shadow Grid (84% Similarity)**: Shares encrypted IP node 185.220.101.5 and Tether cold wallet 0x71C...89B.\n2. **Operation Emerald Coast (71% Similarity)**: Overlapping freight clearing customs broker Vikramaditya Sharma and common storage facility at JNPT.`,
          highlightEntityIds: ['ENT-D-01', 'ENT-D-02', 'ENT-P-02'],
          suggestedRoute: '/related-cases',
          confidence: 84,
          evidence: ['On-chain transaction hash intersection', 'Shared proxy gateway MAC address', 'Common customs agent license #MUM-CHA-8812']
        };
      } else {
        aiResponse = {
          text: `**Case Intelligence Briefing:**\n\n${activeCase.description}\n\n• **Core Finding:** ${aiFindings[0]?.finding || 'Multi-tier financial layering ring using freight entities.'}\n• **Key Entities:** Ramesh Kumar, Vikramaditya Sharma, Surya Bullion Traders, Apex Global Logistics.\n• **Action Suggested:** Verify duplicate candidate R. Kumar and execute Section 65B forensic verification on seized digital ledgers.`,
          highlightEntityIds: ['ENT-P-01', 'ENT-P-02', 'ENT-O-01', 'ENT-O-02'],
          suggestedRoute: '/cases',
          confidence: 88,
          evidence: ['MCA filings', 'Customs seizure panchnama', 'State Special Branch surveillance records']
        };
      }

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'AI',
          text: aiResponse.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          highlightEntityIds: aiResponse.highlightEntityIds,
          suggestedRoute: aiResponse.suggestedRoute,
          confidence: aiResponse.confidence,
          evidence: aiResponse.evidence
        }
      ]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <div className="fixed top-0 right-0 bottom-0 w-96 max-w-full bg-obsidian-850 border-l border-obsidian-700 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
      
      {/* Header */}
      <div className="p-3.5 bg-obsidian-900 border-b border-obsidian-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold tracking-wider text-slate-100 uppercase flex items-center gap-1.5">
              AI Investigation Copilot
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            </h3>
            <p className="text-[10px] text-slate-400">Decision Support • Explainable Rationale</p>
          </div>
        </div>
        <button
          onClick={() => setIsAiCopilotOpen(false)}
          className="p-1 hover:bg-obsidian-800 rounded text-slate-400 hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Safety Notice Banner */}
      <div className="px-3 py-1.5 bg-amber-500/10 border-b border-amber-500/20 flex items-start gap-1.5 text-[11px] text-amber-300/90">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <span>AI assists with exploratory hypothesis generation. All outputs require investigator verification.</span>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="p-2.5 bg-obsidian-900/60 border-b border-obsidian-700 overflow-x-auto whitespace-nowrap space-x-1.5 scrollbar-none flex">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.query)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-obsidian-800 hover:bg-teal-500/20 text-slate-300 hover:text-teal-300 border border-obsidian-700 hover:border-teal-500/40 transition-colors shrink-0"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] font-mono text-slate-400">
              {msg.sender === 'AI' ? (
                <>
                  <Bot className="w-3 h-3 text-teal-400" />
                  <span className="text-teal-400 font-semibold">SYNAPX COPILOT</span>
                </>
              ) : (
                <>
                  <User className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-400 font-semibold">YOU</span>
                </>
              )}
              <span>• {msg.timestamp}</span>
            </div>

            <div
              className={`p-3 rounded-lg text-xs leading-relaxed max-w-[92%] ${
                msg.sender === 'USER'
                  ? 'bg-teal-700/40 text-slate-100 border border-teal-600/50 rounded-br-none'
                  : 'bg-obsidian-900 text-slate-200 border border-obsidian-700 rounded-bl-none shadow-md'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {/* Explainable Confidence & Evidence Pill */}
              {msg.confidence !== undefined && (
                <div className="mt-2.5 pt-2 border-t border-obsidian-750 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono">
                    Confidence: <strong className="text-teal-400 font-bold">{msg.confidence}%</strong>
                  </span>
                  <span className="text-amber-400 font-medium text-[10px]">AI-Assisted Suggestion</span>
                </div>
              )}

              {/* Action Buttons */}
              {msg.highlightEntityIds && msg.highlightEntityIds.length > 0 && (
                <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      highlightEntitiesOnGraph(msg.highlightEntityIds!);
                      router.push('/graph');
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-300 bg-teal-500/20 hover:bg-teal-500/30 px-2 py-1 rounded transition-colors border border-teal-500/30"
                  >
                    <Eye className="w-3 h-3" />
                    View on Graph ({msg.highlightEntityIds.length} Nodes)
                  </button>

                  {msg.suggestedRoute && (
                    <button
                      onClick={() => router.push(msg.suggestedRoute!)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 hover:text-slate-100 bg-obsidian-800 hover:bg-obsidian-750 px-2 py-1 rounded transition-colors border border-obsidian-700"
                    >
                      <span>Deep Dive</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-teal-400 p-2 font-mono">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Analyzing graph topology & synthesizing explainable evidence...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-obsidian-900 border-t border-obsidian-700">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask AI Copilot about connections, entities, time machine..."
            className="flex-1 bg-obsidian-850 border border-obsidian-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isThinking}
            className="p-2 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-obsidian-950 font-bold transition-colors shadow-glow-teal"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
