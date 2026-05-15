export interface Movie {
  id: string;
  title: string;
  overview?: string;
  releaseDate?: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
}

export type MovieCategory =
  | "action"
  | "comedy"
  | "drama"
  | "horror"
  | "romance"
  | "sci-fi"
  | "thriller";

export interface MovieFilters {
  categories?: MovieCategory[];
  releaseYear?: number;
  minimumRating?: number;
  language?: string;
}
