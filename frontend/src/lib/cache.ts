type CacheEntry<T> = { value: T; expiresAt: number };

export class SimpleCache<T> {
  private map = new Map<string, CacheEntry<T>>();
  private ttl: number;

  constructor(ttlSeconds = 60) {
    this.ttl = ttlSeconds * 1000;
  }

  get(key: string): T | undefined {
    const entry = this.map.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.map.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: T) {
    const expiresAt = Date.now() + this.ttl;
    this.map.set(key, { value, expiresAt });
  }

  delete(key: string) {
    this.map.delete(key);
  }
}

export default SimpleCache;
