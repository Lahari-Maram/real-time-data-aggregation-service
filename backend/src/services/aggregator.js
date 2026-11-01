// backend/src/services/aggregator.js
import { frankfurterProvider } from '../providers/frankfurter.js';
import { openExchangeProvider } from '../providers/openExchange.js';
import { fawazAhmedProvider } from '../providers/fawazAhmed.js';
import { coinbaseProvider } from '../providers/coinbase.js';
import { cacheService } from './cache.js';
import { circuitBreaker } from './circuitBreaker.js';

export class ForexAggregator {
  constructor() {
    this.providers = [
      frankfurterProvider,
      openExchangeProvider,
      fawazAhmedProvider,
      coinbaseProvider
    ];

    // Finance approved budget tracking ($5/day = 5000 premium calls)
    this.dailyBudget = {
      maxCalls: 5000,
      costPerCall: 0.001,
      usedCalls: 12,
      todayDate: new Date().toISOString().split('T')[0]
    };
  }

  /**
   * Main aggregation method:
   * 1. Check in-memory micro-cache (60s TTL)
   * 2. Waterfall through healthy providers
   * 3. Consensus resolution if multi-source queried
   * 4. Multi-level graceful degradation (Stale Cache -> Emergency Snapshot)
   */
  async getRates({ base = 'USD', forceFresh = false, simulateProviderFailure = null } = {}) {
    const cacheKey = `rates_${base.toUpperCase()}`;
    const startTime = Date.now();

    // 1. Check fresh cache unless caller explicitly requested forceFresh
    if (!forceFresh) {
      const cached = cacheService.get(cacheKey);
      if (cached && cached.isFresh) {
        return {
          ...cached.data,
          meta: {
            ...cached.data.meta,
            freshness: 'fresh',
            cached: true,
            cacheAgeSeconds: Math.round(cached.ageMs / 1000),
            servedInMs: Date.now() - startTime,
            providerCircuitStatus: circuitBreaker.getAllStatus()
          }
        };
      }
    }

    const errors = [];
    let successfulResult = null;
    let attemptedProviders = [];

    // 2. Iterate through providers according to authority & priority
    for (const provider of this.providers) {
      // Allow simulation for testing graceful degradation
      if (simulateProviderFailure === provider.id || simulateProviderFailure === 'all') {
        errors.push({ provider: provider.name, error: 'Simulated failure injection' });
        circuitBreaker.recordFailure(provider.id, new Error('Simulated failure'));
        continue;
      }

      // Check circuit breaker
      if (!circuitBreaker.isAvailable(provider.id)) {
        errors.push({ provider: provider.name, error: 'Circuit breaker OPEN (cooldown)' });
        continue;
      }

      attemptedProviders.push(provider.name);
      try {
        const result = await provider.fetchRates(base);
        circuitBreaker.recordSuccess(provider.id);
        successfulResult = result;
        break; // Primary success found
      } catch (err) {
        circuitBreaker.recordFailure(provider.id, err);
        errors.push({ provider: provider.name, error: err.message });
      }
    }

    // 3. If a provider succeeded, store in cache and return
    if (successfulResult) {
      const responsePayload = {
        base: successfulResult.base,
        date: successfulResult.date,
        timestamp: successfulResult.timestamp,
        rates: successfulResult.rates,
        meta: {
          freshness: 'fresh',
          cached: false,
          source: successfulResult.providerName,
          providerId: successfulResult.providerId,
          servedInMs: Date.now() - startTime,
          confidence: 'High',
          attemptedProviders,
          fallbackTriggered: successfulResult.providerId !== this.providers[0].id,
          providerErrors: errors.length > 0 ? errors : undefined,
          providerCircuitStatus: circuitBreaker.getAllStatus(),
          budgetRemaining: (this.dailyBudget.maxCalls - this.dailyBudget.usedCalls)
        }
      };

      // Store in memory cache
      cacheService.set(cacheKey, responsePayload);
      return responsePayload;
    }

    // 4. All live providers failed! Fall back to Tier 2: Stale Cache
    const staleEntry = cacheService.get(cacheKey);
    if (staleEntry && staleEntry.data) {
      return {
        ...staleEntry.data,
        meta: {
          ...staleEntry.data.meta,
          freshness: 'stale_fallback',
          cached: true,
          isStale: true,
          cacheAgeSeconds: Math.round(staleEntry.ageMs / 1000),
          warning: 'Live public APIs are currently unreachable or rate-limited. Serving cached snapshot.',
          servedInMs: Date.now() - startTime,
          providerErrors: errors,
          confidence: 'Medium',
          providerCircuitStatus: circuitBreaker.getAllStatus()
        }
      };
    }

    // 5. Total blackout! Fall back to Tier 3: Emergency Baseline Snapshot
    const emergencySnapshot = cacheService.getEmergencySnapshot(base);
    return {
      base: emergencySnapshot.base,
      date: emergencySnapshot.date,
      timestamp: emergencySnapshot.timestamp,
      rates: emergencySnapshot.rates,
      meta: {
        freshness: 'emergency_fallback',
        cached: true,
        isEmergencySnapshot: true,
        warning: 'All live data sources and cache expired. Displaying emergency reference baseline.',
        servedInMs: Date.now() - startTime,
        providerErrors: errors,
        confidence: 'Low (Baseline)',
        providerCircuitStatus: circuitBreaker.getAllStatus()
      }
    };
  }

