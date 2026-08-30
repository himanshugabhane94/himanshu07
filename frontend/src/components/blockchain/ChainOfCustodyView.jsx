import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ShieldAlert, Key, Database, 
  Search, Filter, ExternalLink, ArrowRight, 
  Clock, Hash, UserCheck, CheckCircle2, AlertTriangle, 
  FileText, Copy, Check, Layers
} from 'lucide-react';
import { api } from '../../services/api';

export default function ChainOfCustodyView({ entityId, caseId }) {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [copiedHash, setCopiedHash] = useState(null);
  const [filterAction, setFilterAction] = useState('ALL');

  useEffect(() => {
    loadLedgerData();
  }, [entityId, caseId, filterAction]);

  const loadLedgerData = async () => {
    setLoading(true);
    try {
      let data = [];
      if (entityId) {
        data = await api.getEntityChainOfCustody(entityId);
      } else {
        data = await api.getLedger({
          caseId: caseId,
          actionType: filterAction === 'ALL' ? null : filterAction
        });
      }
      setBlocks(data);
    } catch (err) {
      console.error("Failed to load chain of custody:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(key);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-2 text-[#a8a59e]">
        <div className="w-6 h-6 border-2 border-[#40916c] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-mono">Verifying cryptographic chain-of-custody hashes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-[#141618] border border-[#2d3238] flex flex-wrap items-center justify-between gap-3 shadow-dossier">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#40916c]" />
            <h4 className="font-bold text-xs text-[#e8e6e1] uppercase tracking-wider font-mono">
              {entityId ? `Chain-of-Custody Audit Trail: [${entityId}]` : `Immutable Evidence Ledger`}
            </h4>
          </div>
          <p className="text-[11px] text-[#a8a59e] mt-0.5 font-serif italic">
            Every evidentiary action is sealed with a SHA-256 cryptographic digest under Section 65B of the Indian Evidence Act.
          </p>
        </div>

        {!entityId && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#a8a59e] font-mono text-[10px]">Action Filter:</span>
            {['ALL', 'CREATE', 'INTERCEPT', 'INGEST', 'QUERY'].map(act => (
              <button
                key={act}
                onClick={() => setFilterAction(act)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                  filterAction === act
                    ? 'bg-[#2d6a4f]/20 text-[#60c48e] border-[#2d6a4f]/40 font-bold'
                    : 'bg-[#1a1d1f] text-[#a8a59e] border-[#2d3238] hover:text-[#e8e6e1]'
                }`}
              >
                {act}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Blocks Sequence List */}
      <div className="space-y-2.5">
        {blocks.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#6f6c65] bg-[#141618] rounded-xl border border-[#2d3238] font-mono">
            No chain-of-custody events recorded for this selection.
          </div>
        ) : (
          blocks.map((block) => {
            const isExpanded = selectedBlock?.block_id === block.block_id;
            return (
              <div 
                key={block.block_id}
                className={`p-3.5 rounded-xl border transition-all space-y-2 ${
                  isExpanded 
                    ? 'bg-[#1a1d1f] border-[#c9a227]/60 shadow-dossier' 
                    : 'bg-[#141618] border-[#2d3238] hover:border-[#3d444d]'
                }`}
              >
                <div 
                  onClick={() => setSelectedBlock(isExpanded ? null : block)}
                  className="flex items-center justify-between cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-[#1a1d1f] text-[#e5c970] font-mono font-bold flex items-center justify-center text-[10px] border border-[#2d3238]">
                      #{block.block_id}
                    </span>
                    <span className="font-bold text-[#e8e6e1] font-mono">{block.action_type}</span>
                    <span className="text-[10px] text-[#6f6c65] font-mono">
                      ({block.investigator_id})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#a8a59e]">
                      {new Date(block.timestamp).toLocaleString()}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#2d6a4f]/20 text-[#60c48e] border border-[#2d6a4f]/40 font-mono">
                      SEALED
                    </span>
                  </div>
                </div>

                {/* Hashes Snapshot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                  <div className="flex items-center justify-between p-1.5 rounded bg-[#141618] border border-[#2d3238]">
                    <span className="text-[#6f6c65] truncate">Hash: {block.current_block_hash?.slice(0, 18)}...</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(block.current_block_hash, `curr-${block.block_id}`);
                      }}
                      className="text-[#a8a59e] hover:text-[#e5c970]"
                    >
                      {copiedHash === `curr-${block.block_id}` ? <Check className="w-3 h-3 text-[#60c48e]" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-1.5 rounded bg-[#141618] border border-[#2d3238]">
                    <span className="text-[#6f6c65] truncate">Prev: {block.previous_block_hash?.slice(0, 18)}...</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(block.previous_block_hash, `prev-${block.block_id}`);
                      }}
                      className="text-[#a8a59e] hover:text-[#e5c970]"
                    >
                      {copiedHash === `prev-${block.block_id}` ? <Check className="w-3 h-3 text-[#60c48e]" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Deep Inspector when Expanded */}
                {isExpanded && (
                  <div className="pt-2 border-t border-[#2d3238] space-y-2 text-xs font-mono animate-in fade-in">
                    <div className="text-[10px] text-[#a8a59e] uppercase font-bold">
                      Evidentiary Payload Snapshot:
                    </div>
                    <pre className="p-2.5 rounded bg-[#141618] border border-[#2d3238] text-[10px] text-[#e8e6e1] overflow-x-auto max-h-40">
                      {typeof block.data_snapshot === 'object'
                        ? JSON.stringify(block.data_snapshot, null, 2)
                        : block.data_snapshot}
                    </pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
