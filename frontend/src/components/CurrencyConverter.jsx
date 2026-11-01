// frontend/src/components/CurrencyConverter.jsx
import React, { useState } from 'react';
import { ArrowRightLeft, BadgePercent, ShieldCheck, ArrowRight, TrendingUp } from 'lucide-react';
import { getCurrencyInfo } from '../utils/currencies';

export default function CurrencyConverter({ rates, baseCurrency, meta, onOpenUpgrade }) {
  const [amount, setAmount] = useState('1000');
  const [fromCurr, setFromCurr] = useState(baseCurrency || 'USD');
  const [toCurr, setToCurr] = useState(baseCurrency === 'EUR' ? 'USD' : 'EUR');

  // Sync if baseCurrency prop changed
  React.useEffect(() => {
    if (baseCurrency && baseCurrency !== fromCurr) {
      setFromCurr(baseCurrency);
    }
  }, [baseCurrency]);

  if (!rates || Object.keys(rates).length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-950 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 animate-pulse text-center text-slate-400">
        Loading currency rates...
      </div>
    );
  }

  const fromRateInBase = rates[fromCurr] || 1.0;
  const toRateInBase = rates[toCurr] || 1.0;
  const exchangeRate = toRateInBase / fromRateInBase;
  const parsedAmount = parseFloat(amount) || 0;
  const convertedTotal = (parsedAmount * exchangeRate).toFixed(2);
  const inverseRate = (1 / exchangeRate).toFixed(4);

  // Bank fee comparison (traditional banks typically add ~3% foreign exchange spread)
  const bankMarkup = (parsedAmount * exchangeRate * 0.03).toFixed(2);

  const swapCurrencies = () => {
    const temp = fromCurr;
    setFromCurr(toCurr);
    setToCurr(temp);
  };

  const presetAmounts = ['500', '1000', '2500', '5000', '10000'];

  const fromInfo = getCurrencyInfo(fromCurr);
  const toInfo = getCurrencyInfo(toCurr);

  return (
    <div className="relative rounded-3xl p-1 bg-gradient-to-b from-blue-500/20 via-indigo-500/10 to-transparent dark:from-blue-600/30 dark:via-indigo-600/15 dark:to-zinc-900 shadow-2xl transition-all">
      <div className="bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800/80 rounded-[22px] p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
        {/* Subtle Decorative Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Zero-Spread Interbank Rate
              </span>
              <span className="text-xs text-slate-400 dark:text-zinc-500 hidden sm:inline">• Live Mid-Market</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Currency Exchange Calculator
            </h2>
          </div>

          {meta?.source && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-medium text-slate-600 dark:text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500 dark:text-sky-400" />
              <span>Verified: <strong className="text-slate-900 dark:text-zinc-200">{meta.source.split('(')[0].trim()}</strong></span>
            </div>
          )}
        </div>

        {/* Quick Amount Presets */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 relative z-10">
          <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 shrink-0 mr-1">Popular Amounts:</span>
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              onClick={() => setAmount(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                amount === preset
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800'
              }`}
            >
              ${Number(preset).toLocaleString()}
            </button>
          ))}
        </div>

        {/* Inputs Layout */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 sm:gap-4 items-center relative z-10">
          {/* Amount Input */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
              You Send
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 font-bold text-base">
                {fromInfo.symbol}
              </span>
              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-900/90 border border-slate-300 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-3 text-slate-900 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-inner"
                placeholder="1,000"
              />
            </div>
          </div>

          {/* From Currency */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
              Source Currency
            </label>
            <select
              value={fromCurr}
              onChange={(e) => setFromCurr(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-900/90 border border-slate-300 dark:border-zinc-800 rounded-xl px-3.5 py-3.5 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer shadow-inner"
            >
              {Object.keys(rates).map((code) => (
                <option key={code} value={code} className="bg-white dark:bg-zinc-950 text-slate-900 dark:text-white">
                  {getCurrencyInfo(code).flag} {code} — {getCurrencyInfo(code).name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center md:col-span-1 pt-2 md:pt-6">
            <button
              onClick={swapCurrencies}
              type="button"
              className="p-3 rounded-full bg-blue-50 dark:bg-zinc-900 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-blue-600 dark:text-sky-400 border border-blue-200 dark:border-zinc-800 shadow-sm transition-all hover:rotate-180 hover:scale-110 active:scale-95"
              title="Swap currencies"
              aria-label="Swap currencies"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* To Currency */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
              Recipient Gets
            </label>
            <select
              value={toCurr}
              onChange={(e) => setToCurr(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-900/90 border border-slate-300 dark:border-zinc-800 rounded-xl px-3.5 py-3.5 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer shadow-inner"
            >
              {Object.keys(rates).map((code) => (
                <option key={code} value={code} className="bg-white dark:bg-zinc-950 text-slate-900 dark:text-white">
                  {getCurrencyInfo(code).flag} {code} — {getCurrencyInfo(code).name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results & Value Banner */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-zinc-800/80 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-zinc-400">
              Net Converted Total:
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1 flex items-baseline gap-2">
              <span>{toInfo.symbol} {Number(convertedTotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="text-base font-bold text-blue-600 dark:text-sky-400">{toCurr}</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 flex items-center gap-2">
              <span className="font-medium">1 {fromCurr} = {exchangeRate.toFixed(4)} {toCurr}</span>
              <span className="text-slate-300 dark:text-zinc-700">•</span>
              <span className="font-medium">1 {toCurr} = {inverseRate} {fromCurr}</span>
            </div>
          </div>

          {/* Designer Savings Widget (Replaced AI Sparkle with Real Financial Badge & CTA) */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 dark:from-emerald-950/40 dark:via-zinc-900 dark:to-zinc-900 border border-emerald-500/30 dark:border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between gap-4 w-full lg:w-auto shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                <BadgePercent className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Estimated Spread Savings:</span>
                  <span className="text-[11px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                    +${bankMarkup}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-zinc-400 mt-0.5">
                  vs typical 3% bank wire fees. Need automated rate spike alerts?
                </p>
              </div>
            </div>

            <button
              onClick={onOpenUpgrade}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shrink-0 shadow-sm transition-all flex items-center gap-1 group"
            >
              <span>Pro $9/mo</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
