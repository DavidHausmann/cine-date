import type {
  Movie,
  MovieListItem,
  MovieFilters,
  PaginatedResponse,
} from "@movie-picker/shared/types";
import { api } from "./api";

export async function fetchMovies(filters: MovieFilters) {
  const response = await api.get<PaginatedResponse<MovieListItem>>("/movies", {
    params: filters,
  });
  return response.data;
}

export async function fetchRandomMovie(filters: MovieFilters) {
  const { page: _page, limit: _limit, ...randomFilters } = filters;
  const response = await api.post<MovieListItem>("/movies/random", randomFilters);
  return response.data;
}

export async function markMovieWatched(movieId: string, rating: number) {
  const response = await api.post(`/movies/${movieId}/watched`, { rating });
  return response.data;
}
