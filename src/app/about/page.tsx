'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
  ShieldCheck,
  Building2,
  Users,
  ExternalLink,
  Sparkles,
  Accessibility,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

export default function AboutPage() {
  const { language, t } = useLanguage();

  const faqs = [
    {
      qEn: 'Does YogyaSetu charge any application or processing fees?',
      qHi: 'क्या योग्यसेतु किसी प्रकार का आवेदन या प्रोसेसिंग शुल्क लेता है?',
      aEn: 'Never. YogyaSetu is a 100% free public service digital bridge. All scheme benefits and applications are completely free or subsidized by the respective Government ministries.',
      aHi: 'कदापि नहीं। योग्यसेतु शत-प्रतिशत निशुल्क सार्वजनिक सेवा मंच है। सभी योजनाओं के आवेदन संबंधित सरकारी पोर्टलों पर निशुल्क अथवा सरकार द्वारा निर्धारित नियमों के तहत होते हैं।',
    },
    {
      qEn: 'Do I submit my government documents directly on YogyaSetu?',
      qHi: 'क्या मुझे अपने सरकारी दस्तावेज सीधे योग्यसेतु पर जमा करने होते हैं?',
      aEn: 'No. YogyaSetu does not collect, verify, or store sensitive identity documents (Aadhaar, income certificates, PAN, bank passbooks). We provide detailed checklists and route you securely to the authorized official government portal (*.gov.in / *.nic.in) for submission.',
      aHi: 'नहीं। योग्यसेतु आधार, पैन या बैंक खाते जैसे संवेदनशील दस्तावेज कभी एकत्र या स्टोर नहीं करता। हम आपको केवल आवश्यक दस्तावेजों की चेकलिस्ट प्रदान करते हैं और आवेदन हेतु सीधे अधिकृत सरकारी पोर्टल (*.gov.in) पर भेजते हैं।',
    },
    {
      qEn: 'How does the AI Eligibility Checker determine my match score?',
      qHi: 'AI पात्रता परीक्षक मेरा पात्रता स्कोर कैसे तय करता है?',
      aEn: 'Our engine uses structured, weighted rules based on official scheme guidelines (min/max age, state residence, annual family income ceilings, caste categories, occupation, and educational prerequisites) to calculate your match percentage.',
      aHi: 'हमारा इंजन आधिकारिक सरकारी दिशानिर्देशों (आयु, राज्य, वार्षिक पारिवारिक आय सीमा, जाति श्रेणी, पेशा और शैक्षणिक योग्यता) के आधार पर आपका मिलान प्रतिशत तय करता है।',
    },
    {
      qEn: 'What accessibility features are provided for Divyangjan citizens?',
      qHi: 'दिव्यांगजन नागरिकों के लिए क्या सुलभता सुविधाएं उपलब्ध हैं?',
      aEn: 'YogyaSetu complies with WCAG AA accessibility standards with adjustable font sizes (A-, A, A+), high-contrast viewing modes, full keyboard navigation, screen-reader friendly ARIA tags, and dedicated scheme categories for Persons with Disabilities.',
      aHi: 'योग्यसेतु WCAG AA सुलभता मानकों का पालन करता है, जिसमें फॉन्ट साइज बदलने की सुविधा (A-, A, A+), उच्च कंट्रास्ट मोड, स्क्रीन रीडर फ्रेंडली टैग्स और दिव्यांगजनों के लिए विशेष श्रेणी शामिल है।',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Hero Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-soft-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-saffron-500 to-saffron-600 flex items-center justify-center mx-auto mb-4 text-govNavy-950 shadow-soft-sm border border-saffron-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-7 h-7">
              <path d="M3 17c3-5 8-8 13-5 2.5 1.5 4 3.5 5 5" />
              <path d="M4 17v4" />
              <path d="M9 14v7" />
              <path d="M15 13v8" />
              <path d="M20 17v4" />
              <circle cx="12" cy="7" r="2" fill="#0B3D91" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-govNavy-900 tracking-tight mb-3">
            About Yogya<span className="text-saffron-600">Setu</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto mb-6">
            "{t('brandTagline')}"
          </p>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto">
            {language === 'en'
              ? 'YogyaSetu ("Bridge of Eligibility") is a citizen-first digital initiative designed to connect every Indian citizen with welfare schemes, scholarships, and DBT grants they are rightfully eligible for. We eliminate information barriers, complex gazettes, and middlemen by providing direct, transparent access to central and state government benefits.'
              : 'योग्यसेतु एक नागरिक-हितैषी डिजिटल पहल है जो प्रत्येक भारतीय नागरिक को उनकी पात्रता के अनुसार सरकारी योजनाओं, छात्रवृत्तियों और प्रत्यक्ष लाभ अंतरण (डीबीटी) से जोड़ती है। हम बिचौलियों और सूचना की कमी को समाप्त कर सीधे आधिकारिक लाभ उपलब्ध कराते हैं।'}
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-saffron-600 mb-3" />
            <h3 className="text-base font-bold text-navy-900 mb-1.5">Direct & Middlemen-Free</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every scheme links out strictly to authorized Government of India portals (*.gov.in / *.nic.in). No agents, no commission.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Sparkles className="w-8 h-8 text-navy-900 mb-3" />
            <h3 className="text-base font-bold text-navy-900 mb-1.5">Intelligent Matching</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Weighted algorithms match citizen demographic profiles against multi-faceted criteria (age, state, caste, income, occupation).
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Accessibility className="w-8 h-8 text-tricolorGreen-600 mb-3" />
            <h3 className="text-base font-bold text-navy-900 mb-1.5">Divyangjan Accessible</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Built with high-contrast view options, text scaling, screen reader friendly semantic HTML, and dedicated PwD welfare coverage.
            </p>
          </div>
        </div>

        {/* How It Works Detailed */}
        <div id="how-it-works" className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-black text-navy-900 mb-6">
            {t('howItWorksTitle')}
          </h2>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-9 h-9 rounded-xl bg-navy-50 text-navy-900 font-black text-sm flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{t('step1Title')}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{t('step1Desc')}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-9 h-9 rounded-xl bg-saffron-50 text-saffron-600 font-black text-sm flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{t('step2Title')}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{t('step2Desc')}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-9 h-9 rounded-xl bg-tricolorGreen-50 text-tricolorGreen-600 font-black text-sm flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{t('step3Title')}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{t('step3Desc')}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Ready to discover your benefits?</span>
            <Link
              href="/eligibility"
              className="px-5 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5"
            >
              <span>{t('checkEligibilityHeroBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm">
          <div className="flex items-center space-x-2 text-navy-900 mb-6">
            <HelpCircle className="w-5 h-5 text-saffron-600" />
            <h2 className="text-xl sm:text-2xl font-black">
              {language === 'en' ? 'Frequently Asked Questions' : 'अक्सर पूछे जाने वाले प्रश्न'}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs sm:text-sm font-bold text-navy-900 mb-1.5">
                  {language === 'hi' ? faq.qHi : faq.qEn}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'hi' ? faq.aHi : faq.aEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
