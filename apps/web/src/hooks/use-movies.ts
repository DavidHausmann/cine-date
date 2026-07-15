import { useMutation, useQuery } from "@tanstack/react-query";
import type { MovieFilters } from "@movie-picker/shared/types";
import { fetchMovies, fetchRandomMovie, markMovieWatched } from "@/services/movie-service";

export function useMovies(filters: MovieFilters, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["movies", filters],
    queryFn: () => fetchMovies(filters),
    enabled: options?.enabled ?? true,
  });
}

export function useRandomMovie() {
  return useMutation({
    mutationFn: (filters: MovieFilters) => fetchRandomMovie(filters),
  });
}

export function useMarkWatched() {
  return useMutation({
    mutationFn: ({ movieId, rating }: { movieId: string; rating: number }) =>
      markMovieWatched(movieId, rating),
  });
}
