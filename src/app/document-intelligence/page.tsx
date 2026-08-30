'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DocumentOcrPipeline } from '@/components/records/DocumentOcrPipeline';

export default function DocumentIntelligencePage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <DocumentOcrPipeline />
      </div>
    </AppLayout>
  );
}
