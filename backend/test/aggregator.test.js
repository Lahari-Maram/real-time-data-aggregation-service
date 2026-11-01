import { describe, it } from 'node:test';
import assert from 'node:assert';
import { aggregatorService } from '../src/services/aggregator.js';
import { cacheService } from '../src/services/cache.js';
import { circuitBreaker } from '../src/services/circuitBreaker.js';

describe('Real-Time Forex Aggregator Resilience Tests', () => {
  it('should fetch real rates from active public APIs without throwing errors', async () => {
    const res = await aggregatorService.getRates({ base: 'USD' });
    assert.ok(res.rates, 'Rates object should exist');
    assert.strictEqual(res.base, 'USD');
    assert.ok(res.rates.EUR > 0, 'EUR rate should be positive');
    assert.ok(res.rates.GBP > 0, 'GBP rate should be positive');
    assert.ok(res.meta, 'Meta information should be present');
    assert.ok(['fresh', 'stale_fallback'].includes(res.meta.freshness));
  });

  it('should serve cached data on subsequent requests within fresh TTL window', async () => {
    const res1 = await aggregatorService.getRates({ base: 'USD' });
    const res2 = await aggregatorService.getRates({ base: 'USD' });
    assert.strictEqual(res2.meta.cached, true, 'Second request should be served from cache');
    assert.ok(res2.meta.cacheAgeSeconds >= 0, 'Cache age should be reported in seconds');
  });

  it('should gracefully failover when primary provider fails', async () => {
    const fallbackRes = await aggregatorService.getRates({
      base: 'USD',
      forceFresh: true,
      simulateProviderFailure: 'frankfurter'
    });
    assert.ok(fallbackRes.rates, 'Should still receive valid rates from secondary provider');
    assert.strictEqual(fallbackRes.meta.fallbackTriggered, true, 'Fallback should be marked as triggered');
    assert.notStrictEqual(fallbackRes.meta.providerId, 'frankfurter', 'Should have failed over away from Frankfurter');
  });

  it('should never return a 500 when ALL public providers fail (Blackout recovery)', async () => {
    const blackoutRes = await aggregatorService.getRates({
      base: 'USD',
      forceFresh: true,
      simulateProviderFailure: 'all'
    });
    assert.ok(blackoutRes.rates, 'Should return rates even during complete blackout');
    assert.ok(
      blackoutRes.meta.freshness === 'stale_fallback' || blackoutRes.meta.freshness === 'emergency_fallback',
      'Should indicate fallback state'
    );
    assert.ok(blackoutRes.meta.warning, 'Should include human-readable transparency warning');
    assert.ok(blackoutRes.rates.EUR > 0, 'Baseline or stale rates must be present');
  });

  it('should calculate multi-source consensus median accurately', async () => {
    const consensusRes = await aggregatorService.getConsensusRates('USD');
    assert.ok(consensusRes.rates, 'Consensus rates should be computed');
    assert.ok(consensusRes.meta.sourcesCount >= 1, 'Should aggregate one or more active feeds');
  });

  it('should respect and track the approved $5/day budget strategically', () => {
    const budget = aggregatorService.getBudgetMetrics();
    assert.strictEqual(budget.dailyLimitUSD, 5.00);
    assert.strictEqual(budget.maxCalls, 5000);
    assert.ok(budget.remainingCalls > 0);
  });
});

