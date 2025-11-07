import { defineEventHandler } from "h3";
import { getPlaceById } from "../../../src/services/placeProvider";

export default defineEventHandler(async (event) => {
  const url = event.node.req.url || "";
  const parts = url.split("/");
  const id = parts[parts.length - 1] || "kakao_12345";
  const data = await getPlaceById(String(id));
  return data;
});
