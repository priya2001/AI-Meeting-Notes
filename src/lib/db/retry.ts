const RETRYABLE_ERROR_CODES = new Set([
  "CONNECT_TIMEOUT",
  "ETIMEDOUT",
  "ECONNRESET",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "ECONNREFUSED"
]);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableDbError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const code = "code" in error ? String((error as { code?: string }).code ?? "") : "";
  return RETRYABLE_ERROR_CODES.has(code);
}

export async function withDbRetry<T>(
  operation: () => Promise<T>,
  label: string,
  attempts = 4,
  baseDelayMs = 1200
) {
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === attempts || !isRetryableDbError(error)) {
        break;
      }

      const delay = baseDelayMs * attempt;
      console.warn(`${label} retry ${attempt}/${attempts} failed; retrying in ${delay}ms`, error);
      await sleep(delay);
    }
  }

  console.error(`${label} failed after ${attempts} attempts`, lastError);
  throw lastError instanceof Error ? lastError : new Error(`${label} failed`);
}
