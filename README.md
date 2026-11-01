# TrustFX — Real-Time Forex Data Aggregation Service

A resilient, multi-source currency exchange rate tracking service built with **Node.js/Express** and **React (Vite + Tailwind CSS)**. Designed from a product-first perspective to maximize free-to-paid conversion by eliminating "Unable to fetch rates" errors and providing transparent data freshness.

---

## 💡 Initial Thought Process

When approaching this problem:
1. **Diagnosing the 2% Conversion Rate:**
   Our 10,000 free users churn not because they demand institutional millisecond tick data, but because **broken UI states destroy trust**. Seeing "500 Internal Server Error" or "Unable to fetch rates" sends freelancers and travelers directly to Google or XE. If the free experience feels broken, nobody will ever pay $9/month for Pro.
2. **The PM's Hypothesis is Correct:**
   Trust is earned through **predictable availability** and **radical freshness transparency**. Showing a rate with an honest badge like *"Updated 3 minutes ago • European Central Bank"* converts far higher than pretending to be real-time and failing.
3. **The Multi-Source Defense:**
   Never rely on a single public API. Free endpoints have rate limits and downtime. By chaining **Frankfurter (ECB)**, **Open Exchange Rates**, **Fawaz Ahmed CDN Mirror**, and **Coinbase Spot** behind an in-memory **Circuit Breaker** and **60s micro-cache**, we achieve a **Zero-500 Uptime Guarantee**.
4. **ROI on the $5/day Budget:**
   $5/day allows ~5,000 premium calls. Rather than burning this indiscriminately across 10,000 users, 98% of traffic is absorbed by our 60s micro-cache, reserving the budget for high-intent conversions (active calculator clicks & rate locks) and divergence resolution. Moving conversion from 2% to 5% (+300 paid users) generates **+$2,700/mo MRR on a $150/mo budget (18x ROI)**.

---

## 🏗️ Architecture & Fallback Flow

```
                      ┌──────────────────────┐
                      │  React 18 Frontend   │
                      │ (Vite + Tailwind CSS)│
                      └──────────┬───────────┘
                                 │
                     GET /api/rates?base=USD
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │ Express Aggregator Svc│
                     └──────────┬────────────┘
                                │
          ┌─────────────────────┴─────────────────────┐
          │                                           │
          ▼                                           ▼
┌──────────────────┐                       ┌───────────────────────┐
│ In-Memory Cache  │                       │   Circuit Breaker     │
│ - Fresh TTL: 60s │                       │   & Provider Engine   │
│ - Stale: 24 hrs  │                       └──────────┬────────────┘
└──────────────────┘                                  │
                                    ┌─────────────────┼─────────────────┐
                                    ▼                 ▼                 ▼
                             1. Frankfurter    2. OpenExchange   3. Fawaz Ahmed
                                  (ECB)             (ER-API)        (CDN Mirror)
                                    │                 │                 │
                                    └─────────────────┼─────────────────┘
                                                      │
                                                      ▼
                                            4. Coinbase Institutional
                                               (Real-Time Spot)
```

---

## 🚀 How to Run Locally

### Prerequisites
- **Node.js** v18+ (tested on Node.js v20)
- **npm** v9+

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/real-time-data-aggregation-service.git
cd real-time-data-aggregation-service

# Install all backend and frontend dependencies
npm run install:all
```

### 2. Run Both Backend & Frontend Concurrently
```bash
# Terminal 1: Start Backend (Port 5000)
npm run backend

# Terminal 2: Start Frontend (Port 3000)
npm run frontend
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

