import type { User } from "@movie-picker/shared/types";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  user?: User;
  onLogin: () => void;
  onLogout: () => void;
}

export function AppHeader({ user, onLogin, onLogout }: AppHeaderProps) {
  return (
    <header className="mb-8 flex items-center justify-between gap-4">
      <div className="flex-1" />
      <div className="text-center">
        <h1 className="text-5xl leading-none text-white">CineDate</h1>
        <p className="mt-2 text-sm text-white/80">Decisao facil, para os casais indecisos.</p>
      </div>
      <div className="flex flex-1 justify-end">
        {user ? (
          <button
            type="button"
            onClick={onLogout}
            className="group flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-3 py-2"
          >
            <img
              src={user.avatarUrl ?? "https://placehold.co/64x64"}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover"
            />
            <span className="hidden text-sm text-white/80 group-hover:text-white sm:block">
              {user.name}
            </span>
          </button>
        ) : (
          <Button onClick={onLogin} className="min-w-28">
            Login
          </Button>
        )}
      </div>
    </header>
  );
}
