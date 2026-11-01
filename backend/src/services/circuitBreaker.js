// backend/src/services/circuitBreaker.js

export class CircuitBreaker {
  constructor(failureThreshold = 3, cooldownMs = 30000) {
    this.failureThreshold = failureThreshold;
    this.cooldownMs = cooldownMs;
    this.states = new Map();
  }

  getState(providerId) {
    if (!this.states.has(providerId)) {
      this.states.set(providerId, {
        consecutiveFailures: 0,
        lastFailureTime: 0,
        isOpen: false,
        lastSuccessTime: 0,
        totalCalls: 0,
        totalFailures: 0
      });
    }
    const state = this.states.get(providerId);

    // Check if cooldown has elapsed
    if (state.isOpen && Date.now() - state.lastFailureTime > this.cooldownMs) {
      state.isOpen = false;
      state.consecutiveFailures = 0; // Half-open trial
    }

    return state;
  }

  isAvailable(providerId) {
    const state = this.getState(providerId);
    return !state.isOpen;
  }

  recordSuccess(providerId) {
    const state = this.getState(providerId);
    state.totalCalls++;
    state.consecutiveFailures = 0;
    state.isOpen = false;
    state.lastSuccessTime = Date.now();
  }

  recordFailure(providerId, error) {
    const state = this.getState(providerId);
    state.totalCalls++;
    state.totalFailures++;
    state.consecutiveFailures++;
    state.lastFailureTime = Date.now();

    if (state.consecutiveFailures >= this.failureThreshold) {
      state.isOpen = true;
    }
  }

  getAllStatus() {
    const result = {};
    for (const [id, state] of this.states.entries()) {
      result[id] = {
        status: state.isOpen ? 'CIRCUIT_OPEN' : (state.consecutiveFailures > 0 ? 'DEGRADED' : 'HEALTHY'),
        consecutiveFailures: state.consecutiveFailures,
        totalCalls: state.totalCalls,
        totalFailures: state.totalFailures,
        lastSuccess: state.lastSuccessTime ? new Date(state.lastSuccessTime).toISOString() : null
      };
    }
    return result;
  }
}

export const circuitBreaker = new CircuitBreaker();

