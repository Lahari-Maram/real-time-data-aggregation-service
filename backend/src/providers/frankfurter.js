// backend/src/providers/frankfurter.js
export const frankfurterProvider = {
  id: 'frankfurter',
  name: 'European Central Bank (Frankfurter)',
  priority: 1,
  async fetchRates(base = 'USD') {
    const url = `https://api.frankfurter.app/latest?from=${encodeURIComponent(base)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'FXTracker/1.0' }
      });
      if (!res.ok) throw new Error(`Frankfurter returned HTTP ${res.status}`);
      const data = await res.json();
      
      const rates = { ...data.rates, [base]: 1.0 };
      return {
        providerId: 'frankfurter',
        providerName: 'European Central Bank (Frankfurter)',
        base: data.base || base,
        date: data.date,
        timestamp: Date.now(),
        rates
      };
    } finally {
      clearTimeout(timeout);
    }
  }
};

