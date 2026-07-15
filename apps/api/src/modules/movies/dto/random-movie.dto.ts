import { OmitType } from "@nestjs/mapped-types";
import { GetMoviesQueryDto } from "./get-movies-query.dto";

export class RandomMovieDto extends OmitType(GetMoviesQueryDto, [
  "page",
  "limit",
] as const) {}
