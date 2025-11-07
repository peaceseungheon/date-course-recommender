import { describe, it, expect, beforeEach, vi } from "vitest";
import * as kakao from "../../src/services/kakaoProvider";

describe("kakaoProvider", () => {
  const sampleDoc = {
    id: "12345",
    place_name: "테스트 카페",
    category_name: "카페",
    category_group_name: "CE7",
    road_address_name: "서울시 광진구 테스트로 1",
    address_name: "서울 광진구",
    x: "127.070",
    y: "37.537",
    distance: "100",
  };

  beforeEach(() => {
    vi.resetAllMocks();
    process.env.KAKAO_API_KEY = "test_key";
  });

  it("maps kakao search response into SearchResponse", async () => {
    const fakeRes = { documents: [sampleDoc, { ...sampleDoc, id: "222" }] };
    (global as any).fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(fakeRes) } as any)
    );

    const res = await kakao.kakaoSearch("테스트", 2);
    expect(res).toBeDefined();
    expect(res.recommendations.length).toBe(2);
    const p = res.recommendations[0].place;
    expect(p.id).toBe(`kakao_${sampleDoc.id}`);
    expect(p.name).toBe(sampleDoc.place_name);
    expect(p.coordinates.lat).toBeCloseTo(37.537, 3);
  });

  it("getPlaceById finds matching doc", async () => {
    const fakeRes = { documents: [sampleDoc] };
    (global as any).fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(fakeRes) } as any)
    );

    const detail = await kakao.kakaoGetPlaceById(`kakao_${sampleDoc.id}`);
    expect(detail).not.toBeNull();
    expect(detail?.place.id).toBe(`kakao_${sampleDoc.id}`);
  });
});
