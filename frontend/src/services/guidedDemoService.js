/**
 * SUTRA Autonomous Guided Demo Service
 * Handles script definition and Web Speech API Text-to-Speech narration.
 */

export const DEMO_STEPS = [
  {
    step: 1,
    title: "MHA Command Center & Overview",
    tab: "overview",
    caseId: "CASE-HAWALA-2024",
    nodeId: null,
    subtab: null,
    narration: "Welcome to SUTRA — a sovereign criminal intelligence platform engineered for the Ministry of Home Affairs to uncover complex multi-jurisdictional syndicates.",
    caption: "Welcome to SUTRA — a sovereign criminal intelligence platform engineered for the Ministry of Home Affairs to uncover complex multi-jurisdictional syndicates.",
    durationMs: 7000
  },
  {
    step: 2,
    title: "Raw Evidence & NLP Ingestion Studio",
    tab: "ingestion",
    caseId: "CASE-HAWALA-2024",
    nodeId: null,
    subtab: null,
    narration: "Investigation begins with raw, unstructured evidence — FIR documents, wiretap transcripts, and suspicious financial records.",
    caption: "Investigation begins with raw, unstructured evidence — FIR documents, wiretap transcripts, and suspicious financial records.",
    durationMs: 7500
  },
  {
    step: 3,
    title: "Automated Entity & Relationship Extraction",
    tab: "ingestion",
    caseId: "CASE-HAWALA-2024",
    nodeId: null,
    subtab: null,
    narration: "SUTRA's neural NLP pipeline extracts suspects, phone numbers, mule accounts, and vehicles, building a unified knowledge graph in real time.",
    caption: "SUTRA's neural NLP pipeline extracts suspects, phone numbers, mule accounts, and vehicles, building a unified knowledge graph in real time.",
    durationMs: 8000
  },
  {
    step: 4,
    title: "Interactive Multi-Hop Graph Canvas",
    tab: "graph",
    caseId: "CASE-HAWALA-2024",
    nodeId: "PER_VIKRAM_SHARMA",
    subtab: null,
    narration: "Investigators can explore these complex criminal topologies visually, performing multi-hop expansions and tracing cash flow conduits across borders.",
    caption: "Investigators can explore these complex criminal topologies visually, performing multi-hop expansions and tracing cash flow conduits across borders.",
    durationMs: 8500
  },
  {
    step: 5,
    title: "Graph Centrality & Kingpin Leaderboard",
    tab: "analytics",
    caseId: "CASE-HAWALA-2024",
    nodeId: "PER_VIKRAM_SHARMA",
    subtab: "centrality",
    narration: "Our AI ranks the most influential operatives using PageRank graph centrality — surfacing hidden kingpins, not just low-level mules.",
    caption: "Our AI ranks the most influential operatives using PageRank graph centrality — surfacing hidden kingpins, not just low-level mules.",
    durationMs: 8000
  },
  {
    step: 6,
    title: "Explainable AI (XAI) & Evidence Traceability",
    tab: "analytics",
    caseId: "CASE-HAWALA-2024",
    nodeId: "PER_VIKRAM_SHARMA",
    subtab: "centrality",
    narration: "Every algorithmic risk score is 100% explainable and traceable to verified evidentiary artifacts — ensuring strict legal admissibility.",
    caption: "Every algorithmic risk score is 100% explainable and traceable to verified evidentiary artifacts — ensuring strict legal admissibility.",
    durationMs: 8000
  },
  {
    step: 7,
    title: "Cross-Case Linker & Inter-State Triangulation",
    tab: "crosscase",
    caseId: "CASE-THEFT-2024",
    nodeId: "PER_KULDEEP_YADAV",
    subtab: null,
    narration: "SUTRA automatically detects when the same suspect or vehicle connects across unrelated cases and completely different crime categories.",
    caption: "SUTRA automatically detects when the same suspect or vehicle connects across unrelated cases and completely different crime categories.",
    durationMs: 8000
  },
  {
    step: 8,
    title: "Serial Offender MO Pattern Detector",
    tab: "analytics",
    caseId: "CASE-KIDNAP-2024",
    nodeId: "PER_KULDEEP_YADAV",
    subtab: "serial_patterns",
    narration: "The Serial Offender Pattern Detector flags behavioral similarities to unsolved cold cases based on operational modus operandi signatures.",
    caption: "The Serial Offender Pattern Detector flags behavioral similarities to unsolved cold cases based on operational modus operandi signatures.",
    durationMs: 8500
  },
  {
    step: 9,
    title: "What-If Network Disruption Simulator",
    tab: "analytics",
    caseId: "CASE-ROBBERY-2024",
    nodeId: "PER_KULDEEP_YADAV",
    subtab: "whatif",
    narration: "Before taking action, commanders can simulate the disruption impact of an arrest, identifying keystone targets that collapse multiple syndicates at once.",
    caption: "Before taking action, commanders can simulate the disruption impact of an arrest, identifying keystone targets that collapse multiple syndicates at once.",
    durationMs: 9000
  },
  {
    step: 10,
    title: "Blockchain Vault & Section 65B Integrity",
    tab: "blockchain",
    caseId: "CASE-HAWALA-2024",
    nodeId: null,
    subtab: null,
    narration: "Every evidence ingestion and investigator note is cryptographically anchored to an immutable blockchain ledger with Polygon Layer-2 checkpoints.",
    caption: "Every evidence ingestion and investigator note is cryptographically anchored to an immutable blockchain ledger with Polygon Layer-2 checkpoints.",
    durationMs: 8500
  },
  {
    step: 11,
    title: "SUTRA Intelligence Summary",
    tab: "overview",
    caseId: "CASE-HAWALA-2024",
    nodeId: null,
    subtab: null,
    narration: "This is SUTRA — turning scattered police data into coordinated, court-ready federal criminal intelligence.",
    caption: "This is SUTRA — turning scattered police data into coordinated, court-ready federal criminal intelligence.",
    durationMs: 7000
  }
];

class SpeechNarrationController {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.isMuted = false;
  }

  getBestVoice() {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    // Prefer natural, professional English voices
    const preferredNames = [
      'Google UK English Male',
      'Google UK English Female',
      'Google US English',
      'Microsoft David Online',
      'Microsoft Mark',
      'Microsoft George',
      'Samantha',
      'Daniel'
    ];

    for (let name of preferredNames) {
      const match = voices.find(v => v.name.includes(name));
      if (match) return match;
    }

    const enVoice = voices.find(v => v.lang.startsWith('en') && !v.name.includes('Zira'));
    return enVoice || voices[0];
  }

  speak(text, onEndCallback) {
    if (!this.synth) {
      if (onEndCallback) setTimeout(onEndCallback, 6000);
      return;
    }

    this.stop();

    if (this.isMuted) {
      // If muted, emulate duration
      const simulatedDuration = Math.max(4000, text.length * 55);
      this.timer = setTimeout(() => {
        if (onEndCallback) onEndCallback();
      }, simulatedDuration);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.getBestVoice();
    if (voice) utterance.voice = voice;

    utterance.rate = 0.93; // Professional authoritative pace
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (onEndCallback) {
        // Small 600ms buffer after speech ends before advancing
        setTimeout(onEndCallback, 600);
      }
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error / interrupted:", e);
      if (onEndCallback) setTimeout(onEndCallback, 4000);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  stop() {
    if (this.timer) clearTimeout(this.timer);
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted && this.synth) {
      this.synth.cancel();
    }
  }
}

export const speechController = new SpeechNarrationController();
