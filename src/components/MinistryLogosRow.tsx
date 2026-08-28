'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Landmark, Shield, CheckCircle, ExternalLink, Globe } from 'lucide-react';

export default function MinistryLogosRow() {
  const { language } = useLanguage();

  const partnerPortals = [
    {
      name: 'National Portal of India',
      domain: 'india.gov.in',
      code: 'NPI',
      desc: 'Gateway to Indian Government',
    },
    {
      name: 'National Scholarship Portal',
      domain: 'scholarships.gov.in',
      code: 'NSP',
      desc: 'Ministry of Electronics & IT',
    },
    {
      name: 'DBT Bharat',
      domain: 'dbtbharat.gov.in',
      code: 'DBT',
      desc: 'Direct Benefit Transfer Portal',
    },
    {
      name: 'PM-JAY Ayushman Bharat',
      domain: 'pmjay.gov.in',
      code: 'NHA',
      desc: 'National Health Authority',
    },
    {
      name: 'PM-KISAN Samman Nidhi',
      domain: 'pmkisan.gov.in',
      code: 'AGRI',
      desc: 'Ministry of Agriculture & FW',
    },
    {
      name: 'Pradhan Mantri Awas Yojana',
      domain: 'pmayg.nic.in',
      code: 'MoHUA',
      desc: 'Ministry of Housing & Rural Dev',
    },
  ];

  return (
    <section className="bg-white border-y border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-govEmerald-600 animate-pulse" />
            <span className="text-xs font-bold text-govNavy-900 uppercase tracking-wider">
              {language === 'en'
                ? 'Official Verified Data Sources & Government Gateways'
                : 'आधिकारिक सत्यापित डेटा स्रोत एवं सरकारी पोर्टल'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {language === 'en'
              ? 'All applications link out strictly to authorized *.gov.in / *.nic.in domains'
              : 'सभी आवेदन सीधे अधिकृत *.gov.in / *.nic.in डोमेन पर भेजे जाते हैं'}
          </span>
        </div>

        {/* Partner / Ministry Logo Emblems Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {partnerPortals.map((portal) => (
            <a
              key={portal.domain}
              href={`https://${portal.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 rounded-2xl bg-slate-50 hover:bg-govNavy-50/60 border border-slate-200/90 hover:border-govNavy-200 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 text-govNavy-900 text-[10px] font-black group-hover:border-govNavy-300">
                  {portal.code}
                </span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-govNavy-800 transition-colors" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 group-hover:text-govNavy-900 line-clamp-1">
                  {portal.name}
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                  {portal.domain}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
