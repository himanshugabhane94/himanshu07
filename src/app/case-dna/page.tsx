'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CaseDnaView } from '@/components/dna/CaseDnaView';

export default function CaseDnaPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <CaseDnaView />
      </div>
    </AppLayout>
  );
}
