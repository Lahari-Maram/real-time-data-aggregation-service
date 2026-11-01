// frontend/src/components/StaleWarningBanner.jsx
import React from 'react';
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react';

export default function StaleWarningBanner({ meta, onRefresh, isLoading }) {
  if (!meta) return null;

  const isDegraded = meta.freshness === 'stale_fallback' || meta.freshness === 'emergency_fallback' || meta.isStale;

  if (!isDegraded) return null;

  const isEmergency = meta.freshness === 'emergency_fallback' || meta.isEmergencySnapshot;

  return (
    <div className={`border-b px-4 py-3 sm:px-6 transition-all ${
      isEmergency
        ? 'bg-red-950/40 border-red-800/60 text-red-200'
        : 'bg-amber-950/40 border-amber-800/60 text-amber-200'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
            isEmergency ? 'text-red-400' : 'text-amber-400'
          }`} />
          <div>
            <h4 className="text-sm font-semibold tracking-tight">
              {isEmergency
                ? 'Primary upstream feeds unavailable • Displaying offline baseline rates'
                : 'Upstream rate delay • Serving high-precision cached snapshot'}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              {meta.warning || 'Our multi-source aggregator seamlessly switched to cached rates to prevent service disruption.'}{' '}
              {meta.cacheAgeSeconds ? `Data age: ~${Math.round(meta.cacheAgeSeconds / 60)} minutes old.` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-1 mr-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Zero 500s guarantee</span>
          </div>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className={`px-3 py-1 rounded text-xs font-medium border flex items-center gap-1.5 transition-all ${
              isEmergency
                ? 'bg-red-900/60 hover:bg-red-800/60 text-red-200 border-red-700'
                : 'bg-amber-900/60 hover:bg-amber-800/60 text-amber-200 border-amber-700'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Retry Feed</span>
          </button>
        </div>
      </div>
    </div>
  );
}

