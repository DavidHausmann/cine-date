import type { MovieFilters, MovieListItem } from "@movie-picker/shared/types";
import { useGoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { FilterBar } from "@/components/filter-bar";
import { MovieCard } from "@/components/movie-card";
import { PaginationBar } from "@/components/pagination-bar";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { useMarkWatched, useMovies, useRandomMovie } from "@/hooks/use-movies";
import { useSession } from "@/hooks/use-session";
import { MovieRecommendationModal } from "@/modals/movie-recommendation-modal";
import { loginWithGoogle } from "@/services/auth-service";

const DEFAULT_FILTERS: MovieFilters = {
  page: 1,
  limit: 14,
};

export function HomePage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<MovieFilters>(DEFAULT_FILTERS);
  const [recommendedMovie, setRecommendedMovie] = useState<MovieListItem | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const { session, isAuthenticated, updateSession, logout } = useSession();

  const rawSearch = filters.search ?? "";
  const debouncedSearch = useDebounce(rawSearch, 500);

  const queryFilters: MovieFilters = {
    ...filters,
    search: debouncedSearch || undefined,
  };

  const moviesQuery = useMovies(queryFilters, {
    enabled: rawSearch.length === 0 || rawSearch.length >= 2,
  });
  const randomMutation = useRandomMovie();
  const watchedMutation = useMarkWatched();

  const totalPages = moviesQuery.data?.meta.totalPages ?? 1;

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      const response = await loginWithGoogle(access_token);
      updateSession(response);
      await queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
    flow: "implicit",
  });

  const handleGoogleLogin = () => googleLogin();

  const drawMovie = async () => {
    const movie = await randomMutation.mutateAsync(queryFilters);
    setRecommendedMovie(movie);
    setOpenModal(true);
  };

  const handleRecommendAnother = async () => {
    await drawMovie();
  };

  const handleWatched = async (rating: number) => {
    if (!recommendedMovie) {
      return;
    }

    if (!isAuthenticated) {
      await handleGoogleLogin();
      return;
    }

    await watchedMutation.mutateAsync({ movieId: recommendedMovie.id, rating });
    await queryClient.invalidateQueries({ queryKey: ["movies"] });
    await drawMovie();
  };

  return (
    <section className="animate-reveal">
      <AppHeader
        user={session?.user}
        onLogin={() => void handleGoogleLogin()}
        onLogout={() => {
          logout();
          void queryClient.invalidateQueries({ queryKey: ["movies"] });
        }}
      />

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0B0E16]/90">
        <FilterBar filters={filters} onChange={setFilters} />

        <div className="p-5 md:p-8">
          {moviesQuery.isLoading ? (
            <div className="grid place-items-center py-20 text-white/70">Carregando filmes...</div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
              {(moviesQuery.data?.data ?? []).map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onSelect={() => {
                    setRecommendedMovie(movie);
                    setOpenModal(true);
                  }}
                />
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
            <PaginationBar
              page={filters.page ?? 1}
              totalPages={totalPages}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            />
            <Button onClick={() => void drawMovie()} disabled={randomMutation.isPending}>
              Escolha para nos &lt;3
            </Button>
          </div>
        </div>
      </div>

      <MovieRecommendationModal
        movie={recommendedMovie}
        open={openModal}
        loading={randomMutation.isPending || watchedMutation.isPending}
        onClose={() => setOpenModal(false)}
        onRecommendAnother={() => void handleRecommendAnother()}
        onConfirmWatched={(rating) => void handleWatched(rating)}
      />
    </section>
  );
}
