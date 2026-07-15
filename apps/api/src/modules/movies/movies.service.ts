import { Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { RequestUser } from "../../common/interfaces/request-user.interface";
import { PrismaService } from "../../prisma/prisma.service";
import { ExternalMoviesService } from "../external-movies/external-movies.service";
import { GetMoviesQueryDto } from "./dto/get-movies-query.dto";
import { MarkWatchedDto } from "./dto/mark-watched.dto";
import { RandomMovieDto } from "./dto/random-movie.dto";

@Injectable()
export class MoviesService implements OnModuleInit {
  private readonly logger = new Logger(MoviesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly externalMoviesService: ExternalMoviesService,
  ) {}

  onModuleInit() {
    // Non-blocking backfill: replaces fake platforms with real TMDB data on startup
    void this.backfillPlatforms().catch((err) =>
      this.logger.warn("Platform backfill error", err),
    );
  }

  private async backfillPlatforms() {
    const movies = await this.prisma.movie.findMany({
      where: { platforms: { some: { providerId: null } } },
      select: { id: true, tmdbId: true },
    });
    if (!movies.length) return;

    this.logger.log(`Backfilling providers for ${movies.length} movies...`);
    for (const movie of movies) {
      try {
        await this.prisma.moviePlatform.deleteMany({ where: { movieId: movie.id } });
        const platforms = await this.externalMoviesService.getWatchProviders(movie.tmdbId);
        if (platforms.length) {
          await this.prisma.moviePlatform.createMany({
            data: platforms.map((p) => ({ movieId: movie.id, ...p })),
          });
        }
      } catch {
        // ignore per-movie failures
      }
    }
    this.logger.log("Platform backfill complete");
  }

  private buildSearchWhere(search?: string): Prisma.MovieWhereInput {
    if (!search?.trim()) return {};
    const words = search.trim().split(/\s+/).filter(Boolean);
    if (words.length === 1) {
      return { title: { contains: words[0], mode: "insensitive" } };
    }
    return { AND: words.map((w) => ({ title: { contains: w, mode: "insensitive" } })) };
  }

  private buildUserStateWhere(
    query: { watched?: boolean; rating?: number },
    userId?: string,
  ): Prisma.MovieWhereInput {
    if (!userId) return {};

    const conditions: Prisma.MovieWhereInput[] = [];

    if (query.watched === true) {
      conditions.push({ userMovies: { some: { userId, watched: true } } });
    } else {
      // watched=false or default (undefined): hide already-watched movies
      conditions.push({ NOT: { userMovies: { some: { userId, watched: true } } } });
    }

    if (query.rating !== undefined) {
      conditions.push({ userMovies: { some: { userId, rating: query.rating } } });
    }

    return conditions.length === 1 ? conditions[0] : { AND: conditions };
  }

  private normalizeUserState(
    movies: Array<Record<string, unknown> & { userMovies?: unknown[] }>,
  ) {
    return movies.map((movie) => {
      const [userMovie] = movie.userMovies ?? [];
      const { userMovies, ...rest } = movie;
      return {
        ...rest,
        userState: userMovie
          ? {
              watched: (userMovie as { watched: boolean }).watched,
              rating: (userMovie as { rating?: number | null }).rating,
              watchedAt: (userMovie as { watchedAt?: Date | null }).watchedAt,
            }
          : undefined,
      };
    });
  }

  async getMovies(query: GetMoviesQueryDto, user?: RequestUser) {
    try {
      await this.ensureMoviesSeed(query.search);
    } catch {
      // seed failures don't block serving from local DB
    }

    const where: Prisma.MovieWhereInput = {
      ...this.buildSearchWhere(query.search),
      ...(query.category ? { mainCategory: query.category } : {}),
      ...this.buildUserStateWhere(query, user?.id),
    };

    const skip = (query.page - 1) * query.limit;

    const [movies, total] = await this.prisma.$transaction([
      this.prisma.movie.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: { createdAt: "desc" },
        include: {
          platforms: true,
          ...(user ? { userMovies: { where: { userId: user.id }, take: 1 } } : {}),
        },
      }),
      this.prisma.movie.count({ where }),
    ]);

    return {
      data: this.normalizeUserState(movies as Array<Record<string, unknown> & { userMovies?: unknown[] }>),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit)),
      },
    };
  }

  async getRandomMovie(query: RandomMovieDto, user?: RequestUser) {
    try {
      await this.ensureMoviesSeed(query.search);
    } catch {
      // seed failures don't block serving from local DB
    }

    const where: Prisma.MovieWhereInput = {
      ...this.buildSearchWhere(query.search),
      ...(query.category ? { mainCategory: query.category } : {}),
      ...this.buildUserStateWhere(query, user?.id),
    };

    const pool = await this.prisma.movie.findMany({
      where,
      include: {
        platforms: true,
        ...(user ? { userMovies: { where: { userId: user.id }, take: 1 } } : {}),
      },
    });

    if (!pool.length) {
      throw new NotFoundException("No movie found for selected filters");
    }

    const normalized = this.normalizeUserState(pool as Array<Record<string, unknown> & { userMovies?: unknown[] }>);
    return normalized[Math.floor(Math.random() * normalized.length)];
  }

  async markAsWatched(movieId: string, dto: MarkWatchedDto, user: RequestUser) {
    const movie = await this.prisma.movie.findUnique({ where: { id: movieId } });
    if (!movie) {
      throw new NotFoundException("Movie not found");
    }

    return this.prisma.userMovie.upsert({
      where: {
        userId_movieId: {
          userId: user.id,
          movieId,
        },
      },
      update: {
        watched: true,
        rating: dto.rating,
        watchedAt: new Date(),
      },
      create: {
        userId: user.id,
        movieId,
        watched: true,
        rating: dto.rating,
        watchedAt: new Date(),
      },
    });
  }

  private async ensureMoviesSeed(search?: string) {
    if (search) {
      // avoid re-fetching TMDB if we already have local results for this term
      const existing = await this.prisma.movie.count({
        where: { title: { contains: search, mode: "insensitive" } },
      });
      if (existing > 0) return;
    } else {
      const hasAnyMovie = await this.prisma.movie.count();
      if (hasAnyMovie) return;
    }

    const externalMovies = await this.externalMoviesService.searchMovies(search);
    if (!externalMovies.length) {
      return;
    }

    for (const externalMovie of externalMovies.slice(0, 30)) {
      const details = await this.externalMoviesService.getMovieDetails(externalMovie.id);
      const normalized = this.externalMoviesService.normalizeMovie(
        externalMovie,
        details?.runtime,
      );

      const movie = await this.prisma.movie.upsert({
        where: { tmdbId: normalized.tmdbId },
        update: {
          title: normalized.title,
          description: normalized.description,
          posterUrl: normalized.posterUrl,
          mainCategory: normalized.mainCategory,
          releaseDate: normalized.releaseDate,
          durationMinutes: normalized.durationMinutes,
          isDubbedBr: normalized.isDubbedBr,
        },
        create: {
          tmdbId: normalized.tmdbId,
          title: normalized.title,
          description: normalized.description,
          posterUrl: normalized.posterUrl,
          mainCategory: normalized.mainCategory,
          releaseDate: normalized.releaseDate,
          durationMinutes: normalized.durationMinutes,
          isDubbedBr: normalized.isDubbedBr,
        },
      });

      const hasPlatforms = await this.prisma.moviePlatform.count({
        where: { movieId: movie.id, providerId: { not: null } },
      });

      if (!hasPlatforms) {
        await this.prisma.moviePlatform.deleteMany({ where: { movieId: movie.id } });
        const platforms = await this.externalMoviesService.getWatchProviders(externalMovie.id);
        if (platforms.length) {
          await this.prisma.moviePlatform.createMany({
            data: platforms.map((p) => ({ movieId: movie.id, ...p })),
          });
        }
      }
    }
  }
}
