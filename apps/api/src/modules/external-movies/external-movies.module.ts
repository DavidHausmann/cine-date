import { Module } from "@nestjs/common";
import { ExternalMoviesService } from "./external-movies.service";

@Module({
  providers: [ExternalMoviesService],
  exports: [ExternalMoviesService],
})
export class ExternalMoviesModule {}
