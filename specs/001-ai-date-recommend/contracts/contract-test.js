// Simple contract test: call the running dev server and validate /api/search returns expected shape
const BASE = process.env.BASE_URL || "http://localhost:3000";

async function run() {
  const res = await fetch(`${BASE}/api/search?q=서울시 광진구 화양동&limit=3`);
  if (!res.ok) {
    console.error("Request failed", res.status);
    process.exit(2);
  }
  const body = await res.json();
  if (!body.recommendations || !Array.isArray(body.recommendations)) {
    console.error("Invalid contract: recommendations missing");
    process.exit(2);
  }
  if (body.recommendations.length < 1) {
    console.error("Invalid contract: expected >=1 recommendation");
    process.exit(2);
  }
  console.log(
    "Contract check passed: recommendations count =",
    body.recommendations.length
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(2);
});