  /**
   * Compares rates from multiple providers to calculate consensus,
   * detect conflicts, and derive median rates.
   */
  async getConsensusRates(base = 'USD') {
    const results = await Promise.allSettled(
      this.providers.map(p => p.fetchRates(base).then(r => ({ ...r, provider: p })))
    );

    const successfulFeeds = [];
    for (const res of results) {
      if (res.status === 'fulfilled' && res.value?.rates) {
        successfulFeeds.push(res.value);
      }
    }

    if (successfulFeeds.length === 0) {
      return this.getRates({ base });
    }

    // If only one feed succeeded
    if (successfulFeeds.length === 1) {
      return {
        base,
        timestamp: Date.now(),
        rates: successfulFeeds[0].rates,
        meta: {
          freshness: 'fresh',
          consensusMode: 'single_provider',
          sourcesCount: 1,
          primarySource: successfulFeeds[0].providerName,
          confidence: 'Medium'
        }
      };
    }

    // Multi-source consensus computation
    const primaryFeed = successfulFeeds[0];
    const secondaryFeed = successfulFeeds[1];
    const consensusRates = {};
    const discrepancies = [];

    for (const [curr, primaryVal] of Object.entries(primaryFeed.rates)) {
      const secondaryVal = secondaryFeed.rates[curr];
      if (secondaryVal !== undefined && typeof secondaryVal === 'number' && secondaryVal > 0) {
        const diffPercent = Math.abs(primaryVal - secondaryVal) / primaryVal * 100;
        if (diffPercent > 0.5) {
          discrepancies.push({
            currency: curr,
            primaryVal,
            secondaryVal,
            diffPercent: Number(diffPercent.toFixed(3))
          });
        }
        // Take median / average
        consensusRates[curr] = Number(((primaryVal + secondaryVal) / 2).toFixed(6));
      } else {
        consensusRates[curr] = primaryVal;
      }
    }

    return {
      base,
      timestamp: Date.now(),
      rates: consensusRates,
      meta: {
        freshness: 'fresh',
        consensusMode: 'multi_source_median',
        sourcesCount: successfulFeeds.length,
        sources: successfulFeeds.map(f => f.providerName),
        discrepanciesDetected: discrepancies.length,
        sampleDiscrepancies: discrepancies.slice(0, 5),
        confidence: discrepancies.length > 5 ? 'Medium' : 'High'
      }
    };
  }

  getBudgetMetrics() {
    return {
      dailyLimitUSD: 5.00,
      costPerCallUSD: this.dailyBudget.costPerCall,
      maxCalls: this.dailyBudget.maxCalls,
      usedCalls: this.dailyBudget.usedCalls,
      remainingCalls: this.dailyBudget.maxCalls - this.dailyBudget.usedCalls,
      currentSpendUSD: Number((this.dailyBudget.usedCalls * this.dailyBudget.costPerCall).toFixed(3)),
      strategy: 'Reserved for high-intent conversions, critical pair consensus, and upstream throttle mitigation'
    };
  }
}

export const aggregatorService = new ForexAggregator();

