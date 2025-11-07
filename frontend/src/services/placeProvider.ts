// Provider abstraction that delegates to concrete providers (mock or real)
import { mockSearch, mockGetPlaceById } from "./mockProvider";
import { kakaoSearch, kakaoGetPlaceById } from "./kakaoProvider";
import type {
  SearchResponse,
  PlaceDetailResponse,
} from "../types/ai-recommender";

function hasKakaoKey(): boolean {
  // Prefer server-side env var. When running in Nuxt server, process.env will be available.
  try {
    return Boolean(process.env.KAKAO_API_KEY);
  } catch (e) {
    return false;
  }
}

export async function geocode(q: string) {
  // For now, use Kakao if available, else mock
  if (hasKakaoKey()) {
    const res = await kakaoSearch(q, 1);
    return res.query.normalized_location;
  }
  const res = await mockSearch(q, 1);
  return res.query.normalized_location;
}

export async function searchByQuery(
  q: string,
  limit = 5
): Promise<SearchResponse> {
  if (hasKakaoKey()) {
    return kakaoSearch(q, limit);
  }
  return mockSearch(q, limit);
}

export async function searchNearby(
  coords: { lat: number; lon: number },
  limit = 5
): Promise<SearchResponse> {
  // Simple mapping: prefer Kakao with a lat/lon query
  const q = `${coords.lat},${coords.lon}`;
  return searchByQuery(q, limit);
}

export async function getPlaceById(
  id: string
): Promise<PlaceDetailResponse | null> {
  if (hasKakaoKey()) {
    return kakaoGetPlaceById(id);
  }
  const res = await mockGetPlaceById(id);
  // normalize to guaranteed shape
  return { place: res.place, events: res.events || [] } as PlaceDetailResponse;
}