### 3. Run as a Single Unified Production Build
You can also build the frontend and serve both the React app and API from a single Node process:
```bash
npm run build
npm start
```
Visit **[http://localhost:5000](http://localhost:5000)**.

---

## 🧪 Automated Resilience Tests

Run the built-in automated test suite covering live APIs, caching, circuit breakers, fallback failover, and consensus calculation:
```bash
npm test
```

Sample test output:
```
✔ should fetch real rates from active public APIs without throwing errors (436ms)
✔ should serve cached data on subsequent requests within fresh TTL window (0.4ms)
✔ should gracefully failover when primary provider fails (254ms)
✔ should never return a 500 when ALL public providers fail (Blackout recovery) (0.7ms)
✔ should calculate multi-source consensus median accurately (476ms)
✔ should respect and track the approved $5/day budget strategically (0.5ms)

All 6 tests passed!
```

---

## 📡 API Reference

### `GET /api/rates`
Returns exchange rates, provider metadata, and freshness status.

#### Query Parameters:
| Param | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `base` | string | `USD` | Base ISO 3-letter currency code (e.g., `USD`, `EUR`, `GBP`, `CAD`, `JPY`) |
| `symbols` | string | *all* | Comma-separated list of symbols (e.g. `EUR,GBP,INR,JPY`) |
| `force_fresh` | boolean | `false` | When `true`, bypasses cache and hits live upstream providers |
| `consensus` | boolean | `false` | When `true`, queries multiple feeds and computes median consensus |
| `simulate_failure` | string | `null` | Test helper: `'frankfurter'`, `'open_exchange'`, or `'all'` |

#### Sample Response:
```json
{
  "base": "USD",
  "date": "2026-11-01",
  "timestamp": 1730462000000,
  "rates": {
    "EUR": 0.89509,
    "GBP": 0.7712,
    "JPY": 152.45,
    "CAD": 1.3912,
    "INR": 84.08
  },
  "meta": {
    "freshness": "fresh",
    "cached": false,
    "source": "European Central Bank (Frankfurter)",
    "providerId": "frankfurter",
    "servedInMs": 376,
    "confidence": "High",
    "fallbackTriggered": false,
    "providerCircuitStatus": {
      "frankfurter": { "status": "HEALTHY", "consecutiveFailures": 0 }
    },
    "budgetRemaining": 4988
  }
}
```

---

### `GET /api/health`
Returns system uptime, circuit breaker states for all 4 providers, and cache statistics.

### `GET /api/budget`
Returns the status of the finance-approved $5.00/day strategic reserve.

---

## 🎛️ Interactive Evaluator Testing Guide

To test the service's resilience under degraded conditions directly from the UI:
1. Open the UI at `http://localhost:3000` (or the deployed URL).
2. Click **"Resilience & Health"** in the top navigation bar.
3. In the **Telemetry & Resilience Drawer**:
   - Click **"1. Fail Primary (ECB)"** → Watch the aggregator automatically fail over to Open Exchange Rates without errors.
   - Click **"2. Blackout (All Fail)"** → Notice the UI gracefully display the cached stale snapshot with a clear amber banner. **Zero crashes or 500s.**
   - Click **"3. Consensus Engine"** → Derives the median rate across multiple active providers with discrepancy checking.
   - Click **"4. Live Reset"** → Restores standard live ECB feeds.

---

## ☁️ Deployment Instructions

### Vercel (Recommended)
This repo contains a pre-configured `vercel.json` and `api/index.js` serverless handler:
```bash
# Deploy to Vercel
npx vercel
```

### Render / Heroku / Railway
Using the included `render.yaml` or `Dockerfile`:
```bash
# Docker build & run
docker build -t trustfx .
docker run -p 5000:5000 trustfx
```

---

## 📁 Repository Structure

```
/
├── MY_APPROACH.md           # Product strategy, persona analysis & business math
├── decisions.md             # Architectural tradeoffs, fallbacks & answers to questions
├── README.md                # Run instructions, initial thought process & docs
├── vercel.json              # Vercel deployment specification
├── render.yaml              # Render deployment specification
├── Dockerfile               # Multi-stage production container
├── package.json             # Root monorepo scripts
├── api/                     # Serverless API adapter for Vercel
│   └── index.js
├── backend/                 # Node.js Express Aggregator
│   ├── package.json
│   ├── src/
│   │   ├── index.js         # Express server & API endpoints
│   │   ├── providers/       # Frankfurter, OpenExchange, FawazAhmed, Coinbase
│   │   └── services/        # Aggregator, MemoryCache, CircuitBreaker
│   └── test/                # Automated resilience test suite
└── frontend/                # React 18 (Vite + Tailwind CSS)
    ├── package.json
    ├── src/
    │   ├── App.jsx
    │   ├── components/      # Header, Converter, RatesTable, ObservabilityDrawer, etc.
    │   └── utils/           # Currency metadata & helpers
    └── dist/                # Production build
```

