import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";

interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path?: string | null;
  genre_ids?: number[];
  release_date?: string;
}

interface TmdbDetails {
  id: number;
  runtime?: number;
  production_countries?: Array<{ iso_3166_1: string }>;
}

interface TmdbProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

interface TmdbWatchProvidersResponse {
  results?: {
    BR?: {
      link?: string;
      flatrate?: TmdbProvider[];
      rent?: TmdbProvider[];
      buy?: TmdbProvider[];
    };
  };
}

@Injectable()
export class ExternalMoviesService {
  private readonly logger = new Logger(ExternalMoviesService.name);
  private readonly client: AxiosInstance;
  private readonly imageBaseUrl: string;

  private readonly categoryMap: Record<number, string> = {
    28: "Acao",
    35: "Comedia",
    18: "Drama",
    99: "Documentarios",
    10751: "Fantasia",
    878: "Ficcao cientifica",
    80: "Policial",
    10749: "Romance",
    53: "Suspense",
    27: "Terror",
    16: "Anime",
  };

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>("TMDB_API_KEY", "");
    const baseURL = this.configService.get<string>(
      "TMDB_BASE_URL",
      "https://api.themoviedb.org/3",
    );
    this.imageBaseUrl = this.configService.get<string>(
      "TMDB_IMAGE_BASE_URL",
      "https://image.tmdb.org/t/p/w500",
    );

    this.client = axios.create({
      baseURL,
      timeout: 7000,
      params: {
        api_key: apiKey,
        language: "pt-BR",
      },
    });
  }

  async searchMovies(search?: string) {
    if (!this.configService.get<string>("TMDB_API_KEY")) {
      return [];
    }

    try {
      const path = search ? "/search/movie" : "/discover/movie";
      const response = await this.client.get<{ results: TmdbMovie[] }>(path, {
        params: search
          ? { query: search, include_adult: false }
          : { sort_by: "popularity.desc", include_adult: false },
      });

      return response.data.results;
    } catch (error) {
      this.logger.warn("TMDB request failed", error as Error);
      return [];
    }
  }

  async getMovieDetails(tmdbId: number) {
    if (!this.configService.get<string>("TMDB_API_KEY")) {
      return undefined;
    }

    try {
      const response = await this.client.get<TmdbDetails>(`/movie/${tmdbId}`);
      return response.data;
    } catch {
      return undefined;
    }
  }

  normalizeCategory(genreIds?: number[]): string {
    if (!genreIds?.length) {
      return "Outros";
    }

    const firstKnown = genreIds.find((id) => this.categoryMap[id]);
    return firstKnown ? this.categoryMap[firstKnown] : "Outros";
  }

  normalizeMovie(movie: TmdbMovie, runtime?: number) {
    return {
      tmdbId: movie.id,
      title: movie.title,
      description: movie.overview || "Sem descricao disponivel.",
      posterUrl: movie.poster_path
        ? `${this.imageBaseUrl}${movie.poster_path}`
        : "https://placehold.co/500x750/111111/ffffff?text=Sem+Poster",
      mainCategory: this.normalizeCategory(movie.genre_ids),
      releaseDate: (() => {
        if (!movie.release_date) return null;
        const d = new Date(movie.release_date);
        return isNaN(d.getTime()) ? null : d;
      })(),
      durationMinutes: runtime ?? null,
      isDubbedBr: false,
    };
  }

  async getWatchProviders(tmdbId: number): Promise<
    Array<{
      providerId: number;
      platformName: string;
      logoUrl: string;
      type: string;
      platformUrl: string | null;
    }>
  > {
    if (!this.configService.get<string>("TMDB_API_KEY")) {
      return [];
    }

    try {
      const response = await this.client.get<TmdbWatchProvidersResponse>(
        `/movie/${tmdbId}/watch/providers`,
      );
      const br = response.data.results?.BR;
      if (!br) return [];

      const link = br.link ?? null;
      const mapProviders = (providers: TmdbProvider[] = [], type: string) =>
        providers.map((p) => ({
          providerId: p.provider_id,
          platformName: p.provider_name,
          logoUrl: `https://image.tmdb.org/t/p/original${p.logo_path}`,
          type,
          platformUrl: link,
        }));

      return [
        ...mapProviders(br.flatrate, "flatrate"),
        ...mapProviders(br.rent, "rent"),
        ...mapProviders(br.buy, "buy"),
      ];
    } catch {
      return [];
    }
  }
}
