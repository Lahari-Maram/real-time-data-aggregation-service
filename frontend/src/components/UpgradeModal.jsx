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
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-white overflow-hidden transition-colors">
        {/* Subtle royal blue ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          ✕
        </button>

        {subscribed ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-blue-600/20 text-blue-600 dark:text-sky-400 border border-blue-500/30 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              Pro Trial Activated!
            </h3>
            <p className="text-sm text-slate-500 dark:text-zinc-300 max-w-sm mx-auto mb-6">
              Welcome to TrustFX Pro. Your account now has sub-second feeds, unlimited calls, and custom rate alerts enabled.
            </p>
            <button
              onClick={() => {
                setSubscribed(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all"
            >
              Continue to Dashboard
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-sky-400 border border-blue-500/20 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" /> TrustFX Pro Tier
              </span>
            </div>

            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Institutional Speed for Global Business
            </h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 mb-6">
              Engineered for high-volume freelancers, remote agencies, and cross-border commerce teams.
            </p>

            {/* Price Box */}
            <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 mb-6 flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black text-slate-900 dark:text-white">$9</span>
                <span className="text-slate-500 dark:text-zinc-400 text-sm ml-1">/ month</span>
              </div>
              <span className="text-xs font-semibold text-blue-600 dark:text-sky-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                7-Day Free Trial • Cancel Anytime
              </span>
            </div>

            {/* Features List */}
            <div className="space-y-3.5 mb-8">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-sky-400 shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-zinc-200">{f.title}</h5>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <button
              onClick={() => setSubscribed(true)}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              <span>Start 7-Day Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-center text-slate-400 dark:text-zinc-500 mt-3">
              No credit card required for trial. Guaranteed satisfaction.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
