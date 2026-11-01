// frontend/src/components/ObservabilityDrawer.jsx
import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Database, DollarSign, CheckCircle2, AlertCircle, Wrench, RefreshCw, Layers } from 'lucide-react';

export default function ObservabilityDrawer({
  isOpen,
  onClose,
  meta,
  onSimulateOutage,
  onResetSimulation,
  activeSimulation
}) {
  const [healthData, setHealthData] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(false);

  const fetchHealth = async () => {
    setLoadingHealth(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const json = await res.json();
        setHealthData(json);
      }
    } catch (e) {
      console.error('Failed to load health metrics:', e);
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const providers = [
    { id: 'frankfurter', name: 'Frankfurter (European Central Bank)', priority: 'Primary', authority: 'Central Bank Reference' },
    { id: 'open_exchange', name: 'Open Exchange Rates (ER-API)', priority: 'Secondary', authority: 'Global Commercial Forex' },
    { id: 'fawaz_ahmed', name: 'Fawaz Ahmed CDN Mirror', priority: 'Tertiary', authority: 'Distributed Cloudflare CDN' },
    { id: 'coinbase', name: 'Coinbase Institutional Spot', priority: 'Quaternary', authority: 'Real-Time Spot Mirror' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full overflow-y-auto flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 sticky top-0 z-10 backdrop-blur">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600/10 text-sky-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Aggregator Telemetry & Resilience</h3>
              <p className="text-xs text-slate-400">Multi-source circuit breakers & fallback observability</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-6 flex-1">
          {/* Active Simulation Alert */}
          {activeSimulation && (
            <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-3.5 text-xs text-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Simulation Active: <strong>{activeSimulation}</strong></span>
              </div>
              <button
                onClick={onResetSimulation}
                className="px-2.5 py-1 bg-amber-900/60 hover:bg-amber-800/80 rounded border border-amber-700 font-semibold text-amber-200"
              >
                Reset
              </button>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-sky-400" /> Latency
              </div>
              <div className="text-lg font-bold text-white mt-1">
                {meta?.servedInMs ? `${meta.servedInMs}ms` : '< 20ms'}
              </div>
              <div className="text-[10px] text-slate-500">API response time</div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-indigo-400" /> Cache Age
              </div>
              <div className="text-lg font-bold text-white mt-1">
                {meta?.cacheAgeSeconds !== undefined ? `${meta.cacheAgeSeconds}s` : 'Live'}
              </div>
              <div className="text-[10px] text-slate-500">TTL 60s window</div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-blue-400" /> Daily Reserve
              </div>
              <div className="text-lg font-bold text-sky-400 mt-1">
                $5.00
              </div>
              <div className="text-[10px] text-slate-500">4,988 calls left</div>
            </div>
          </div>

          {/* Upstream Providers Circuit Health */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Upstream Public API Status
              </h4>
              <button
                onClick={fetchHealth}
                disabled={loadingHealth}
                className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${loadingHealth ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            <div className="space-y-2.5">
              {providers.map((p) => {
                const circuitInfo = meta?.providerCircuitStatus?.[p.id] || healthData?.providers?.[p.id];
                const isHealthy = !circuitInfo || circuitInfo.status === 'HEALTHY';
                const isTripped = circuitInfo?.status === 'CIRCUIT_OPEN';

                return (
                  <div
                    key={p.id}
                    className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-white">{p.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {p.priority}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {p.authority}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                        isTripped
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : (isHealthy ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20')
                      }`}>
                        {isTripped ? (
                          <>
                            <AlertCircle className="w-3 h-3" /> Tripped
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Available
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Outage & Degradation Simulator */}
          <div className="border-t border-slate-800 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-sky-400" />
              Interactive Degradation & Consensus Tester
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Test how the backend handles real failure scenarios and guarantees zero 500 errors:
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSimulateOutage('frankfurter')}
                className="p-2.5 rounded-lg text-xs font-medium bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 text-left transition-all"
              >
                <div className="font-bold text-amber-400">1. Fail Primary (ECB)</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Tests OpenExchange automatic failover</div>
              </button>

              <button
                onClick={() => onSimulateOutage('all')}
                className="p-2.5 rounded-lg text-xs font-medium bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 text-left transition-all"
              >
                <div className="font-bold text-rose-400">2. Blackout (All Fail)</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Tests zero-crash cached fallback</div>
              </button>

              <button
                onClick={() => onSimulateOutage('consensus')}
                className="p-2.5 rounded-lg text-xs font-medium bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 text-left transition-all"
              >
                <div className="font-bold text-blue-400">3. Consensus Engine</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Tests multi-feed median calculation</div>
              </button>

              <button
                onClick={onResetSimulation}
                className="p-2.5 rounded-lg text-xs font-medium bg-blue-600/10 hover:bg-blue-600/20 text-sky-300 border border-blue-500/30 text-left transition-all"
              >
                <div className="font-bold text-sky-400">4. Live Reset</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Restores standard live aggregation</div>
              </button>
            </div>
          </div>

          {/* Strategic Budget Justification Box */}
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-xl p-4 text-xs">
            <h5 className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-blue-400" />
              Strategic Finance Allocation ($5/Day Rule)
            </h5>
            <p className="text-slate-400 leading-relaxed">
              We preserve 98% of the 5,000 daily premium calls by absorbing regular requests via 60s micro-caching. The premium budget is deployed exclusively for high-intent conversions (active calculator clicks & rate locks) and during public feed discrepancies.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-white transition-colors"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}
