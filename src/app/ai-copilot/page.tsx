'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useInvestigation } from '@/context/InvestigationContext';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Eye, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Network, 
  Clock, 
  Dna, 
  FileText,
  Layers
} from 'lucide-react';

export default function AiCopilotPage() {
  const { activeCase, highlightEntitiesOnGraph } = useInvestigation();
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
  }>>([
    {
      id: 'msg-01',
      sender: 'AI',
      text: `Welcome to the SYNAPX AI Investigation Console.\n\nI have indexed **${activeCase.title}** (${activeCase.caseNumber}). You can ask natural-language questions regarding multi-hop paths, bridge entities, temporal surges, or evidence provenance.`,
      timestamp: '14:30'
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const quickPrompts = [
    'Show the strongest indirect connections.',
    'Which entities connect multiple clusters?',
    'What changed during 2024-2025?',
    'Show records that need verification.',
    'Summarize this case.'
  ];

  const handleSend = (text?: string) => {
    const q = (text || inputQuery).trim();
    if (!q) return;

    setMessages(prev => [
      ...prev,
      {
        id: `usr-${Date.now()}`,
        sender: 'USER',
        text: q,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      let responseText = '';
      let highlightIds: string[] = [];
      let route = '/graph';

      if (q.toLowerCase().includes('indirect') || q.toLowerCase().includes('path')) {
        responseText = `**Strongest Indirect Relational Chain:**\n\n1. **Ramesh Kumar** ➔ Attended **BKC Coordination Conclave** (DOC-03)\n2. Meeting reviewed customs manifests for **Apex Global Logistics**\n3. Operations led directly by **Vikramaditya Sharma**\n\nThis establishes a direct 3-hop evidentiary link between the ₹89 Cr bullion invoicing front and JNPT port logistics.`;
        highlightIds = ['ENT-P-01', 'ENT-E-03', 'ENT-O-01', 'ENT-P-02'];
        route = '/indirect-connections';
      } else if (q.toLowerCase().includes('bridge') || q.toLowerCase().includes('cluster')) {
        responseText = `**Covert Bridge Entity Candidate:**\n\n**Ramesh Kumar** has betweenness centrality of **0.84**, acting as the sole covert conduit connecting the **Invoicing Cluster** with the **Maritime Logistics Ring**.\n\nUndisclosed guarantee agreements discovered during the BKC suite search confirm joint operational control.`;
        highlightIds = ['ENT-P-01', 'ENT-O-01', 'ENT-O-02'];
        route = '/hidden-bridges';
      } else if (q.toLowerCase().includes('changed') || q.toLowerCase().includes('2024')) {
        responseText = `**2024–2025 Temporal Evolution:**\n\n• **Q4 2024:** 18 wire transfers totaling $2.4M USD routed to Swiss Escrow #CH-88.\n• **Q1 2025:** High-volume Tether OTC off-ramp via Ananya Iyer.\n• **Q4 2025:** Seizure of container MSCU-889104 at JNPT Berth 4 (₹24.5 Cr unmanifested gold).`;
        highlightIds = ['ENT-E-01', 'ENT-E-02', 'ENT-D-01'];
        route = '/time-machine';
      } else {
        responseText = `**Investigation Summary for ${activeCase.title.split(':')[0]}:**\n\n• **Modus Operandi:** Trans-state Hawala, circular bullion invoicing, and maritime container concealment.\n• **Key Suspects:** Ramesh Kumar, Vikramaditya Sharma, Siddharth Mehta, Ananya Iyer.\n• **Recommended Action:** Execute Section 65B forensic validation on seized spreadsheet ledgers.`;
        highlightIds = ['ENT-P-01', 'ENT-P-02', 'ENT-O-01', 'ENT-O-02'];
        route = '/cases';
      }

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'AI',
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          highlightEntityIds: highlightIds,
          suggestedRoute: route,
          confidence: 91
        }
      ]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto h-[calc(100vh-6.5rem)] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-obsidian-700 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-teal-500/20 text-teal-400">
                <Sparkles className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-slate-100">
                AI Investigation Copilot Console
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Interactive natural-language reasoning assistant for criminal network exploration.
            </p>
          </div>

          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Decision Support • Human in the Loop</span>
          </span>
        </div>

        {/* Quick Prompts Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs shrink-0">
          <span className="text-slate-400 font-mono text-[10px] uppercase mr-1">Suggested:</span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="px-3 py-1 rounded-full bg-obsidian-850 hover:bg-teal-500/20 text-slate-300 hover:text-teal-300 border border-obsidian-700 transition-colors shrink-0"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Main Conversation Stream */}
        <div className="flex-1 synapx-card bg-obsidian-850 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] font-mono text-slate-400">
                {msg.sender === 'AI' ? (
                  <>
                    <Bot className="w-3.5 h-3.5 text-teal-400" />
                    <span className="text-teal-400 font-bold">SYNAPX INTELLIGENCE COPILOT</span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-400 font-bold">INVESTIGATING OFFICER</span>
                  </>
                )}
                <span>• {msg.timestamp}</span>
              </div>

              <div
                className={`p-4 rounded-xl text-xs leading-relaxed max-w-[85%] ${
                  msg.sender === 'USER'
                    ? 'bg-teal-700/40 text-slate-100 border border-teal-600/50 rounded-br-none'
                    : 'bg-obsidian-900 text-slate-200 border border-obsidian-750 rounded-bl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {msg.highlightEntityIds && msg.highlightEntityIds.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-obsidian-800 flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        highlightEntitiesOnGraph(msg.highlightEntityIds!);
                        router.push('/graph');
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-teal-300 bg-teal-500/20 hover:bg-teal-500/30 px-2.5 py-1 rounded transition-colors border border-teal-500/30"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View on Graph ({msg.highlightEntityIds.length} Nodes)</span>
                    </button>

                    {msg.suggestedRoute && (
                      <button
                        onClick={() => router.push(msg.suggestedRoute!)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-slate-100 bg-obsidian-800 hover:bg-obsidian-750 px-2.5 py-1 rounded transition-colors border border-obsidian-700"
                      >
                        <span>Deep Dive Module</span>
                        <ArrowRight className="w-3.5 h-3.5" />
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
              <span>Analyzing investigation knowledge graph & topological paths...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask AI Copilot about covert links, suspect transactions, time machine, or case brief..."
            className="flex-1 bg-obsidian-850 border border-obsidian-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isThinking}
            className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-obsidian-950 font-bold text-xs shadow-glow-teal transition-all flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>

      </div>
    </AppLayout>
  );
}
