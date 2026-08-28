'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useLanguage } from '@/context/LanguageContext';
import {
  Search,
  Bell,
  User as UserIcon,
  Menu,
  X,
  ShieldAlert,
  Bookmark,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Sparkles,
  Globe,
  ArrowRight,
} from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/notifications')
        .then((res) => res.json())
        .then((data) => {
          if (data.unreadCount !== undefined) {
            setUnreadNotifications(data.unreadCount);
          }
        })
        .catch(() => {});
    }
  }, [session]);

  const navLinks = [
    { href: '/', label: t('navHome') },
    { href: '/schemes', label: t('navSchemes') },
    { href: '/scholarships', label: t('navScholarships') },
    { href: '/eligibility', label: t('navEligibility') },
    { href: '/about#how-it-works', label: t('navHowItWorks') },
    { href: '/about', label: t('navAbout') },
  ];

  const user = session?.user as any;
  const isAdminOrOfficer = user && ['ADMIN', 'VERIFIED_OFFICER'].includes(user.role);

  return (
    <header className="sticky top-0 z-50 transition-all">
      {/* 1. Top Aggregator Disclaimer Strip */}
      <div className="bg-govNavy-950 text-slate-300 py-1.5 px-4 sm:px-6 lg:px-8 border-b border-govNavy-900 text-[11px]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-saffron-500" />
            <span className="font-semibold text-slate-200">
              {language === 'en'
                ? 'Government Scheme Information Aggregator · Not an official government website'
                : 'सरकारी योजना सूचना एग्रीगेटर · यह आधिकारिक सरकारी वेबसाइट नहीं है'}
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-3 text-slate-400 text-[10px]">
            <span className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-govEmerald-400" />
              <span>
                {language === 'en'
                  ? 'Verified against official portals'
                  : 'आधिकारिक पोर्टलों द्वारा सत्यापित'}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* GovTech Accent Line */}
      <div className="gov-accent-bar w-full" />

      {/* 2. Main Navbar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-soft-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo (🟧 Saffron Badge + Bridge Motif + YogyaSetu Wordmark) */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-saffron-500 to-saffron-600 flex items-center justify-center shadow-soft-sm group-hover:scale-105 transition-smooth border border-saffron-400">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-govNavy-950"
                >
                  {/* Bridge / Setu Motif */}
                  <path d="M3 17c3-5 8-8 13-5 2.5 1.5 4 3.5 5 5" />
                  <path d="M4 17v4" />
                  <path d="M9 14v7" />
                  <path d="M15 13v8" />
                  <path d="M20 17v4" />
                  <circle cx="12" cy="7" r="2" fill="#0B3D91" />
                </svg>
              </div>

              <div className="flex flex-col">
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-govNavy-900">
                    {language === 'en' ? 'Yogya' : 'योग्य'}
                    <span className="text-saffron-600">{language === 'en' ? 'Setu' : 'सेतु'}</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 bg-govNavy-50 text-govNavy-800 text-[10px] font-bold rounded-md border border-govNavy-200/60 uppercase tracking-wider">
                    GovTech
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium tracking-tight hidden sm:block">
                  {language === 'en' ? 'Aapke Liye Sahi Yojana, Ab Ek Hi Jagah.' : 'आपके लिए सही योजना, अब एक ही जगह।'}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-smooth ${
                      isActive
                        ? 'text-govNavy-900 bg-govNavy-50 font-bold border border-govNavy-200/50'
                        : 'text-slate-600 hover:text-govNavy-900 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Controls: Bilingual Switcher, Solid Saffron Login CTA, User Menu */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Bilingual Toggle Switch Pill */}
              <div className="inline-flex items-center p-1 rounded-xl bg-slate-100/90 border border-slate-200 text-xs font-bold shadow-inner">
                <button
                  type="button"
                  onClick={() => language !== 'en' && toggleLanguage()}
                  aria-label="Switch to English"
                  className={`px-2.5 py-1 rounded-lg transition-smooth text-[11px] ${
                    language === 'en'
                      ? 'bg-govNavy-900 text-white shadow-soft-sm font-black'
                      : 'text-slate-600 hover:text-govNavy-900 font-medium'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => language !== 'hi' && toggleLanguage()}
                  aria-label="Switch to Hindi"
                  className={`px-2.5 py-1 rounded-lg transition-smooth text-[11px] ${
                    language === 'hi'
                      ? 'bg-govNavy-900 text-white shadow-soft-sm font-black'
                      : 'text-slate-600 hover:text-govNavy-900 font-medium'
                  }`}
                >
                  हिन्दी
                </button>
              </div>

              {/* User Session Menu or Solid Saffron CTA Button */}
              {session ? (
                <div className="flex items-center space-x-2">
                  {/* Notification Bell */}
                  <Link
                    href="/dashboard?tab=notifications"
                    className="relative p-2 text-slate-600 hover:text-govNavy-900 rounded-xl hover:bg-slate-100 transition-smooth"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadNotifications}
                      </span>
                    )}
                  </Link>

                  {/* User Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center space-x-2 p-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-smooth focus:ring-2 focus:ring-govNavy-800"
                      aria-expanded={userDropdownOpen}
                    >
                      <div className="w-8 h-8 rounded-lg bg-govNavy-900 text-white font-bold flex items-center justify-center text-xs shadow-inner">
                        {user.name ? user.name[0].toUpperCase() : 'U'}
                      </div>
                      <span className="hidden md:block text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                        {user.name}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden md:block" />
                    </button>

                    {userDropdownOpen && (
                      <div
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-soft-lg border border-slate-200/80 py-1.5 z-50 text-sm"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-govNavy-50 text-govNavy-800 text-[10px] font-bold rounded">
                            {user.role}
                          </span>
                        </div>

                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2.5 text-slate-500" />
                          {t('navDashboard')}
                        </Link>

                        <Link
                          href="/dashboard?tab=saved"
                          className="flex items-center px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                        >
                          <Bookmark className="w-4 h-4 mr-2.5 text-slate-500" />
                          {t('tabSaved')}
                        </Link>

                        {isAdminOrOfficer && (
                          <Link
                            href="/admin"
                            className="flex items-center px-4 py-2 text-indigo-700 hover:bg-indigo-50 font-semibold"
                          >
                            <ShieldAlert className="w-4 h-4 mr-2.5 text-indigo-600" />
                            {t('navAdmin')}
                          </Link>
                        )}

                        <div className="border-t border-slate-100 my-1" />

                        <button
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className="w-full text-left flex items-center px-4 py-2 text-rose-600 hover:bg-rose-50 font-medium"
                        >
                          <LogOut className="w-4 h-4 mr-2.5 text-rose-500" />
                          {t('navLogout')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {/* Single Solid Saffron Button for Auth */}
                  <Link
                    href="/login"
                    className="px-4 py-2.5 text-xs sm:text-sm font-bold text-govNavy-950 bg-saffron-500 hover:bg-saffron-600 active:bg-saffron-700 rounded-xl shadow-soft-sm hover:shadow-soft-md transition-smooth flex items-center space-x-1.5"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>{t('navLogin')} / {t('navRegister')}</span>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-soft-lg">
          <Link
            href="/eligibility"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center space-x-2 w-full py-3 bg-govEmerald-600 text-white rounded-xl font-bold text-sm mb-3 shadow-soft-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'en' ? 'Check My Eligibility' : 'पात्रता जांचें'}</span>
          </Link>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-100"
            >
              {link.label}
            </Link>
          ))}

          {session ? (
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-govNavy-900"
              >
                {t('navDashboard')}
              </Link>
              {isAdminOrOfficer && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-semibold text-indigo-700"
                >
                  {t('navAdmin')}
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="block w-full text-left px-3 py-2 text-sm font-semibold text-rose-600"
              >
                {t('navLogout')}
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-sm font-bold bg-saffron-500 hover:bg-saffron-600 text-govNavy-950 rounded-xl shadow-soft-sm"
              >
                {t('navLogin')} / {t('navRegister')}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
