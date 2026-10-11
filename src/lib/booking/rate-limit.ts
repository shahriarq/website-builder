/**
 * Limitatore di frequenza a finestra scorrevole, in memoria.
 *
 * Limite noto: su piattaforme serverless ogni istanza ha la propria memoria,
 * quindi il limite vale per istanza. E' una protezione di base contro invii
 * ripetuti; per un limite globale usare un archivio condiviso (es. Redis).
 */

export interface RateLimitResult {
  ok: boolean;
  retryAfterSeconds: number;
}

export function createRateLimiter({ limit, windowMs, maxKeys = 5000 }: { limit: number; windowMs: number; maxKeys?: number }) {
  const hits = new Map<string, number[]>();

  return function check(key: string, now: number = Date.now()): RateLimitResult {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      const retryAfterSeconds = Math.max(1, Math.ceil((windowMs - (now - recent[0])) / 1000));
      return { ok: false, retryAfterSeconds };
    }
    recent.push(now);
    hits.delete(key);
    hits.set(key, recent);
    if (hits.size > maxKeys) {
      const oldest = hits.keys().next().value;
      if (oldest !== undefined) hits.delete(oldest);
    }
    return { ok: true, retryAfterSeconds: 0 };
  };
}
