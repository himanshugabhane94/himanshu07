'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { EntityResolutionView } from '@/components/ai/EntityResolutionView';

export default function EntityResolutionPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <EntityResolutionView />
      </div>
    </AppLayout>
  );
}
