import React, { useState } from 'react';
import { 
  Binary, FileText, UploadCloud, PlusCircle, CheckCircle2, 
  Sparkles, ArrowRight, ShieldCheck, Database, RefreshCw, FileCode,
  FileSpreadsheet, AlertCircle, Trash2, Layers, Check
} from 'lucide-react';
import { api } from '../../services/api';

export default function IngestionStudio({
  selectedCaseId,
  onDataIngested,
  currentUser
}) {
  const isReadOnly = currentUser?.role === 'Analyst';
  const [ingestMode, setIngestMode] = useState('nlp');
  const [rawText, setRawText] = useState('');
  const [sourceType, setSourceType] = useState('FIR');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [extractionResult, setExtractionResult] = useState(null);
  const [commitSuccess, setCommitSuccess] = useState(null);

  // Bulk File Upload State
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [bulkExtractionResult, setBulkExtractionResult] = useState(null);
  const [bulkIsCommitting, setBulkIsCommitting] = useState(false);
  const [bulkCommitSuccess, setBulkCommitSuccess] = useState(null);
  const [bulkParseError, setBulkParseError] = useState(null);

  // Manual Node & Edge States
  const [manualLabel, setManualLabel] = useState('');
  const [manualType, setManualType] = useState('Person');
  const [manualRisk, setManualRisk] = useState('High');

  const sampleTexts = [
    {
      title: "FIR 402/2024 (Hawala Syndicate Wiretap)",
      type: "FIR",
      text: `CONFIDENTIAL SPECIAL CELL INTERCEPTION MEMO:
During technical surveillance of FIR 402/2024, suspect Vikram Sharma (alias 'Vicky Seth') was intercepted using phone +91-98201-99881. He instructed courier Rohit Khanna to collect cash at Zaveri Bazaar Secret Vault and meet with Sameer Merchant of Zenith Import & Export Pvt Ltd.
Funds amounting to ₹ 4,50,00,000 were transferred from HDFC Mule Account #501004 to ICICI Layering Acc #000419.
Subsequently, overseas remittance was routed to Apex Global Overseas FZE in Dubai via Telegram @vicky_vault_dxb.
Suspect Tariq Mansoor received funds into Emirates NBD Corporate #4489 and converted into USDT Cold Wallet 0x71cA4918ef9bC81920aa1982bbfe098172918b99.`
    },
    {
      title: "NCB Narcotics Interception Report",
      type: "Interrogation_Report",
      text: `NARCOTICS CONTROL BUREAU RAID REPORT:
Acting on electronic intelligence, operative Gurpreet Singh (alias 'Laddi') was intercepted operating Thuraya Satellite Comms XT-0918 near Attari Border Concealment Point.
Suspect Iqbal Mir operating +92-300-8812741 transmitted GPS coordinates for a 12kg consignment.
Gurpreet coordinated with fleet dispatcher Rakesh Yadav of Falcon Transways & Logistics to transport contraband in Tata 16-Wheeler PB-10-CZ-4412.
Consignment was delivered to Manoj Shukla at Mayapuri Secret Chemical Godown for processing with precursor chemicals from Shree Biotech Chemical Labs.`
    },
    {
      title: "NIA Intercepted Telegram Chat Log",
      type: "Chat_Log",
      text: `INTERCEPTED ENCRYPTED LOG:
Controller Zuber Farooq linked via Matrix Node onion://subversion77.onion to technician Mohd. Rehan.
Deposit of ₹ 60 Lakhs completed through ChipMixer CoinJoin Tx to operative Bilal Ahmed for procuring forged passports.
Operative Asif Nazir using phone +91-70061-00214 rendezvoused at Okhla Jamia Safe Apartment with Naveed Khan driving Bajaj Pulsar DL-3S-CJ-9912.`
    }
  ];

  const handleRunNlp = async () => {
    if (!rawText.trim()) return;
    setIsExtracting(true);
    setExtractionResult(null);
    setCommitSuccess(null);
    try {
      const res = await api.extractNlp(rawText, selectedCaseId, sourceType);
      setExtractionResult(res);
    } catch (err) {
      console.error("NLP extraction failed:", err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleCommitToGraph = async () => {
    if (!extractionResult) return;
    setIsCommitting(true);
    try {
      const res = await api.commitNlp(extractionResult);
      setCommitSuccess(res);
      if (onDataIngested) {
        onDataIngested();
      }
    } catch (err) {
      console.error("Commit failed:", err);
    } finally {
      setIsCommitting(false);
    }
  };

  // ==========================================
  // BULK CSV / JSON FILE PROCESSING ENGINE
  // ==========================================
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const processUploadedFile = (file) => {
    setUploadedFile(file);
    setBulkParseError(null);
    setBulkCommitSuccess(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (!content || typeof content !== 'string') return;

      try {
        if (file.name.endsWith('.json')) {
          parseJsonFile(content, file.name);
        } else {
          parseCsvFile(content, file.name);
        }
      } catch (err) {
        console.error("Parsing file failed:", err);
        setBulkParseError(`Failed to parse ${file.name}: ${err.message}`);
      }
    };

    reader.readAsText(file);
  };

  const parseJsonFile = (content, fileName) => {
    const data = JSON.parse(content);
    const caseId = selectedCaseId || "CASE-HAWALA-2024";

    let entities = [];
    let relationships = [];

    if (Array.isArray(data)) {
      entities = data.map((item, idx) => ({
        id: item.id || `ENT_${Date.now()}_${idx}`,
        text: item.label || item.name || `Entity_${idx}`,
        label: item.label || item.name || `Entity_${idx}`,
        type: item.type || "Person",
        risk_level: item.risk_level || "Medium",
        confidence: item.confidence || 0.95,
        properties: item.properties || {}
      }));
    } else if (data.nodes || data.entities) {
      const rawNodes = data.nodes || data.entities || [];
      const rawEdges = data.edges || data.relationships || [];

      entities = rawNodes.map((item, idx) => ({
        id: item.id || `ENT_${Date.now()}_${idx}`,
        text: item.label || item.name || `Entity_${idx}`,
        label: item.label || item.name || `Entity_${idx}`,
        type: item.type || "Person",
        risk_level: item.risk_level || "Medium",
        confidence: item.confidence || 0.95,
        properties: item.properties || {}
      }));

      relationships = rawEdges.map((edge) => ({
        source_text: edge.source_text || edge.source || edge.from,
        target_text: edge.target_text || edge.target || edge.to,
        type: (edge.type || edge.relation || "CONNECTED_TO").toUpperCase().replace(/\s+/g, '_'),
        confidence: edge.confidence || 0.90,
        weight: edge.weight || 1.0,
        evidence_snippet: edge.evidence_snippet || `Imported from ${fileName}`
      }));
    }

    setBulkExtractionResult({
      case_id: caseId,
      source_type: "JSON_INGESTION",
      summary: `Parsed ${entities.length} entities and ${relationships.length} relationships from ${fileName}.`,
      total_entities_found: entities.length,
      total_relationships_found: relationships.length,
      extracted_entities: entities,
      extracted_relationships: relationships
    });
  };

  const parseCsvFile = (content, fileName) => {
    const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      throw new Error("CSV file contains no records or header.");
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^['"]|['"]$/g, ''));
      if (values.length === headers.length) {
        const rowObj = {};
        headers.forEach((h, idx) => {
          rowObj[h] = values[idx];
        });
        rows.push(rowObj);
      }
    }

    const caseId = selectedCaseId || "CASE-HAWALA-2024";
    const entityMap = new Map();
    const relationships = [];

    const getOrAddEntity = (label, type = "Person", risk = "Medium", extraProps = {}) => {
      if (!entityMap.has(label)) {
        entityMap.set(label, {
          id: `ENT_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          text: label,
          label: label,
          type: type,
          risk_level: risk,
          confidence: 0.95,
          properties: { ...extraProps, source_csv: fileName }
        });
      }
      return entityMap.get(label);
    };

    rows.forEach((row, idx) => {
      const caller = row.caller || row.source || row.sender || row.from || row.from_node;
      const receiver = row.receiver || row.target || row.recipient || row.to || row.to_node;
      const duration = row.duration || row.duration_sec || row.amount || row.weight;
      const role = row.role || row.action || row.relation || row.type || "COMMUNICATED_WITH";

      if (caller && receiver) {
        const callerType = caller.startsWith('+') || /^\d{10}$/.test(caller) ? "Phone" : "Person";
        const receiverType = receiver.startsWith('+') || /^\d{10}$/.test(receiver) ? "Phone" : (receiver.startsWith('0x') ? "DigitalID" : "Person");

        const src = getOrAddEntity(caller, callerType, "High", { duration, row_index: idx + 1 });
        const tgt = getOrAddEntity(receiver, receiverType, "High", { duration, row_index: idx + 1 });

        relationships.push({
          source_text: src.text,
          target_text: tgt.text,
          type: role.toUpperCase().replace(/\s+/g, '_'),
          confidence: 0.92,
          weight: parseFloat(duration) || 1.0,
          evidence_snippet: `CDR / Transaction row #${idx+1} from ${fileName}`
        });
      } else {
        const name = row.name || row.label || row.entity || row.suspect;
        const type = row.type || "Person";
        const risk = row.risk || row.risk_level || "Medium";
        getOrAddEntity(name, type, risk, row);
      }
    });

    const entities = Array.from(entityMap.values());

    setBulkExtractionResult({
      case_id: caseId,
      source_type: "CSV_CDR_INGESTION",
      summary: `Parsed ${rows.length} CSV records into ${entities.length} entities and ${relationships.length} relational edges from ${fileName}.`,
      total_entities_found: entities.length,
      total_relationships_found: relationships.length,
      extracted_entities: entities,
      extracted_relationships: relationships
    });
  };

  const handleCommitBulk = async () => {
    if (!bulkExtractionResult) return;
    setBulkIsCommitting(true);
    try {
      const res = await api.commitNlp(bulkExtractionResult);
      setBulkCommitSuccess(res);
      if (onDataIngested) {
        onDataIngested();
      }
    } catch (err) {
      console.error("Bulk commit failed:", err);
      setBulkParseError(err.message);
    } finally {
      setBulkIsCommitting(false);
    }
  };

  const handleLoadSampleCdr = () => {
    const sampleCsv = `caller,receiver,duration_sec,type,timestamp
+91-98110-44910,+91-99882-33441,412,CALL_INTERCEPT,2026-08-24 14:22:00
+91-98110-44910,+91-98201-99881,180,CALL_INTERCEPT,2026-08-24 16:05:00
+91-99882-33441,HDFC Mule #501004,1,UPI_TRANSFER,2026-08-25 09:12:00
HDFC Mule #501004,ICICI Layering #000419,1,NEFT_HAWALA,2026-08-25 11:30:00
ICICI Layering #000419,0x71cA4918ef9bC81920aa1982bbfe098172918b99,1,CRYPTO_CONVERSION,2026-08-25 14:00:00`;
    parseCsvFile(sampleCsv, 'Sample_CDR_Hawala_Ledger.csv');
    setUploadedFile({ name: 'Sample_CDR_Hawala_Ledger.csv', size: sampleCsv.length });
  };

  const handleLoadSampleThreatJson = () => {
    const sampleJson = {
      nodes: [
        { id: "ENT_SAMPLE_1", label: "Col. Tariq Al-Mansoor", type: "Person", risk_level: "Critical", properties: { designation: "Overseas Hawala Controller" } },
        { id: "ENT_SAMPLE_2", label: "+971-50-9918234", type: "Phone", risk_level: "Critical", properties: { provider: "Etisalat UAE" } },
        { id: "ENT_SAMPLE_3", label: "Emirates NBD #448901", type: "BankAccount", risk_level: "Critical", properties: { jurisdiction: "Dubai, UAE" } },
        { id: "ENT_SAMPLE_4", label: "Apex Global Overseas FZE", type: "Organization", risk_level: "Critical", properties: { entity_type: "Shell Company" } }
      ],
      edges: [
        { source: "ENT_SAMPLE_1", target: "ENT_SAMPLE_2", type: "OPERATES_PHONE", weight: 3.5, evidence_snippet: "Registered via Dubai passport wiretap" },
        { source: "ENT_SAMPLE_1", target: "ENT_SAMPLE_3", type: "BENEFICIAL_OWNER", weight: 5.0, evidence_snippet: "Corporate bank signing authority" },
        { source: "ENT_SAMPLE_3", target: "ENT_SAMPLE_4", type: "CORPORATE_ACCOUNT_OF", weight: 4.0, evidence_snippet: "Shell entity commercial registry" }
      ]
    };
    parseJsonFile(JSON.stringify(sampleJson, null, 2), 'Overseas_Syndicate_Intelligence.json');
    setUploadedFile({ name: 'Overseas_Syndicate_Intelligence.json', size: 1024 });
  };

  const handleManualCreateNode = async (e) => {
    e.preventDefault();
    if (!manualLabel) return;
    try {
      await api.createNode({
        label: manualLabel,
        type: manualType,
        risk_level: manualRisk,
        case_id: selectedCaseId || "CASE-HAWALA-2024",
        properties: { manual_entry: true }
      });
      setManualLabel('');
      alert("Entity created & logged to SUTRA blockchain ledger!");
      if (onDataIngested) onDataIngested();
    } catch (err) {
      console.error("Manual creation error:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-[#1c1a17] border border-[#3a352d] shadow-dossier flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        <div className="stamp-watermark">INTAKE STUDIO</div>

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#d68a1f]" />
            <h2 className="text-lg sm:text-xl font-bold text-[#ece7de] tracking-tight font-serif">
              SUTRA Intelligence Intake & NLP Extraction Studio
            </h2>
          </div>
          <p className="text-xs text-[#8a8478] font-serif">
            Domain-trained forensic NLP engine for extracting suspects, mules, burner phones, and clandestine links from raw police FIR narratives, Call Detail Records (CDR), and banking STRs.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-[#0f0e0d] p-1.5 rounded-2xl border border-[#3a352d] relative z-10">
          {[
            { id: 'nlp', label: 'AI NLP Narrative Extractor', icon: Sparkles },
            { id: 'bulk', label: 'CSV / JSON Importer', icon: UploadCloud },
            { id: 'manual', label: 'Manual Entity Entry', icon: PlusCircle },
          ].map((mode) => {
            const Icon = mode.icon;
            const active = ingestMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setIngestMode(mode.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-[#24211d] text-[#f5c074] border border-[#d68a1f]/50 shadow-sm'
                    : 'text-[#8a8478] hover:text-[#ece7de] hover:bg-[#24211d]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#d68a1f]' : 'text-[#8a8478]'}`} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==========================================
          MODE 1: AI NLP NARRATIVE EXTRACTOR
          ========================================== */}
      {ingestMode === 'nlp' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column: Input Form & Sample Memos */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#1c1a17] border border-[#3a352d] shadow-dossier space-y-4">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#ece7de] uppercase tracking-wider font-mono">
                  Raw Intelligence Narrative / Document
                </span>
                <span className="text-[10px] font-mono text-[#f5c074]">
                  Target Case: {selectedCaseId || "CASE-HAWALA-2024"}
                </span>
              </div>

              {/* Sample Memos Quick Select */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-[#8a8478] font-semibold block font-mono">
                  Quick Load Intercepted Intelligence Samples:
                </label>
                <div className="flex flex-wrap gap-2">
                  {sampleTexts.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setRawText(sample.text);
                        setSourceType(sample.type);
                        setExtractionResult(null);
                        setCommitSuccess(null);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-[#0f0e0d] hover:bg-[#24211d] border border-[#3a352d] hover:border-[#d68a1f]/50 text-[11px] text-[#8a8478] hover:text-[#ece7de] transition-all font-medium font-serif"
                    >
                      {sample.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Source Type Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8a8478] font-mono">Document Type:</span>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value)}
                  className="bg-[#0f0e0d] border border-[#3a352d] rounded-xl px-2.5 py-1 text-xs text-[#ece7de] font-mono focus:outline-none focus:border-[#d68a1f]"
                >
                  <option value="FIR">Police First Information Report (FIR)</option>
                  <option value="Interrogation_Report">Interrogation Report / Confession</option>
                  <option value="Chat_Log">Encrypted Chat Wiretap (WhatsApp/Telegram)</option>
                  <option value="CDR_Notes">Call Detail Record (CDR) Field Notes</option>
                  <option value="Bank_STR">Suspicious Transaction Report (STR)</option>
                </select>
              </div>

              {/* Textarea */}
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste raw police FIR narrative, interrogation transcripts, chat dumps, or phone wiretap notes here..."
                rows={9}
                className="w-full p-3.5 bg-[#0f0e0d] border border-[#3a352d] rounded-2xl text-xs font-mono text-[#ece7de] placeholder-[#666157] focus:outline-none focus:border-[#d68a1f] transition-colors leading-relaxed"
              />

              <button
                onClick={handleRunNlp}
                disabled={isExtracting || !rawText.trim()}
                className="w-full py-2.5 rounded-xl bg-[#d68a1f] hover:bg-[#e59b2d] disabled:opacity-50 text-[#0f0e0d] text-xs font-bold font-mono shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {isExtracting ? (
                  <div className="w-4 h-4 border-2 border-[#0f0e0d] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run SUTRA Domain NLP Extraction</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Live Extraction Preview & Commit Button */}
          <div className="space-y-4">
            {extractionResult ? (
              <div className="p-5 rounded-2xl bg-[#1c1a17] border border-[#d68a1f]/40 shadow-dossier space-y-4">
                
                <div className="flex items-center justify-between border-b border-[#2a2620] pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-[#ece7de] font-serif">
                      Discovered Entities ({extractionResult.total_entities_found}) & Links ({extractionResult.total_relationships_found})
                    </h3>
                    <p className="text-[11px] text-[#8a8478] mt-0.5 font-serif">{extractionResult.summary}</p>
                  </div>
                </div>

                {/* Entities List */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  <div className="text-xs font-bold text-[#8a8478] uppercase font-mono">Extracted Entities:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {extractionResult.extracted_entities.map((ent) => (
                      <div
                        key={ent.id}
                        className="p-2 rounded-xl bg-[#0f0e0d] border border-[#3a352d] text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-[#ece7de] font-serif">{ent.label}</div>
                          <div className="text-[10px] text-[#8a8478] font-mono">{ent.type}</div>
                        </div>
                        <span className={
                          ent.risk_level === 'Critical' ? 'seal-badge-critical' :
                          ent.risk_level === 'High' ? 'seal-badge-high' :
                          'seal-badge-medium'
                        }>
                          {ent.risk_level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Relationships List */}
                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 pt-2 border-t border-[#2a2620]">
                  <div className="text-xs font-bold text-[#8a8478] uppercase font-mono">Inferred Relational Edges:</div>
                  {extractionResult.extracted_relationships.map((rel, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-[#0f0e0d] border border-[#3a352d] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#f5c074] font-mono">
                          {rel.source_text} ➔ {rel.target_text}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#1c1a17] text-[#ece7de] rounded border border-[#3a352d]">
                          {rel.type} ({Math.round(rel.confidence * 100)}%)
                        </span>
                      </div>
                      <div className="text-[10px] text-[#8a8478] font-serif italic">
                        "{rel.evidence_snippet}"
                      </div>
                    </div>
                  ))}
                </div>

                {/* Commit Action Button */}
                <div className="pt-3 border-t border-[#2a2620]">
                  <button
                    onClick={handleCommitToGraph}
                    disabled={isCommitting || isReadOnly}
                    title={isReadOnly ? "Requires Investigator or Admin clearance to commit evidence to ledger" : ""}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold font-mono shadow-sm transition-all flex items-center justify-center gap-2 ${
                      isReadOnly 
                        ? 'bg-[#24211d] text-[#666157] border border-[#3a352d] cursor-not-allowed'
                        : 'bg-[#5c7a5c] hover:bg-[#3d523d] text-white active:scale-95'
                    }`}
                  >
                    {isCommitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : isReadOnly ? (
                      <>
                        <AlertCircle className="w-4 h-4 text-[#a5342a]" />
                        <span>Commit Disabled (Requires Investigator Clearance)</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Commit to SUTRA Knowledge Graph & Ledger</span>
                      </>
                    )}
                  </button>
                </div>

                {commitSuccess && (
                  <div className="p-3 rounded-xl bg-[#5c7a5c]/20 border border-[#5c7a5c]/50 text-xs text-[#8eb38e] flex items-center gap-2 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-[#5c7a5c] shrink-0" />
                    <span>{commitSuccess.message} Cryptographic block appended.</span>
                  </div>
                )}

              </div>
            ) : (
              <div className="h-full min-h-[350px] p-8 rounded-2xl bg-[#1c1a17]/60 border border-[#3a352d] border-dashed flex flex-col items-center justify-center text-center text-[#8a8478] space-y-3">
                <FileCode className="w-10 h-10 text-[#3a352d]" />
                <div className="space-y-1">
                  <div className="font-bold text-[#ece7de] text-sm font-serif">Extraction Preview Area</div>
                  <p className="text-xs max-w-sm font-serif">
                    Select a sample memo on the left or paste your own FIR text, then click "Run SUTRA Domain NLP Extraction".
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ==========================================
          MODE 2: BULK CSV / JSON INGESTION
          ========================================== */}
      {ingestMode === 'bulk' && (
        <div className="space-y-6">
          
          {/* Top Dropzone & Sample Buttons */}
          <div className="p-8 rounded-2xl bg-[#1c1a17] border border-[#3a352d] text-center space-y-5 shadow-dossier">
            <UploadCloud className="w-12 h-12 text-[#d68a1f] mx-auto" />
            <div className="space-y-1">
              <h3 className="font-bold text-base text-[#ece7de] font-serif">Bulk Intake Pipeline</h3>
              <p className="text-xs text-[#8a8478] max-w-md mx-auto font-serif">
                Drag & Drop Call Detail Records (CDR.csv), Bank Transfer Ledgers (STR.xlsx), or Suspect JSON metadata files.
              </p>
            </div>

            {/* Clickable & Draggable Native Label Drop Zone */}
            <label
              htmlFor="bulk-file-upload-input"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files?.[0]) {
                  processUploadedFile(e.dataTransfer.files[0]);
                }
              }}
              className={`block p-8 border-2 border-dashed rounded-2xl max-w-lg mx-auto cursor-pointer transition-all ${
                isDragging 
                  ? 'border-[#d68a1f] bg-[#d68a1f]/10 shadow-lg scale-[1.02]' 
                  : 'border-[#3a352d] hover:border-[#d68a1f]/70 bg-[#0f0e0d] hover:bg-[#0f0e0d]/80'
              }`}
            >
              {/* Native hidden file input */}
              <input
                id="bulk-file-upload-input"
                type="file"
                accept=".csv,.json,.txt"
                onChange={handleFileChange}
                style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}
              />

              <div className="flex flex-col items-center gap-2 pointer-events-none">
                <FileSpreadsheet className={`w-8 h-8 ${isDragging ? 'text-[#d68a1f] animate-bounce' : 'text-[#8a8478]'}`} />
                <div>
                  <span className="text-xs text-[#d68a1f] font-bold hover:underline font-mono">Click to browse files</span>
                  <span className="text-xs text-[#8a8478] font-serif"> or drag and drop here</span>
                </div>
                <span className="text-[10px] text-[#666157] font-mono">
                  Supported formats: CSV, JSON, TXT (Auto-detects CDR & Bank Ledgers)
                </span>
              </div>
            </label>

            {/* Quick Demo Pre-Load Buttons */}
            <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
              <span className="text-xs text-[#8a8478] font-semibold font-mono">Judge Demo Templates:</span>
              <button
                type="button"
                onClick={handleLoadSampleCdr}
                className="px-3 py-1.5 rounded-xl bg-[#0f0e0d] hover:bg-[#24211d] border border-[#3a352d] hover:border-[#d68a1f]/40 text-[#f5c074] text-xs font-semibold font-mono transition-all flex items-center gap-1.5 active:scale-95"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#d68a1f]" />
                <span>Load Sample CDR (CSV)</span>
              </button>
              <button
                type="button"
                onClick={handleLoadSampleThreatJson}
                className="px-3 py-1.5 rounded-xl bg-[#0f0e0d] hover:bg-[#24211d] border border-[#3a352d] hover:border-[#d68a1f]/40 text-[#ece7de] text-xs font-semibold font-mono transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Layers className="w-3.5 h-3.5 text-[#d68a1f]" />
                <span>Load Overseas Threat Graph (JSON)</span>
              </button>
            </div>
          </div>

          {/* Parse Error Banner */}
          {bulkParseError && (
            <div className="p-4 rounded-xl bg-[#a5342a]/20 border border-[#a5342a]/50 text-[#e27d75] text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 text-[#a5342a] shrink-0" />
              <span>{bulkParseError}</span>
            </div>
          )}

          {/* Bulk Extraction Preview & Commit Section */}
          {bulkExtractionResult && (
            <div className="p-6 rounded-2xl bg-[#1c1a17] border border-[#d68a1f]/40 shadow-dossier space-y-5 animate-in fade-in duration-200">
              
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2a2620] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#5c7a5c]" />
                    <h3 className="font-bold text-sm text-[#ece7de] font-serif">
                      Bulk Parsed Intelligence: {uploadedFile?.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[#8a8478] font-serif">{bulkExtractionResult.summary}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-xl bg-[#24211d] text-[#f5c074] border border-[#d68a1f]/40 text-xs font-mono font-bold">
                    {bulkExtractionResult.total_entities_found} Entities
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-[#24211d] text-[#ece7de] border border-[#3a352d] text-xs font-mono font-bold">
                    {bulkExtractionResult.total_relationships_found} Links
                  </span>
                </div>
              </div>

              {/* Entities Grid */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-[#ece7de] uppercase tracking-wider font-mono">
                  Discovered Entities & Forensic Nodes
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
                  {bulkExtractionResult.extracted_entities.map((ent) => (
                    <div
                      key={ent.id}
                      className="p-2.5 rounded-xl bg-[#0f0e0d] border border-[#3a352d] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-[#ece7de] truncate font-serif">{ent.label}</div>
                        <span className={
                          ent.risk_level === 'Critical' ? 'seal-badge-critical' :
                          ent.risk_level === 'High' ? 'seal-badge-high' :
                          'seal-badge-medium'
                        }>
                          {ent.risk_level}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#8a8478] font-mono">{ent.type}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Relational Edges Grid */}
              <div className="space-y-2 pt-3 border-t border-[#2a2620]">
                <div className="text-xs font-bold text-[#ece7de] uppercase tracking-wider font-mono">
                  Relational Links & Wiretap Interactions
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {bulkExtractionResult.extracted_relationships.map((rel, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#0f0e0d] border border-[#3a352d] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#f5c074] font-mono truncate">
                          {rel.source_text} ➔ {rel.target_text}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#1c1a17] text-[#ece7de] rounded border border-[#3a352d] shrink-0">
                          {rel.type}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#8a8478] font-serif italic truncate">
                        "{rel.evidence_snippet}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commit Button */}
              <div className="pt-3 border-t border-[#2a2620] flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCommitBulk}
                  disabled={bulkIsCommitting || isReadOnly}
                  title={isReadOnly ? "Requires Investigator or Admin clearance" : ""}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold font-mono shadow-sm transition-all flex items-center justify-center gap-2 ${
                    isReadOnly 
                      ? 'bg-[#24211d] text-[#666157] border border-[#3a352d] cursor-not-allowed'
                      : 'bg-[#5c7a5c] hover:bg-[#3d523d] text-white active:scale-95'
                  }`}
                >
                  {bulkIsCommitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : isReadOnly ? (
                    <>
                      <AlertCircle className="w-4 h-4 text-[#a5342a]" />
                      <span>Bulk Commit Disabled (Requires Investigator Clearance)</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Commit Bulk Dataset to SUTRA Knowledge Graph & Ledger</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBulkExtractionResult(null);
                    setUploadedFile(null);
                    setBulkCommitSuccess(null);
                  }}
                  className="p-3 rounded-xl bg-[#24211d] hover:bg-[#2d2924] text-[#8a8478] text-xs font-bold transition-all active:scale-95 border border-[#3a352d]"
                  title="Clear import"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {bulkCommitSuccess && (
                <div className="p-3.5 rounded-xl bg-[#5c7a5c]/20 border border-[#5c7a5c]/50 text-xs text-[#8eb38e] flex items-center gap-2.5 animate-in fade-in font-mono">
                  <CheckCircle2 className="w-5 h-5 text-[#5c7a5c] shrink-0" />
                  <div>
                    <span className="font-bold">Commit Succeeded: </span>
                    <span>{bulkCommitSuccess.message} Cryptographic block appended to ledger.</span>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* ==========================================
          MODE 3: MANUAL ENTRY WIZARD
          ========================================== */}
      {ingestMode === 'manual' && (
        <div className="max-w-xl mx-auto p-6 rounded-2xl bg-[#1c1a17] border border-[#3a352d] shadow-dossier space-y-4">
          <h3 className="font-bold text-base text-[#ece7de] flex items-center gap-2 font-serif">
            <PlusCircle className="w-4 h-4 text-[#d68a1f]" />
            Manual Entity Entry
          </h3>
          <form onSubmit={handleManualCreateNode} className="space-y-3 text-xs">
            <div>
              <label className="text-[#ece7de] font-semibold block mb-1 font-serif">Entity Label / Name</label>
              <input
                type="text"
                value={manualLabel}
                onChange={(e) => setManualLabel(e.target.value)}
                placeholder="e.g., Ramesh Verma, Bank Account #10291, DL-01-AB-1234"
                className="w-full p-2.5 bg-[#0f0e0d] border border-[#3a352d] rounded-xl text-[#ece7de] font-mono focus:outline-none focus:border-[#d68a1f]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#ece7de] font-semibold block mb-1 font-serif">Entity Type</label>
                <select
                  value={manualType}
                  onChange={(e) => setManualType(e.target.value)}
                  className="w-full p-2.5 bg-[#0f0e0d] border border-[#3a352d] rounded-xl text-[#ece7de] font-mono focus:outline-none focus:border-[#d68a1f]"
                >
                  <option value="Person">Person</option>
                  <option value="Phone">Phone</option>
                  <option value="BankAccount">BankAccount</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Organization">Organization</option>
                  <option value="Location">Location</option>
                  <option value="DigitalID">DigitalID</option>
                </select>
              </div>
              <div>
                <label className="text-[#ece7de] font-semibold block mb-1 font-serif">Risk Level</label>
                <select
                  value={manualRisk}
                  onChange={(e) => setManualRisk(e.target.value)}
                  className="w-full p-2.5 bg-[#0f0e0d] border border-[#3a352d] rounded-xl text-[#ece7de] font-mono focus:outline-none focus:border-[#d68a1f]"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isReadOnly}
              title={isReadOnly ? "Requires Investigator or Admin clearance" : ""}
              className={`w-full py-2.5 rounded-xl font-bold font-mono transition-all shadow-sm flex items-center justify-center gap-2 ${
                isReadOnly
                  ? 'bg-[#24211d] text-[#666157] border border-[#3a352d] cursor-not-allowed'
                  : 'bg-[#d68a1f] hover:bg-[#e59b2d] text-[#0f0e0d] active:scale-95'
              }`}
            >
              {isReadOnly ? (
                <>
                  <AlertCircle className="w-4 h-4 text-[#a5342a]" />
                  <span>Entry Disabled (Requires Investigator Clearance)</span>
                </>
              ) : (
                <span>Add Entity to SUTRA Knowledge Graph</span>
              )}
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
