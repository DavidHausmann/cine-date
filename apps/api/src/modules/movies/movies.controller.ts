import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RequestUser } from "../../common/interfaces/request-user.interface";
import { AuthService } from "../auth/auth.service";
import { GetMoviesQueryDto } from "./dto/get-movies-query.dto";
import { MarkWatchedDto } from "./dto/mark-watched.dto";
import { RandomMovieDto } from "./dto/random-movie.dto";
import { MoviesService } from "./movies.service";

@Controller("movies")
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async getMovies(
    @Query() query: GetMoviesQueryDto,
    @Headers("authorization") authorization?: string,
  ) {
    const user = await this.authService.getOptionalUserFromBearerToken(authorization);
    return this.moviesService.getMovies(query, user);
  }

  @Post("random")
  async getRandomMovie(
    @Body() query: RandomMovieDto,
    @Headers("authorization") authorization?: string,
  ) {
    const user = await this.authService.getOptionalUserFromBearerToken(authorization);
    return this.moviesService.getRandomMovie(query, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/watched")
  markWatched(
    @Param("id") id: string,
    @Body() dto: MarkWatchedDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.moviesService.markAsWatched(id, dto, user);
  }
}
