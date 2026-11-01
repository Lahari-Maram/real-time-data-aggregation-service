// frontend/src/components/QuickPairsGrid.jsx
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { getCurrencyInfo } from '../utils/currencies';

const TOP_PAIRS = ['EUR', 'GBP', 'JPY', 'CAD', 'INR', 'AUD', 'CHF', 'SGD'];

export default function QuickPairsGrid({ rates, baseCurrency = 'USD' }) {
  if (!rates) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-black text-zinc-900 dark:text-white tracking-tight">Major Currency Benchmarks</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Wholesale exchange rates pegged to 1.00 {baseCurrency}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {TOP_PAIRS.filter(code => code !== baseCurrency).map((code) => {
          const rate = rates[code];
          if (!rate) return null;

          const info = getCurrencyInfo(code);

          return (
            <div
              key={code}
              className="bg-white/90 dark:bg-zinc-950/90 hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-2xl p-4 transition-all group shadow-sm backdrop-blur"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg leading-none">{info.flag}</span>
                  <span className="font-bold font-mono text-sm text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                    {baseCurrency}/{code}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" />
                  +0.04%
                </span>
              </div>

              <div className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white tracking-tight font-mono">
                {info.symbol} {typeof rate === 'number' ? rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : rate}
              </div>

              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 truncate font-mono">
                1 {code} = {(1 / rate).toFixed(4)} {baseCurrency}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
