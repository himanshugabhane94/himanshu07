'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/context/LanguageContext';
import { INDIAN_STATES, CASTE_CATEGORIES, OCCUPATIONS, EDUCATION_LEVELS } from '@/lib/indianStates';
import SchemeCard from '@/components/SchemeCard';
import { SchemeItem, ApplicationTrackerItem, NotificationItem } from '@/types';
import { calculateTotalBenefits } from '@/lib/benefitCalculator';
import {
  LayoutDashboard,
  Bookmark,
  FileCheck,
  Bell,
  User,
  Sparkles,
  ExternalLink,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  AlertTriangle,
  Save,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  IndianRupee,
  Calendar,
  BadgeCheck,
} from 'lucide-react';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status, update } = useSession();
  const { language, t } = useLanguage();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'recommendations');
  const [recommendations, setRecommendations] = useState<SchemeItem[]>([]);
  const [bookmarks, setBookmarks] = useState<SchemeItem[]>([]);
  const [trackers, setTrackers] = useState<ApplicationTrackerItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [showBenefitBreakdown, setShowBenefitBreakdown] = useState(false);
  const [loading, setLoading] = useState(true);

  // Profile Form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    mobile: '',
    state: 'Uttar Pradesh',
    gender: 'Male',
    age: 24,
    occupation: 'Student',
    income: 180000,
    category: 'OBC',
    education: 'Graduate',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard');
    }
  }, [status, router]);

  // Load Dashboard Data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Profile
      const profileRes = await fetch('/api/user/profile');
      if (profileRes.ok) {
        const pData = await profileRes.json();
        if (pData.user) {
          setProfileData({
            name: pData.user.name || '',
            email: pData.user.email || '',
            mobile: pData.user.mobile || '',
            state: pData.user.state || 'Uttar Pradesh',
            gender: pData.user.gender || 'Male',
            age: pData.user.age || 24,
            occupation: pData.user.occupation || 'Student',
            income: pData.user.income || 180000,
            category: pData.user.category || 'OBC',
            education: pData.user.education || 'Graduate',
          });

          // 2. Fetch AI Recommendations based on loaded profile
          const recRes = await fetch('/api/eligibility', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pData.user),
          });
          const recData = await recRes.json();
          if (recData.schemes) {
            setRecommendations(recData.schemes.filter((s: SchemeItem) => (s.matchScore || 0) >= 50));
          }
        }
      }

      // 3. Fetch Bookmarks
      const bmRes = await fetch('/api/bookmarks');
      if (bmRes.ok) {
        const bmData = await bmRes.json();
        setBookmarks(bmData.schemes || []);
      }

      // 4. Fetch Application Trackers
      const appRes = await fetch('/api/applications');
      if (appRes.ok) {
        const appData = await appRes.json();
        setTrackers(appData.trackers || []);
      }

      // 5. Fetch Notifications
      const notifRes = await fetch('/api/notifications');
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifications(notifData.notifications || []);
      }

      // 6. Fetch Upcoming Deadlines / Reminders
      const remRes = await fetch('/api/reminders');
      if (remRes.ok) {
        const remData = await remRes.json();
        setDeadlines(remData.deadlines || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadDashboardData();
    }
  }, [session]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (res.ok) {
        setSaveSuccess(true);
        // Refresh session
        await update();
        // Recalculate recommendations
        loadDashboardData();
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Profile update failed:', err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleTrackerStatusChange = async (schemeId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schemeId, status: newStatus }),
      });
      if (res.ok) {
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTracker = async (trackerId: string) => {
    try {
      const res = await fetch(`/api/applications?id=${trackerId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setTrackers((prev) => prev.filter((t) => t.id !== trackerId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkNotificationsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {}
  };

  if (status === 'loading' || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-10 w-64 bg-slate-200 rounded-xl animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="md:col-span-3 h-96 bg-slate-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'recommendations', label: t('tabRecommendations'), icon: Sparkles, badge: recommendations.length },
    { id: 'saved', label: t('tabSaved'), icon: Bookmark, badge: bookmarks.length },
    { id: 'tracker', label: t('tabTracker'), icon: FileCheck, badge: trackers.length },
    { id: 'notifications', label: t('tabNotifications'), icon: Bell, badge: notifications.filter((n) => !n.read).length },
    { id: 'profile', label: t('tabProfile'), icon: User },
  ];

  const benefitSummary = calculateTotalBenefits(recommendations);

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-govNavy-950 via-govNavy-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-soft-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-govEmerald-400 uppercase tracking-wider block">
              {t('officialPortalBadge')}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              {language === 'en' ? `Namaste, ${profileData.name || 'Citizen'}!` : `नमस्ते, ${profileData.name || 'नागरिक'}!`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {profileData.state} · {profileData.occupation} · {profileData.category} Category
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/eligibility"
              className="px-4 py-2.5 bg-govEmerald-600 hover:bg-govEmerald-700 text-white font-bold text-xs rounded-xl shadow-soft-sm hover:shadow-soft-md transition-smooth flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>{t('checkEligibilityHeroBtn')}</span>
            </Link>
          </div>
        </div>

        {/* 1. TOTAL BENEFIT CALCULATOR CARD */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-soft-sm mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-saffron-50 border border-saffron-200 text-saffron-900 text-xs font-bold shadow-soft-sm">
                <IndianRupee className="w-3.5 h-3.5 text-saffron-600" />
                <span>{language === 'hi' ? 'कुल अनुमानित कल्याणकारी लाभ' : 'Total Estimated Benefit Potential'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-govNavy-900 tracking-tight">
                {language === 'hi' ? 'आपके लिए कुल अनुमानित लाभ' : 'Your Total Estimated Welfare Benefit'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                {language === 'hi'
                  ? `आपकी प्रोफ़ाइल के अनुसार आप ${benefitSummary.formattedTotal} तक के वार्षिक लाभ और सरकारी सहायता के लिए पात्र हो सकते हैं।`
                  : `Based on your profile, you could be eligible for up to ${benefitSummary.formattedTotal} in welfare grants, scholarships, and healthcare benefits.`}
              </p>
            </div>

            {/* Big Prominent Benefit Number */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-govNavy-950 to-govNavy-900 text-white text-center sm:text-right border border-govNavy-800 shadow-soft-md shrink-0 flex flex-col justify-center">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                {language === 'hi' ? 'अनुमानित कुल लाभ' : 'Estimated Annual Potential'}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-saffron-400 tracking-tight leading-none">
                {benefitSummary.formattedTotal}
              </div>
              <span className="text-[11px] text-slate-300 mt-1 font-medium">
                {benefitSummary.schemeCount} {language === 'hi' ? 'पात्र योजनाओं में' : 'contributing schemes'}
              </span>
            </div>
          </div>

          {/* Breakdown Toggle Button */}
          {benefitSummary.breakdown.length > 0 && (
            <div className="mt-5 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-[11px] text-slate-400 italic">
                *Disclaimer: Approximate figure based on official maximum limits. Actual entitlement is subject to government verification and scheme rules.
              </p>
              <button
                onClick={() => setShowBenefitBreakdown(!showBenefitBreakdown)}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-govNavy-900 hover:text-govNavy-700 transition-smooth shrink-0"
              >
                <span>{showBenefitBreakdown ? (language === 'hi' ? 'विवरण छुपाएं' : 'Hide Scheme Breakdown') : (language === 'hi' ? 'योजनावार विवरण देखें' : 'View Scheme Breakdown')}</span>
                {showBenefitBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          )}

          {/* Collapsible Scheme Breakdown List */}
          {showBenefitBreakdown && benefitSummary.breakdown.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 animate-fadeIn">
              {benefitSummary.breakdown.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/schemes/${item.id}`}
                      className="text-xs font-bold text-govNavy-900 hover:text-govNavy-700 truncate block"
                    >
                      {language === 'hi' && item.titleHi ? item.titleHi : item.titleEn}
                    </Link>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {item.benefitType}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-govEmerald-50 text-govEmerald-800 border border-govEmerald-200 text-xs font-bold shrink-0">
                    {item.amountFormatted}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dashboard Layout: Tabs Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Tabs + Deadlines Widget (Horizontal on mobile, Vertical on desktop) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-2 rounded-2xl border border-slate-200/90 shadow-soft-sm flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1 sticky top-24">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap lg:whitespace-normal ${
                      isActive
                        ? 'bg-govNavy-900 text-white shadow-soft-sm'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-govNavy-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-govEmerald-400' : 'text-slate-500'}`} />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span
                        className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isActive
                            ? 'bg-govEmerald-500 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 2. UPCOMING DEADLINES WIDGET (Next 30 Days) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-soft-sm">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-govNavy-900" />
                  <h3 className="text-xs font-bold text-govNavy-900 uppercase tracking-wider">
                    {language === 'hi' ? 'आगामी अंतिम तिथियां' : 'Upcoming Deadlines'}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-govNavy-50 text-govNavy-800 text-[10px] font-bold">
                  {deadlines.length} {language === 'hi' ? 'सक्रिय' : 'Active'}
                </span>
              </div>

              {deadlines.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">
                  {language === 'hi'
                    ? 'अगले 30 दिनों में कोई योजना बंद नहीं हो रही है।'
                    : 'No bookmarked schemes closing in the next 30 days.'}
                </p>
              ) : (
                <div className="space-y-2.5">
                  {deadlines.map((dl) => {
                    const isUrgent = dl.daysLeft <= 3;
                    return (
                      <div
                        key={dl.id}
                        className={`p-3 rounded-xl border transition-all ${
                          dl.daysLeft <= 1
                            ? 'bg-rose-50 border-rose-200'
                            : dl.daysLeft <= 3
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <Link
                            href={`/schemes/${dl.id}`}
                            className="text-xs font-bold text-govNavy-900 hover:text-govNavy-700 line-clamp-1 flex-1"
                          >
                            {language === 'hi' && dl.titleHi ? dl.titleHi : dl.titleEn}
                          </Link>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                              dl.daysLeft <= 1
                                ? 'bg-rose-600 text-white animate-pulse'
                                : dl.daysLeft <= 3
                                ? 'bg-amber-600 text-white'
                                : 'bg-govNavy-900 text-white'
                            }`}
                          >
                            {dl.daysLeft} {dl.daysLeft === 1 ? 'day' : 'days'} left
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500 mb-2">
                          Closes on {dl.closeDateFormatted}
                        </p>

                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/schemes/${dl.id}`}
                            className="text-[11px] font-bold text-govNavy-900 hover:underline"
                          >
                            Details &rarr;
                          </Link>
                          {dl.officialLink && (
                            <a
                              href={dl.officialLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-bold text-saffron-600 hover:underline inline-flex items-center space-x-0.5"
                            >
                              <span>Apply</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Tab Content Panel */}
          <div className="lg:col-span-9 space-y-6">
            {/* TAB 1: AI RECOMMENDATIONS */}
            {activeTab === 'recommendations' && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-navy-900">
                      {t('tabRecommendations')}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {language === 'en'
                        ? 'Schemes algorithmically matched against your age, state, occupation, income, and category.'
                        : 'आपकी आयु, राज्य, व्यवसाय, आय और आरक्षण श्रेणी से सुसंगत योजनाएं।'}
                    </p>
                  </div>
                </div>

                {recommendations.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
                    <Sparkles className="w-10 h-10 text-saffron-500 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-900 mb-1">No direct matches calculated yet</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                      Update your profile criteria or run the 7-step Eligibility Checker.
                    </p>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="px-4 py-2 bg-navy-900 text-white font-bold text-xs rounded-xl"
                    >
                      Update Profile
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recommendations.map((scheme) => (
                      <SchemeCard
                        key={scheme.id}
                        scheme={scheme}
                        showMatchScore={true}
                        onBookmarkToggle={() => loadDashboardData()}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SAVED SCHEMES (BOOKMARKS) */}
            {activeTab === 'saved' && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h2 className="text-base sm:text-lg font-bold text-navy-900">{t('tabSaved')}</h2>
                  <p className="text-xs text-slate-500">
                    Schemes bookmarked for future reference and quick application.
                  </p>
                </div>

                {bookmarks.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
                    <Bookmark className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-900 mb-1">{t('noSavedSchemes')}</h3>
                    <Link
                      href="/schemes"
                      className="inline-block mt-3 px-4 py-2 bg-navy-900 text-white font-bold text-xs rounded-xl"
                    >
                      Browse Schemes
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookmarks.map((scheme) => (
                      <SchemeCard
                        key={scheme.id}
                        scheme={scheme}
                        onBookmarkToggle={() => loadDashboardData()}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: APPLICATION TRACKER */}
            {activeTab === 'tracker' && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-navy-900">
                      {t('tabTracker')}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Self-track the status of your applications submitted on government portals.
                    </p>
                  </div>
                  <Link
                    href="/schemes"
                    className="text-xs font-bold text-saffron-600 hover:text-saffron-700"
                  >
                    + Add Scheme
                  </Link>
                </div>

                {trackers.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
                    <FileCheck className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-900 mb-1">{t('noAppliedSchemes')}</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                      When you apply for a scheme on the government portal, mark it on YogyaSetu to track deadlines and progress.
                    </p>
                    <Link
                      href="/schemes"
                      className="px-4 py-2 bg-navy-900 text-white font-bold text-xs rounded-xl"
                    >
                      Browse Schemes
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {trackers.map((tr) => (
                      <div
                        key={tr.id}
                        className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="flex-1">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            {tr.scheme?.category?.nameEn || 'Government Scheme'}
                          </span>
                          <Link href={`/schemes/${tr.schemeId}`}>
                            <h3 className="text-base font-bold text-navy-900 hover:underline">
                              {language === 'hi' && tr.scheme?.titleHi
                                ? tr.scheme.titleHi
                                : tr.scheme?.titleEn}
                            </h3>
                          </Link>
                          {tr.notes && (
                            <p className="text-xs text-slate-600 mt-1 italic">
                              "{tr.notes}"
                            </p>
                          )}
                          <span className="text-[11px] text-slate-400 block mt-2">
                            Last Updated: {new Date(tr.updatedAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Status Select & Delete */}
                        <div className="flex items-center space-x-3 w-full md:w-auto">
                          <select
                            value={tr.status}
                            onChange={(e) => handleTrackerStatusChange(tr.schemeId, e.target.value)}
                            className="text-xs font-bold py-2 px-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 outline-none"
                          >
                            <option value="APPLIED">Applied</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="APPROVED">Approved / Disbursed</option>
                            <option value="REJECTED">Action Needed / Rejected</option>
                          </select>

                          <a
                            href={tr.scheme?.officialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
                            title="Open Official Application Portal"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => handleDeleteTracker(tr.id)}
                            className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50"
                            title="Remove Tracker"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-navy-900">
                      {t('tabNotifications')}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Alerts for matching schemes, deadline reminders, and status updates.
                    </p>
                  </div>

                  {notifications.some((n) => !n.read) && (
                    <button
                      onClick={handleMarkNotificationsRead}
                      className="text-xs font-bold text-saffron-600 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
                    <Bell className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-900 mb-1">No notifications yet</h3>
                    <p className="text-xs text-slate-500">
                      You will receive notifications when new schemes matching your profile are published.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          notif.read
                            ? 'bg-white border-slate-200 text-slate-700'
                            : 'bg-saffron-50/40 border-saffron-200 text-navy-900'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold">
                            {language === 'hi' && notif.titleHi ? notif.titleHi : notif.titleEn}
                          </h4>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          {language === 'hi' && notif.messageHi ? notif.messageHi : notif.messageEn}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: PROFILE EDIT (Feeds the Recommendation Engine) */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="mb-6 pb-4 border-b border-slate-100">
                  <h2 className="text-base sm:text-lg font-bold text-navy-900">
                    {t('tabProfile')}
                  </h2>
                  <p className="text-xs text-slate-500">
                    This demographic profile continuously powers your personalized AI eligibility matches.
                  </p>
                </div>

                {saveSuccess && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-6 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t('profileSavedSuccess')}</span>
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        {t('fullName')}
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white outline-none focus:ring-2 focus:ring-navy-500"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full text-xs font-medium bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-500 cursor-not-allowed"
                      />
                    </div>

                    {/* Mobile */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        value={profileData.mobile}
                        onChange={(e) => setProfileData({ ...profileData, mobile: e.target.value })}
                        placeholder="10-digit mobile number"
                        className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white outline-none focus:ring-2 focus:ring-navy-500"
                      />
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        {t('filterByState')}
                      </label>
                      <select
                        value={profileData.state}
                        onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                        className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white outline-none focus:ring-2 focus:ring-navy-500"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st.code} value={st.nameEn}>
                            {st.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        {t('filterByGender')}
                      </label>
                      <select
                        value={profileData.gender}
                        onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                        className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white outline-none focus:ring-2 focus:ring-navy-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Transgender">Transgender</option>
                      </select>
                    </div>

                    {/* Age */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Age (Years)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={profileData.age}
                        onChange={(e) =>
                          setProfileData({ ...profileData, age: parseInt(e.target.value, 10) || 18 })
                        }
                        className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white outline-none focus:ring-2 focus:ring-navy-500"
                      />
                    </div>

                    {/* Occupation */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        {t('filterByOccupation')}
                      </label>
                      <select
                        value={profileData.occupation}
                        onChange={(e) =>
                          setProfileData({ ...profileData, occupation: e.target.value })
                        }
                        className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white outline-none focus:ring-2 focus:ring-navy-500"
                      >
                        {OCCUPATIONS.map((occ) => (
                          <option key={occ.id} value={occ.id}>
                            {occ.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Social Category */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        {t('filterByCaste')}
                      </label>
                      <select
                        value={profileData.category}
                        onChange={(e) => setProfileData({ ...profileData, category: e.target.value })}
                        className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white outline-none focus:ring-2 focus:ring-navy-500"
                      >
                        {CASTE_CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Income */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Annual Family Income (₹ INR)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="10000000"
                        step="10000"
                        value={profileData.income}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            income: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white outline-none focus:ring-2 focus:ring-navy-500"
                      />
                    </div>

                    {/* Education */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Highest Education Level
                      </label>
                      <select
                        value={profileData.education}
                        onChange={(e) =>
                          setProfileData({ ...profileData, education: e.target.value })
                        }
                        className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white outline-none focus:ring-2 focus:ring-navy-500"
                      >
                        {EDUCATION_LEVELS.map((edu) => (
                          <option key={edu.id} value={edu.id}>
                            {edu.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{savingProfile ? 'Saving...' : t('saveProfileBtn')}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-semibold">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
