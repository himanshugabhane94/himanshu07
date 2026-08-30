'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { GeoIntelligenceMap } from '@/components/geo/GeoIntelligenceMap';

export default function GeoIntelligencePage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <GeoIntelligenceMap />
      </div>
    </AppLayout>
  );
}
