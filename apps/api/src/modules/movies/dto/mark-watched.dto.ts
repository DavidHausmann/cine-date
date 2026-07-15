import { Transform } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

export class MarkWatchedDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;
}
