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
      <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 animate-pulse text-center text-slate-400">
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
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/40 backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Currency Exchange Calculator</span>
            <span className="text-xs font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
              Interbank Mid-Market
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time cross rates without hidden foreign transaction spreads.
          </p>
        </div>

        {meta?.source && (
          <div className="text-right text-[11px] text-slate-400 hidden sm:block">
            <span className="text-slate-500">Benchmark Source: </span>
            <span className="text-slate-300 font-medium">{meta.source}</span>
          </div>
        )}
      </div>

      {/* Quick Amount Presets */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        <span className="text-[11px] text-slate-400 font-medium shrink-0">Quick Amount:</span>
        {presetAmounts.map((preset) => (
          <button
            key={preset}
            onClick={() => setAmount(preset)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all shrink-0 ${
              amount === preset
                ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700/60'
            }`}
          >
            ${Number(preset).toLocaleString()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3 sm:gap-4 items-center">
        {/* Amount Input */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            You Send
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
              {fromInfo.symbol}
            </span>
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-750 border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white font-bold text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              placeholder="1,000"
            />
          </div>
        </div>

        {/* From Currency */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Source Currency
          </label>
          <select
            value={fromCurr}
            onChange={(e) => setFromCurr(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
          >
            {Object.keys(rates).map((code) => (
              <option key={code} value={code} className="bg-slate-900 text-white">
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
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all hover:scale-105 active:scale-95"
            title="Swap currencies"
          >
            <ArrowRightLeft className="w-4 h-4 text-sky-400" />
          </button>
        </div>

        {/* To Currency */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Recipient Gets
          </label>
          <select
            value={toCurr}
            onChange={(e) => setToCurr(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
          >
            {Object.keys(rates).map((code) => (
              <option key={code} value={code} className="bg-slate-900 text-white">
                {getCurrencyInfo(code).flag} {code} — {getCurrencyInfo(code).name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result Section */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-400 font-medium">Net Settlement Amount:</div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
            {toInfo.symbol} {Number(convertedTotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
            <span className="text-sm font-bold text-sky-400 ml-1">{toCurr}</span>
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span>1 {fromCurr} = {exchangeRate.toFixed(4)} {toCurr}</span>
            <span className="text-slate-600">•</span>
            <span>1 {toCurr} = {inverseRate} {fromCurr}</span>
          </div>
        </div>

        {/* Value Callout for Freelancers & Businesses */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 sm:px-4 sm:py-2.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-sky-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <div className="text-slate-200 font-medium">Estimated Bank Spread Savings: ~${bankMarkup}</div>
            <div className="text-slate-400">
              Need rate guarantees or auto-triggers?{' '}
              <button
                onClick={onOpenUpgrade}
                className="text-sky-400 underline font-semibold hover:text-sky-300"
              >
                Try Pro for $9/mo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
