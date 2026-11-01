// frontend/src/components/CurrencyConverter.jsx
import React, { useState } from 'react';
import { ArrowRightLeft, Sparkles, ShieldCheck } from 'lucide-react';
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

  // Bank fee comparison (traditional banks typically add ~3% foreign exchange markup)
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
    <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 dark:border-zinc-800 rounded-2xl p-5 sm:p-7 shadow-xl shadow-slate-200/50 dark:shadow-black/70 backdrop-blur-md relative overflow-hidden transition-colors">
      {/* Background Watermark Symbol */}
      <div className="absolute -right-8 -bottom-10 select-none pointer-events-none opacity-[0.03] dark:opacity-[0.04] text-[180px] font-black font-mono leading-none">
        {fromCurr}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6 relative z-10">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Interbank Cross-Currency Calculator</span>
            <span className="text-[11px] font-mono font-semibold text-blue-600 dark:text-sky-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              Zero Markup
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Real-time wholesale spot rates without retail banking spread markup.
          </p>
        </div>

        {meta?.source && (
          <div className="text-right text-[11px] text-slate-500 dark:text-zinc-400 hidden sm:block font-mono">
            <span>AUDIT: </span>
            <span className="text-slate-700 dark:text-zinc-200 font-semibold">{meta.source}</span>
          </div>
        )}
      </div>

      {/* Quick Amount Presets */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 relative z-10">
        <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 font-medium shrink-0">PRESETS:</span>
        {presetAmounts.map((preset) => (
          <button
            key={preset}
            onClick={() => setAmount(preset)}
            className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium border transition-all shrink-0 ${
              amount === preset
                ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                : 'bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-850 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-800'
            }`}
          >
            ${Number(preset).toLocaleString()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3 sm:gap-4 items-center relative z-10">
        {/* Amount Input */}
        <div className="md:col-span-2">
          <label className="block text-xs font-mono font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
            TRANSFER AMOUNT
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 font-semibold text-sm">
              {fromInfo.symbol}
            </span>
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 dark:text-white font-mono font-bold text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              placeholder="1,000"
            />
          </div>
        </div>

        {/* From Currency */}
        <div className="md:col-span-2">
          <label className="block text-xs font-mono font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
            ORIGIN CURRENCY
          </label>
          <select
            value={fromCurr}
            onChange={(e) => setFromCurr(e.target.value)}
            className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
          >
            {Object.keys(rates).map((code) => (
              <option key={code} value={code} className="bg-white dark:bg-zinc-950 text-slate-900 dark:text-white">
                {getCurrencyInfo(code).flag} {code} — {getCurrencyInfo(code).name}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center md:col-span-1 pt-4 md:pt-6">
          <button
            onClick={swapCurrencies}
            type="button"
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 transition-all hover:scale-105 active:scale-95"
            title="Swap currencies"
          >
            <ArrowRightLeft className="w-4 h-4 text-blue-600 dark:text-sky-400" />
          </button>
        </div>

        {/* To Currency */}
        <div className="md:col-span-2">
          <label className="block text-xs font-mono font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
            RECIPIENT RECEIVES
          </label>
          <select
            value={toCurr}
            onChange={(e) => setToCurr(e.target.value)}
            className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
          >
            {Object.keys(rates).map((code) => (
              <option key={code} value={code} className="bg-white dark:bg-zinc-950 text-slate-900 dark:text-white">
                {getCurrencyInfo(code).flag} {code} — {getCurrencyInfo(code).name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result Section */}
      <div className="mt-6 pt-5 border-t border-slate-200 dark:border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="text-xs font-mono text-slate-500 dark:text-zinc-400 font-medium">SETTLEMENT AMOUNT:</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5 font-mono">
            {toInfo.symbol} {Number(convertedTotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
            <span className="text-sm font-bold text-blue-600 dark:text-sky-400 ml-1">{toCurr}</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1 flex items-center gap-2 font-mono">
            <span>1 {fromCurr} = {exchangeRate.toFixed(4)} {toCurr}</span>
            <span className="text-slate-300 dark:text-zinc-700">•</span>
            <span>1 {toCurr} = {inverseRate} {fromCurr}</span>
          </div>
        </div>

        {/* Value Callout for Freelancers & Businesses */}
        <div className="bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl p-3 sm:px-4 sm:py-2.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-sky-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <div className="text-slate-800 dark:text-zinc-200 font-semibold">Saved vs Retail Wire Spread: ~${bankMarkup}</div>
            <div className="text-slate-500 dark:text-zinc-400">
              Need automated limit triggers?{' '}
              <button
                onClick={onOpenUpgrade}
                className="text-blue-600 dark:text-sky-400 underline font-semibold hover:text-blue-500 dark:hover:text-sky-300"
              >
                Pro at $9/mo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
