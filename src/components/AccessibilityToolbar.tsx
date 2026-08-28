'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Eye, Type, Globe } from 'lucide-react';

export default function AccessibilityToolbar() {
  const {
    language,
    toggleLanguage,
    t,
    fontScale,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    highContrast,
    toggleHighContrast,
  } = useLanguage();

  return (
    <aside
      aria-label="Accessibility & Language Quick Controls"
      className="bg-govNavy-950 text-slate-200 text-xs py-1.5 px-4 border-b border-govNavy-800/80"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Official Government Portal Badge */}
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-saffron-500 animate-pulse"></span>
          <span className="font-medium tracking-wide text-[11px] sm:text-xs">
            {t('officialPortalBadge')}
          </span>
        </div>

        {/* Right: Accessibility Controls & Language Toggle */}
        <div className="flex items-center space-x-4">
          {/* Skip link for screen readers */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:px-2 focus:py-1 focus:bg-saffron-500 focus:text-slate-900 rounded font-medium"
          >
            Skip to Main Content
          </a>

          {/* Font Size Controls */}
          <div className="flex items-center space-x-1 border-r border-navy-800 pr-3">
            <span className="hidden sm:inline text-slate-400 mr-1 text-[11px]">Text:</span>
            <button
              onClick={decreaseFontSize}
              title="Decrease Font Size"
              aria-label="Decrease Font Size"
              className={`px-1.5 py-0.5 rounded hover:bg-navy-800 font-semibold ${
                fontScale < 1 ? 'text-saffron-400 bg-navy-900' : ''
              }`}
            >
              A-
            </button>
            <button
              onClick={resetFontSize}
              title="Standard Font Size"
              aria-label="Standard Font Size"
              className={`px-1.5 py-0.5 rounded hover:bg-navy-800 font-semibold ${
                fontScale === 1 ? 'text-saffron-400 bg-navy-900' : ''
              }`}
            >
              A
            </button>
            <button
              onClick={increaseFontSize}
              title="Increase Font Size"
              aria-label="Increase Font Size"
              className={`px-1.5 py-0.5 rounded hover:bg-navy-800 font-semibold ${
                fontScale > 1 ? 'text-saffron-400 bg-navy-900' : ''
              }`}
            >
              A+
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            title={highContrast ? 'Standard Contrast' : 'High Contrast Mode'}
            aria-pressed={highContrast}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded border text-[11px] ${
              highContrast
                ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                : 'border-navy-700 hover:bg-navy-800 text-slate-300'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{highContrast ? 'Standard' : 'Contrast'}</span>
          </button>

          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-navy-800 hover:bg-navy-700 text-saffron-400 font-medium text-[11px] border border-navy-700"
            title="Toggle between English and हिन्दी"
          >
            <Globe className="w-3 h-3 text-saffron-400" />
            <span className="font-semibold">{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
