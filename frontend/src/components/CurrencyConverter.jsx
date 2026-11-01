// frontend/src/components/CurrencyConverter.jsx
import React, { useState } from 'react';
import { ArrowRightLeft, BadgePercent, ShieldCheck, ArrowRight } from 'lucide-react';
import { getCurrencyInfo } from '../utils/currencies';

export default function CurrencyConverter({ rates, baseCurrency, meta, onOpenUpgrade }) {
  const [amount, setAmount] = useState('1000');
  const [fromCurr, setFromCurr] = useState(baseCurrency || 'USD');
  const [toCurr, setToCurr] = useState(baseCurrency === 'EUR' ? 'USD' : 'EUR');

  React.useEffect(() => {
    if (baseCurrency && baseCurrency !== fromCurr) {
      setFromCurr(baseCurrency);
    }
  }, [baseCurrency]);

  if (!rates || Object.keys(rates).length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-950 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 animate-pulse text-center text-zinc-400">
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
    <div className="bg-white/95 dark:bg-zinc-950/95 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-zinc-200/40 dark:shadow-black/60 backdrop-blur-md relative overflow-hidden transition-all">
      {/* Background Currency Code Watermark */}
      <div className="absolute -right-6 -bottom-8 select-none pointer-events-none opacity-[0.03] dark:opacity-[0.03] text-[180px] font-black font-mono leading-none">
        {fromCurr}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Interbank Mid-Market Rate
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 hidden sm:inline">• Zero Spread Markup</span>
          </div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
            Currency Exchange Calculator
          </h2>
        </div>

        {meta?.source && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>Audited: <strong className="text-zinc-900 dark:text-zinc-200">{meta.source.split('(')[0].trim()}</strong></span>
          </div>
        )}
      </div>

      {/* Quick Amount Presets */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 relative z-10">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 shrink-0 mr-1 font-mono">PRESETS:</span>
        {presetAmounts.map((preset) => (
          <button
            key={preset}
            onClick={() => setAmount(preset)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 font-mono ${
              amount === preset
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-sm scale-105'
                : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800'
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
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5 font-mono">
            Transfer Amount
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 font-bold text-base">
              {fromInfo.symbol}
            </span>
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-3 text-zinc-900 dark:text-white font-mono font-bold text-lg focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:border-transparent transition-all"
              placeholder="1,000"
            />
          </div>
        </div>

        {/* From Currency */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5 font-mono">
            Origin Currency
          </label>
          <select
            value={fromCurr}
            onChange={(e) => setFromCurr(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3.5 py-3.5 text-zinc-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 cursor-pointer"
          >
            {Object.keys(rates).map((code) => (
              <option key={code} value={code} className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">
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
            className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:rotate-180 hover:scale-105 active:scale-95"
            title="Swap currencies"
            aria-label="Swap currencies"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* To Currency */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5 font-mono">
            Recipient Receives
          </label>
          <select
            value={toCurr}
            onChange={(e) => setToCurr(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3.5 py-3.5 text-zinc-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 cursor-pointer"
          >
            {Object.keys(rates).map((code) => (
              <option key={code} value={code} className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">
                {getCurrencyInfo(code).flag} {code} — {getCurrencyInfo(code).name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results & Value Banner */}
      <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        <div>
          <div className="text-xs uppercase font-bold tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
            Net Converted Total:
          </div>
          <div className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight mt-1 flex items-baseline gap-2 font-mono">
            <span>{toInfo.symbol} {Number(convertedTotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-base font-bold text-zinc-500 dark:text-zinc-400">{toCurr}</span>
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 flex items-center gap-2 font-mono">
            <span className="font-medium">1 {fromCurr} = {exchangeRate.toFixed(4)} {toCurr}</span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="font-medium">1 {toCurr} = {inverseRate} {fromCurr}</span>
          </div>
        </div>

        {/* Clean Monochrome & Emerald Spread Savings Widget */}
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center justify-between gap-4 w-full lg:w-auto shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <BadgePercent className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-900 dark:text-white">Spread Savings:</span>
                <span className="text-[11px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-mono">
                  +${bankMarkup}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                vs typical retail wire markups. Need automated alerts?
              </p>
            </div>
          </div>

          <button
            onClick={onOpenUpgrade}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 shrink-0 shadow-sm transition-all flex items-center gap-1 group font-mono"
          >
            <span>Pro $9/mo</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
