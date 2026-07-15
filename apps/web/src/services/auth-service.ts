import type { AuthResponse } from "@movie-picker/shared/types";
import { api } from "./api";

export async function loginWithGoogle(token: string) {
  const response = await api.post<AuthResponse>("/auth/google", { token });
  return response.data;
}
