export async function retry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      await new Promise(r => setTimeout(r, 300)); // krátká pauza
    }
  }
  throw lastError;
}
