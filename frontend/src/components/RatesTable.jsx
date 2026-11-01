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

    // Filter
    const filtered = entries.filter(
      (c) =>
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    // Sort
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
    <div className="mt-8 bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md">
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Global Interbank Table</h3>
          <p className="text-xs text-slate-400">
            Multi-currency exchange rates indexed to 1.00 {baseCurrency}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search currency (e.g. EUR, Yen, Peso)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950/80 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800/80">
            <tr>
              <th
                onClick={() => toggleSort('code')}
                className="py-3 px-4 sm:px-6 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Currency</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('rate')}
                className="py-3 px-4 sm:px-6 cursor-pointer hover:text-white transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Exchange Rate (1 {baseCurrency})</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 sm:px-6 text-right hidden sm:table-cell">
                Inverse (1 Unit in {baseCurrency})
              </th>
              <th className="py-3 px-4 sm:px-6 text-right hidden md:table-cell">
                Verification Tier
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {currencyList.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-slate-500 text-xs">
                  No matching currencies found for "{search}"
                </td>
              </tr>
            ) : (
              currencyList.map((item) => (
                <tr
                  key={item.code}
                  className="hover:bg-slate-850/50 hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="py-3 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <span className="text-xl leading-none">{item.flag}</span>
                      <div>
                        <span className="font-bold text-white group-hover:text-blue-400 transition-colors">
                          {item.code}
                        </span>
                        <span className="text-slate-400 text-xs ml-2 hidden sm:inline">
                          {item.name}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right font-mono font-semibold text-white">
                    {item.rate > 0 ? item.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 }) : 'N/A'}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right font-mono text-xs text-slate-400 hidden sm:table-cell">
                    {item.rate > 0 ? (1 / item.rate).toFixed(5) : '—'} {baseCurrency}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right hidden md:table-cell">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                      <ShieldCheck className="w-3 h-3 text-blue-400" />
                      {meta?.source ? meta.source.split('(')[0].trim() : 'Aggregated'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="p-3 text-center border-t border-slate-800 text-xs text-slate-500 bg-slate-900/40">
        Showing {currencyList.length} global currency pairs
      </div>
    </div>
  );
}
