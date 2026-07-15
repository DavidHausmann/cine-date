import { useEffect, useState } from "react";
import { getSession, setSession as saveSession, clearSession } from "@/services/storage";
import { SessionData } from "@/types/auth";

export function useSession() {
  const [session, setSession] = useState<SessionData | null>(null);

  useEffect(() => {
    setSession(getSession());
  }, []);

  const updateSession = (value: SessionData) => {
    saveSession(value);
    setSession(value);
  };

  const logout = () => {
    clearSession();
    setSession(null);
  };

  return {
    session,
    isAuthenticated: Boolean(session?.accessToken),
    updateSession,
    logout,
  };
}
