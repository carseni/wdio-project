// Simple shared test context for step definitions.
// This is a tiny mutable object shared across step-definition modules.
// Prefer the helper functions below instead of writing `testContext.response`
// directly — helpers make intent clearer and keep a global fallback for
// runners that create multiple module instances.
const testContext = {
  response: undefined,
  // add other shared keys here as needed (e.g., token, createdId)
};

// Expose on globalThis as a fallback in case step-definition modules are
// loaded in a way that causes multiple module instances (some runners/tools
// may do this). Using `globalThis.testContext` makes the context reachable
// across those boundaries while still allowing imports to use the module.
try {
  globalThis.testContext = globalThis.testContext || testContext;
} catch (e) {
  // ignore (some environments may restrict globalThis writes)
}

// Helper API around the shared context. Use these from step files:
// import testContext, { setResponse, getResponse, clearResponse } from './context.js'
const setResponse = (resp) => {
  testContext.response = resp;
  try {
    if (globalThis && globalThis.testContext) globalThis.testContext.response = resp;
  } catch (e) {
    // no-op if environment prevents global writes
  }
};

const getResponse = () => {
  // Prefer the module-local value; fall back to globalThis if present.
  return testContext.response ?? (typeof globalThis !== 'undefined' && globalThis.testContext && globalThis.testContext.response);
};

const clearResponse = () => {
  testContext.response = undefined;
  try {
    if (globalThis && globalThis.testContext) globalThis.testContext.response = undefined;
  } catch (e) {
    // ignore
  }
};

const setValue = (key, value) => {
  testContext[key] = value;
  try {
    if (globalThis && globalThis.testContext) globalThis.testContext[key] = value;
  } catch (e) {}
};

const getValue = (key) => {
  return testContext[key] ?? (typeof globalThis !== 'undefined' && globalThis.testContext && globalThis.testContext[key]);
};

export default testContext;
export { setResponse, getResponse, clearResponse, setValue, getValue };
