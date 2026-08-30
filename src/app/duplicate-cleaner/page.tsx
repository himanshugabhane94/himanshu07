'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DuplicateCleanerView } from '@/components/records/DuplicateCleanerView';

export default function DuplicateCleanerPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <DuplicateCleanerView />
      </div>
    </AppLayout>
  );
}
