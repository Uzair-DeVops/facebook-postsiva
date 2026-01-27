type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

const memoryCache = new Map<string, CacheEntry<unknown>>();

const now = () => Date.now();

function isExpired(entry: CacheEntry<unknown>): boolean {
  return entry.expiresAt <= now();
}

function storageAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.localStorage;
}

export function getCachedValue<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (entry) {
    if (isExpired(entry)) {
      memoryCache.delete(key);
    } else {
      return entry.data as T;
    }
  }

  if (!storageAvailable()) return null;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEntry<T> | null;
    if (!parsed || isExpired(parsed)) {
      window.localStorage.removeItem(key);
      return null;
    }
    memoryCache.set(key, parsed);
    return parsed.data;
  } catch {
    return null;
  }
}

export function setCachedValue<T>(key: string, data: T, ttlMs: number) {
  const entry: CacheEntry<T> = {
    data,
    expiresAt: now() + ttlMs,
  };
  memoryCache.set(key, entry);

  if (!storageAvailable()) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // Ignore storage write failures
  }
}

export function clearCachedValue(key: string) {
  memoryCache.delete(key);
  if (!storageAvailable()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage removal failures
  }
}

export function clearCachedByPrefix(prefix: string) {
  for (const key of Array.from(memoryCache.keys())) {
    if (key.startsWith(prefix)) {
      memoryCache.delete(key);
    }
  }

  if (!storageAvailable()) return;

  try {
    for (let i = window.localStorage.length - 1; i >= 0; i -= 1) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        window.localStorage.removeItem(key);
      }
    }
  } catch {
    // Ignore storage removal failures
  }
}
