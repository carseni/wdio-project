import axios from 'axios';

/**
 * Wait for a backend service to become available.
 * Repeatedly pings the /api/tags endpoint until a 200 OK is received,
 * or times out after 30 seconds.
 */
export async function waitForBackendReady(
  url = 'http://localhost:3001/api/tags',
  timeoutMs = 30000,
  intervalMs = 1000
) {

    // ⬇️ Skip logicfor local testing
    //example when run test localy, so we don't have to wait every time:
    //$env:SKIP_BACKEND_WAIT = "true"; npm run test:bdd
  if (process.env.SKIP_BACKEND_WAIT === 'true') {
    console.log('⚡ SKIP_BACKEND_WAIT=true → skipping backend readiness check');
    return;
  }
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const resp = await axios.get(url);
      if (resp.status === 200) {
        console.log(`✅ Backend ready (${url})`);
        return true;
      }
    } catch {
      // ignore until it becomes available
    }

    await new Promise(r => setTimeout(r, intervalMs));
  }

  throw new Error(`Backend did not become ready within ${timeoutMs / 1000}s`);
}
