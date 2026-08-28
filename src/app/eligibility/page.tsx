'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/context/LanguageContext';
import { INDIAN_STATES, CASTE_CATEGORIES, OCCUPATIONS, EDUCATION_LEVELS } from '@/lib/indianStates';
import SchemeCard from '@/components/SchemeCard';
import { SchemeItem } from '@/types';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Bot,
  User,
  Users,
  Briefcase,
  GraduationCap,
  Sprout,
  HeartHandshake,
  Award,
  Accessibility,
  IndianRupee,
  Building2,
  Calendar,
  Check,
} from 'lucide-react';

const OCCUPATION_ICONS: Record<string, any> = {
  Student: GraduationCap,
  Farmer: Sprout,
  'Agricultural Worker': Sprout,
  'Self-Employed': Briefcase,
  'Daily Wage': Users,
  Salaried: Building2,
  Unemployed: User,
  'Senior Citizen': Award,
  Homemaker: HeartHandshake,
};

export default function EligibilityCheckerPage() {
  const { data: session } = useSession();
  const { language, t } = useLanguage();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: 24,
    state: 'Uttar Pradesh',
    gender: 'All',
    occupation: 'Student',
    income: 200000,
    category: 'OBC',
    education: 'Graduate',
  });

  const [loading, setLoading] = useState(false);
  const [analyzingProgress, setAnalyzingProgress] = useState(0);
  const [analyzingStepText, setAnalyzingStepText] = useState('');
  const [results, setResults] = useState<SchemeItem[]>([]);
  const [summary, setSummary] = useState<{ en: string; hi: string } | null>(null);
  const [evaluated, setEvaluated] = useState(false);
  const [filterScore, setFilterScore] = useState<'all' | 'high' | 'partial'>('all');

  // Pre-fill if logged-in user has profile data
  useEffect(() => {
    if (session?.user) {
      const u = session.user as any;
      setFormData((prev) => ({
        ...prev,
        age: u.age || prev.age,
        state: u.state || prev.state,
        gender: u.gender || prev.gender,
        occupation: u.occupation || prev.occupation,
        income: u.income || prev.income,
        category: u.category || prev.category,
        education: u.education || prev.education,
      }));
    }
  }, [session]);

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      handleEvaluate();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleEvaluate = async () => {
    setLoading(true);
    setAnalyzingProgress(15);
    setAnalyzingStepText(language === 'en' ? 'Verifying age and state eligibility...' : 'आयु और राज्य पात्रता की जांच की जा रही है...');

    const timer1 = setTimeout(() => {
      setAnalyzingProgress(45);
      setAnalyzingStepText(language === 'en' ? 'Cross-referencing family income ceilings...' : 'पारिवारिक आय सीमा का मिलान किया जा रहा है...');
    }, 600);

    const timer2 = setTimeout(() => {
      setAnalyzingProgress(80);
      setAnalyzingStepText(language === 'en' ? 'Computing weighted match scores across 500+ rules...' : '500+ नियमों के आधार पर पात्रता स्कोर तय किया जा रहा है...');
    }, 1200);

    try {
      const res = await fetch('/api/eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      setTimeout(() => {
        setAnalyzingProgress(100);
        setResults(data.schemes || []);
        setSummary(data.summary || null);
        setLoading(false);
        setEvaluated(true);
      }, 1800);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEvaluated(false);
    setStep(1);
    setResults([]);
  };

  const stepLabels = [
    { num: 1, nameEn: 'Age', nameHi: 'आयु' },
    { num: 2, nameEn: 'State', nameHi: 'राज्य' },
    { num: 3, nameEn: 'Gender', nameHi: 'लिंग' },
    { num: 4, nameEn: 'Occupation', nameHi: 'पेशा' },
    { num: 5, nameEn: 'Income', nameHi: 'आय' },
    { num: 6, nameEn: 'Category', nameHi: 'श्रेणी' },
    { num: 7, nameEn: 'Education', nameHi: 'शिक्षा' },
  ];

  const filteredResults = results.filter((r) => {
    if (filterScore === 'high') return (r.matchScore || 0) >= 75;
    if (filterScore === 'partial') return (r.matchScore || 0) >= 50 && (r.matchScore || 0) < 75;
    return true;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-govEmerald-50 border border-govEmerald-200 text-govEmerald-800 text-xs font-bold mb-3 shadow-soft-sm">
            <Sparkles className="w-3.5 h-3.5 text-govEmerald-600" />
            <span>{t('wizardTitle')}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-govNavy-900 tracking-tight">
            {language === 'en' ? 'Check Your Scheme Eligibility in 7 Steps' : '7 आसान चरणों में अपनी पात्रता जांचें'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mt-2">
            {t('wizardSub')}
          </p>
        </div>

        {/* LOADING & AI ANALYSIS SCREEN */}
        {loading && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-soft-lg text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-govEmerald-50 border border-govEmerald-200 text-govEmerald-600 flex items-center justify-center mx-auto mb-6 shadow-soft-sm animate-pulse">
              <Bot className="w-8 h-8" />
            </div>

            <h3 className="text-lg sm:text-xl font-black text-govNavy-900 mb-2">
              {t('analyzingTitle')}
            </h3>
            <p className="text-xs text-slate-500 mb-6">{analyzingStepText}</p>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 mb-3 overflow-hidden border border-slate-200">
              <div
                className="bg-gradient-to-r from-govNavy-900 to-govEmerald-600 h-full transition-all duration-500 rounded-full"
                style={{ width: `${analyzingProgress}%` }}
              />
            </div>
            <span className="text-xs font-bold text-govNavy-900">{analyzingProgress}% Completed</span>
          </div>
        )}

        {/* RESULTS SCREEN */}
        {!loading && evaluated && (
          <div className="space-y-8">
            {/* Results Banner */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-soft-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-govEmerald-50 border border-govEmerald-200 text-govEmerald-800 text-xs font-bold mb-2 shadow-soft-sm">
                    <Sparkles className="w-3.5 h-3.5 text-govEmerald-600" />
                    <span>AI Eligibility Evaluation Complete</span>
                  </div>
                  <h2 className="text-xl sm:text-3xl font-black text-govNavy-900 mt-1">
                    {language === 'en'
                      ? `✅ ${results.filter((r) => (r.matchScore || 0) >= 60).length} Schemes Strongly Matched For You`
                      : `✅ आपके लिए ${results.filter((r) => (r.matchScore || 0) >= 60).length} योजनाएं मिलीं`}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-2xl">
                    {language === 'hi' && summary?.hi ? summary.hi : summary?.en}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-smooth"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t('startOver')}</span>
                  </button>

                  <Link
                    href="/schemes"
                    className="px-4 py-2.5 rounded-xl bg-govNavy-900 hover:bg-govNavy-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-soft-sm transition-smooth"
                  >
                    <span>Browse All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setFilterScore('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-smooth ${
                    filterScore === 'all'
                      ? 'bg-govNavy-900 text-white shadow-soft-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Schemes ({results.length})
                </button>
                <button
                  onClick={() => setFilterScore('high')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-smooth ${
                    filterScore === 'high'
                      ? 'bg-govEmerald-700 text-white shadow-soft-sm'
                      : 'bg-govEmerald-50 text-govEmerald-800 hover:bg-govEmerald-100 border border-govEmerald-200/60'
                  }`}
                >
                  High Match ≥75% ({results.filter((r) => (r.matchScore || 0) >= 75).length})
                </button>
                <button
                  onClick={() => setFilterScore('partial')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-smooth ${
                    filterScore === 'partial'
                      ? 'bg-amber-600 text-white shadow-soft-sm'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
                  }`}
                >
                  Partial Match 50-74% ({results.filter((r) => (r.matchScore || 0) >= 50 && (r.matchScore || 0) < 75).length})
                </button>
              </div>
            </div>

            {/* Scheme Cards Grid or Empty Fallback */}
            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map((scheme) => (
                  <SchemeCard key={scheme.id} scheme={scheme} showMatchScore={true} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
                <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 mb-1">No Schemes in This Filter</h3>
                <p className="text-xs text-slate-500 mb-4">Try switching back to 'All Schemes' to view your other matched options.</p>
                <button
                  onClick={() => setFilterScore('all')}
                  className="px-4 py-2 bg-govNavy-900 text-white text-xs font-bold rounded-xl"
                >
                  Show All Matched Schemes
                </button>
              </div>
            )}
          </div>
        )}

        {/* 7-STEP INTERACTIVE WIZARD MODAL CONTAINER */}
        {!loading && !evaluated && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft-lg p-6 sm:p-10">
            {/* Interactive Progress Step Indicator */}
            <div className="mb-10">
              <div className="hidden sm:flex items-center justify-between relative mb-6">
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
                <div
                  className="absolute top-4 left-4 h-0.5 bg-govEmerald-600 -translate-y-1/2 z-0 transition-all duration-500"
                  style={{ width: `${((step - 1) / 6) * 90}%` }}
                />

                {stepLabels.map((s) => {
                  const isCompleted = s.num < step;
                  const isCurrent = s.num === step;

                  return (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => setStep(s.num)}
                      className="relative z-10 flex flex-col items-center group focus:outline-none"
                    >
                      <div
                        className={`w-9 h-9 rounded-full font-black text-xs flex items-center justify-center transition-all duration-300 ${
                          isCurrent
                            ? 'bg-govNavy-900 text-white ring-4 ring-govNavy-100 scale-110 shadow-soft-md'
                            : isCompleted
                            ? 'bg-govEmerald-600 text-white hover:bg-govEmerald-700 shadow-soft-sm'
                            : 'bg-white text-slate-400 border-2 border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        {isCompleted ? <Check className="w-4 h-4 text-white" /> : s.num}
                      </div>
                      <span
                        className={`text-[11px] font-bold mt-2 transition-colors ${
                          isCurrent
                            ? 'text-govNavy-900'
                            : isCompleted
                            ? 'text-govEmerald-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {language === 'hi' ? s.nameHi : s.nameEn}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Mobile Progress Bar */}
              <div className="sm:hidden space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>
                    Step {step} of 7: <span className="text-govNavy-900">{language === 'hi' ? stepLabels[step - 1].nameHi : stepLabels[step - 1].nameEn}</span>
                  </span>
                  <span className="text-govEmerald-700">{Math.round((step / 7) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/80">
                  <div
                    className="bg-gradient-to-r from-govNavy-900 to-govEmerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(step / 7) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* STEP 1: AGE */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-govNavy-900 mb-1">
                    {t('stepAgeTitle')}
                  </h3>
                  <p className="text-xs text-slate-500">{t('stepAgeSub')}</p>
                </div>

                <div className="max-w-xs">
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: parseInt(e.target.value, 10) || 18 })
                      }
                      className="w-32 py-3 px-4 rounded-xl border border-slate-300 text-lg font-black text-govNavy-900 focus:ring-2 focus:ring-govNavy-800 outline-none"
                    />
                    <span className="text-sm font-bold text-slate-600">Years Old</span>
                  </div>
                </div>

                {/* Quick Age Presets */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-slate-400 block">Quick Age Presets:</span>
                  <div className="flex flex-wrap gap-2">
                    {[18, 21, 24, 30, 45, 60, 65].map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setFormData({ ...formData, age: a })}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-smooth ${
                          formData.age === a
                            ? 'bg-govNavy-900 text-white border-govNavy-900 shadow-soft-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {a} Years
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: STATE */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-govNavy-900 mb-1">
                    {t('stepStateTitle')}
                  </h3>
                  <p className="text-xs text-slate-500">{t('stepStateSub')}</p>
                </div>

                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full max-w-md py-3.5 px-4 rounded-xl border border-slate-300 text-sm font-bold text-govNavy-900 focus:ring-2 focus:ring-govNavy-800 outline-none bg-slate-50"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st.code} value={st.nameEn}>
                      {language === 'hi' ? st.nameHi : st.nameEn} {st.isUT ? '(UT)' : ''}
                    </option>
                  ))}
                </select>

                {/* Popular State Chips */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-slate-400 block">Popular States:</span>
                  <div className="flex flex-wrap gap-2">
                    {['Uttar Pradesh', 'Maharashtra', 'Bihar', 'Rajasthan', 'Madhya Pradesh', 'West Bengal', 'Tamil Nadu', 'Karnataka'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setFormData({ ...formData, state: st })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-smooth ${
                          formData.state === st
                            ? 'bg-govNavy-900 text-white border-govNavy-900 shadow-soft-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: GENDER (Large Icon-based Clickable Selection Cards) */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-govNavy-900 mb-1">
                    {t('stepGenderTitle')}
                  </h3>
                  <p className="text-xs text-slate-500">{t('stepGenderSub')}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
                  {[
                    { id: 'Male', labelEn: 'Male', labelHi: 'पुरुष', descEn: 'General & Men Welfare', descHi: 'सामान्य एवं पुरुष योजनाएं', icon: '👨' },
                    { id: 'Female', labelEn: 'Female', labelHi: 'महिला', descEn: 'Women, Maternity & SHGs', descHi: 'मातृत्व एवं महिला सशक्तिकरण', icon: '👩' },
                    { id: 'Transgender', labelEn: 'Transgender', labelHi: 'ट्रांसजेंडर', descEn: 'Inclusive Welfare & SMILE', descHi: 'समावेशी कल्याण योजनाएं', icon: '⚧' },
                  ].map((g) => {
                    const isSelected = formData.gender === g.id;

                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: g.id })}
                        className={`p-6 rounded-2xl border text-center font-bold text-sm transition-all duration-300 flex flex-col items-center justify-center space-y-2 relative group ${
                          isSelected
                            ? 'bg-govNavy-900 text-white border-govNavy-900 shadow-soft-md scale-[1.02]'
                            : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300 shadow-soft-sm'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-govEmerald-500 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        <span className="text-4xl mb-1 group-hover:scale-110 transition-transform">{g.icon}</span>
                        <span className="text-base font-extrabold">{language === 'hi' ? g.labelHi : g.labelEn}</span>
                        <span className={`text-[11px] font-normal leading-tight ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          {language === 'hi' ? g.descHi : g.descEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: OCCUPATION (Large Icon-based Clickable Selection Cards) */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-govNavy-900 mb-1">
                    {t('stepOccupationTitle')}
                  </h3>
                  <p className="text-xs text-slate-500">{t('stepOccupationSub')}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-w-3xl">
                  {OCCUPATIONS.map((occ) => {
                    const Icon = OCCUPATION_ICONS[occ.id] || Briefcase;
                    const isSelected = formData.occupation === occ.id;

                    return (
                      <button
                        key={occ.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, occupation: occ.id })}
                        className={`p-4 rounded-2xl border text-left font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-between group ${
                          isSelected
                            ? 'bg-govNavy-900 text-white border-govNavy-900 shadow-soft-md scale-[1.02]'
                            : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-govNavy-300 shadow-soft-sm'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2.5 rounded-xl transition-colors ${
                              isSelected
                                ? 'bg-white/15 text-white'
                                : 'bg-slate-100 text-slate-700 group-hover:bg-govNavy-50 group-hover:text-govNavy-900'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="block font-extrabold">{language === 'hi' ? occ.nameHi : occ.nameEn}</span>
                            <span className={`text-[10px] font-normal ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                              {language === 'hi' ? 'पात्रता श्रेणियां' : 'Target Category'}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-govEmerald-500 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5: INCOME (Visual Slider + Fast Preset Chips) */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-govNavy-900 mb-1">
                    {t('stepIncomeTitle')}
                  </h3>
                  <p className="text-xs text-slate-500">{t('stepIncomeSub')}</p>
                </div>

                <div className="space-y-5 max-w-xl">
                  <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100/80 rounded-2xl border border-slate-200/90 flex items-center justify-between shadow-soft-sm">
                    <div>
                      <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Annual Household Income:</span>
                      <span className="text-xs text-slate-400">Total family earnings per financial year</span>
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-govNavy-900 tracking-tight">
                      ₹{formData.income.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="px-1">
                    <input
                      type="range"
                      min="0"
                      max="1500000"
                      step="25000"
                      value={formData.income}
                      onChange={(e) =>
                        setFormData({ ...formData, income: parseInt(e.target.value, 10) })
                      }
                      className="w-full accent-govEmerald-600 h-2.5 bg-slate-200 rounded-lg cursor-pointer transition-all"
                    />
                    <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-1.5">
                      <span>₹0 (Nil / BPL)</span>
                      <span>₹5 Lakh</span>
                      <span>₹10 Lakh</span>
                      <span>₹15 Lakh+</span>
                    </div>
                  </div>

                  {/* Benchmark Preset Pills */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-semibold text-slate-400 block">Official Welfare Thresholds:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { label: 'Below ₹1 Lakh (BPL / Antyodaya)', value: 80000 },
                        { label: '₹2.5 Lakh (EWS / State Scholarships)', value: 250000 },
                        { label: '₹4.5 Lakh (National Scholarship Cap)', value: 450000 },
                        { label: '₹8.0 Lakh (OBC Non-Creamy Layer)', value: 800000 },
                      ].map((inc) => (
                        <button
                          key={inc.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, income: inc.value })}
                          className={`p-2.5 rounded-xl text-left text-xs font-bold border transition-smooth ${
                            formData.income === inc.value
                              ? 'bg-govNavy-900 text-white border-govNavy-900 shadow-soft-sm'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {inc.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: CATEGORY (Large Icon-based Clickable Selection Cards) */}
            {step === 6 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-govNavy-900 mb-1">
                    {t('stepCategoryTitle')}
                  </h3>
                  <p className="text-xs text-slate-500">{t('stepCategorySub')}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl">
                  {[
                    { id: 'General', nameEn: 'General / Open', nameHi: 'सामान्य वर्ग', descEn: 'Merit-based & Universal Central Subsidies', descHi: 'मेधावी एवं सार्वभौमिक कल्याणकारी योजनाएं' },
                    { id: 'OBC', nameEn: 'OBC (Other Backward Classes)', nameHi: 'अन्य पिछड़ा वर्ग (OBC)', descEn: 'Non-Creamy Layer Scholarships & Loans', descHi: 'छात्रवृत्ति, कौशल व रियायती ऋण योजनाएं' },
                    { id: 'SC', nameEn: 'SC (Scheduled Castes)', nameHi: 'अनुसूचित जाति (SC)', descEn: 'Post-Matric, Coaching & Direct Support', descHi: 'पोस्ट-मैट्रिक छात्रवृत्ति एवं विशेष सहायता' },
                    { id: 'ST', nameEn: 'ST (Scheduled Tribes)', nameHi: 'अनुसूचित जनजाति (ST)', descEn: 'Tribal Welfare, Eklavya & Direct Grants', descHi: 'जनजातीय विकास एवं एकलव्य योजनाएं' },
                    { id: 'EWS', nameEn: 'EWS (Economically Weaker)', nameHi: 'आर्थिक कमजोर वर्ग (EWS)', descEn: '10% Reservation & General Category Subsidies', descHi: 'सामान्य वर्ग आरक्षण एवं आय-आधारित लाभ' },
                  ].map((c) => {
                    const isSelected = formData.category === c.id;

                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: c.id })}
                        className={`p-4.5 rounded-2xl border text-left font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-between group ${
                          isSelected
                            ? 'bg-govNavy-900 text-white border-govNavy-900 shadow-soft-md scale-[1.01]'
                            : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-govNavy-300 shadow-soft-sm'
                        }`}
                      >
                        <div>
                          <span className="block text-sm font-black mb-0.5">{language === 'hi' ? c.nameHi : c.nameEn}</span>
                          <span className={`text-[11px] font-normal leading-relaxed ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                            {language === 'hi' ? c.descHi : c.descEn}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-govEmerald-500 text-white flex items-center justify-center shrink-0 ml-3">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 7: EDUCATION (Large Clickable Selection Cards) */}
            {step === 7 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-govNavy-900 mb-1">
                    {t('stepEducationTitle')}
                  </h3>
                  <p className="text-xs text-slate-500">{t('stepEducationSub')}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl">
                  {[
                    { id: 'Below 10th', nameEn: 'Below 10th / Literate', nameHi: '10वीं से कम / साक्षर', descEn: 'Primary welfare, MGNREGA & health schemes', descHi: 'बुनियादी सहायता एवं स्वास्थ्य योजनाएं' },
                    { id: '10th Pass', nameEn: '10th Standard / Matric', nameHi: '10वीं पास (मैट्रिक)', descEn: 'Pre-matric & technical ITI admissions', descHi: 'प्री-मैट्रिक छात्रवृत्तियां व आईटीआई' },
                    { id: '12th Pass', nameEn: '12th Standard / Inter', nameHi: '12वीं पास (इंटरमीडिएट)', descEn: 'Post-matric scholarships & entrance coaching', descHi: 'पोस्ट-मैट्रिक छात्रवृत्ति व प्रतियोगी कोचिंग' },
                    { id: 'Diploma', nameEn: 'Diploma / Polytechnic', nameHi: 'डिप्लोमा / पॉलिटेक्निक', descEn: 'AICTE scholarships & skill apprenticeships', descHi: 'एआईसीटीई छात्रवृत्ति व अप्रेंटिसशिप' },
                    { id: 'Graduate', nameEn: 'Graduate (Degree)', nameHi: 'स्नातक (ग्रेजुएट)', descEn: 'Higher education grants & UPSC coaching', descHi: 'उच्च शिक्षा अनुदान व यूपीएससी कोचिंग' },
                    { id: 'Postgraduate', nameEn: 'Postgraduate & Above', nameHi: 'परास्नातक एवं उच्चतर', descEn: 'Research fellowships, CSIR & UGC schemes', descHi: 'अनुसंधान अध्येतावृत्ति (Fellowships)' },
                  ].map((edu) => {
                    const isSelected = formData.education === edu.id;

                    return (
                      <button
                        key={edu.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, education: edu.id })}
                        className={`p-4 rounded-2xl border text-left font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-between group ${
                          isSelected
                            ? 'bg-govNavy-900 text-white border-govNavy-900 shadow-soft-md scale-[1.01]'
                            : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-govNavy-300 shadow-soft-sm'
                        }`}
                      >
                        <div>
                          <span className="block text-sm font-black mb-0.5">{language === 'hi' ? edu.nameHi : edu.nameEn}</span>
                          <span className={`text-[11px] font-normal leading-relaxed ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                            {language === 'hi' ? edu.descHi : edu.descEn}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-govEmerald-500 text-white flex items-center justify-center shrink-0 ml-3">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Modal Bottom Controls */}
            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-100 flex items-center space-x-1.5 transition-smooth"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t('previousStep')}</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNext}
                className={`px-6 py-3 rounded-xl text-white text-xs sm:text-sm font-bold shadow-soft-sm hover:shadow-soft-md transition-smooth flex items-center space-x-2 ${
                  step === 7
                    ? 'bg-gradient-to-r from-govEmerald-600 to-govEmerald-700 hover:from-govEmerald-700 hover:to-govEmerald-800 ring-2 ring-govEmerald-400/40'
                    : 'bg-govNavy-900 hover:bg-govNavy-800 active:bg-govNavy-950'
                }`}
              >
                <span>{step === 7 ? t('findEligibleSchemesBtn') : t('nextStep')}</span>
                {step === 7 ? <Sparkles className="w-4 h-4 text-emerald-200" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
