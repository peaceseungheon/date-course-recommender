import type { Place, Event } from "../types/ai-recommender";
import SimpleCache from "../lib/cache";

const cache = new SimpleCache<Event[]>(60 * 60); // 1 hour TTL

async function fetchWikipedia(place: Place): Promise<Event[]> {
  try {
    const q = encodeURIComponent(place.name || place.address || "");
    const searchUrl = `https://ko.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${q}&srlimit=3&origin=*`;
    const res = await fetch(searchUrl, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const body = await res.json();
    const ids =
      (body.query &&
        body.query.search &&
        body.query.search.map((s: any) => s.pageid)) ||
      [];

    const events = await Promise.all(
      ids.map(async (pid: number) => {
        try {
          const extractUrl = `https://ko.wikipedia.org/w/api.php?action=query&format=json&pageids=${pid}&prop=extracts&exintro=true&explaintext=true&origin=*`;
          const r = await fetch(extractUrl, {
            headers: { Accept: "application/json" },
          });
          if (!r.ok) return null;
          const b = await r.json();
          const page = b.query && b.query.pages && b.query.pages[pid];
          if (!page) return null;
          const summary = (page.extract || "").trim();
          return {
            id: `wiki_${pid}`,
            source_label: "Wikipedia",
            source_url: `https://ko.wikipedia.org/?curid=${pid}`,
            title: page.title || place.name,
            summary: summary,
            date_or_year: undefined,
            relevance_score: 0.8,
          } as Event;
        } catch (e) {
          return null;
        }
      })
    );

    return events.filter(Boolean) as Event[];
  } catch (e) {
    return [];
  }
}

async function fetchNewsAPI(place: Place): Promise<Event[]> {
  try {
    const key =
      (process && (process.env as any)?.NEWSAPI_KEY) ||
      (globalThis as any).NEWSAPI_KEY ||
      "";
    if (!key) return [];
    const q = encodeURIComponent(place.name || place.address || "");
    const url = `https://newsapi.org/v2/everything?q=${q}&pageSize=3&language=ko&apiKey=${key}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return [];
    const body = await res.json();
    const articles = Array.isArray(body.articles) ? body.articles : [];
    return articles.map(
      (a: any, i: number) =>
        ({
          id: `news_${i}_${(a.publishedAt || "").replace(/[^0-9]/g, "")}`,
          source_label: a.source && a.source.name ? a.source.name : "NewsAPI",
          source_url: a.url,
          title: a.title || place.name,
          summary: (a.description || a.content || "").slice(0, 1000),
          date_or_year: a.publishedAt,
          relevance_score: 0.9,
        } as Event)
    );
  } catch (e) {
    return [];
  }
}

export async function getEventsForPlace(place: Place): Promise<Event[]> {
  const key = `events:${place.id}`;
  const cached = cache.get(key);
  if (cached) return cached;

  // Fetch Wikipedia and NewsAPI in parallel
  const [wiki, news] = await Promise.all([
    fetchWikipedia(place),
    fetchNewsAPI(place),
  ]);
  const combined = [...news, ...wiki];

  // simple ranking: keep up to 5 events, prefer news then wiki
  const result = combined.slice(0, 5);
  cache.set(key, result);
  return result;
}

export default { getEventsForPlace };
