// backend/src/providers/coinbase.js
export const coinbaseProvider = {
  id: 'coinbase',
  name: 'Coinbase Institutional Spot API',
  priority: 4,
  async fetchRates(base = 'USD') {
    const url = `https://api.coinbase.com/v2/exchange-rates?currency=${encodeURIComponent(base)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'FXTracker/1.0' }
      });
      if (!res.ok) throw new Error(`Coinbase returned HTTP ${res.status}`);
      const data = await res.json();

      if (!data?.data?.rates) {
        throw new Error('Invalid response structure from Coinbase');
      }

      const rates = {};
      for (const [code, val] of Object.entries(data.data.rates)) {
        const num = parseFloat(val);
        if (!isNaN(num) && num > 0) {
          rates[code.toUpperCase()] = num;
        }
      }
      rates[base.toUpperCase()] = 1.0;

      return {
        providerId: 'coinbase',
        providerName: 'Coinbase Institutional Spot API',
        base: data.data.currency || base,
        date: new Date().toISOString(),
        timestamp: Date.now(),
        rates
      };
    } finally {
      clearTimeout(timeout);
    }
  }
};
