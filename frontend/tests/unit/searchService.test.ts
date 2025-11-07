import { describe, it, expect } from "vitest";
import { searchByQuery } from "../../src/services/searchService";

describe("searchByQuery (unit)", () => {
  it("returns recommendations for a valid query", async () => {
    const res = await searchByQuery("서울시 광진구 화양동", 3);
    expect(res).toHaveProperty("recommendations");
    expect(Array.isArray(res.recommendations)).toBe(true);
    expect(res.recommendations.length).toBeGreaterThanOrEqual(1);
  });
});
