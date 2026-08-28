'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/context/LanguageContext';
import { Home, Compass, GraduationCap, Sparkles, LayoutDashboard, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { language } = useLanguage();

  const items = [
    {
      href: '/',
      label: language === 'en' ? 'Home' : 'होम',
      icon: Home,
    },
    {
      href: '/schemes',
      label: language === 'en' ? 'Schemes' : 'योजनाएं',
      icon: Compass,
    },
    {
      href: '/scholarships',
      label: language === 'en' ? 'Scholarships' : 'छात्रवृत्ति',
      icon: GraduationCap,
    },
    {
      href: '/eligibility',
      label: language === 'en' ? 'AI Check' : 'पात्रता',
      icon: Sparkles,
      highlight: true,
    },
    {
      href: session ? '/dashboard' : '/login',
      label: session ? (language === 'en' ? 'Dashboard' : 'डैशबोर्ड') : (language === 'en' ? 'Sign In' : 'लॉग इन'),
      icon: session ? LayoutDashboard : User,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 shadow-lg px-2 py-1 safe-area-pb"
    >
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 rounded-xl transition-all ${
                item.highlight
                  ? 'text-govEmerald-700 font-bold'
                  : isActive
                  ? 'text-govNavy-900 font-bold'
                  : 'text-slate-500 hover:text-govNavy-900 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  item.highlight
                    ? 'bg-govEmerald-50 text-govEmerald-600 border border-govEmerald-200/80 shadow-soft-sm'
                    : isActive
                    ? 'bg-govNavy-50 text-govNavy-900'
                    : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
