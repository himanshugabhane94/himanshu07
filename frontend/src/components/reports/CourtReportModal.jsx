import React from 'react';
import { FileText, Printer, Download, X, ExternalLink, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';

export default function CourtReportModal({ caseId, onClose }) {
  const dossierUrl = api.getDossierUrl(caseId || "CASE-HAWALA-2024");

  const handlePrint = () => {
    const iframe = document.getElementById('dossier-iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.print();
    } else {
      window.open(dossierUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-5xl h-[90vh] bg-[#1c1a17] border border-[#3a352d] rounded-2xl shadow-dossier flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 bg-[#0f0e0d] border-b border-[#3a352d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1c1a17] border border-[#3a352d] flex items-center justify-center text-[#d68a1f]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#ece7de] font-serif">
                SUTRA Court-Admissible Intelligence Dossier & Section 65B Export
              </h3>
              <p className="text-xs text-[#8a8478] font-serif italic">
                Statutory format compliant with Section 65B Indian Evidence Act & Bharatiya Sakshya Adhiniyam 2023.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-[#d68a1f] hover:bg-[#e59b2d] text-[#0f0e0d] text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Export PDF</span>
            </button>
            <a
              href={dossierUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-[#24211d] hover:bg-[#2d2924] text-[#ece7de] transition-all border border-[#3a352d]"
              title="Open in new window"
            >
              <ExternalLink className="w-4 h-4 text-[#d68a1f]" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#24211d] hover:bg-[#2d2924] text-[#8a8478] hover:text-[#ece7de] transition-all border border-[#3a352d]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Embedded Live Report Preview Iframe */}
        <div className="flex-1 w-full bg-white">
          <iframe
            id="dossier-iframe"
            src={dossierUrl}
            title="SUTRA Court Intelligence Dossier"
            className="w-full h-full border-0"
          />
        </div>

      </div>
    </div>
  );
}
