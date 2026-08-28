'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, ExternalLink, PhoneCall, Globe, Accessibility, Building2, Heart } from 'lucide-react';

export default function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-govNavy-950 text-slate-300 border-t border-govNavy-900 pb-16 lg:pb-0">
      {/* GovTech Accent Line */}
      <div className="gov-accent-bar w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: YogyaSetu Platform */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-saffron-500 to-saffron-600 flex items-center justify-center text-govNavy-950 font-bold border border-saffron-400 shadow-soft-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-5 h-5">
                  <path d="M3 17c3-5 8-8 13-5 2.5 1.5 4 3.5 5 5" />
                  <path d="M4 17v4" />
                  <path d="M9 14v7" />
                  <path d="M15 13v8" />
                  <path d="M20 17v4" />
                  <circle cx="12" cy="7" r="2" fill="#0B3D91" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">
                  Yogya<span className="text-saffron-400">Setu</span>
                </span>
                <span className="ml-1.5 px-1.5 py-0.2 bg-white/10 text-slate-300 text-[10px] font-bold rounded">
                  GovTech
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              {language === 'en'
                ? 'Empowering every Indian citizen to discover, verify eligibility, and directly access central and state welfare benefits with zero middlemen.'
                : 'प्रत्येक भारतीय नागरिक को बिना किसी बिचौलिए के केंद्रीय एवं राज्य सरकारी कल्याणकारी योजनाओं से जोड़ने वाला पारदर्शी मंच।'}
            </p>

            <div className="p-3.5 rounded-xl bg-govNavy-900/80 border border-govNavy-800 text-xs text-slate-300 flex items-start space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-govEmerald-400 shrink-0 mt-0.5" />
              <span className="text-[11px] leading-relaxed">
                {language === 'en'
                  ? 'All application links strictly route to official *.gov.in & *.nic.in portals.'
                  : 'सभी आवेदन लिंक सीधे आधिकारिक *.gov.in व *.nic.in पोर्टलों पर भेजते हैं।'}
              </span>
            </div>
          </div>

          {/* Col 2: Essential Category Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-govEmerald-400 mb-4">
              {language === 'en' ? 'Essential Categories' : 'प्रमुख श्रेणियां'}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/schemes?category=students" className="hover:text-white transition-smooth">
                  👨‍🎓 Students & Higher Education
                </Link>
              </li>
              <li>
                <Link href="/schemes?category=farmers" className="hover:text-white transition-smooth">
                  🌾 Farmers & Agriculture Welfare
                </Link>
              </li>
              <li>
                <Link href="/schemes?category=health" className="hover:text-white transition-smooth">
                  🏥 Healthcare & Cashless Treatment
                </Link>
              </li>
              <li>
                <Link href="/schemes?category=women" className="hover:text-white transition-smooth">
                  👩 Women & Child Development
                </Link>
              </li>
              <li>
                <Link href="/schemes?category=senior-citizens" className="hover:text-white transition-smooth">
                  👴 Senior Citizens & Old Age Pension
                </Link>
              </li>
              <li>
                <Link href="/schemes?category=divyangjan" className="hover:text-white transition-smooth">
                  ♿ Divyangjan (Persons with Disabilities)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-govEmerald-400 mb-4">
              {language === 'en' ? 'Citizen Navigation' : 'नागरिक नेविगेशन'}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/eligibility" className="hover:text-white transition-smooth flex items-center">
                  <span>{t('navEligibility')}</span>
                  <span className="ml-1.5 px-1.5 py-0.2 bg-govEmerald-500/20 text-govEmerald-300 text-[10px] font-bold rounded">AI</span>
                </Link>
              </li>
              <li>
                <Link href="/schemes" className="hover:text-white transition-smooth">
                  {t('navSchemes')} (500+ Programs)
                </Link>
              </li>
              <li>
                <Link href="/about#how-it-works" className="hover:text-white transition-smooth">
                  {t('navHowItWorks')}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-smooth">
                  {t('navDashboard')} & Application Tracker
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-smooth">
                  {t('navAbout')} & Citizen Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Helpline Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-govEmerald-400 mb-4">
              {language === 'en' ? 'Official Helplines & Portals' : 'आधिकारिक हेल्पलाइन एवं पोर्टल'}
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start space-x-2">
                <PhoneCall className="w-3.5 h-3.5 text-govEmerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200 block">Kisan Call Centre</span>
                  <span className="text-[11px] text-slate-400">155261 (Toll-Free, 24/7)</span>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <PhoneCall className="w-3.5 h-3.5 text-govEmerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200 block">Ayushman Bharat (PM-JAY)</span>
                  <span className="text-[11px] text-slate-400">14555 / 1800-111-565</span>
                </div>
              </li>
              <li className="pt-1">
                <a
                  href="https://india.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-smooth inline-flex items-center space-x-1 text-slate-300"
                >
                  <span>National Portal of India</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://scholarships.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-smooth inline-flex items-center space-x-1 text-slate-300"
                >
                  <span>National Scholarship Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner: Government Disclaimer & Accessibility */}
        <div className="pt-8 border-t border-govNavy-900 text-xs text-slate-400 space-y-4">
          <div className="p-4 rounded-2xl bg-govNavy-900/50 border border-govNavy-800 text-[11px] leading-relaxed text-slate-400">
            <strong className="text-slate-200">
              {language === 'en' ? 'Notice & Disclaimer: ' : 'सूचना एवं अस्वीकरण: '}
            </strong>
            {language === 'en'
              ? 'YogyaSetu is an independent GovTech welfare discovery portal. We do not collect government processing fees, store identity proofs (such as Aadhaar or biometric data), or make administrative decisions. All scheme applications must be submitted directly through the verified official Government of India (.gov.in / .nic.in) portals linked on this site.'
              : 'योग्यसेतु एक स्वतंत्र नागरिक कल्याण सूचना मंच है। हम कोई शुल्क नहीं लेते और न ही संवेदनशील दस्तावेज एकत्र करते हैं। सभी योजनाओं के आवेदन केवल अधिकृत सरकारी पोर्टल (.gov.in / .nic.in) पर ही किए जाने चाहिए।'}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-[11px] text-slate-500">
            <div className="flex items-center space-x-2">
              <Accessibility className="w-4 h-4 text-govEmerald-400" />
              <span>WCAG AA Accessible · Screen-Reader Friendly · Divyangjan Ready</span>
            </div>
            <p>
              © {new Date().getFullYear()} YogyaSetu. Built for Citizens of India.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
