// frontend/src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StaleWarningBanner from './components/StaleWarningBanner';
import CurrencyConverter from './components/CurrencyConverter';
import QuickPairsGrid from './components/QuickPairsGrid';
import RatesTable from './components/RatesTable';
import ObservabilityDrawer from './components/ObservabilityDrawer';
import UpgradeModal from './components/UpgradeModal';
import { ShieldCheck, Radio, Globe2, Clock, BadgePercent, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import fintechBg from './assets/fintech-bg.jpg';

export default function App() {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [ratesData, setRatesData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSimulation, setActiveSimulation] = useState(null);
  const [isObservabilityOpen, setIsObservabilityOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  // Theme Management (Default Dark)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('trustfx-theme') || 'dark';
    }
    return 'dark';
  });

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('trustfx-theme', next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      const meta = document.querySelector('meta[name="color-scheme"]');
      if (meta) meta.content = 'dark';
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      const meta = document.querySelector('meta[name="color-scheme"]');
      if (meta) meta.content = 'light';
    }
  };

  const fetchRates = useCallback(async ({ forceFresh = false, simulation = activeSimulation } = {}) => {
    setIsLoading(true);
    try {
      let url = `/api/rates?base=${encodeURIComponent(baseCurrency)}`;
      if (forceFresh) url += '&force_fresh=true';

      if (simulation === 'consensus') {
        url += '&consensus=true';
      } else if (simulation) {
        url += `&simulate_failure=${encodeURIComponent(simulation)}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setRatesData(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [baseCurrency, activeSimulation]);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const handleSimulateOutage = (type) => {
    setActiveSimulation(type);
    fetchRates({ forceFresh: true, simulation: type });
  };

  const handleResetSimulation = () => {
    setActiveSimulation(null);
    fetchRates({ forceFresh: true, simulation: null });
  };

  const rates = ratesData?.rates;
  const meta = ratesData?.meta;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 relative overflow-x-hidden ${
      theme === 'dark' ? 'dark text-zinc-100' : 'light text-zinc-900'
    }`}>
      {/* 100% VISIBLE FINTECH WALLPAPER BACKGROUND IMAGE */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src={fintechBg}
          alt="Global Interbank Forex Network"
          className={`w-full h-full object-cover transition-all duration-300 ${
            theme === 'dark' ? 'opacity-75 brightness-90 contrast-110' : 'opacity-25 invert contrast-125'
          }`}
        />
        {/* Soft Vignette Overlays to Ensure Cards & Text Are Perfectly Crisp */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/85 dark:block hidden"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/90 dark:hidden block"></div>
      </div>

      {/* Top Professional Interbank Market Sessions Ticker */}
      <div className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 px-4 py-1.5 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 z-30 relative backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-semibold text-zinc-800 dark:text-zinc-200">
              <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
              INTERBANK SESSIONS:
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              London (Active)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              New York (Active)
            </span>
            <span className="flex items-center gap-1 text-zinc-400 dark:text-zinc-600 hidden sm:inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
              Tokyo (Closed)
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-zinc-500 dark:text-zinc-500">
            <span className="hidden md:inline">CLUSTER: US-EAST-1 (NODE 04)</span>
            <span>LATENCY: {meta?.servedInMs ? `${meta.servedInMs}ms` : '38ms'}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">ZERO-500 SLA</span>
          </div>
        </div>
      </div>

      {/* Top Header */}
      <Header
        baseCurrency={baseCurrency}
        setBaseCurrency={setBaseCurrency}
        meta={meta}
        onRefresh={() => fetchRates({ forceFresh: true })}
        isLoading={isLoading}
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
        onToggleObservability={() => setIsObservabilityOpen(!isObservabilityOpen)}
        isObservabilityOpen={isObservabilityOpen}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Degraded State Banner (shown only when API is stale or fallback) */}
      <StaleWarningBanner
        meta={meta}
        onRefresh={() => fetchRates({ forceFresh: true })}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
              <span>Multi-Source Resilient Routing • Fallback Consensus Model</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 dark:text-white tracking-tight drop-shadow-sm">
              Real-Time Foreign Exchange
            </h1>
            <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 max-w-2xl leading-relaxed drop-shadow-sm">
              Serving verified European Central Bank, Open Exchange Rates, and distributed CDN feeds with automated failover and zero-500 uptime guarantee.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/90 dark:bg-zinc-950/90 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3 text-right shadow-sm backdrop-blur-md">
              <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
                AUDIT CONFIDENCE
              </div>
              <div className="text-lg font-black text-zinc-900 dark:text-white flex items-center justify-end gap-1.5 mt-0.5 font-mono">
                <span>{meta?.confidence || 'High'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
            </div>

            <div className="bg-white/90 dark:bg-zinc-950/90 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3 text-right shadow-sm backdrop-blur-md">
              <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
                ACTIVE PROVIDER
              </div>
              <div className="text-lg font-black text-zinc-900 dark:text-white truncate max-w-[160px] mt-0.5 font-mono">
                {meta?.source ? meta.source.split('(')[0].trim() : 'Aggregator'}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Stat Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/90 dark:bg-zinc-950/90 border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-md">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
              <Globe2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-white">4 Public Feeds</div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Cascading Fallback</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/90 dark:bg-zinc-950/90 border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-md">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <BadgePercent className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-white">0% Hidden Fees</div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Mid-Market Rates</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/90 dark:bg-zinc-950/90 border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-md">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-white">60s Micro-Cache</div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Sub-10ms Hits</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/90 dark:bg-zinc-950/90 border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-md">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-white">Zero-500 Uptime</div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Circuit Breakers</div>
            </div>
          </div>
        </div>

        {/* Interactive Currency Converter */}
        <CurrencyConverter
          rates={rates}
          baseCurrency={baseCurrency}
          meta={meta}
          onOpenUpgrade={() => setIsUpgradeOpen(true)}
        />

        {/* Major Benchmarks Quick Grid */}
        <QuickPairsGrid
          rates={rates}
          baseCurrency={baseCurrency}
        />

        {/* Global Rates Table with Search & Sort */}
        <RatesTable
          rates={rates}
          baseCurrency={baseCurrency}
          meta={meta}
        />

        {/* High-End Monochrome Pro Banner */}
        <div className="bg-white/90 dark:bg-zinc-950/90 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-sm backdrop-blur-md">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 font-mono">
              <Zap className="w-3.5 h-3.5 fill-current text-amber-500" />
              <span>For High-Volume Remote Freelancers & Global SMBs</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              Tired of rate discrepancies when settling overseas invoices?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Upgrade to <strong>TrustFX Pro for $9/month</strong> to unlock sub-second institutional pricing, real-time rate deviation alerts, 10-year OHLC history, and our 99.99% uptime SLA.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={() => setIsUpgradeOpen(true)}
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 shadow-sm transition-all text-center flex items-center justify-center gap-2 group font-mono"
            >
              <span>Start 7-Day Pro Trial</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => setIsObservabilityOpen(true)}
              className="px-5 py-3.5 rounded-xl font-semibold text-xs bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 transition-all text-center font-mono"
            >
              Cluster Telemetry
            </button>
          </div>
        </div>
      </main>

      {/* Footer with Developer Build Watermark */}
      <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 py-8 mt-12 text-xs text-zinc-500 dark:text-zinc-400 relative z-10 transition-colors backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-black text-zinc-900 dark:text-white">TrustFX Service</span>
              <span>•</span>
              <span className="font-mono">High-Availability Forex Aggregator</span>
            </div>

            <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">
              <span>ECB (Frankfurter)</span>
              <span>•</span>
              <span>Open Exchange Rates</span>
              <span>•</span>
              <span>Fawaz Ahmed CDN</span>
              <span>•</span>
              <span>Coinbase Spot</span>
            </div>

            <div className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              ● 99.99% Active SLA
            </div>
          </div>

          {/* Developer Stamp Watermark */}
          <div className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-400 dark:text-zinc-600">
            <div>
              ENGINE: Node.js 20 ESM • RESILIENCE: 3-Tier Circuit Breaker • ARCH: Monorepo Micro-Cache
            </div>
            <div>
              BUILD: v2.4.1-prod (SHA: 0968573)
            </div>
          </div>
        </div>
      </footer>

      {/* Observability Telemetry Drawer */}
      <ObservabilityDrawer
        isOpen={isObservabilityOpen}
        onClose={() => setIsObservabilityOpen(false)}
        meta={meta}
        onSimulateOutage={handleSimulateOutage}
        onResetSimulation={handleResetSimulation}
        activeSimulation={activeSimulation}
      />

      {/* Upgrade Pro Modal */}
      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
      />
    </div>
  );
}
