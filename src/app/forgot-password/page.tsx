'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Mail, ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, Send } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { language, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Logo Mark Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2.5 group mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-saffron-500 to-saffron-600 flex items-center justify-center shadow-soft-sm text-govNavy-950 border border-saffron-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-5 h-5">
                <path d="M3 17c3-5 8-8 13-5 2.5 1.5 4 3.5 5 5" />
                <path d="M4 17v4" />
                <path d="M9 14v7" />
                <path d="M15 13v8" />
                <path d="M20 17v4" />
                <circle cx="12" cy="7" r="2" fill="#0B3D91" />
              </svg>
            </div>
            <span className="text-2xl font-black text-govNavy-900">
              Yogya<span className="text-saffron-600">Setu</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-govNavy-900">
            {language === 'en' ? 'Reset Your Password' : 'अपना पासवर्ड रीसेट करें'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'en'
              ? 'Enter your registered email address to receive password recovery instructions.'
              : 'पासवर्ड पुनर्प्राप्ति निर्देश प्राप्त करने के लिए अपना पंजीकृत ईमेल दर्ज करें।'}
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft-lg p-6 sm:p-8">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-2xl bg-govEmerald-50 border border-govEmerald-200 text-govEmerald-700 flex items-center justify-center mx-auto shadow-soft-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-govNavy-900">
                {language === 'en' ? 'Reset Instructions Sent' : 'रीसेट निर्देश भेज दिए गए'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {language === 'en'
                  ? `If an account exists for ${email}, a secure reset link has been dispatched with further instructions.`
                  : `यदि ${email} के लिए कोई खाता मौजूद है, तो सुरक्षित रीसेट लिंक भेज दिया गया है।`}
              </p>
              <div className="pt-4 border-t border-slate-100">
                <Link
                  href="/login"
                  className="w-full py-3 px-4 bg-govNavy-900 hover:bg-govNavy-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-soft-sm inline-flex items-center justify-center space-x-1.5 transition-smooth"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{language === 'en' ? 'Return to Sign In' : 'लॉग इन पर वापस जाएं'}</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  {language === 'en' ? 'Registered Email Address' : 'पंजीकृत ईमेल पता'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-govNavy-800 outline-none transition-smooth"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-saffron-500 hover:bg-saffron-600 active:bg-saffron-700 text-govNavy-950 font-black text-xs sm:text-sm rounded-xl shadow-soft-sm transition-smooth flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Sending instructions...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{language === 'en' ? 'Send Password Reset Link' : 'रीसेट लिंक भेजें'}</span>
                  </>
                )}
              </button>

              <div className="pt-3 text-center border-t border-slate-100">
                <Link
                  href="/login"
                  className="inline-flex items-center space-x-1 text-xs font-bold text-govNavy-900 hover:text-saffron-600 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Back to Sign In' : 'लॉग इन पर वापस जाएं'}</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
