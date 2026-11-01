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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
          Emergency Snapshot
        </span>
      );
    }

    if (meta.freshness === 'stale_fallback' || meta.isStale) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          Cached Snapshot ({meta.cacheAgeSeconds || 120}s)
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        {meta.cached ? `Cached (${meta.cacheAgeSeconds}s ago)` : 'Live Feed'}
      </span>
    );
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
            ₮
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white tracking-tight">TrustFX</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Free Tier
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Reliable rates for freelancers & global businesses
            </p>
          </div>
        </div>

        {/* Center / Status */}
        <div className="hidden md:flex items-center gap-3">
          {getFreshnessBadge()}
          {meta?.source && (
            <span className="text-xs text-slate-400 flex items-center gap-1 truncate max-w-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Source: <span className="text-slate-200 font-medium truncate">{meta.source}</span>
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Base Selector */}
          <div className="flex items-center text-xs bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200">
            <span className="text-slate-400 mr-1.5 hidden sm:inline">Base:</span>
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="bg-transparent font-semibold focus:outline-none cursor-pointer text-emerald-400"
            >
              <option value="USD" className="bg-slate-800 text-white">USD ($)</option>
              <option value="EUR" className="bg-slate-800 text-white">EUR (€)</option>
              <option value="GBP" className="bg-slate-800 text-white">GBP (£)</option>
              <option value="CAD" className="bg-slate-800 text-white">CAD (CA$)</option>
              <option value="AUD" className="bg-slate-800 text-white">AUD (A$)</option>
              <option value="JPY" className="bg-slate-800 text-white">JPY (¥)</option>
              <option value="INR" className="bg-slate-800 text-white">INR (₹)</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Force refresh live rates"
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          {/* Observability Button */}
          <button
            onClick={onToggleObservability}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 ${
              isObservabilityOpen
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800/80 text-slate-300 hover:text-white border-slate-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Resilience & Health</span>
          </button>

          {/* Upgrade CTA */}
          <button
            onClick={onOpenUpgrade}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all transform active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Upgrade to Pro</span>
          </button>
        </div>
      </div>
    </header>
  );
}
