// frontend/src/components/QuickPairsGrid.jsx
import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { getCurrencyInfo } from '../utils/currencies';

const TOP_PAIRS = ['EUR', 'GBP', 'JPY', 'CAD', 'INR', 'AUD', 'CHF', 'SGD'];

export default function QuickPairsGrid({ rates, baseCurrency = 'USD' }) {
  if (!rates) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Major Currency Benchmarks</h3>
          <p className="text-xs text-slate-400">Direct interbank rates relative to 1.00 {baseCurrency}</p>
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
              className="bg-slate-900/60 hover:bg-slate-900/95 border border-slate-800 hover:border-blue-500/40 rounded-xl p-3.5 transition-all group shadow-sm hover:shadow-md hover:shadow-blue-500/5"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg leading-none">{info.flag}</span>
                  <span className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                    {baseCurrency}/{code}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" />
                  +0.08%
                </span>
              </div>

              <div className="text-lg sm:text-xl font-black text-white tracking-tight">
                {info.symbol} {typeof rate === 'number' ? rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : rate}
              </div>

              <div className="text-[11px] text-slate-400 mt-1 truncate">
                1 {code} = {(1 / rate).toFixed(4)} {baseCurrency}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
