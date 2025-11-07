import type { Place } from "../types/ai-recommender";

const KEY = "dcr:shortlist";

function read(): Place[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Place[];
  } catch (e) {
    return [];
  }
}

function write(items: Place[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch (e) {
    // ignore
  }
}

export function list(): Place[] {
  return read();
}

export function add(place: Place) {
  const items = read();
  if (items.find((p) => p.id === place.id)) return;
  items.push(place);
  write(items);
}

export function remove(id: string) {
  const items = read().filter((p) => p.id !== id);
  write(items);
}

export function isInShortlist(id: string) {
  return read().some((p) => p.id === id);
}

export function clear() {
  write([]);
}

export default { list, add, remove, isInShortlist, clear };
