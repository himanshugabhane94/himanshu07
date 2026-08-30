'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { InvestigationTimeline } from '@/components/timeline/InvestigationTimeline';

export default function TimelinePage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <InvestigationTimeline />
      </div>
    </AppLayout>
  );
}
