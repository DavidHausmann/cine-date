import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ExternalMoviesModule } from "../external-movies/external-movies.module";
import { MoviesController } from "./movies.controller";
import { MoviesService } from "./movies.service";

@Module({
  imports: [AuthModule, ExternalMoviesModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
