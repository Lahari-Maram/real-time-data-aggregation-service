// api/index.js - Serverless function entrypoint for Vercel
import { aggregatorService } from '../backend/src/services/aggregator.js';
import { cacheService } from '../backend/src/services/cache.js';
import { circuitBreaker } from '../backend/src/services/circuitBreaker.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (pathname.endsWith('/health')) {
    return res.status(200).json({
      status: 'healthy',
      uptimeSeconds: Math.round(process.uptime()),
      providers: circuitBreaker.getAllStatus(),
      cache: cacheService.getStats(),
      budget: aggregatorService.getBudgetMetrics()
    });
  }

  if (pathname.endsWith('/budget')) {
    return res.status(200).json(aggregatorService.getBudgetMetrics());
  }

  // Default to /api/rates handler
  try {
    const base = (req.query?.base || url.searchParams.get('base') || 'USD').toString().toUpperCase();
    const symbolsParam = (req.query?.symbols || url.searchParams.get('symbols') || '').toString().toUpperCase();
    const forceFresh = (req.query?.force_fresh || url.searchParams.get('force_fresh')) === 'true';
    const simulateFailure = req.query?.simulate_failure || url.searchParams.get('simulate_failure');
    const useConsensus = (req.query?.consensus || url.searchParams.get('consensus')) === 'true';

    let result;
    if (useConsensus) {
      result = await aggregatorService.getConsensusRates(base);
    } else {
      result = await aggregatorService.getRates({
        base,
        forceFresh,
        simulateProviderFailure: simulateFailure
      });
    }

    if (symbolsParam && result.rates) {
      const requestedSymbols = symbolsParam.split(',').map(s => s.trim());
      const filteredRates = {};
      for (const symbol of requestedSymbols) {
        if (result.rates[symbol] !== undefined) {
          filteredRates[symbol] = result.rates[symbol];
        }
      }
      result.rates = filteredRates;
    }

    return res.status(200).json(result);
  } catch (err) {
    const emergency = cacheService.getEmergencySnapshot('USD');
    return res.status(200).json({
      base: emergency.base,
      date: emergency.date,
      timestamp: emergency.timestamp,
      rates: emergency.rates,
      meta: {
        freshness: 'emergency_fallback',
        warning: 'Emergency fallback rates served.',
        errorDetail: err.message
      }
    });
  }
}
