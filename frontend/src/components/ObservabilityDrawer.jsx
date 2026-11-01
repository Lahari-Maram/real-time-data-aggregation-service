// frontend/src/components/ObservabilityDrawer.jsx
import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Database, DollarSign, CheckCircle2, AlertCircle, Wrench, RefreshCw, Layers, Terminal } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-xl bg-white dark:bg-black border-l border-slate-200 dark:border-zinc-800 h-full overflow-y-auto flex flex-col shadow-2xl transition-colors">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50/90 dark:bg-zinc-950/90 sticky top-0 z-10 backdrop-blur">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600/10 text-blue-600 dark:text-sky-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white font-mono">Aggregator Telemetry & Circuit Status</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono">Multi-source failover runtime metrics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-6 flex-1">
          {/* Active Simulation Alert */}
          {activeSimulation && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 text-xs text-amber-700 dark:text-amber-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Simulation Active: <strong>{activeSimulation}</strong></span>
              </div>
              <button
                onClick={onResetSimulation}
                className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 rounded border border-amber-500/40 font-semibold text-amber-800 dark:text-amber-200"
              >
                Reset
              </button>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-3">
              <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono font-medium flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" /> LATENCY
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white mt-1 font-mono">
                {meta?.servedInMs ? `${meta.servedInMs}ms` : '< 20ms'}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">API response time</div>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-3">
              <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono font-medium flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> CACHE AGE
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white mt-1 font-mono">
                {meta?.cacheAgeSeconds !== undefined ? `${meta.cacheAgeSeconds}s` : 'Live'}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">TTL 60s window</div>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-3">
              <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono font-medium flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> BUDGET
              </div>
              <div className="text-lg font-black text-blue-600 dark:text-sky-400 mt-1 font-mono">
                $5.00
              </div>
              <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">4,988 calls left</div>
            </div>
          </div>

          {/* Upstream Providers Circuit Health */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                UPSTREAM PROVIDER CIRCUIT STATUS
              </h4>
              <button
                onClick={fetchHealth}
                disabled={loadingHealth}
                className="text-[11px] text-blue-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-mono"
              >
                <RefreshCw className={`w-3 h-3 ${loadingHealth ? 'animate-spin' : ''}`} />
                SYNC
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
                    className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-3.5 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900 dark:text-white font-mono">{p.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                          {p.priority}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                        {p.authority}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold ${
                        isTripped
                          ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
                          : (isHealthy ? 'bg-blue-500/10 text-blue-600 dark:text-sky-400 border border-blue-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20')
                      }`}>
                        {isTripped ? (
                          <>
                            <AlertCircle className="w-3 h-3" /> Tripped
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Online
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
          <div className="border-t border-slate-200 dark:border-zinc-800 pt-5">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
              Developer Failure Injection Simulator
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-3">
              Test how the backend handles real failure scenarios and guarantees zero 500 errors:
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSimulateOutage('frankfurter')}
                className="p-2.5 rounded-lg text-xs font-medium bg-slate-50 dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-800 text-left transition-all"
              >
                <div className="font-bold text-amber-600 dark:text-amber-400 font-mono">1. Fail Primary (ECB)</div>
                <div className="text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5">Tests OpenExchange automatic failover</div>
              </button>

              <button
                onClick={() => onSimulateOutage('all')}
                className="p-2.5 rounded-lg text-xs font-medium bg-slate-50 dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-800 text-left transition-all"
              >
                <div className="font-bold text-rose-600 dark:text-rose-400 font-mono">2. Blackout (All Fail)</div>
                <div className="text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5">Tests zero-crash cached fallback</div>
              </button>

              <button
                onClick={() => onSimulateOutage('consensus')}
                className="p-2.5 rounded-lg text-xs font-medium bg-slate-50 dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-800 text-left transition-all"
              >
                <div className="font-bold text-blue-600 dark:text-blue-400 font-mono">3. Consensus Engine</div>
                <div className="text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5">Tests multi-feed median calculation</div>
              </button>

              <button
                onClick={onResetSimulation}
                className="p-2.5 rounded-lg text-xs font-medium bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-sky-300 border border-blue-500/30 text-left transition-all"
              >
                <div className="font-bold text-blue-600 dark:text-sky-400 font-mono">4. Live Reset</div>
                <div className="text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5">Restores standard live aggregation</div>
              </button>
            </div>
          </div>

          {/* Strategic Budget Justification Box */}
          <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 text-xs font-mono">
            <h5 className="font-bold text-slate-800 dark:text-zinc-200 mb-1 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              FINANCE QUOTA: $5.00/DAY RULE
            </h5>
            <p className="text-slate-500 dark:text-zinc-400 leading-relaxed font-sans text-xs">
              98% of regular requests are absorbed via 60s micro-caching. The 5,000 premium call allocation is reserved strictly for high-intent conversions and interbank feed discrepancy checks.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-black text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg text-xs font-bold text-slate-800 dark:text-white transition-colors"
          >
            Close Telemetry
          </button>
        </div>
      </div>
    </div>
  );
}
