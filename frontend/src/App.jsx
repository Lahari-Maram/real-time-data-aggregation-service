// frontend/src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StaleWarningBanner from './components/StaleWarningBanner';
import CurrencyConverter from './components/CurrencyConverter';
import QuickPairsGrid from './components/QuickPairsGrid';
import RatesTable from './components/RatesTable';
import ObservabilityDrawer from './components/ObservabilityDrawer';
import UpgradeModal from './components/UpgradeModal';
import { ShieldCheck, Sparkles, TrendingUp, Layers, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [ratesData, setRatesData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSimulation, setActiveSimulation] = useState(null);
  const [isObservabilityOpen, setIsObservabilityOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

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
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 selection:bg-blue-600 selection:text-white">
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
      />

      {/* Degraded State Banner (shown only when API is stale or fallback) */}
      <StaleWarningBanner
        meta={meta}
        onRefresh={() => fetchRates({ forceFresh: true })}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Value Proposition Hero */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-sky-400 border border-blue-500/20 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Multi-Source Resilient Routing • Guaranteed Zero-500 Uptime</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Real-Time Foreign Exchange
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl mt-1.5 leading-relaxed">
              Serving verified European Central Bank, Open Exchange Rates, and distributed CDN feeds with automatic sub-second failover and consensus auditing.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2 text-right">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Confidence Rating
              </div>
              <div className="text-base font-extrabold text-sky-400 flex items-center justify-end gap-1">
                <span>{meta?.confidence || 'High'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2 text-right">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Active Feed
              </div>
              <div className="text-base font-extrabold text-white truncate max-w-[150px]">
                {meta?.source ? meta.source.split('(')[0].trim() : 'Aggregator'}
              </div>
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

        {/* Free-to-Paid Conversion Banner */}
        <div className="bg-gradient-to-r from-blue-950/40 via-slate-900/90 to-slate-900 border border-blue-500/20 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>For High-Volume Freelancers & Global SMBs</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Tired of currency delays when quoting client invoices or wiring supplier payments?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Upgrade to <strong>TrustFX Pro for $9/month</strong> to unlock sub-second institutional pricing, real-time rate deviation alerts, 10-year OHLC history, and our 99.99% uptime SLA.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => setIsUpgradeOpen(true)}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 transition-all text-center"
            >
              Start 7-Day Pro Trial
            </button>
            <button
              onClick={() => setIsObservabilityOpen(true)}
              className="px-4 py-3 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-center"
            >
              Inspect Health Metrics
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-8 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">TrustFX Service</span>
            <span>•</span>
            <span>Multi-Source Public Forex Aggregator</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>ECB (Frankfurter)</span>
            <span>•</span>
            <span>Open Exchange Rates</span>
            <span>•</span>
            <span>Fawaz Ahmed CDN</span>
            <span>•</span>
            <span>Coinbase Spot</span>
          </div>

          <div>
            Zero-500 Resilience Engine
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
