import { describe, it, expect, beforeEach } from "vitest";
import * as Shortlist from "../../src/services/shortlistService";

describe("shortlistService", () => {
  beforeEach(() => {
    // provide a minimal localStorage mock in the node test environment
    (global as any).localStorage = {
      _store: {} as Record<string, string>,
      getItem(key: string) {
        return this._store[key] ?? null;
      },
      setItem(key: string, value: string) {
        this._store[key] = String(value);
      },
      removeItem(key: string) {
        delete this._store[key];
      },
      clear() {
        this._store = {};
      },
    } as any;
    localStorage.clear();
  });

  it("adds and lists items", () => {
    const p = {
      id: "p1",
      name: "Place 1",
      coordinates: { lat: 1, lon: 1 },
    } as any;
    Shortlist.add(p);
    const items = Shortlist.list();
    expect(items.length).toBe(1);
    expect(Shortlist.isInShortlist("p1")).toBe(true);
  });

  it("removes items", () => {
    const p = {
      id: "p2",
      name: "Place 2",
      coordinates: { lat: 1, lon: 1 },
    } as any;
    Shortlist.add(p);
    Shortlist.remove("p2");
    expect(Shortlist.list().length).toBe(0);
  });
});
