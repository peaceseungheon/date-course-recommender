export type Coordinates = { lat: number; lon: number };

export type Location = {
  place_name?: string;
  coordinates?: Coordinates;
  bounding_box?: number[];
};

export type QueryInfo = {
  raw_input: string;
  normalized_location?: Location;
};

export type Place = {
  id: string;
  provider?: string;
  name: string;
  category?: string;
  address?: string;
  coordinates: Coordinates;
  distance_from_query?: number;
  short_description?: string;
  photo_url?: string;
};

export type Event = {
  id?: string;
  source_label?: string;
  source_url?: string;
  title: string;
  summary: string;
  date_or_year?: string;
  relevance_score?: number;
};

export type Recommendation = {
  place: Place;
  rank?: number;
  reason_text?: string;
  events?: Event[];
};

export type SearchResponse = {
  query: QueryInfo;
  recommendations: Recommendation[];
};

export type PlaceDetailResponse = {
  place: Place;
  events: Event[];
};
