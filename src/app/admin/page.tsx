'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/context/LanguageContext';
import { CATEGORIES_CONFIG } from '@/lib/categoriesConfig';
import {
  ShieldAlert,
  BarChart3,
  FileText,
  Users,
  Download,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Trash2,
  Edit,
  ExternalLink,
  Eye,
  AlertCircle,
  Building,
  Check,
  X,
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { language, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'stats' | 'schemes' | 'users' | 'export'>('stats');
  const [stats, setStats] = useState<any>(null);
  const [schemes, setSchemes] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [schemeSearch, setSchemeSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // New Scheme Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchemeId, setEditingSchemeId] = useState<string | null>(null);
  const [newSchemeData, setNewSchemeData] = useState({
    titleEn: '',
    titleHi: '',
    categoryId: 'students',
    descriptionEn: '',
    descriptionHi: '',
    benefitsEn: '',
    benefitsHi: '',
    benefitType: 'Financial',
    benefitAmount: '',
    officialLink: '',
    departmentEn: '',
    departmentHi: '',
    status: 'PUBLISHED',
  });

  const user = session?.user as any;
  const isAuthorized = user && ['ADMIN', 'VERIFIED_OFFICER'].includes(user.role);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin');
    }
  }, [status, router]);

  const loadAdminData = async () => {
    if (!isAuthorized) return;
    setLoading(true);
    try {
      const [statsRes, schemesRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/schemes?status=ALL&limit=100'),
        fetch('/api/admin/users'),
      ]);

      if (statsRes.ok) {
        const d = await statsRes.json();
        setStats(d.stats);
      }
      if (schemesRes.ok) {
        const d = await schemesRes.json();
        setSchemes(d.schemes || []);
      }
      if (usersRes.ok) {
        const d = await usersRes.json();
        setUsers(d.users || []);
      }
    } catch (err) {
      console.error('Admin data load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      loadAdminData();
    }
  }, [isAuthorized]);

  if (status === 'loading' || (isAuthorized && loading)) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="h-10 w-48 bg-slate-200 rounded mx-auto animate-pulse mb-6" />
        <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-rose-200 text-center shadow-lg">
        <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Restricted Government Portal</h2>
        <p className="text-xs text-slate-600 mb-6">
          You need an authorized <strong>ADMIN</strong> or <strong>VERIFIED_OFFICER</strong> role to access this area.
        </p>
        <Link href="/" className="px-5 py-2.5 bg-navy-900 text-white font-bold text-xs rounded-xl">
          Return to Home
        </Link>
      </div>
    );
  }

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const scheme = schemes.find((s) => s.id === id);
      if (!scheme) return;

      const res = await fetch(`/api/schemes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...scheme, status: newStatus }),
      });
      if (res.ok) {
        setSchemes((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteScheme = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this scheme?')) return;
    try {
      const res = await fetch(`/api/schemes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSchemes((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Look up category id
      const selectedCat = CATEGORIES_CONFIG.find((c) => c.slug === newSchemeData.categoryId);
      const catId = selectedCat ? stats?.categories?.find((c: any) => c.nameEn.toLowerCase().includes(selectedCat.slug.toLowerCase()))?.id || schemes[0]?.categoryId : schemes[0]?.categoryId;

      const payload = {
        ...newSchemeData,
        categoryId: catId,
        eligibilityJson: JSON.stringify({ minAge: 18, maxAge: 65, gender: 'All', states: ['All'] }),
        documentsRequired: JSON.stringify(['Aadhaar Card', 'Income Certificate', 'Bank Passbook']),
        applicationProcess: JSON.stringify([
          { step: 1, titleEn: 'Register on Portal', titleHi: 'पंजीकरण करें', descEn: 'Register on the official portal', descHi: 'आधिकारिक पोर्टल पर पंजीकरण करें' },
        ]),
      };

      const url = editingSchemeId ? `/api/schemes/${editingSchemeId}` : '/api/schemes';
      const method = editingSchemeId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModalOpen(false);
        setEditingSchemeId(null);
        loadAdminData();
      }
    } catch (err) {
      console.error('Save scheme failed:', err);
    }
  };

  const handleToggleUserActive = async (userId: string, currentActive: boolean) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isActive: !currentActive }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isActive: !currentActive } : u))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePromoteRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredSchemes = schemes.filter(
    (s) =>
      s.titleEn.toLowerCase().includes(schemeSearch.toLowerCase()) ||
      (s.titleHi && s.titleHi.includes(schemeSearch)) ||
      s.departmentEn.toLowerCase().includes(schemeSearch.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.state && u.state.toLowerCase().includes(userSearch.toLowerCase()))
  );

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Admin Header */}
        <div className="bg-navy-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-saffron-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>Role: {user?.role}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{t('adminTitle')}</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">{t('adminSub')}</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setEditingSchemeId(null);
                setNewSchemeData({
                  titleEn: '',
                  titleHi: '',
                  categoryId: 'students',
                  descriptionEn: '',
                  descriptionHi: '',
                  benefitsEn: '',
                  benefitsHi: '',
                  benefitType: 'Financial',
                  benefitAmount: '',
                  officialLink: 'https://',
                  departmentEn: '',
                  departmentHi: '',
                  status: 'VERIFIED',
                });
                setModalOpen(true);
              }}
              className="px-4 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-white text-xs font-bold rounded-xl shadow flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addNewScheme')}</span>
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-2 mb-6 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'stats'
                ? 'bg-navy-900 text-white'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{t('adminTabStats')}</span>
          </button>
          <button
            onClick={() => setActiveTab('schemes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'schemes'
                ? 'bg-navy-900 text-white'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>
              {t('adminTabSchemes')} ({schemes.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'users'
                ? 'bg-navy-900 text-white'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>
              {t('adminTabUsers')} ({users.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'export'
                ? 'bg-navy-900 text-white'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>{t('adminTabExport')}</span>
          </button>
        </div>

        {/* TAB 1: ANALYTICS & IMPACT */}
        {activeTab === 'stats' && stats && (
          <div className="space-y-6">
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase">{t('totalSchemesCount')}</span>
                <div className="text-2xl sm:text-3xl font-black text-navy-900 mt-1">
                  {stats.totalSchemes}
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                  {stats.publishedSchemes} Published to Citizens
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase">Verification Queue</span>
                <div className="text-2xl sm:text-3xl font-black text-saffron-600 mt-1">
                  {stats.draftSchemes + stats.verifiedSchemes}
                </div>
                <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
                  {stats.draftSchemes} Drafts, {stats.verifiedSchemes} Verified
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase">{t('totalUsersCount')}</span>
                <div className="text-2xl sm:text-3xl font-black text-navy-900 mt-1">
                  {stats.totalUsers}
                </div>
                <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
                  Active Citizens
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase">{t('totalTrackedCount')}</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
                  {stats.totalTrackedApplications}
                </div>
                <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
                  {stats.totalBookmarks} Saved Bookmarks
                </span>
              </div>
            </div>

            {/* Top Viewed Schemes */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-navy-900 mb-4">
                Most Viewed Government Programs
              </h3>
              <div className="divide-y divide-slate-100">
                {stats.topViewedSchemes?.map((item: any) => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.titleEn}</h4>
                      <span className="text-[11px] text-slate-500">{item.benefitType}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                      {item.viewsCount} views
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE SCHEMES & VERIFICATION WORKFLOW */}
        {activeTab === 'schemes' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Search filter bar */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search scheme name or ministry..."
                  value={schemeSearch}
                  onChange={(e) => setSchemeSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-navy-500"
                />
              </div>

              <span className="text-xs text-slate-500 font-semibold">
                Showing {filteredSchemes.length} schemes
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Scheme Title</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Benefit</th>
                    <th className="p-4">Status & Workflow</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSchemes.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80">
                      <td className="p-4">
                        <Link href={`/schemes/${s.id}`} className="font-bold text-navy-900 hover:underline block max-w-xs truncate">
                          {s.titleEn}
                        </Link>
                        <span className="text-[11px] text-slate-500 truncate block max-w-xs">
                          {s.titleHi}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 max-w-[200px] truncate">
                        {s.departmentEn}
                      </td>
                      <td className="p-4 font-semibold text-slate-800">
                        {s.benefitAmount || s.benefitType}
                      </td>
                      <td className="p-4">
                        <select
                          value={s.status}
                          onChange={(e) => handleStatusUpdate(s.id, e.target.value)}
                          className={`text-xs font-bold py-1 px-2.5 rounded-lg border outline-none ${
                            s.status === 'PUBLISHED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : s.status === 'VERIFIED'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : s.status === 'DRAFT'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          <option value="DRAFT">Draft</option>
                          <option value="VERIFIED">Verified</option>
                          <option value="PUBLISHED">Published</option>
                          <option value="CLOSED">Closed</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <Link
                            href={`/schemes/${s.id}`}
                            className="p-1.5 text-slate-500 hover:text-navy-900 rounded-lg hover:bg-slate-100"
                            title="View Scheme"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteScheme(s.id)}
                            className="p-1.5 text-rose-600 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                            title="Delete Scheme"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: MANAGE CITIZENS & OFFICERS */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user by name, email, or state..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-navy-500"
                />
              </div>

              <span className="text-xs text-slate-500 font-semibold">
                {filteredUsers.length} Citizens & Officers
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Name & Email</th>
                    <th className="p-4">Location & Category</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80">
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">{u.name}</span>
                        <span className="text-[11px] text-slate-500">{u.email}</span>
                      </td>
                      <td className="p-4 text-slate-600">
                        <span>{u.state || 'India'}</span> · <span>{u.category || 'General'}</span>
                      </td>
                      <td className="p-4">
                        <select
                          value={u.role}
                          onChange={(e) => handlePromoteRole(u.id, e.target.value)}
                          className="text-xs font-bold py-1 px-2.5 rounded-lg border border-slate-300 bg-slate-50"
                        >
                          <option value="USER">USER</option>
                          <option value="VERIFIED_OFFICER">VERIFIED_OFFICER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.isActive
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleUserActive(u.id, u.isActive)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                            u.isActive
                              ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                              : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: REPORTS & CSV EXPORT */}
        {activeTab === 'export' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <FileText className="w-8 h-8 text-saffron-600 mb-4" />
              <h3 className="text-base font-bold text-navy-900 mb-2">Export Schemes Database</h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Download a complete CSV export of all verified, draft, and published welfare schemes, including official links, eligibility rules, and view statistics.
              </p>
              <a
                href="/api/admin/export?type=schemes"
                download
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl shadow transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{t('exportSchemesCSV')}</span>
              </a>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <Users className="w-8 h-8 text-navy-900 mb-4" />
              <h3 className="text-base font-bold text-navy-900 mb-2">Export Citizen Users Data</h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Download a sanitized CSV export of registered citizens, state demographics, categories, and roles for government reporting and program outreach.
              </p>
              <a
                href="/api/admin/export?type=users"
                download
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl shadow transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{t('exportUsersCSV')}</span>
              </a>
            </div>
          </div>
        )}

        {/* ADD / EDIT SCHEME MODAL */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <h3 className="text-lg font-bold text-navy-900">
                  {editingSchemeId ? t('editScheme') : t('addNewScheme')}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveScheme} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Scheme Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSchemeData.titleEn}
                    onChange={(e) => setNewSchemeData({ ...newSchemeData, titleEn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 outline-none focus:ring-2 focus:ring-navy-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Scheme Title (Hindi)
                  </label>
                  <input
                    type="text"
                    value={newSchemeData.titleHi}
                    onChange={(e) => setNewSchemeData({ ...newSchemeData, titleHi: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 outline-none focus:ring-2 focus:ring-navy-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                    <select
                      value={newSchemeData.categoryId}
                      onChange={(e) => setNewSchemeData({ ...newSchemeData, categoryId: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                    >
                      {CATEGORIES_CONFIG.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Benefit Type</label>
                    <select
                      value={newSchemeData.benefitType}
                      onChange={(e) => setNewSchemeData({ ...newSchemeData, benefitType: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                    >
                      <option value="Financial">Financial</option>
                      <option value="Educational">Educational</option>
                      <option value="Health">Health</option>
                      <option value="Housing">Housing</option>
                      <option value="Livelihood">Livelihood</option>
                      <option value="Social Security">Social Security</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Benefit Amount / Highlight (e.g. "₹6,000 / year")
                  </label>
                  <input
                    type="text"
                    value={newSchemeData.benefitAmount}
                    onChange={(e) => setNewSchemeData({ ...newSchemeData, benefitAmount: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Official Government Application Link (MUST be *.gov.in or *.nic.in) *
                  </label>
                  <input
                    type="url"
                    required
                    value={newSchemeData.officialLink}
                    onChange={(e) => setNewSchemeData({ ...newSchemeData, officialLink: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Department / Ministry (English)
                  </label>
                  <input
                    type="text"
                    value={newSchemeData.departmentEn}
                    onChange={(e) => setNewSchemeData({ ...newSchemeData, departmentEn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Description / Overview
                  </label>
                  <textarea
                    rows={3}
                    value={newSchemeData.descriptionEn}
                    onChange={(e) => setNewSchemeData({ ...newSchemeData, descriptionEn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 border border-slate-300 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-navy-900 text-white rounded-xl font-bold"
                  >
                    Save Scheme
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
