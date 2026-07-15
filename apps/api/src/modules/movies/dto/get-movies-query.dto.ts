import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

const CATEGORIES = [
  "Acao",
  "Comedia",
  "Drama",
  "Documentarios",
  "Esportes",
  "Fantasia",
  "Ficcao cientifica",
  "Policial",
  "Romance",
  "Suspense",
  "Terror",
  "Anime",
  "Outros",
] as const;

export class GetMoviesQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  @IsIn(CATEGORIES)
  category?: (typeof CATEGORIES)[number];

  @IsOptional()
  @Transform(({ value }) => (typeof value === "boolean" ? value : value === "true"))
  @IsBoolean()
  watched?: boolean;

  @IsOptional()
  @Transform(({ value }) => (typeof value === "number" ? value : Number(value)))
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(48)
  limit = 14;
}
