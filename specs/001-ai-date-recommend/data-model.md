# data-model.md

Entities derived from the feature spec and research decisions

## User Query

- raw_input: string
- normalized_location: { place_name: string, coordinates: { lat: number, lon: number }, bounding_box?: [number,number,number,number] }
- confidence_score: number (0-1)
- timestamp: ISO8601

Validation rules:

- raw_input must be non-empty
- confidence_score must be present (0-1), use geocoding provider score when available

## Place

- id: string (provider-specific id)
- provider: string (e.g., kakao)
- name: string
- category: string (food, cafe, park, museum, attraction, etc.)
- address: string
- coordinates: { lat: number, lon: number }
- distance_from_query: number (meters)
- short_description: string (one-line rationale)
- photo_url?: string

Validation rules:

- coordinates required for distance calculations
- category normalized to a finite set used by the UI

## Recommendation

- id: string
- place_id: string
- rank: integer
- reason_text: string
- generated_at: ISO8601

## Event

- id: string
- source_label: string (e.g., "Wikipedia", "NewsAPI", "Curated")
- source_url?: string
- title: string
- summary: string (one-line or short paragraph)
- date_or_year?: string
- relevance_score?: number (0-1)

Validation rules:

- Either source_url or source_label must be present (MVP allows missing source_url per policy)
- summary must be <= 300 chars for UI display

## Relationships

- Recommendation -> Place (place_id)
- Place -> Event (one-to-many)
- Query -> Recommendation (one-to-many)

## Notes for implementation

- Use provider-specific IDs and include provider label to simplify merging/refreshing
- Keep event objects small (summary + source) to keep responses lightweight
