import { IsString, MinLength } from "class-validator";

export class GoogleAuthDto {
  @IsString()
  @MinLength(10)
  token!: string;
}
