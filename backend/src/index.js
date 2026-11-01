// backend/src/index.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { aggregatorService } from './services/aggregator.js';
import { cacheService } from './services/cache.js';
import { circuitBreaker } from './services/circuitBreaker.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Single main rates endpoint as specified in requirements
app.get('/api/rates', async (req, res) => {
  try {
    const base = (req.query.base || 'USD').toString().toUpperCase();
    const symbolsParam = req.query.symbols ? req.query.symbols.toString().toUpperCase() : null;
    const forceFresh = req.query.force_fresh === 'true';
    const simulateFailure = req.query.simulate_failure ? req.query.simulate_failure.toString() : null;
    const useConsensus = req.query.consensus === 'true';

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

    // Filter by symbols if requested
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

    // Never return 500 — always return 200 with clear freshness and status
    res.json(result);
  } catch (err) {
    // Graceful fallback even if an uncaught exception occurred
    console.error('Unhandled aggregator error:', err);
    const emergencySnapshot = cacheService.getEmergencySnapshot(req.query.base || 'USD');
    res.json({
      base: emergencySnapshot.base,
      date: emergencySnapshot.date,
      timestamp: emergencySnapshot.timestamp,
      rates: emergencySnapshot.rates,
      meta: {
        freshness: 'emergency_fallback',
        warning: 'Internal aggregator recovery triggered. Displaying emergency reference baseline.',
        errorDetail: err.message,
        confidence: 'Low'
      }
    });
  }
});

// System health and provider observability endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptimeSeconds: Math.round(process.uptime()),
    providers: circuitBreaker.getAllStatus(),
    cache: cacheService.getStats(),
    budget: aggregatorService.getBudgetMetrics()
  });
});

// Strategic budget tracking endpoint
app.get('/api/budget', (req, res) => {
  res.json(aggregatorService.getBudgetMetrics());
});

// Serve frontend static build if available (unified full-stack deployment)
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
    if (err) {
      // In case frontend is not built yet
      res.status(200).send(`
        <html>
          <body style="font-family: sans-serif; padding: 40px; text-align: center;">
            <h2>Forex Aggregation Service API Active</h2>
            <p>Access rates at <a href="/api/rates">/api/rates</a></p>
            <p>Health metrics at <a href="/api/health">/api/health</a></p>
          </body>
        </html>
      `);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Forex Aggregator Backend running on http://localhost:${PORT}`);
});
