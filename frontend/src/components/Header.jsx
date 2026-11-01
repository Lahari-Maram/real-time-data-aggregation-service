// frontend/src/components/Header.jsx
import React from 'react';
import { RefreshCw, Activity, ShieldCheck, Zap, Sun, Moon, Terminal } from 'lucide-react';

export default function Header({
  baseCurrency,
  setBaseCurrency,
  meta,
  onRefresh,
  isLoading,
  onOpenUpgrade,
  onToggleObservability,
  isObservabilityOpen,
  theme,
  onToggleTheme
}) {
  const getFreshnessBadge = () => {
    if (!meta) return null;

    if (meta.freshness === 'emergency_fallback') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
          Emergency Snapshot
        </span>
      );
    }

    if (meta.freshness === 'stale_fallback' || meta.isStale) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Cached Snapshot ({meta.cacheAgeSeconds || 120}s)
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-sky-300 border border-blue-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-sky-400"></span>
        {meta.cached ? `Cached (${meta.cacheAgeSeconds}s ago)` : 'Real-Time Interbank Feed'}
      </span>
    );
  };

  return (
    <header className="border-b border-slate-200 dark:border-zinc-800 bg-white/90 dark:bg-black/90 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-500/20">
            ₮
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">TrustFX</span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                PROD v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 hidden sm:block font-mono">
              Interbank Settlement Protocol
            </p>
          </div>
        </div>

        {/* Center / Status */}
        <div className="hidden md:flex items-center gap-3">
          {getFreshnessBadge()}
          {meta?.source && (
            <span className="text-xs text-slate-600 dark:text-zinc-400 flex items-center gap-1.5 truncate max-w-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500 dark:text-sky-400 shrink-0" />
              Source: <span className="font-semibold text-slate-900 dark:text-zinc-200 truncate">{meta.source}</span>
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Base Currency Selector */}
          <div className="flex items-center text-xs bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-zinc-200 transition-colors">
            <span className="text-slate-500 dark:text-zinc-500 mr-1.5 hidden sm:inline font-mono">BASE:</span>
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="bg-transparent font-bold focus:outline-none cursor-pointer text-blue-600 dark:text-sky-400"
            >
              <option value="USD" className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white">USD ($)</option>
              <option value="EUR" className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white">EUR (€)</option>
              <option value="GBP" className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white">GBP (£)</option>
              <option value="CAD" className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white">CAD (CA$)</option>
              <option value="AUD" className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white">AUD (A$)</option>
              <option value="JPY" className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white">JPY (¥)</option>
              <option value="INR" className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white">INR (₹)</option>
            </select>
          </div>

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className="p-2 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 rounded-lg transition-all"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-blue-600" />
            )}
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Force refresh live rates"
            className="p-2 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 rounded-lg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600 dark:text-sky-400' : ''}`} />
          </button>

          {/* Observability Button */}
          <button
            onClick={onToggleObservability}
            className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
              isObservabilityOpen
                ? 'bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-300 border-blue-500/40'
                : 'bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
            <span className="hidden sm:inline font-mono">Cluster Telemetry</span>
          </button>

          {/* Upgrade CTA */}
          <button
            onClick={onOpenUpgrade}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition-all transform active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Upgrade to Pro</span>
          </button>
        </div>
      </div>
    </header>
  );
}
