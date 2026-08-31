/**
 * SUTRA Autonomous Guided Demo Service
 * Handles script definitions (Hindi & English) and Web Speech API Text-to-Speech narration.
 */

export const DEMO_STEPS = [
  {
    step: 1,
    title: "MHA Command Center & Overview",
    title_hi: "गृह मंत्रालय कमांड सेंटर एवं ओवरव्यू",
    tab: "overview",
    caseId: "CASE-HAWALA-2024",
    nodeId: null,
    subtab: null,
    narration_hi: "सूत्र (SUTRA) में आपका स्वागत है — यह एक सॉवरेन क्रिमिनल इंटेलिजेंस प्लेटफॉर्म है जो गृह मंत्रालय और जांच अधिकारियों को जटिल इंटर-स्टेट सिंडिकेट्स का पर्दाफाश करने में मदद करता है।",
    caption_hi: "सूत्र (SUTRA) में आपका स्वागत है — यह एक सॉवरेन क्रिमिनल इंटेलिजेंस प्लेटफॉर्म है जो गृह मंत्रालय और जांच अधिकारियों को जटिल इंटर-स्टेट सिंडिकेट्स का पर्दाफाश करने में मदद करता है।",
    narration_en: "Welcome to SUTRA — a sovereign criminal intelligence platform engineered for the Ministry of Home Affairs to uncover complex multi-jurisdictional syndicates.",
    caption_en: "Welcome to SUTRA — a sovereign criminal intelligence platform engineered for the Ministry of Home Affairs to uncover complex multi-jurisdictional syndicates.",
    durationMs: 7000
  },
  {
    step: 2,
    title: "Raw Evidence & NLP Ingestion Studio",
    title_hi: "कच्चे साक्ष्य एवं NLP इनजेशन स्टूडियो",
    tab: "ingestion",
    caseId: "CASE-HAWALA-2024",
    nodeId: null,
    subtab: null,
    narration_hi: "जांच की शुरुआत रॉ और अनस्ट्रक्चर्ड एविडेंस से होती है — जैसे FIR डॉक्युमेंट्स, वायरटैप ट्रांसक्रिप्ट्स और संदिग्ध बैंक रिकॉर्ड्स।",
    caption_hi: "जांच की शुरुआत रॉ और अनस्ट्रक्चर्ड एविडेंस से होती है — जैसे FIR डॉक्युमेंट्स, वायरटैप ट्रांसक्रिप्ट्स और संदिग्ध बैंक रिकॉर्ड्स।",
    narration_en: "Investigation begins with raw, unstructured evidence — FIR documents, wiretap transcripts, and suspicious financial records.",
    caption_en: "Investigation begins with raw, unstructured evidence — FIR documents, wiretap transcripts, and suspicious financial records.",
    durationMs: 7500
  },
  {
    step: 3,
    title: "Automated Entity & Relationship Extraction",
    title_hi: "स्वचालित एंटिटी व संबंध निष्कर्षण",
    tab: "ingestion",
    caseId: "CASE-HAWALA-2024",
    nodeId: null,
    subtab: null,
    narration_hi: "SUTRA की न्यूरल NLP पाइपलाइन संदिग्धों, फोन नंबर्स, म्यूल बैंक अकाउंट्स और वाहनों को एक्सट्रैक्ट करके रियल-टाइम में नॉलेज ग्राफ बनाती है।",
    caption_hi: "SUTRA की न्यूरल NLP पाइपलाइन संदिग्धों, फोन नंबर्स, म्यूल बैंक अकाउंट्स और वाहनों को एक्सट्रैक्ट करके रियल-टाइम में नॉलेज ग्राफ बनाती है।",
    narration_en: "SUTRA's neural NLP pipeline extracts suspects, phone numbers, mule accounts, and vehicles, building a unified knowledge graph in real time.",
    caption_en: "SUTRA's neural NLP pipeline extracts suspects, phone numbers, mule accounts, and vehicles, building a unified knowledge graph in real time.",
    durationMs: 8000
  },
  {
    step: 4,
    title: "Interactive Multi-Hop Graph Canvas",
    title_hi: "इंटरएक्टिव मल्टी-हॉप ग्राफ कैनवास",
    tab: "graph",
    caseId: "CASE-HAWALA-2024",
    nodeId: "PER_VIKRAM_SHARMA",
    subtab: null,
    narration_hi: "जांच अधिकारी इन क्रिमिनल नेटवर्क्स को विजुअली एक्सप्लोर कर सकते हैं, मल्टी-हॉप कनेक्शन देख सकते हैं और बॉर्डर के पार कैश फ्लो को ट्रेस कर सकते हैं।",
    caption_hi: "जांच अधिकारी इन क्रिमिनल नेटवर्क्स को विजुअली एक्सप्लोर कर सकते हैं, मल्टी-हॉप कनेक्शन देख सकते हैं और बॉर्डर के पार कैश फ्लो को ट्रेस कर सकते हैं।",
    narration_en: "Investigators can explore these complex criminal topologies visually, performing multi-hop expansions and tracing cash flow conduits across borders.",
    caption_en: "Investigators can explore these complex criminal topologies visually, performing multi-hop expansions and tracing cash flow conduits across borders.",
    durationMs: 8500
  },
  {
    step: 5,
    title: "Graph Centrality & Kingpin Leaderboard",
    title_hi: "ग्राफ सेंट्रैलिटी व किंगपिन लीडरबोर्ड",
    tab: "analytics",
    caseId: "CASE-HAWALA-2024",
    nodeId: "PER_VIKRAM_SHARMA",
    subtab: "centrality",
    narration_hi: "हमारा AI पेज-रैंक ग्राफ सेंट्रैलिटी का उपयोग करके सबसे प्रभावशाली ऑपरेटरों को रैंक करता है — जिससे सिर्फ प्यादे नहीं, बल्कि असली मास्टरमाइंड सामने आते हैं।",
    caption_hi: "हमारा AI पेज-रैंक ग्राफ सेंट्रैलिटी का उपयोग करके सबसे प्रभावशाली ऑपरेटरों को रैंक करता है — जिससे सिर्फ प्यादे नहीं, बल्कि असली मास्टरमाइंड सामने आते हैं।",
    narration_en: "Our AI ranks the most influential operatives using PageRank graph centrality — surfacing hidden kingpins, not just low-level mules.",
    caption_en: "Our AI ranks the most influential operatives using PageRank graph centrality — surfacing hidden kingpins, not just low-level mules.",
    durationMs: 8000
  },
  {
    step: 6,
    title: "Explainable AI (XAI) & Evidence Traceability",
    title_hi: "एक्सप्लेनेबल AI (XAI) एवं साक्ष्य ट्रेसेबिलिटी",
    tab: "analytics",
    caseId: "CASE-HAWALA-2024",
    nodeId: "PER_VIKRAM_SHARMA",
    subtab: "centrality",
    narration_hi: "AI का प्रत्येक रिस्क स्कोर 100% एक्सप्लेनेबल है और वेरीफाइड एविडेंस से जुड़ा है — जिससे कोर्ट में मजबूत कानूनी साक्ष्य प्रस्तुत किया जा सके।",
    caption_hi: "AI का प्रत्येक रिस्क स्कोर 100% एक्सप्लेनेबल है और वेरीफाइड एविडेंस से जुड़ा है — जिससे कोर्ट में मजबूत कानूनी साक्ष्य प्रस्तुत किया जा सके।",
    narration_en: "Every algorithmic risk score is 100% explainable and traceable to verified evidentiary artifacts — ensuring strict legal admissibility.",
    caption_en: "Every algorithmic risk score is 100% explainable and traceable to verified evidentiary artifacts — ensuring strict legal admissibility.",
    durationMs: 8000
  },
  {
    step: 7,
    title: "Cross-Case Linker & Inter-State Triangulation",
    title_hi: "क्रॉस-केस लिंकर एवं अंतर्राज्यीय सिंडिकेट",
    tab: "crosscase",
    caseId: "CASE-THEFT-2024",
    nodeId: "PER_KULDEEP_YADAV",
    subtab: null,
    narration_hi: "SUTRA ऑटोमैटिकली पहचानता है जब वही संदिग्ध या वाहन अलग-अलग राज्यों और अलग-अलग अपराधों में शामिल होता है।",
    caption_hi: "SUTRA ऑटोमैटिकली पहचानता है जब वही संदिग्ध या वाहन अलग-अलग राज्यों और अलग-अलग अपराधों में शामिल होता है।",
    narration_en: "SUTRA automatically detects when the same suspect or vehicle connects across unrelated cases and completely different crime categories.",
    caption_en: "SUTRA automatically detects when the same suspect or vehicle connects across unrelated cases and completely different crime categories.",
    durationMs: 8000
  },
  {
    step: 8,
    title: "Serial Offender MO Pattern Detector",
    title_hi: "सीरियल ऑफेंडर MO पैटर्न डिटेक्टर",
    tab: "analytics",
    caseId: "CASE-KIDNAP-2024",
    nodeId: "PER_KULDEEP_YADAV",
    subtab: "serial_patterns",
    narration_hi: "सीरियल ऑफेंडर पैटर्न डिटेक्टर संदिग्ध के काम करने के तरीके के आधार पर अनसुलझे पुराने केसों से समानताएं ढूंढ निकालता है।",
    caption_hi: "सीरियल ऑफेंडर पैटर्न डिटेक्टर संदिग्ध के काम करने के तरीके के आधार पर अनसुलझे पुराने केसों से समानताएं ढूंढ निकालता है।",
    narration_en: "The Serial Offender Pattern Detector flags behavioral similarities to unsolved cold cases based on operational modus operandi signatures.",
    caption_en: "The Serial Offender Pattern Detector flags behavioral similarities to unsolved cold cases based on operational modus operandi signatures.",
    durationMs: 8500
  },
  {
    step: 9,
    title: "What-If Network Disruption Simulator",
    title_hi: "व्हाट-इफ नेटवर्क डिसरप्शन सिम्युलेटर",
    tab: "analytics",
    caseId: "CASE-ROBBERY-2024",
    nodeId: "PER_KULDEEP_YADAV",
    subtab: "whatif",
    narration_hi: "कार्रवाई करने से पहले, कमांडर्स किसी संदिग्ध की गिरफ्तारी के असर को सिम्युलेट कर सकते हैं, जिससे एक ही झटके में कई सिंडिकेट्स को तोड़ा जा सके।",
    caption_hi: "कार्रवाई करने से पहले, कमांडर्स किसी संदिग्ध की गिरफ्तारी के असर को सिम्युलेट कर सकते हैं, जिससे एक ही झटके में कई सिंडिकेट्स को तोड़ा जा सके।",
    narration_en: "Before taking action, commanders can simulate the disruption impact of an arrest, identifying keystone targets that collapse multiple syndicates at once.",
    caption_en: "Before taking action, commanders can simulate the disruption impact of an arrest, identifying keystone targets that collapse multiple syndicates at once.",
    durationMs: 9000
  },
  {
    step: 10,
    title: "Blockchain Vault & Section 65B Integrity",
    title_hi: "ब्लॉकचेन वॉल्ट एवं धारा 65B अखंडता",
    tab: "blockchain",
    caseId: "CASE-HAWALA-2024",
    nodeId: null,
    subtab: null,
    narration_hi: "सिस्टम में दर्ज हर साक्ष्य और नोट्स को ब्लॉकचेन लेजर पर क्रिप्टोग्राफिक रूप से लॉक किया जाता है, जो सेक्शन 65B के तहत कोर्ट में मान्य है।",
    caption_hi: "सिस्टम में दर्ज हर साक्ष्य और नोट्स को ब्लॉकचेन लेजर पर क्रिप्टोग्राफिक रूप से लॉक किया जाता है, जो सेक्शन 65B के तहत कोर्ट में मान्य है।",
    narration_en: "Every evidence ingestion and investigator note is cryptographically anchored to an immutable blockchain ledger with Polygon Layer-2 checkpoints.",
    caption_en: "Every evidence ingestion and investigator note is cryptographically anchored to an immutable blockchain ledger with Polygon Layer-2 checkpoints.",
    durationMs: 8500
  },
  {
    step: 11,
    title: "SUTRA Intelligence Summary",
    title_hi: "SUTRA इंटेलिजेंस सारांश",
    tab: "overview",
    caseId: "CASE-HAWALA-2024",
    nodeId: null,
    subtab: null,
    narration_hi: "यह है SUTRA — बिखरे हुए पुलिस डेटा को संगठित और कोर्ट-रेडी राष्ट्रीय सुरक्षा इंटेलिजेंस में बदलने वाला प्लेटफॉर्म।",
    caption_hi: "यह है SUTRA — बिखरे हुए पुलिस डेटा को संगठित और कोर्ट-रेडी राष्ट्रीय सुरक्षा इंटेलिजेंस में बदलने वाला प्लेटफॉर्म।",
    narration_en: "This is SUTRA — turning scattered police data into coordinated, court-ready federal criminal intelligence.",
    caption_en: "This is SUTRA — turning scattered police data into coordinated, court-ready federal criminal intelligence.",
    durationMs: 7000
  }
];

