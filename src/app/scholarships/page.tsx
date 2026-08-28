'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { INDIAN_STATES } from '@/lib/indianStates';
import SchemeCard from '@/components/SchemeCard';
import { SchemeItem } from '@/types';
import {
  GraduationCap,
  Search,
  BookOpen,
  Award,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Users,
  Building2,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  Info,
} from 'lucide-react';

function ScholarshipsContent() {
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'pre-matric' | 'post-matric' | 'higher-edu' | 'girls' | 'reserved'>('all');
  const [selectedState, setSelectedState] = useState('All');
  const [schemes, setSchemes] = useState<SchemeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('category', 'students');
    if (search.trim()) params.set('search', search.trim());
    if (selectedState !== 'All') params.set('state', selectedState);
    params.set('limit', '50');

    fetch(`/api/schemes?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.schemes) {
          let list: SchemeItem[] = data.schemes;

          // Client side sub-filter for level
          if (selectedLevel === 'pre-matric') {
            list = list.filter((s) =>
              s.titleEn.toLowerCase().includes('pre-matric') ||
              s.descriptionEn.toLowerCase().includes('school') ||
              s.titleEn.toLowerCase().includes('yasasvi')
            );
          } else if (selectedLevel === 'post-matric') {
            list = list.filter((s) =>
              s.titleEn.toLowerCase().includes('post-matric') ||
              s.descriptionEn.toLowerCase().includes('11th') ||
              s.descriptionEn.toLowerCase().includes('12th')
            );
          } else if (selectedLevel === 'higher-edu') {
            list = list.filter((s) =>
              s.titleEn.toLowerCase().includes('college') ||
              s.titleEn.toLowerCase().includes('university') ||
              s.descriptionEn.toLowerCase().includes('degree') ||
              s.titleEn.toLowerCase().includes('pragati')
            );
          } else if (selectedLevel === 'girls') {
            list = list.filter((s) =>
              s.titleEn.toLowerCase().includes('girl') ||
              s.titleEn.toLowerCase().includes('pragati') ||
              s.titleEn.toLowerCase().includes('women') ||
              s.eligibilityJson.toLowerCase().includes('female')
            );
          } else if (selectedLevel === 'reserved') {
            list = list.filter((s) =>
              s.titleEn.toLowerCase().includes('sc') ||
              s.titleEn.toLowerCase().includes('st') ||
              s.titleEn.toLowerCase().includes('obc') ||
              s.titleEn.toLowerCase().includes('minority')
            );
          }

          setSchemes(list);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [search, selectedState, selectedLevel]);

  const levelTabs = [
    { id: 'all', labelEn: 'All Scholarships', labelHi: 'सभी छात्रवृत्तियां', icon: Award },
    { id: 'higher-edu', labelEn: 'Higher Education (UG/PG)', labelHi: 'उच्च शिक्षा (UG/PG)', icon: GraduationCap },
    { id: 'post-matric', labelEn: 'Post-Matric (11th & 12th)', labelHi: 'पोस्ट-मैट्रिक (11वीं/12वीं)', icon: BookOpen },
    { id: 'pre-matric', labelEn: 'Pre-Matric (Class 1-10)', labelHi: 'प्री-मैट्रिक (कक्षा 1-10)', icon: BookOpen },
    { id: 'girls', labelEn: 'Girls & Women', labelHi: 'बालिकाएं एवं छात्राएं', icon: Users },
    { id: 'reserved', labelEn: 'SC / ST / OBC / EWS', labelHi: 'आरक्षित एवं ईडब्ल्यूएस', icon: Award },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Banner Section */}
        <div className="bg-gradient-to-br from-govNavy-950 via-govNavy-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-soft-lg mb-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-saffron-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-slate-200 text-xs font-semibold mb-4">
              <GraduationCap className="w-4 h-4 text-saffron-400" />
              <span>
                {language === 'en'
                  ? 'National Scholarship Portal (NSP) & Central Sector Gateway'
                  : 'राष्ट्रीय छात्रवृत्ति पोर्टल (एनएसपी) एवं केंद्रीय छात्रवृत्ति मंच'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-3">
              {language === 'en'
                ? 'Central & State Scholarships for Students'
                : 'छात्रों के लिए केंद्रीय एवं राज्य छात्रवृत्ति योजनाएं'}
            </h1>

            <p className="text-xs sm:text-base text-slate-300 mb-8 leading-relaxed font-normal">
              {language === 'en'
                ? 'Find direct financial grants, fee waivers, post-matric assistance, and merit-cum-means awards verified from official Ministry of Education and Social Justice portals.'
                : 'शिक्षा मंत्रालय एवं सामाजिक न्याय मंत्रालय द्वारा सत्यापित प्रत्यक्ष वित्तीय सहायता, फीस माफी और मेरिट-कम-मीन्स छात्रवृत्तियां प्राप्त करें।'}
            </p>

            {/* Inline Quick Search & State Filter */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
              <div className="sm:col-span-8 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={
                    language === 'en'
                      ? 'Search scholarship name (e.g. NSP, PM-YASASVI, Pragati, Post-Matric)...'
                      : 'छात्रवृत्ति का नाम खोजें (जैसे: एनएसपी, यशस्वी, प्रगति, पोस्ट-मैट्रिक)...'
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </div>

              <div className="sm:col-span-4">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white text-xs sm:text-sm font-bold text-slate-800 outline-none"
                >
                  <option value="All">{language === 'en' ? 'All States & UTs' : 'सभी राज्य'}</option>
                  {INDIAN_STATES.map((st) => (
                    <option key={st.code} value={st.nameEn}>
                      {language === 'hi' ? st.nameHi : st.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Level Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {levelTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedLevel === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedLevel(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 flex items-center space-x-2 border shadow-soft-sm ${
                  isSelected
                    ? 'bg-govNavy-900 text-white border-govNavy-900 shadow-soft-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-saffron-400' : 'text-slate-500'}`} />
                <span>{language === 'hi' ? tab.labelHi : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Direct Link to NSP Box */}
        <div className="mb-8 p-4 rounded-2xl bg-saffron-50 border border-saffron-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-saffron-500 text-govNavy-950 font-black shrink-0">
              NSP
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">
                {language === 'en'
                  ? 'Official National Scholarship Portal (NSP) Application Link'
                  : 'राष्ट्रीय छात्रवृत्ति पोर्टल (एनएसपी) आधिकारिक आवेदन लिंक'}
              </p>
              <p className="text-slate-600 mt-0.5">
                {language === 'en'
                  ? 'Submit OTR (One Time Registration) and track renewal applications directly on scholarships.gov.in.'
                  : 'scholarships.gov.in पर सीधे ओटीआर पंजीकरण करें एवं छात्रवृत्ति नवीनीकरण ट्रैक करें।'}
              </p>
            </div>
          </div>

          <a
            href="https://scholarships.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-2 bg-saffron-500 hover:bg-saffron-600 text-govNavy-950 font-bold rounded-xl shadow-soft-sm transition-smooth flex items-center space-x-1.5"
          >
            <span>scholarships.gov.in</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Scholarships Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-white border border-slate-200 animate-pulse p-6" />
            ))}
          </div>
        ) : schemes.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-soft-sm">
            <Info className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">
              {language === 'en' ? 'No Scholarships Found' : 'कोई छात्रवृत्ति नहीं मिली'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {language === 'en'
                ? 'Try resetting the search keyword or choosing "All States & UTs".'
                : 'कृपया खोज मानदंड बदलें या "सभी राज्य" चुनें।'}
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedState('All');
                setSelectedLevel('all');
              }}
              className="px-4 py-2 bg-govNavy-900 text-white text-xs font-bold rounded-xl"
            >
              {language === 'en' ? 'Reset All Filters' : 'फ़िल्टर रीसेट करें'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ScholarshipsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-semibold">Loading scholarships...</div>}>
      <ScholarshipsContent />
    </Suspense>
  );
}
