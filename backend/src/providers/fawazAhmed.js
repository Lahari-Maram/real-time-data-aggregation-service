// backend/src/providers/fawazAhmed.js
export const fawazAhmedProvider = {
  id: 'fawaz_ahmed',
  name: 'Global Currency CDN (Fawaz Ahmed)',
  priority: 3,
  async fetchRates(base = 'USD') {
    const baseLower = base.toLowerCase();
    const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${encodeURIComponent(baseLower)}.json`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'FXTracker/1.0' }
      });
      if (!res.ok) throw new Error(`FawazAhmed CDN returned HTTP ${res.status}`);
      const data = await res.json();

      const rawRates = data[baseLower];
      if (!rawRates) {
        throw new Error(`Currency key '${baseLower}' missing in response`);
      }

      // Convert lowercase keys to standard uppercase ISO codes
      const rates = {};
      for (const [code, val] of Object.entries(rawRates)) {
        rates[code.toUpperCase()] = val;
      }
      rates[base.toUpperCase()] = 1.0;

      return {
        providerId: 'fawaz_ahmed',
        providerName: 'Global Currency CDN (Fawaz Ahmed)',
        base: base.toUpperCase(),
        date: data.date,
        timestamp: Date.now(),
        rates
      };
    } finally {
      clearTimeout(timeout);
    }
  }
};

