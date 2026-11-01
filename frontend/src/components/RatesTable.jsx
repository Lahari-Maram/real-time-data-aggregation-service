// frontend/src/components/RatesTable.jsx
import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ShieldCheck } from 'lucide-react';
import { getCurrencyInfo } from '../utils/currencies';

export default function RatesTable({ rates, baseCurrency = 'USD', meta }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('code'); // 'code' | 'rate'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'

  const currencyList = useMemo(() => {
    if (!rates) return [];
    const entries = Object.entries(rates).map(([code, rate]) => {
      const info = getCurrencyInfo(code);
      return {
        code,
        name: info.name,
        flag: info.flag,
        symbol: info.symbol,
        rate: typeof rate === 'number' ? rate : parseFloat(rate) || 0
      };
    });

    const filtered = entries.filter(
      (c) =>
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let comp = 0;
      if (sortBy === 'code') comp = a.code.localeCompare(b.code);
      else if (sortBy === 'rate') comp = a.rate - b.rate;
      return sortOrder === 'asc' ? comp : -comp;
    });
  }, [rates, search, sortBy, sortOrder]);

  const toggleSort = (col) => {
    if (sortBy === col) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortOrder('asc');
    }
  };

  return (
    <div className="mt-8 bg-white/95 dark:bg-zinc-950/95 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm backdrop-blur-md transition-colors">
      <div className="p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-50/50 dark:bg-zinc-900/60">
        <div>
          <h3 className="text-base font-black text-zinc-900 dark:text-white tracking-tight">Global Interbank Currency Matrix</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            Active central bank & liquidity provider feeds indexed to 1.00 {baseCurrency}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ISO symbol or currency..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-100/70 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 text-xs font-mono font-semibold uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th
                onClick={() => toggleSort('code')}
                className="py-3 px-4 sm:px-6 cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>CURRENCY</span>
                  <ArrowUpDown className="w-3 h-3 text-zinc-400 dark:text-zinc-600" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('rate')}
                className="py-3 px-4 sm:px-6 cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>EXCHANGE RATE (1 {baseCurrency})</span>
                  <ArrowUpDown className="w-3 h-3 text-zinc-400 dark:text-zinc-600" />
                </div>
              </th>
              <th className="py-3 px-4 sm:px-6 text-right hidden sm:table-cell">
                INVERSE (1 UNIT IN {baseCurrency})
              </th>
              <th className="py-3 px-4 sm:px-6 text-right hidden md:table-cell">
                VERIFICATION TIER
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {currencyList.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-zinc-500 dark:text-zinc-500 text-xs font-mono">
                  No matching currencies found for "{search}"
                </td>
              </tr>
            ) : (
              currencyList.map((item) => (
                <tr
                  key={item.code}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group"
                >
                  <td className="py-3 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <span className="text-xl leading-none">{item.flag}</span>
                      <div>
                        <span className="font-bold font-mono text-zinc-900 dark:text-white group-hover:text-zinc-950 dark:group-hover:text-zinc-200 transition-colors">
                          {item.code}
                        </span>
                        <span className="text-zinc-500 dark:text-zinc-400 text-xs ml-2 hidden sm:inline">
                          {item.name}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right font-mono font-semibold text-zinc-900 dark:text-white">
                    {item.rate > 0 ? item.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 }) : 'N/A'}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right font-mono text-xs text-zinc-500 dark:text-zinc-400 hidden sm:table-cell">
                    {item.rate > 0 ? (1 / item.rate).toFixed(5) : '—'} {baseCurrency}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right hidden md:table-cell">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-zinc-500 dark:text-zinc-400">
                      <ShieldCheck className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
                      {meta?.source ? meta.source.split('(')[0].trim() : 'Aggregated'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="p-3.5 text-center border-t border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-500 dark:text-zinc-500 bg-zinc-50/50 dark:bg-zinc-950">
        {currencyList.length} global ISO currencies synced • European Central Bank reference model
      </div>
    </div>
  );
}
