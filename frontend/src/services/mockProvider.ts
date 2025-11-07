// Lightweight mock provider returning example data matching the OpenAPI example
import type { SearchResponse, Place, Event } from "../types/ai-recommender";

export function mockSearch(query: string, limit = 5): SearchResponse {
  const place: Place = {
    id: "kakao_12345",
    provider: "kakao",
    name: "뚝섬한강공원",
    category: "park",
    address: "서울 광진구",
    coordinates: { lat: 37.537, lon: 127.07 },
    distance_from_query: 800,
    short_description: "한강공원 산책 및 야경 추천",
    photo_url: "",
  };

  const event: Event = {
    id: "evt_001",
    source_label: "Wikipedia",
    source_url: "https://ko.wikipedia.org/wiki/뚝섬",
    title: "뚝섬 개발 역사",
    summary: "뚝섬 지역은 19XX년에 ... (요약)",
    date_or_year: "1980",
    relevance_score: 0.9,
  };

  const rec = {
    place,
    rank: 1,
    reason_text: "한강 변 산책로가 유명하며 분위기가 좋음",
    events: [event],
  };

  return {
    query: {
      raw_input: query,
      normalized_location: {
        place_name: "화양동, 광진구, 서울",
        coordinates: { lat: 37.543, lon: 127.07 },
      },
    },
    recommendations: Array.from({ length: Math.min(limit, 5) }).map((_, i) => ({
      ...rec,
      rank: i + 1,
    })),
  };
}

export function mockGetPlaceById(id: string) {
  const { recommendations } = mockSearch("서울시 광진구 화양동", 1);
  return { place: recommendations[0].place, events: recommendations[0].events };
}
