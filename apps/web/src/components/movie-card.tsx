import { Eye, Star } from "lucide-react";
import type { MovieListItem } from "@movie-picker/shared/types";

interface MovieCardProps {
  movie: MovieListItem;
  onSelect?: () => void;
}

export function MovieCard({ movie, onSelect }: MovieCardProps) {
  return (
    <article
      className="relative overflow-hidden rounded-lg border border-white/10 bg-black/30 cursor-pointer"
      onClick={onSelect}
    >
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="h-56 w-full object-cover transition duration-300"
        loading="lazy"
      />

      {movie.userState?.watched ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111111]/80 text-white">
          <Eye size={28} />
          <p className="mt-2 text-sm font-semibold">Assistido</p>
          <div className="mt-1 flex items-center gap-1 text-sm">
            <span>{movie.userState.rating ?? "-"}</span>
            <Star size={14} className="fill-[#F4C430] text-[#F4C430]" />
          </div>
        </div>
      ) : null}

      <div className="space-y-1 p-2 text-center">
        <p className="truncate text-sm font-semibold text-white" title={movie.title}>{movie.title}</p>
        <p className="text-xs text-white/75">{movie.mainCategory}</p>
      </div>
    </article>
  );
}
