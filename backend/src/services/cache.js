// backend/src/services/cache.js

/**
 * Hardcoded baseline emergency rates to ensure zero-crash guarantee
 * even during a catastrophic total network blackout.
 */
const EMERGENCY_SNAPSHOT = {
  USD: 1.0,
  EUR: 0.923,
  GBP: 0.771,
  JPY: 152.45,
  CAD: 1.391,
  AUD: 1.518,
  CHF: 0.867,
  CNY: 7.125,
  INR: 84.08,
  SGD: 1.321,
  NZD: 1.674,
  MXN: 20.04,
  BRL: 5.78,
  ZAR: 17.62,
  AED: 3.6725
};

export class MemoryCache {
  constructor(freshTtlMs = 60 * 1000, staleTtlMs = 24 * 60 * 60 * 1000) {
    this.freshTtlMs = freshTtlMs;   // 60 seconds fresh
    this.staleTtlMs = staleTtlMs;   // 24 hours stale fallback
    this.store = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      staleHits: 0
    };
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    const age = Date.now() - entry.timestamp;
    if (age <= this.freshTtlMs) {
      this.stats.hits++;
      return {
        data: entry.data,
        isFresh: true,
        ageMs: age
      };
    }

    if (age <= this.staleTtlMs) {
      this.stats.staleHits++;
      return {
        data: entry.data,
        isFresh: false,
        ageMs: age,
        isStaleFallback: true
      };
    }

    // Completely expired
    this.store.delete(key);
    this.stats.misses++;
    return null;
  }

  set(key, data) {
    this.store.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  getEmergencySnapshot(base = 'USD') {
    return {
      rates: { ...EMERGENCY_SNAPSHOT },
      base,
      date: 'Emergency Offline Baseline Snapshot',
      timestamp: Date.now() - (3600 * 1000 * 12),
      isEmergencySnapshot: true
    };
  }

  getStats() {
    return {
      ...this.stats,
      cachedKeysCount: this.store.size
    };
  }
}

export const cacheService = new MemoryCache();
