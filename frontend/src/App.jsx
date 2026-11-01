// frontend/src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StaleWarningBanner from './components/StaleWarningBanner';
import CurrencyConverter from './components/CurrencyConverter';
import QuickPairsGrid from './components/QuickPairsGrid';
import RatesTable from './components/RatesTable';
import ObservabilityDrawer from './components/ObservabilityDrawer';
import UpgradeModal from './components/UpgradeModal';
import { ShieldCheck, Terminal, Radio, Globe2, Clock, BadgePercent, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

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
      theme === 'dark' ? 'dark bg-black text-slate-100 bg-fintech-grid-dark' : 'light bg-slate-50 text-slate-900 bg-fintech-grid-light'
    }`}>
      {/* Designer Ambient Color Glows (Warmth & Depth) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[360px] bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-teal-500/10 dark:from-blue-600/15 dark:via-indigo-600/10 dark:to-teal-500/5 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[600px] right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-600/10 dark:to-purple-600/5 blur-[140px] pointer-events-none z-0"></div>

      {/* Background Architectural Watermarks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full border border-blue-500/5 dark:border-blue-500/10 pointer-events-none"></div>
        <div className="absolute top-24 right-6 select-none opacity-[0.02] dark:opacity-[0.03] text-[240px] font-black font-mono leading-none tracking-tighter">
          FX
        </div>
      </div>

      {/* Top Professional Interbank Market Sessions Ticker */}
      <div className="border-b border-slate-200 dark:border-zinc-800 bg-slate-100/90 dark:bg-zinc-950/90 px-4 py-1.5 text-[11px] font-mono text-slate-600 dark:text-zinc-400 z-30 relative backdrop-blur">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-zinc-200">
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
            <span className="flex items-center gap-1 text-slate-400 dark:text-zinc-600 hidden sm:inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
              Tokyo (Closed)
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-slate-500 dark:text-zinc-500">
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
        {/* Designer Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200 dark:border-zinc-850 dark:border-zinc-800">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-sky-400 border border-blue-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
              <span>Multi-Source Resilient Routing • Fallback Consensus Model</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Real-Time Foreign Exchange
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              Serving verified European Central Bank, Open Exchange Rates, and distributed CDN feeds with automated failover and zero-500 uptime guarantee.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl px-5 py-3 text-right shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-zinc-500">
                AUDIT CONFIDENCE
              </div>
              <div className="text-lg font-black text-blue-600 dark:text-sky-400 flex items-center justify-end gap-1.5 mt-0.5">
                <span>{meta?.confidence || 'High'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl px-5 py-3 text-right shadow-sm">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-zinc-500">
                ACTIVE PROVIDER
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white truncate max-w-[160px] mt-0.5">
                {meta?.source ? meta.source.split('(')[0].trim() : 'Aggregator'}
              </div>
            </div>
          </div>
        </div>

        {/* Designer Feature Stat Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 shadow-sm">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-sky-400">
              <Globe2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">4 Public Feeds</div>
              <div className="text-[11px] text-slate-500 dark:text-zinc-400">Cascading Fallback</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 shadow-sm">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <BadgePercent className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">0% Hidden Fees</div>
              <div className="text-[11px] text-slate-500 dark:text-zinc-400">Mid-Market Rates</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 shadow-sm">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">60s Micro-Cache</div>
              <div className="text-[11px] text-slate-500 dark:text-zinc-400">Sub-10ms Hits</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 shadow-sm">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Zero-500 Uptime</div>
              <div className="text-[11px] text-slate-500 dark:text-zinc-400">Circuit Breakers</div>
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

        {/* Designer Upgrade Banner (No AI Sparkles, Authentic Fintech Value Proposition) */}
        <div className="relative rounded-3xl p-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 shadow-xl overflow-hidden">
          <div className="bg-white dark:bg-zinc-950 rounded-[22px] p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-2 max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-sky-400 border border-blue-500/20">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Engineered for High-Volume Remote Freelancers & Global SMBs</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Tired of rate discrepancies when settling overseas invoices?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                Upgrade to <strong>TrustFX Pro for $9/month</strong> to unlock sub-second institutional pricing, real-time rate deviation alerts, 10-year OHLC history, and our 99.99% uptime SLA.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0 relative z-10">
              <button
                onClick={() => setIsUpgradeOpen(true)}
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all text-center flex items-center justify-center gap-2 group"
              >
                <span>Start 7-Day Pro Trial</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => setIsObservabilityOpen(true)}
                className="px-5 py-3.5 rounded-xl font-semibold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 transition-all text-center font-mono"
              >
                Cluster Telemetry
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with Developer Build Watermark */}
      <footer className="border-t border-slate-200 dark:border-zinc-850 dark:border-zinc-900 bg-slate-100/60 dark:bg-zinc-950 py-8 mt-12 text-xs text-slate-500 dark:text-zinc-400 relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 dark:text-white">TrustFX Service</span>
              <span>•</span>
              <span className="font-mono">High-Availability Forex Aggregator</span>
            </div>

            <div className="flex items-center gap-3 text-slate-500 dark:text-zinc-400 font-mono text-[11px]">
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
          <div className="pt-4 border-t border-slate-200 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 dark:text-zinc-600">
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
