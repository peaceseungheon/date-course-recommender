// Kakao Local API provider
// Uses the server-side environment variable KAKAO_API_KEY for authentication.
import type {
  SearchResponse,
  Place,
  PlaceDetailResponse,
} from "../types/ai-recommender";

const KAKAO_BASE = "https://dapi.kakao.com";

function kakaoAuthHeader(): Record<string, string> {
  const key = (process && (process.env as any)?.KAKAO_API_KEY) || "";
  const headers: Record<string, string> = { Accept: "application/json" };
  if (key) headers.Authorization = `KakaoAK ${key}`;
  return headers;
}

function mapDocToPlace(doc: any): Place {
  return {
    id: `kakao_${doc.id}`,
    provider: "kakao",
    name: doc.place_name,
    category: doc.category_name || doc.category_group_name,
    address: doc.road_address_name || doc.address_name || "",
    coordinates: {
      lat: parseFloat(doc.y || "0"),
      lon: parseFloat(doc.x || "0"),
    },
    distance_from_query: doc.distance ? Number(doc.distance) : undefined,
    short_description: doc.category_group_name || undefined,
    photo_url: "",
  };
}

export async function kakaoSearch(
  query: string,
  limit = 5
): Promise<SearchResponse> {
  const params = new URLSearchParams({ query, size: String(limit) });
  const url = `${KAKAO_BASE}/v2/local/search/keyword.json?${params.toString()}`;
  const headers = kakaoAuthHeader();

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Kakao API error: ${res.status} ${res.statusText}`);
  }
  const body = await res.json();
  const docs = Array.isArray(body.documents) ? body.documents : [];

  const recommendations = docs.map((d: any, i: number) => ({
    place: mapDocToPlace(d),
    rank: i + 1,
    reason_text: "",
    events: [],
  }));

  const normalized_location = docs[0]
    ? {
        place_name: docs[0].address_name || docs[0].place_name,
        coordinates: {
          lat: parseFloat(docs[0].y || "0"),
          lon: parseFloat(docs[0].x || "0"),
        },
      }
    : { place_name: query, coordinates: undefined };

  return {
    query: { raw_input: query, normalized_location },
    recommendations,
  };
}

export async function kakaoGetPlaceById(
  id: string
): Promise<PlaceDetailResponse | null> {
  // Kakao Local API doesn't provide a direct "get by id" endpoint for place ids returned in search.
  // Strategy: strip known prefix if present, then perform a keyword search and find matching doc id.
  const rawId = id.startsWith("kakao_") ? id.replace("kakao_", "") : id;
  const params = new URLSearchParams({ query: rawId, size: "5" });
  const url = `${KAKAO_BASE}/v2/local/search/keyword.json?${params.toString()}`;
  const headers = kakaoAuthHeader();

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Kakao API error: ${res.status} ${res.statusText}`);
  }
  const body = await res.json();
  const docs = Array.isArray(body.documents) ? body.documents : [];

  const found =
    docs.find((d: any) => String(d.id) === String(rawId)) || docs[0];
  if (!found) return null;

  return { place: mapDocToPlace(found), events: [] };
}
