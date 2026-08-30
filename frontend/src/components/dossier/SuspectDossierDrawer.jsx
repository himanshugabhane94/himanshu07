import React, { useState, useEffect } from 'react';
import { 
  X, User, Phone, Landmark, Building2, Truck, 
  MapPin, Globe, ShieldAlert, Key, ExternalLink, 
  Clock, Hash, FileCheck, ArrowUpRight, ArrowDownLeft, 
  Share2, Eye, Network, Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import RiskExplanationPanel from './RiskExplanationPanel';
import ChainOfCustodyView from '../blockchain/ChainOfCustodyView';

export default function SuspectDossierDrawer({
  nodeId,
  caseId,
  onClose,
  onSelectNode,
  onFindPathFromNode,
  onExpandNeighborhood
}) {
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('xai'); // default to 'xai'

  useEffect(() => {
    if (!nodeId) return;
    setLoading(true);
    api.getNodeDossier(nodeId)
      .then(data => {
        setDossier(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load dossier:", err);
        setLoading(false);
      });
  }, [nodeId]);

  if (!nodeId) return null;

  const node = dossier?.node;
  const riskSealClass = node?.risk_level === 'Critical' ? 'seal-badge-critical' :
                        node?.risk_level === 'High' ? 'seal-badge-high' :
                        node?.risk_level === 'Medium' ? 'seal-badge-medium' :
                        'seal-badge-low';

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[490px] bg-[#1c1a17]/98 backdrop-blur-xl border-l border-[#3a352d] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      
      {/* Header with Risk Banner */}
      <div className="p-4 border-b border-[#3a352d] flex items-center justify-between bg-[#0f0e0d]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#d68a1f] uppercase">
            SUTRA Intelligence Dossier
          </span>
          <span className="text-[#3a352d]">•</span>
          <span className="text-xs text-[#8a8478] font-mono">{nodeId}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl bg-[#24211d] hover:bg-[#2d2924] text-[#8a8478] hover:text-[#ece7de] transition-all border border-[#3a352d]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[#8a8478]">
          <div className="w-8 h-8 border-2 border-[#d68a1f] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono">Decrypting intelligence dossier...</span>
        </div>
      ) : node ? (
        <div className="flex-1 overflow-y-auto p-5 space-y-5 relative">
          
          {/* Subtle Classified Stamp Watermark */}
          <div className="stamp-watermark">
            CLASSIFIED // SUTRA DOSSIER
          </div>

          {/* Profile Card */}
          <div className="p-4 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] space-y-3 shadow-dossier relative z-10">
            <div className="flex items-start gap-3.5">
              
              {/* Entity Avatar */}
              <div className="w-14 h-14 rounded-2xl bg-[#1c1a17] border border-[#3a352d] flex items-center justify-center text-2xl shrink-0">
                {node.type === 'Person' ? '👤' : 
                 node.type === 'Phone' ? '📞' :
                 node.type === 'BankAccount' ? '🏦' :
                 node.type === 'Vehicle' ? '🚗' :
                 node.type === 'Organization' ? '🏢' :
                 node.type === 'Location' ? '📍' : '🌐'}
              </div>

              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-base text-[#ece7de] truncate font-serif">{node.label}</h3>
                  <span className={riskSealClass}>
                    {node.risk_level}
                  </span>
                </div>
                <p className="text-xs text-[#f5c074] font-medium font-serif italic">
                  {node.properties?.role || `${node.type} Entity`}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-[#8a8478] font-mono">
                  <span>Degree: <strong className="text-[#ece7de]">{dossier.degree}</strong></span>
                  <span>•</span>
                  <span>PageRank: <strong className="text-[#d68a1f]">{node.centrality_score ? node.centrality_score.toFixed(4) : '0.0450'}</strong></span>
                </div>
              </div>
            </div>

            {/* Action Bar (Trace Path, 2-Hop Expand) */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#2a2620]">
              <button
                onClick={() => onFindPathFromNode && onFindPathFromNode(nodeId)}
                className="py-1.5 px-3 rounded-xl bg-[#24211d] hover:bg-[#2d2924] text-[#ece7de] border border-[#3a352d] text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Network className="w-3.5 h-3.5 text-[#d68a1f]" />
                <span>Trace Path</span>
              </button>
              <button
                onClick={() => onExpandNeighborhood && onExpandNeighborhood(nodeId)}
                className="py-1.5 px-3 rounded-xl bg-[#24211d] hover:bg-[#2d2924] text-[#ece7de] border border-[#3a352d] text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Eye className="w-3.5 h-3.5 text-[#4a6670]" />
                <span>Expand 2-Hop</span>
              </button>
            </div>
          </div>

          {/* Dossier Tabs (XAI, Direct Connections, Blockchain Custody) */}
          <div className="flex items-center rounded-2xl bg-[#0f0e0d] border border-[#3a352d] p-1 text-xs font-mono">
            <button
              onClick={() => setActiveTab('xai')}
              className={`flex-1 py-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'xai' 
                  ? 'bg-[#24211d] text-[#f5c074] border border-[#d68a1f]/40' 
                  : 'text-[#8a8478] hover:text-[#ece7de]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#d68a1f]" />
              <span>AI Explanation</span>
            </button>
            <button
              onClick={() => setActiveTab('connections')}
              className={`flex-1 py-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'connections' 
                  ? 'bg-[#24211d] text-[#f5c074] border border-[#d68a1f]/40' 
                  : 'text-[#8a8478] hover:text-[#ece7de]'
              }`}
            >
              <Share2 className="w-3 h-3 text-[#4a6670]" />
              <span>Links ({dossier.neighbors?.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveTab('custody')}
              className={`flex-1 py-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'custody' 
                  ? 'bg-[#24211d] text-[#f5c074] border border-[#d68a1f]/40' 
                  : 'text-[#8a8478] hover:text-[#ece7de]'
              }`}
            >
              <FileCheck className="w-3 h-3 text-[#5c7a5c]" />
              <span>Sec 65B Audit</span>
            </button>
          </div>

          {/* TAB CONTENT 1: EXPLAINABLE AI RISK EXPLANATION */}
          {activeTab === 'xai' && (
            <RiskExplanationPanel 
              nodeId={nodeId}
              caseId={caseId}
              onSelectNode={onSelectNode}
            />
          )}

          {/* TAB CONTENT 2: DIRECT NEIGHBORHOOD CONNECTIONS */}
          {activeTab === 'connections' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#8a8478] uppercase font-mono tracking-wider">
                Direct Counterparty Entities ({dossier.neighbors?.length || 0})
              </div>

              <div className="space-y-2">
                {(dossier.neighbors || []).map((nbr) => (
                  <div
                    key={nbr.id}
                    onClick={() => onSelectNode && onSelectNode(nbr.id)}
                    className="p-3 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] hover:border-[#d68a1f]/60 cursor-pointer transition-all flex items-center justify-between text-xs shadow-sm"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-[#ece7de] font-serif">{nbr.label}</div>
                      <div className="text-[11px] text-[#8a8478] font-mono">{nbr.type} • {nbr.relationship}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={
                        nbr.risk_level === 'Critical' ? 'seal-badge-critical' :
                        nbr.risk_level === 'High' ? 'seal-badge-high' :
                        'seal-badge-medium'
                      }>
                        {nbr.risk_level}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-[#8a8478]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT 3: BLOCKCHAIN CHAIN OF CUSTODY */}
          {activeTab === 'custody' && (
            <ChainOfCustodyView nodeId={nodeId} />
          )}

        </div>
      ) : null}

    </div>
  );
}
