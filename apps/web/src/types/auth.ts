import type { User } from "@movie-picker/shared/types";

export interface SessionData {
  accessToken: string;
  user: User;
}
