export type MovieCategory =
  | "Acao"
  | "Comedia"
  | "Drama"
  | "Documentarios"
  | "Esportes"
  | "Fantasia"
  | "Ficcao cientifica"
  | "Policial"
  | "Romance"
  | "Suspense"
  | "Terror"
  | "Anime"
  | "Outros";

export interface MoviePlatform {
  id: string;
  providerId?: number | null;
  platformName: string;
  platformUrl?: string | null;
  logoUrl?: string | null;
  type: "flatrate" | "rent" | "buy" | "free";
}

export interface Movie {
  id: string;
  tmdbId: number;
  title: string;
  description: string;
  posterUrl: string;
  mainCategory: MovieCategory;
  releaseDate?: string | null;
  durationMinutes?: number | null;
  isDubbedBr: boolean;
  platforms: MoviePlatform[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export interface UserMovieState {
  watched: boolean;
  rating?: number | null;
  watchedAt?: string | null;
}

export interface MovieListItem extends Movie {
  userState?: UserMovieState;
}

export interface MovieFilters {
  search?: string;
  category?: MovieCategory;
  watched?: boolean;
  rating?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RandomMovieRequest {
  search?: string;
  category?: MovieCategory;
  watched?: boolean;
  rating?: number;
}

export interface GoogleAuthRequest {
  token: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
