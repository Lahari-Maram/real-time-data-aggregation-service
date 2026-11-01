// frontend/src/components/CurrencyConverter.jsx
import React, { useState } from 'react';
import { ArrowRightLeft, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
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
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/60 animate-pulse text-center">
        Loading converter...
      </div>
    );
  }

  // Calculate rate from fromCurr to toCurr using cross-rate formula
  const fromRateInBase = rates[fromCurr] || 1.0;
  const toRateInBase = rates[toCurr] || 1.0;
  // If base is USD: 1 USD = fromRateInBase FROM; 1 USD = toRateInBase TO
  // Therefore: 1 FROM = (toRateInBase / fromRateInBase) TO
  const exchangeRate = toRateInBase / fromRateInBase;
  const parsedAmount = parseFloat(amount) || 0;
  const convertedTotal = (parsedAmount * exchangeRate).toFixed(2);
  const inverseRate = (1 / exchangeRate).toFixed(4);

  // Bank fee comparison (banks typically charge a 3% hidden spread markup)
  const bankMarkup = (parsedAmount * exchangeRate * 0.03).toFixed(2);

  const swapCurrencies = () => {
    const temp = fromCurr;
    setFromCurr(toCurr);
    setToCurr(temp);
  };

  const fromInfo = getCurrencyInfo(fromCurr);
  const toInfo = getCurrencyInfo(toCurr);

  return (
    <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/30 backdrop-blur">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Currency Converter</span>
            <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Mid-Market Rate
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time cross rates without typical 3% bank foreign exchange markup.
          </p>
        </div>

        {meta?.source && (
          <div className="text-right text-[11px] text-slate-400 hidden sm:block">
            <span>Verified via: </span>
            <span className="text-slate-300 font-medium">{meta.source}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3 sm:gap-4 items-center">
        {/* Amount Input */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
              {fromInfo.symbol}
            </span>
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
              placeholder="1,000"
            />
          </div>
        </div>

        {/* From Currency */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            From
          </label>
          <select
            value={fromCurr}
            onChange={(e) => setFromCurr(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            {Object.keys(rates).map((code) => (
              <option key={code} value={code}>
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
            className="p-2.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 transition-all hover:rotate-180"
            title="Swap currencies"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* To Currency */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            To
          </label>
          <select
            value={toCurr}
            onChange={(e) => setToCurr(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            {Object.keys(rates).map((code) => (
              <option key={code} value={code}>
                {getCurrencyInfo(code).flag} {code} — {getCurrencyInfo(code).name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result Section */}
      <div className="mt-6 pt-5 border-t border-slate-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-400 font-medium">Estimated Conversion:</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            {toInfo.symbol} {Number(convertedTotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
            <span className="text-sm font-semibold text-emerald-400 ml-1">{toCurr}</span>
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span>1 {fromCurr} = {exchangeRate.toFixed(4)} {toCurr}</span>
            <span>•</span>
            <span>1 {toCurr} = {inverseRate} {fromCurr}</span>
          </div>
        </div>

        {/* Value Proposition Callout for Freelancers & SMBs */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3 sm:px-4 sm:py-2.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <div className="text-slate-200 font-medium">You save ~${bankMarkup} vs. retail banks</div>
            <div className="text-slate-400">
              Need rate-lock or auto-alerts?{' '}
              <button
                onClick={onOpenUpgrade}
                className="text-emerald-400 underline font-semibold hover:text-emerald-300"
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
