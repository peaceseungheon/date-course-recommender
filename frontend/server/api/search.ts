import { defineEventHandler, getQuery } from "h3";
import { searchByQuery } from "../..//src/services/searchService";

export default defineEventHandler(async (event) => {
  const q = String(getQuery(event).q || "서울시 광진구 화양동");
  const limit = Number(getQuery(event).limit || 5);
  const result = await searchByQuery(q, limit);
  return result;
});
