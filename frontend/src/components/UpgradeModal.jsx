// frontend/src/components/UpgradeModal.jsx
import React, { useState } from 'react';
import { Check, Zap, Shield, Bell, BarChart3, ArrowRight } from 'lucide-react';

export default function UpgradeModal({ isOpen, onClose }) {
  const [subscribed, setSubscribed] = useState(false);

  if (!isOpen) return null;

  const features = [
    {
      title: 'Institutional Millisecond Real-Time Feeds',
      desc: 'Sub-second tick data direct from liquidity providers & interbank exchanges.',
      icon: Zap
    },
    {
      title: '99.99% Guaranteed SLA Uptime',
      desc: 'Dedicated enterprise infrastructure with zero rate limits and instant fallback.',
      icon: Shield
    },
    {
      title: 'Real-Time Rate Spike & Limit Alerts',
      desc: 'SMS, WhatsApp, and Slack notifications when currency crosses your target rate.',
      icon: Bell
    },
    {
      title: '10-Year Historical Data & Charts',
      desc: 'Full OHLC candlestick charts, volatility heatmaps, and CSV export for bookkeeping.',
      icon: BarChart3
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-zinc-900 dark:text-white overflow-hidden transition-colors">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          ✕
        </button>

        {subscribed ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
              Pro Trial Activated!
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-300 max-w-sm mx-auto mb-6">
              Welcome to TrustFX Pro. Your account now has sub-second feeds, unlimited calls, and custom rate alerts enabled.
            </p>
            <button
              onClick={() => {
                setSubscribed(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold rounded-xl text-sm transition-all"
            >
              Continue to Dashboard
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 flex items-center gap-1.5 font-mono">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" /> TrustFX Pro Tier
              </span>
            </div>

            <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
              Institutional Speed for Global Business
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 mb-6">
              Engineered for high-volume freelancers, remote agencies, and cross-border commerce teams.
            </p>

            {/* Price Box */}
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 mb-6 flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black text-zinc-900 dark:text-white">$9</span>
                <span className="text-zinc-500 dark:text-zinc-400 text-sm ml-1 font-mono">/ month</span>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-mono">
                7-Day Free Trial • Cancel Anytime
              </span>
            </div>

            {/* Features List */}
            <div className="space-y-3.5 mb-8">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-200">{f.title}</h5>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <button
              onClick={() => setSubscribed(true)}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 shadow-sm transition-all flex items-center justify-center gap-2 transform active:scale-95 font-mono"
            >
              <span>Start 7-Day Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-center text-zinc-400 dark:text-zinc-500 mt-3 font-mono">
              No credit card required for trial. Guaranteed satisfaction.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
