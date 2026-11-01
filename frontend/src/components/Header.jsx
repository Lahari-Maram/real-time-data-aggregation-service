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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
          Emergency Snapshot
        </span>
      );
    }

    if (meta.freshness === 'stale_fallback' || meta.isStale) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Cached ({meta.cacheAgeSeconds || 120}s)
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        {meta.cached ? `Cached (${meta.cacheAgeSeconds}s)` : 'Live Interbank'}
      </span>
    );
  };

  return (
    <header className="border-b border-zinc-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-black/95 backdrop-blur-md sticky top-0 z-50 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Project Name & Brand (Always Visible When Scrolling) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-9 w-9 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-950 font-black text-lg shadow-sm shrink-0">
            ₮
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-black tracking-tight text-zinc-900 dark:text-white">
              TrustFX
            </span>
            <span className="hidden sm:inline text-xs font-semibold text-zinc-500 dark:text-zinc-400 font-mono border-l border-zinc-300 dark:border-zinc-700 pl-2">
              Real-Time Data Aggregation Service
            </span>
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
              PROD
            </span>
          </div>
        </div>

        {/* Center / Status */}
        <div className="hidden lg:flex items-center gap-3">
          {getFreshnessBadge()}
          {meta?.source && (
            <span className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 truncate max-w-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
              Source: <span className="font-semibold text-zinc-900 dark:text-zinc-200 truncate">{meta.source.split('(')[0].trim()}</span>
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Base Currency Selector */}
          <div className="flex items-center text-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-800 dark:text-zinc-200 transition-colors">
            <span className="text-zinc-500 dark:text-zinc-500 mr-1.5 hidden sm:inline font-mono">BASE:</span>
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="bg-transparent font-bold focus:outline-none cursor-pointer text-zinc-900 dark:text-white"
            >
              <option value="USD" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">USD ($)</option>
              <option value="EUR" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">EUR (€)</option>
              <option value="GBP" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">GBP (£)</option>
              <option value="CAD" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">CAD (CA$)</option>
              <option value="AUD" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">AUD (A$)</option>
              <option value="JPY" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">JPY (¥)</option>
              <option value="INR" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">INR (₹)</option>
            </select>
          </div>

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className="p-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-all"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-zinc-700" />
            )}
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Force refresh live rates"
            className="p-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-zinc-900 dark:text-white' : ''}`} />
          </button>

          {/* Observability Button */}
          <button
            onClick={onToggleObservability}
            className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
              isObservabilityOpen
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white border-zinc-300 dark:border-zinc-700'
                : 'bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
            <span className="hidden sm:inline font-mono">Telemetry</span>
          </button>

          {/* Monochrome Pro CTA */}
          <button
            onClick={onOpenUpgrade}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 flex items-center gap-1.5 shadow-sm transition-all transform active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Pro $9/mo</span>
          </button>
        </div>
      </div>
    </header>
  );
}