class SpeechNarrationController {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.isMuted = false;
    this.currentLanguage = 'hi'; // Default to Hindi
  }

  getBestVoice(lang = 'hi') {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    if (lang === 'hi') {
      // 1. Look for native Hindi voices (hi-IN, hi_IN, or name containing Hindi/Kalpana/Swara/Hemant/Madhur)
      const hindiKeywords = ['hi-in', 'hi_in', 'hindi', 'kalpana', 'hemant', 'swara', 'madhur', 'neerja', 'हिन्दी'];
      for (let voice of voices) {
        const voiceName = (voice.name || '').toLowerCase();
        const voiceLang = (voice.lang || '').toLowerCase();
        for (let kw of hindiKeywords) {
          if (voiceLang.includes(kw) || voiceName.includes(kw)) {
            return voice;
          }
        }
      }

      // 2. Look for Indian English as second priority fallback if native Hindi is absent
      const inEnVoice = voices.find(v => (v.lang || '').toLowerCase().includes('en-in') || (v.name || '').toLowerCase().includes('india'));
      if (inEnVoice) return inEnVoice;

      // 3. Fallback to default voice
      return voices[0];
    } else {
      // English voices
      const preferredNames = [
        'Google UK English Male',
        'Google UK English Female',
        'Google US English',
        'Microsoft David Online',
        'Microsoft Mark',
        'Samantha',
        'Daniel'
      ];

      for (let name of preferredNames) {
        const match = voices.find(v => (v.name || '').includes(name));
        if (match) return match;
      }

      const enVoice = voices.find(v => (v.lang || '').startsWith('en') && !(v.name || '').includes('Zira'));
      return enVoice || voices[0];
    }
  }

  speak(text, lang = 'hi', onEndCallback) {
    if (!this.synth) {
      if (onEndCallback) setTimeout(onEndCallback, 6000);
      return;
    }

    this.stop();

    if (this.isMuted) {
      // If muted, emulate comfortable reading duration
      const simulatedDuration = Math.max(4000, text.length * 60);
      this.timer = setTimeout(() => {
        if (onEndCallback) onEndCallback();
      }, simulatedDuration);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.getBestVoice(lang);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = lang === 'hi' ? 0.92 : 0.94; // Professional natural cadence
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (onEndCallback) {
        setTimeout(onEndCallback, 650);
      }
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error / interrupted:", e);
      if (onEndCallback) setTimeout(onEndCallback, 4500);
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

  setLanguage(lang) {
    this.currentLanguage = lang;
  }
}

export const speechController = new SpeechNarrationController();
