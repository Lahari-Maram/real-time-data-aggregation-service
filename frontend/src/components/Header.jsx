// frontend/src/components/Header.jsx
import React from 'react';
import { RefreshCw, Activity, ShieldCheck, Zap } from 'lucide-react';

export default function Header({
  baseCurrency,
  setBaseCurrency,
  meta,
  onRefresh,
  isLoading,
  onOpenUpgrade,
  onToggleObservability,
  isObservabilityOpen
}) {
  const getFreshnessBadge = () => {
    if (!meta) return null;

    if (meta.freshness === 'emergency_fallback') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
          Emergency Snapshot
        </span>
      );
    }

    if (meta.freshness === 'stale_fallback' || meta.isStale) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          Cached Snapshot ({meta.cacheAgeSeconds || 120}s)
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
        {meta.cached ? `Cached (${meta.cacheAgeSeconds}s ago)` : 'Real-Time Feed'}
      </span>
    );
  };

  return (
    <header className="border-b border-slate-800/80 bg-navy-900/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-500/20">
            ₮
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white tracking-tight">TrustFX</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Core
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Institutional benchmark rates for global freelancers & SMBs
            </p>
          </div>
        </div>

        {/* Center / Status */}
        <div className="hidden md:flex items-center gap-3">
          {getFreshnessBadge()}
          {meta?.source && (
            <span className="text-xs text-slate-400 flex items-center gap-1.5 truncate max-w-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              Source: <span className="text-slate-200 font-medium truncate">{meta.source}</span>
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Base Currency Selector */}
          <div className="flex items-center text-xs bg-slate-850 border border-slate-750 rounded-lg px-2.5 py-1.5 text-slate-200 bg-slate-900/80 border-slate-800">
            <span className="text-slate-400 mr-1.5 hidden sm:inline">Base:</span>
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="bg-transparent font-semibold focus:outline-none cursor-pointer text-sky-400"
            >
              <option value="USD" className="bg-slate-900 text-white">USD ($)</option>
              <option value="EUR" className="bg-slate-900 text-white">EUR (€)</option>
              <option value="GBP" className="bg-slate-900 text-white">GBP (£)</option>
              <option value="CAD" className="bg-slate-900 text-white">CAD (CA$)</option>
              <option value="AUD" className="bg-slate-900 text-white">AUD (A$)</option>
              <option value="JPY" className="bg-slate-900 text-white">JPY (¥)</option>
              <option value="INR" className="bg-slate-900 text-white">INR (₹)</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Force refresh live rates"
            className="p-2 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 rounded-lg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
          </button>

          {/* Observability Button */}
          <button
            onClick={onToggleObservability}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 ${
              isObservabilityOpen
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border-slate-700/80'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">System Health</span>
          </button>

          {/* Upgrade CTA */}
          <button
            onClick={onOpenUpgrade}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all transform active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Upgrade to Pro</span>
          </button>
        </div>
      </div>
    </header>
  );
}
