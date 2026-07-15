import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "./modules/auth/auth.module";
import { ExternalMoviesModule } from "./modules/external-movies/external-movies.module";
import { MovieUserModule } from "./modules/movie-user/movie-user.module";
import { MoviesModule } from "./modules/movies/movies.module";
import { UsersModule } from "./modules/users/users.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 60,
      },
    ]),
    PrismaModule,
    UsersModule,
    AuthModule,
    ExternalMoviesModule,
    MoviesModule,
    MovieUserModule,
  ],
})
export class AppModule {}
