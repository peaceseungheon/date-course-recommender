import { searchByQuery as providerSearch } from "./placeProvider";
import eventProvider from "./eventProvider";
import SimpleCache from "../lib/cache";

const cache = new SimpleCache<any>(30); // 30s TTL for dev

export async function searchByQuery(q: string, limit = 5) {
  const key = `search:${q}:${limit}`;
  const cached = cache.get(key);
  if (cached) return cached;

  // Delegate to provider abstraction which will use Kakao if available or mock otherwise.
  const result = await providerSearch(q, limit);

  // Enrich each recommendation with events in parallel
  if (result && Array.isArray(result.recommendations)) {
    await Promise.all(
      result.recommendations.map(async (rec: any) => {
        try {
          const events = await eventProvider.getEventsForPlace(rec.place);
          rec.events = events || [];
        } catch (e) {
          rec.events = rec.events || [];
        }
      })
    );
  }

  cache.set(key, result);
  return result;
}
