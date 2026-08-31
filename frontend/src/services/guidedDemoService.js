/**
 * SUTRA Autonomous Guided Demo Service
 * Handles deep technical script definitions (Hindi & English) and Web Speech API Text-to-Speech narration.
 */

export const DEMO_STEPS = [
  {
    step: 1,
    title: "System Architecture & Introduction",
    title_hi: "सिस्टम आर्किटेक्चर एवं परिचय",
    tab: "overview",
    caseId: "CASE-HAWALA-2024",
    nodeId: null,
    subtab: null,
    narration_hi: "SUTRA ek AI-powered criminal network analysis system hai jo Neo4j graph database aur machine learning algorithms ka istemal karke complex criminal networks ko samajhta hai. Chaliye dekhte hain yeh andar se kaise kaam karta hai.",
    caption_hi: "SUTRA ek AI-powered criminal network analysis system hai jo Neo4j graph database aur machine learning algorithms ka istemal karke complex criminal networks ko samajhta hai. Chaliye dekhte hain yeh andar se kaise kaam karta hai.",
    narration_en: "SUTRA is an AI-powered criminal network analysis system leveraging Neo4j graph databases and machine learning algorithms to map complex syndicates. Let's see how it works under the hood.",
    caption_en: "SUTRA is an AI-powered criminal network analysis system leveraging Neo4j graph databases and machine learning algorithms to map complex syndicates. Let's see how it works under the hood.",
    durationMs: 12000
  },
  {
    step: 2,
    title: "Neural NLP & Entity Extraction",
    title_hi: "न्यूरल NLP एवं एंटिटी निष्कर्षण",
    tab: "ingestion",
    caseId: "CASE-HAWALA-2024",
    nodeId: null,
    subtab: null,
    narration_hi: "Sabse pehle, hum ek unstructured FIR text lete hain — jaise ki police station mein likha gaya original report. SUTRA ka NLP engine is text ko padhta hai aur Named Entity Recognition technique se automatically logon ke naam, phone numbers, bank accounts, aur organizations ko pehchanta hai. Fir yeh entities ke beech relationships bhi detect karta hai — jaise 'X ne Y ko paisa transfer kiya' — aur inhe structured data mein convert karke Neo4j graph database mein store karta hai.",
    caption_hi: "Sabse pehle, hum ek unstructured FIR text lete hain — jaise ki police station mein likha gaya original report. SUTRA ka NLP engine is text ko padhta hai aur Named Entity Recognition technique se automatically logon ke naam, phone numbers, bank accounts, aur organizations ko pehchanta hai. Fir yeh entities ke beech relationships bhi detect karta hai — jaise 'X ne Y ko paisa transfer kiya' — aur inhe structured data mein convert karke Neo4j graph database mein store karta hai.",
    narration_en: "First, we ingest unstructured FIR reports. SUTRA's NLP engine parses the narrative using Named Entity Recognition to automatically extract suspect names, burner phones, bank accounts, and entities, detecting semantic relationships and persisting them into Neo4j graph storage.",
    caption_en: "First, we ingest unstructured FIR reports. SUTRA's NLP engine parses the narrative using Named Entity Recognition to automatically extract suspect names, burner phones, bank accounts, and entities, detecting semantic relationships and persisting them into Neo4j graph storage.",
    durationMs: 22000
  },
  {
    step: 3,
    title: "Interactive Multi-Hop Graph Canvas",
    title_hi: "इंटरएक्टिव मल्टी-हॉप ग्राफ कैनवास",
    tab: "graph",
    caseId: "CASE-HAWALA-2024",
    nodeId: "PER_VIKRAM_SHARMA",
    subtab: null,
    narration_hi: "Yeh saari extracted entities ab ek graph ke roop mein dikhti hain — jahan har node ek person, phone, ya account represent karta hai, aur har edge unke beech ka relationship dikhata hai. Hum is graph ko real-time mein explore kar sakte hain — kisi bhi suspect ko double-click karke uske 2-hop connections dekh sakte hain, matlab uske direct contacts aur unke contacts bhi.",
    caption_hi: "Yeh saari extracted entities ab ek graph ke roop mein dikhti hain — jahan har node ek person, phone, ya account represent karta hai, aur har edge unke beech ka relationship dikhata hai. Hum is graph ko real-time mein explore kar sakte hain — kisi bhi suspect ko double-click karke uske 2-hop connections dekh sakte hain, matlab uske direct contacts aur unke contacts bhi.",
    narration_en: "All extracted entities form an interactive topology graph where nodes represent entities and edges represent relationships. Investigators can explore in real-time, double-clicking suspects to traverse 2-hop neighborhoods, revealing direct contacts and secondary associates.",
    caption_en: "All extracted entities form an interactive topology graph where nodes represent entities and edges represent relationships. Investigators can explore in real-time, double-clicking suspects to traverse 2-hop neighborhoods, revealing direct contacts and secondary associates.",
    durationMs: 18000
  },
  {
    step: 4,
    title: "PageRank Centrality & Kingpin Detection",
    title_hi: "पेज-रैंक सेंट्रैलिटी एवं किंगपिन डिटेक्शन",
    tab: "analytics",
    caseId: "CASE-HAWALA-2024",
    nodeId: "PER_VIKRAM_SHARMA",
    subtab: "centrality",
    narration_hi: "Ab sabse important sawaal — is network mein sabse powerful kaun hai? Iske liye hum graph theory ka ek algorithm use karte hain jise PageRank kehte hain — yeh wahi algorithm hai jo Google search results rank karne ke liye use karta hai. Yeh calculate karta hai ki kaun sa node sabse zyada important connections ke saath juda hai. Jo suspect is score mein sabse upar hota hai, wahi network ka asli kingpin hota hai — sirf naam se nahi, balki mathematical proof se.",
    caption_hi: "Ab sabse important sawaal — is network mein sabse powerful kaun hai? Iske liye hum graph theory ka ek algorithm use karte hain jise PageRank kehte hain — yeh wahi algorithm hai jo Google search results rank karne ke liye use karta hai. Yeh calculate karta hai ki kaun sa node sabse zyada important connections ke saath juda hai. Jo suspect is score mein sabse upar hota hai, wahi network ka asli kingpin hota hai — sirf naam se nahi, balki mathematical proof se.",
    narration_en: "To identify the network's most influential figure, SUTRA calculates graph PageRank centrality — the mathematical algorithm behind search ranking. It measures eigenvalue influence across directional paths. The top-ranked node is the mathematical kingpin of the criminal syndicate.",
    caption_en: "To identify the network's most influential figure, SUTRA calculates graph PageRank centrality — the mathematical algorithm behind search ranking. It measures eigenvalue influence across directional paths. The top-ranked node is the mathematical kingpin of the criminal syndicate.",
    durationMs: 22000
  },
  {
    step: 5,
    title: "Explainable AI (XAI) & Evidence Traceability",
    title_hi: "एक्सप्लेनेबल AI (XAI) एवं साक्ष्य ट्रेसेबिलिटी",
    tab: "analytics",
    caseId: "CASE-HAWALA-2024",
    nodeId: "PER_VIKRAM_SHARMA",
    subtab: "centrality",
    narration_hi: "Lekin sirf ek score dikhana kaafi nahi hai — kanooni tor par yeh evidence defensible bhi hona chahiye. Isliye SUTRA ka har AI conclusion fully traceable hai — matlab system yeh bhi batata hai ki yeh score kyun mila: kitne verified connections hain, kaunse wiretap records isse support karte hain, aur kya koi unusual pattern mila hai. Yeh 'black-box AI' nahi hai — har decision explainable hai, jo court mein evidence ke roop mein present kiya ja sakta hai.",
    caption_hi: "Lekin sirf ek score dikhana kaafi nahi hai — kanooni tor par yeh evidence defensible bhi hona chahiye. Isliye SUTRA ka har AI conclusion fully traceable hai — matlab system yeh bhi batata hai ki yeh score kyun mila: kitne verified connections hain, kaunse wiretap records isse support karte hain, aur kya koi unusual pattern mila hai. Yeh 'black-box AI' nahi hai — har decision explainable hai, jo court mein evidence ke roop mein present kiya ja sakta hai.",
    narration_en: "For courtroom admissibility, SUTRA rejects black-box models. Every risk score is explainable with traceable citations: verified call detail records, banking transactions, and anomaly flags that defense lawyers and judges can audit under Indian Evidence Act norms.",
    caption_en: "For courtroom admissibility, SUTRA rejects black-box models. Every risk score is explainable with traceable citations: verified call detail records, banking transactions, and anomaly flags that defense lawyers and judges can audit under Indian Evidence Act norms.",
    durationMs: 22000
  },
  {
    step: 6,
    title: "Cross-Case Linker & Inter-State Triangulation",
    title_hi: "क्रॉस-केस लिंकर एवं अंतर्राज्यीय सिंडिकेट",
    tab: "crosscase",
    caseId: "CASE-THEFT-2024",
    nodeId: "PER_KULDEEP_YADAV",
    subtab: null,
    narration_hi: "Ab ek aur powerful feature — Cross-Case Linker. Yeh system database mein saare cases ko scan karta hai aur dekhta hai ki koi entity — jaise ek phone number ya bank account — do alag-alag, alag-alag states ke FIR mein to nahi repeat ho raha. Agar match milta hai, to system automatically flag karta hai ki yeh dono cases ek hi network ka hissa ho sakte hain — jo normally investigators manually kabhi discover nahi kar paate kyunki cases alag-alag police stations mein register hote hain.",
    caption_hi: "Ab ek aur powerful feature — Cross-Case Linker. Yeh system database mein saare cases ko scan karta hai aur dekhta hai ki koi entity — jaise ek phone number ya bank account — do alag-alag, alag-alag states ke FIR mein to nahi repeat ho raha. Agar match milta hai, to system automatically flag karta hai ki yeh dono cases ek hi network ka hissa ho sakte hain — jo normally investigators manually kabhi discover nahi kar paate kyunki cases alag-alag police stations mein register hote hain.",
    narration_en: "The Cross-Case Linker scans all FIR cases across jurisdictions, discovering shared entities — such as vehicles or burner SIMs — appearing in separate cases across different states, instantly connecting what would otherwise remain siloed local police records.",
    caption_en: "The Cross-Case Linker scans all FIR cases across jurisdictions, discovering shared entities — such as vehicles or burner SIMs — appearing in separate cases across different states, instantly connecting what would otherwise remain siloed local police records.",
    durationMs: 22000
  },
  {
    step: 7,
    title: "Serial Offender MO Pattern Detector",
    title_hi: "सीरियल ऑफेंडर MO पैटर्न डिटेक्टर",
    tab: "analytics",
    caseId: "CASE-KIDNAP-2024",
    nodeId: "PER_KULDEEP_YADAV",
    subtab: "serial_patterns",
    narration_hi: "SUTRA ek Serial Offender Pattern Detector bhi rakhta hai. Yeh har suspect ka 'Modus Operandi' — matlab unka crime karne ka tareeka — record karta hai, jaise raat ko operate karna, group mein kaam karna, ya specific vehicle use karna. Fir yeh pattern ko doosre unsolved cases se compare karta hai. Agar strong match milta hai, to system suggest karta hai ki yeh suspect kisi aur unsolved case mein bhi involved ho sakta hai — sirf pattern similarity ke basis par.",
    caption_hi: "SUTRA ek Serial Offender Pattern Detector bhi rakhta hai. Yeh har suspect ka 'Modus Operandi' — matlab unka crime karne ka tareeka — record karta hai, jaise raat ko operate karna, group mein kaam karna, ya specific vehicle use karna. Fir yeh pattern ko doosre unsolved cases se compare karta hai. Agar strong match milta hai, to system suggest karta hai ki yeh suspect kisi aur unsolved case mein bhi involved ho sakta hai — sirf pattern similarity ke basis par.",
    narration_en: "The Serial Offender Pattern Detector profiles behavioral Modus Operandi — timing, weapons, group size, and vehicle usage — matching active suspects against cold cases to solve dormant investigations based on behavioral similarity.",
    caption_en: "The Serial Offender Pattern Detector profiles behavioral Modus Operandi — timing, weapons, group size, and vehicle usage — matching active suspects against cold cases to solve dormant investigations based on behavioral similarity.",
    durationMs: 20000
  },
  {
    step: 8,
    title: "What-If Network Disruption Simulator",
    title_hi: "व्हाट-इफ नेटवर्क डिसरप्शन सिम्युलेटर",
    tab: "analytics",
    caseId: "CASE-ROBBERY-2024",
    nodeId: "PER_KULDEEP_YADAV",
    subtab: "whatif",
    narration_hi: "Yeh sabse unique feature hai — What-If Disruption Simulator. Yeh graph theory ka use karke calculate karta hai ki agar hum ek specific suspect ko arrest karein, to poora network kitna disrupt hoga. System us node ko temporarily graph se hata ke dekhta hai ki network kitne pieces mein toot jaata hai. Agar disruption score high hai, matlab yeh suspect network ka critical connector hai — usse pakadna sabse zyada impact dalega.",
    caption_hi: "Yeh sabse unique feature hai — What-If Disruption Simulator. Yeh graph theory ka use karke calculate karta hai ki agar hum ek specific suspect ko arrest karein, to poora network kitna disrupt hoga. System us node ko temporarily graph se hata ke dekhta hai ki network kitne pieces mein toot jaata hai. Agar disruption score high hai, matlab yeh suspect network ka critical connector hai — usse pakadna sabse zyada impact dalega.",
    narration_en: "The What-If Disruption Simulator models the operational consequence of interdicting a target by temporarily removing their vertex and recalculating network fragmentation. A high disruption score identifies keystone bridges whose arrest shatters multiple operations.",
    caption_en: "The What-If Disruption Simulator models the operational consequence of interdicting a target by temporarily removing their vertex and recalculating network fragmentation. A high disruption score identifies keystone bridges whose arrest shatters multiple operations.",
    durationMs: 22000
  },
  {
    step: 9,
    title: "Blockchain Vault & Section 65B Integrity",
    title_hi: "ब्लॉकचेन वॉल्ट एवं धारा 65B अखंडता",
    tab: "blockchain",
    caseId: "CASE-HAWALA-2024",
    nodeId: null,
    subtab: null,
    narration_hi: "Aakhri mein, evidence integrity ka sawaal aata hai. SUTRA har action — chahe woh naya entity add karna ho ya koi query run karna ho — ko ek blockchain-style hash chain mein record karta hai. Har block mein SHA-256 cryptographic hash hota hai jo pichle block se linked hota hai. Agar koi bhi purana data tamper kare, to hash chain turant mismatch ho jaata hai aur system 'Tamper Detected' alert dikhata hai — isse evidence ki integrity court mein legally provable hai, Indian Evidence Act ke Section 65B ke under.",
    caption_hi: "Aakhri mein, evidence integrity ka sawaal aata hai. SUTRA har action — chahe woh naya entity add karna ho ya koi query run karna ho — ko ek blockchain-style hash chain mein record karta hai. Har block mein SHA-256 cryptographic hash hota hai jo pichle block se linked hota hai. Agar koi bhi purana data tamper kare, to hash chain turant mismatch ho jaata hai aur system 'Tamper Detected' alert dikhata hai — isse evidence ki integrity court mein legally provable hai, Indian Evidence Act ke Section 65B ke under.",
    narration_en: "To guarantee chain of custody, every ingestion and modification is hashed into an SHA-256 linked blockchain. Any historical tampering triggers an instant cryptographic mismatch, fulfilling Section 65B admissibility under the Indian Evidence Act.",
    caption_en: "To guarantee chain of custody, every ingestion and modification is hashed into an SHA-256 linked blockchain. Any historical tampering triggers an instant cryptographic mismatch, fulfilling Section 65B admissibility under the Indian Evidence Act.",
    durationMs: 25000
  },
  {
    step: 10,
    title: "Automated Case Priority Queue",
    title_hi: "स्वचालित केस प्रायोरिटी एवं ट्राइएज क्यू",
    tab: "priority_queue",
    caseId: "CASE-ROBBERY-2024",
    nodeId: null,
    subtab: null,
    narration_hi: "System automatically har case ko ek Priority Score bhi deta hai — jo crime severity, cross-case connections ki sankhya, aur victim safety jaise factors ko weight karke calculate hota hai. Isse investigators ko pata chalta hai ki sabse pehle kaunsa case attend karna chahiye jab unke paas ek saath kai cases ho.",
    caption_hi: "System automatically har case ko ek Priority Score bhi deta hai — jo crime severity, cross-case connections ki sankhya, aur victim safety jaise factors ko weight karke calculate hota hai. Isse investigators ko pata chalta hai ki sabse pehle kaunsa case attend karna chahiye jab unke paas ek saath kai cases ho.",
    narration_en: "SUTRA automatically assigns every case an explainable Priority Score (0-100) based on crime severity, cross-case syndicate volume, victim safety, and evidence completeness, allowing commanders to triage resources with transparent mathematical logic.",
    caption_en: "SUTRA automatically assigns every case an explainable Priority Score (0-100) based on crime severity, cross-case syndicate volume, victim safety, and evidence completeness, allowing commanders to triage resources with transparent mathematical logic.",
    durationMs: 18000
  },
  {
    step: 11,
    title: "Conclusion & Operational Readiness",
    title_hi: "निष्कर्ष एवं परिचालन तत्परता",
    tab: "overview",
    caseId: "CASE-HAWALA-2024",
    nodeId: null,
    subtab: null,
    narration_hi: "Yeh hai SUTRA — jo scattered, unstructured data ko structured, explainable, aur legally defensible intelligence mein badalta hai, taaki investigators tezi se aur bharosemand tareeke se criminal networks ko todh sakein.",
    caption_hi: "Yeh hai SUTRA — jo scattered, unstructured data ko structured, explainable, aur legally defensible intelligence mein badalta hai, taaki investigators tezi se aur bharosemand tareeke se criminal networks ko todh sakein.",
    narration_en: "This is SUTRA — transforming scattered, unstructured police data into structured, explainable, and legally defensible criminal intelligence to dismantle organized syndicates.",
    caption_en: "This is SUTRA — transforming scattered, unstructured police data into structured, explainable, and legally defensible criminal intelligence to dismantle organized syndicates.",
    durationMs: 14000
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
      if (onEndCallback) setTimeout(onEndCallback, 8000);
      return;
    }

    this.stop();

    if (this.isMuted) {
      // If muted, emulate comfortable reading duration based on character count
      const simulatedDuration = Math.max(5000, text.length * 65);
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
    utterance.rate = lang === 'hi' ? 0.92 : 0.94; // Natural authoritative pacing
    utterance.pitch = 1.0;

    // Use onend event for flawless synchronization with longer technical text
    utterance.onend = () => {
      if (onEndCallback) {
        setTimeout(onEndCallback, 750);
      }
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error / interrupted:", e);
      if (onEndCallback) setTimeout(onEndCallback, 5000);
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
