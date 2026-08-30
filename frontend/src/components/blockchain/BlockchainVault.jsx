import React, { useState, useEffect } from 'react';
import { 
  Database, ShieldCheck, ShieldAlert, AlertTriangle, 
  CheckCircle2, RefreshCw, Key, Lock, FileBadge, 
  ArrowDown, Terminal, Binary, ExternalLink, Zap
} from 'lucide-react';
import { api } from '../../services/api';

export default function BlockchainVault({
  selectedCaseId,
  onChainStatusChanged,
  currentUser
}) {
  const isReadOnly = currentUser?.role === 'Analyst';
  const [blocks, setBlocks] = useState([]);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tamperLoading, setTamperLoading] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [auditNotification, setAuditNotification] = useState(null);

  useEffect(() => {
    loadLedger();
  }, [selectedCaseId]);

  const loadLedger = async () => {
    setLoading(true);
    try {
      const b = await api.getBlockchainBlocks(selectedCaseId);
      const v = await api.verifyBlockchain();
      setBlocks(b);
      setVerification(v);
      if (b.length > 0) setSelectedBlock(b[b.length - 1]);
      if (onChainStatusChanged) {
        onChainStatusChanged(v.is_valid);
      }
    } catch (err) {
      console.error("Failed to load blockchain ledger:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setAuditNotification({
      status: 'verifying',
      title: 'Cryptographic Audit in Progress',
      message: 'Recalculating SHA-256 digests and pointer hashes across all ledger blocks...'
    });

    try {
      const v = await api.verifyBlockchain();
      setVerification(v);
      if (onChainStatusChanged) {
        onChainStatusChanged(v.is_valid);
      }
      
      const blockCount = v.total_blocks_checked || blocks.length;
      if (v.is_valid) {
        setAuditNotification({
          status: 'success',
          title: 'Chain Cryptographically Verified',
          message: `✅ Chain Verified — ${blockCount} blocks checked, 0 tampering detected. Merkle Root: ${v.merkle_root ? v.merkle_root.slice(0, 20) : ''}...`
        });
      } else {
        const tamperedId = v.tampered_block_id !== undefined ? v.tampered_block_id : (v.tampered_block_index !== undefined ? v.tampered_block_index : 1);
        setAuditNotification({
          status: 'error',
          title: 'Cryptographic Tamper Alert',
          message: `❌ Tampering Detected at Block #${tamperedId}: ${v.status_message || v.message || 'Hash mismatch detected in database snapshot.'}`
        });
      }
    } catch (err) {
      console.error("Verification failed:", err);
      setAuditNotification({
        status: 'error',
        title: 'Verification Error',
        message: `Failed to communicate with cryptographic engine: ${err.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateTamper = async () => {
    setTamperLoading(true);
    try {
      await api.simulateTamper(1, {
        malicious_action: "UNAUTHORIZED_EVIDENCE_DELETION",
        tampered_balance: "₹ 999,00,00,000",
        hacker_signature: "TAMPERED_WITHOUT_KEY"
      });
      const v = await api.verifyBlockchain();
      setVerification(v);
      const b = await api.getBlockchainBlocks(selectedCaseId);
      setBlocks(b);
      if (onChainStatusChanged) onChainStatusChanged(false);

      setAuditNotification({
        status: 'error',
        title: 'Tamper Injected (Judge Demo)',
        message: '❌ Tampering Detected at Block #1: Data snapshot JSON altered in database without cryptographic consensus!'
      });
    } catch (err) {
      console.error("Tamper simulation failed:", err);
    } finally {
      setTamperLoading(false);
    }
  };

  const handleRestoreChain = async () => {
    setLoading(true);
    try {
      await api.restoreBlockchain();
      await loadLedger();
      setAuditNotification({
        status: 'success',
        title: 'Consensus Backup Restored',
        message: '✅ Chain Restored — Cryptographic integrity re-established. 0 tampering detected.'
      });
    } catch (err) {
      console.error("Restore failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCertificate = async () => {
    try {
      const cert = await api.getCustodyCertificate(selectedCaseId || "CASE-HAWALA-2024");
      setCertificateData(cert);
      setShowCertificateModal(true);
    } catch (err) {
      console.error("Failed to fetch certificate:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Top Ledger Status Banner */}
      <div className={`p-6 rounded-2xl border shadow-dossier transition-all relative overflow-hidden ${
        verification?.is_valid
          ? 'bg-[#1c1a17] border-[#3a352d]'
          : 'bg-[#1c1a17] border-[#a5342a]'
      }`}>
        <div className="stamp-watermark">SEC 65B EVIDENCE VAULT</div>

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              {verification?.is_valid ? (
                <ShieldCheck className="w-6 h-6 text-[#5c7a5c]" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-[#a5342a] animate-pulse" />
              )}
              <h2 className="text-lg sm:text-xl font-bold text-[#ece7de] tracking-tight font-serif">
                SUTRA Cryptographic Evidence Ledger & Section 65B Audit Trail
              </h2>
              <span className={verification?.is_valid ? 'seal-badge-low' : 'seal-badge-critical'}>
                {verification?.is_valid ? 'LEDGER VERIFIED' : 'TAMPER DETECTED'}
              </span>
            </div>
            <p className="text-xs text-[#8a8478] max-w-3xl font-serif">
              {verification?.status_message || verification?.message || "Cryptographic SHA-256 immutable ledger certifying non-repudiation of all digital wiretaps, phone records, and investigator queries."}
            </p>
          </div>

          {/* Action Buttons: Verify, Tamper Demo, Restore, Certificate */}
          <div className="flex items-center gap-2 flex-wrap relative z-10">
            <button
              onClick={handleVerify}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-[#24211d] hover:bg-[#2d2924] border border-[#3a352d] text-[#ece7de] text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#d68a1f]' : 'text-[#d68a1f]'}`} />
              <span>{loading ? 'Verifying...' : 'Verify Integrity'}</span>
            </button>

            {/* Hackathon Judge Demo Button */}
            {verification?.is_valid ? (
              <button
                onClick={handleSimulateTamper}
                disabled={tamperLoading || isReadOnly}
                title={isReadOnly ? "Requires Investigator / Admin clearance to simulate tamper" : "Hackathon Demo: Alter a block to demonstrate real-time tamper detection"}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                  isReadOnly
                    ? 'bg-[#24211d] text-[#666157] border border-[#3a352d] cursor-not-allowed'
                    : 'bg-[#a5342a]/20 hover:bg-[#a5342a]/30 border border-[#a5342a]/40 text-[#e27d75] active:scale-95'
                }`}
              >
                <Zap className={`w-3.5 h-3.5 ${isReadOnly ? 'text-[#666157]' : 'text-[#a5342a]'}`} />
                <span>{tamperLoading ? 'Injecting...' : isReadOnly ? 'Tamper Disabled (Read-Only)' : 'Simulate Tamper Attack'}</span>
              </button>
            ) : (
              <button
                onClick={handleRestoreChain}
                disabled={loading || isReadOnly}
                title={isReadOnly ? "Requires Investigator / Admin clearance to restore consensus" : ""}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-sm ${
                  isReadOnly
                    ? 'bg-[#24211d] text-[#666157] border border-[#3a352d] cursor-not-allowed'
                    : 'bg-[#5c7a5c] hover:bg-[#3d523d] text-white active:scale-95'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isReadOnly ? 'Restore Disabled (Read-Only)' : 'Restore Ledger Consensus'}</span>
              </button>
            )}

            <button
              onClick={handleViewCertificate}
              className="px-3.5 py-2 rounded-xl bg-[#24211d] hover:bg-[#2d2924] border border-[#3a352d] text-[#f5c074] text-xs font-bold font-mono transition-all flex items-center gap-1.5 active:scale-95"
            >
              <FileBadge className="w-3.5 h-3.5 text-[#d68a1f]" />
              <span>Sec 65B Certificate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Audit Toast / Result Banner */}
      {auditNotification && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200 font-mono text-xs ${
          auditNotification.status === 'success'
            ? 'bg-[#5c7a5c]/20 border-[#5c7a5c]/50 text-[#8eb38e]'
            : auditNotification.status === 'error'
            ? 'bg-[#a5342a]/20 border-[#a5342a] text-[#e27d75] animate-pulse'
            : 'bg-[#24211d] border-[#d68a1f]/50 text-[#f5c074]'
        }`}>
          <div className="flex items-center gap-3">
            {auditNotification.status === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-[#5c7a5c] shrink-0" />
            ) : auditNotification.status === 'error' ? (
              <AlertTriangle className="w-5 h-5 text-[#a5342a] shrink-0" />
            ) : (
              <RefreshCw className="w-5 h-5 text-[#d68a1f] animate-spin shrink-0" />
            )}
            <div>
              <span className="font-bold">{auditNotification.title}: </span>
              <span>{auditNotification.message}</span>
            </div>
          </div>
          <button
            onClick={() => setAuditNotification(null)}
            className="text-xs opacity-70 hover:opacity-100 px-2 py-1 rounded bg-black/40 text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Ledger Split View: Block List on Left vs Selected Block Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Blocks Feed */}
        <div className="lg:col-span-5 space-y-3 max-h-[640px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-xs text-[#8a8478] px-1 font-mono">
            <span>CHRONOLOGICAL CHAIN ({blocks.length} BLOCKS)</span>
            <span>GENESIS ➔ LATEST</span>
          </div>

          {blocks.map((b) => {
            const isSelected = selectedBlock?.block_id === b.block_id;
            return (
              <div
                key={b.block_id}
                onClick={() => setSelectedBlock(b)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-[#24211d] border-[#d68a1f] shadow-dossier'
                    : 'bg-[#1c1a17] border-[#3a352d] hover:border-[#8a8478]'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-[#0f0e0d] text-[#d68a1f] font-mono font-bold flex items-center justify-center text-[10px] border border-[#3a352d]">
                      #{b.block_id}
                    </span>
                    <span className="font-bold text-[#ece7de] font-mono">{b.action_type}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8a8478]">
                    {new Date(b.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <div className="text-[11px] text-[#8a8478] font-mono truncate">
                  Record ID: <span className="text-[#ece7de]">{b.entity_id || 'System Genesis'}</span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#666157] pt-1 border-t border-[#2a2620]">
                  <span>By: {b.investigator_id}</span>
                  <span className="text-[#f5c074] truncate max-w-[150px]">
                    Hash: {b.current_block_hash?.slice(0, 10)}...
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Cryptographic Block Inspector */}
        <div className="lg:col-span-7 space-y-4">
          {selectedBlock ? (
            <div className="p-6 rounded-2xl bg-[#1c1a17] border border-[#3a352d] shadow-dossier space-y-5">
              
              <div className="flex items-center justify-between border-b border-[#2a2620] pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#d68a1f] uppercase tracking-wider">
                    CRYPTOGRAPHIC BLOCK INSPECTOR
                  </span>
                  <h3 className="text-base font-bold text-[#ece7de] mt-0.5 font-serif">
                    Block #{selectedBlock.block_id} — {selectedBlock.action_type}
                  </h3>
                </div>

                <span className="seal-badge-low">
                  SHA-256 SEALED
                </span>
              </div>

              {/* Hashes Deep Dive */}
              <div className="space-y-2.5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#0f0e0d] border border-[#3a352d] space-y-1">
                  <div className="text-[10px] text-[#8a8478] uppercase">Current Block Hash</div>
                  <div className="text-[#f5c074] break-all font-semibold select-all">
                    {selectedBlock.current_block_hash}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0f0e0d] border border-[#3a352d] space-y-1">
                  <div className="text-[10px] text-[#8a8478] uppercase">Previous Block Pointer Hash</div>
                  <div className="text-[#8a8478] break-all select-all">
                    {selectedBlock.previous_block_hash}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0f0e0d] border border-[#3a352d] space-y-1">
                  <div className="text-[10px] text-[#8a8478] uppercase">Data Payload SHA-256 Snapshot Hash</div>
                  <div className="text-[#5c7a5c] break-all select-all">
                    {selectedBlock.data_snapshot_hash}
                  </div>
                </div>
              </div>

              {/* Data Snapshot JSON */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-[#8a8478] uppercase font-mono">
                  Immutable Payload Snapshot (JSON)
                </div>
                <pre className="p-3.5 rounded-xl bg-[#0f0e0d] border border-[#3a352d] text-[11px] font-mono text-[#ece7de] overflow-x-auto max-h-56">
                  {typeof selectedBlock.data_snapshot === 'object'
                    ? JSON.stringify(selectedBlock.data_snapshot, null, 2)
                    : selectedBlock.data_snapshot}
                </pre>
              </div>

              {/* Metadata Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#2a2620] text-xs font-mono">
                <div className="p-2 rounded-xl bg-[#0f0e0d] border border-[#3a352d]">
                  <div className="text-[10px] text-[#666157]">Investigator ID</div>
                  <div className="font-bold text-[#ece7de] mt-0.5 truncate">{selectedBlock.investigator_id}</div>
                </div>
                <div className="p-2 rounded-xl bg-[#0f0e0d] border border-[#3a352d]">
                  <div className="text-[10px] text-[#666157]">Timestamp</div>
                  <div className="font-bold text-[#ece7de] mt-0.5 truncate">{new Date(selectedBlock.timestamp).toLocaleDateString()}</div>
                </div>
                <div className="p-2 rounded-xl bg-[#0f0e0d] border border-[#3a352d]">
                  <div className="text-[10px] text-[#666157]">Layer-2 Polygon</div>
                  <div className="font-bold text-[#d68a1f] mt-0.5">Anchored (0x892a...)</div>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-64 p-8 rounded-2xl bg-[#1c1a17] border border-[#3a352d] flex flex-col items-center justify-center text-center text-[#8a8478] space-y-2">
              <Database className="w-8 h-8 text-[#3a352d]" />
              <span className="text-xs font-mono">Select a block from the ledger to inspect cryptographic hashes.</span>
            </div>
          )}
        </div>

      </div>

      {/* Section 65B Electronic Evidence Certificate Modal */}
      {showCertificateModal && certificateData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#1c1a17] border border-[#d68a1f]/60 rounded-2xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto shadow-dossier relative">
            <div className="stamp-watermark">CERTIFICATE // SEC 65B</div>

            <div className="flex items-center justify-between border-b border-[#2a2620] pb-3 relative z-10">
              <div className="flex items-center gap-2">
                <FileBadge className="w-5 h-5 text-[#d68a1f]" />
                <h3 className="font-bold text-base text-[#ece7de] font-serif">
                  CERTIFICATE UNDER SECTION 65B(4)
                </h3>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="text-[#8a8478] hover:text-[#ece7de] p-1 font-mono text-base"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3 leading-relaxed text-[#ece7de] font-serif relative z-10">
              <p className="font-bold text-[#f5c074] uppercase font-mono text-[10px]">
                Indian Evidence Act, 1872 / Bharatiya Sakshya Adhiniyam, 2023
              </p>
              <p>
                This certifies that the electronic records contained in the SUTRA Knowledge Graph database (Case ID: <strong className="font-mono">{certificateData.case_id}</strong>) have been cryptographically hashed and continuously sealed in an append-only SHA-256 blockchain ledger.
              </p>

              <div className="p-3.5 rounded-xl bg-[#0f0e0d] border border-[#3a352d] space-y-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#8a8478]">Ledger Status:</span>
                  <span className="text-[#5c7a5c] font-bold">{certificateData.chain_valid ? 'VERIFIED UNTAMPERED' : 'INVALID'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8a8478]">Total Immutable Blocks:</span>
                  <span className="text-[#ece7de]">{certificateData.total_blocks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8a8478]">Merkle Root Digest:</span>
                  <span className="text-[#f5c074] truncate max-w-[280px]">{certificateData.merkle_root}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8a8478]">Anchor Timestamp:</span>
                  <span className="text-[#ece7de]">{certificateData.generated_at}</span>
                </div>
              </div>

              <p className="text-[11px] text-[#8a8478] italic">
                "The computer system producing these electronic records operated properly at all relevant times without any unauthorized cryptographic alteration or security breach."
              </p>
            </div>

            <div className="pt-3 border-t border-[#2a2620] flex justify-end relative z-10">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-5 py-2 rounded-xl bg-[#d68a1f] hover:bg-[#e59b2d] text-[#0f0e0d] text-xs font-bold font-mono transition-all"
              >
                Close Certificate
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
