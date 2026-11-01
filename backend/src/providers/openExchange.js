// backend/src/providers/openExchange.js
export const openExchangeProvider = {
  id: 'open_exchange',
  name: 'Open Exchange Rates (ER-API)',
  priority: 2,
  async fetchRates(base = 'USD') {
    const url = `https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'FXTracker/1.0' }
      });
      if (!res.ok) throw new Error(`Open Exchange returned HTTP ${res.status}`);
      const data = await res.json();

      if (data.result !== 'success' || !data.rates) {
        throw new Error('Invalid response structure from Open Exchange Rates');
      }

      const rates = { ...data.rates, [base]: 1.0 };
      const timestamp = data.time_last_update_unix ? data.time_last_update_unix * 1000 : Date.now();

      return {
        providerId: 'open_exchange',
        providerName: 'Open Exchange Rates (ER-API)',
        base: data.base_code || base,
        date: data.time_last_update_utc || new Date(timestamp).toISOString(),
        timestamp,
        rates
      };
    } finally {
      clearTimeout(timeout);
    }
  }
};
