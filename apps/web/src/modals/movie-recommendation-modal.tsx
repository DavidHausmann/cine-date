import type { MovieListItem } from "@movie-picker/shared/types";
import { CalendarDays, Clock3, PlayCircle, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { RATINGS } from "@/constants/movie";

interface MovieRecommendationModalProps {
  movie: MovieListItem | null;
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onRecommendAnother: () => void;
  onConfirmWatched: (rating: number) => void;
}

export function MovieRecommendationModal({
  movie,
  open,
  loading,
  onClose,
  onRecommendAnother,
  onConfirmWatched,
}: MovieRecommendationModalProps) {
  const [rating, setRating] = useState<string>("");

  useEffect(() => {
    if (!open) {
      setRating("");
    } else if (movie?.userState?.rating) {
      setRating(String(movie.userState.rating));
    }
  }, [open, movie?.userState?.rating]);

  if (!open || !movie) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 backdrop-blur-sm">
      <div className="relative my-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#0D0F16] p-6 md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20"
        >
          <X size={24} />
        </button>

        <div className="grid gap-6 md:grid-cols-[320px_1fr]">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="max-h-[420px] w-full rounded-2xl object-cover"
          />

          <div>
            <h2 className="text-5xl text-white">{movie.title}</h2>
            <div className="mt-4 flex flex-wrap gap-6 text-white/80">
              <span className="flex items-center gap-2">
                <CalendarDays size={18} />
                {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : "-"}
              </span>
              <span className="flex items-center gap-2">
                <Clock3 size={18} />
                {movie.durationMinutes ? `${movie.durationMinutes}min` : "--"}
              </span>
            </div>

            <p className="mt-6 max-w-3xl text-xl leading-relaxed text-white/70">{movie.description}</p>

            <p className="mt-6 text-sm font-semibold tracking-wide text-white/60">DISPONIVEL EM</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {movie.platforms.map((platform) => (
                <a
                  key={platform.id}
                  href={platform.platformUrl ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#7DA8B5] px-4 py-2 font-medium text-[#0D111A]"
                >
                  {platform.logoUrl ? (
                    <img
                      src={platform.logoUrl}
                      alt={platform.platformName}
                      className="h-5 w-5 rounded object-cover"
                    />
                  ) : (
                    <PlayCircle size={16} />
                  )}
                  {platform.platformName}
                </a>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-semibold text-white/60">NOTA</p>
                <div className="flex items-center gap-2">
                  <Select
                    value={rating}
                    onChange={(event) => setRating(event.target.value)}
                    className="w-36"
                  >
                    <option value="">Aguardando</option>
                    {RATINGS.map((value) => (
                      <option key={value} value={String(value)}>
                        {value}
                      </option>
                    ))}
                  </Select>
                  <Star size={18} className="fill-[#F4C430] text-[#F4C430]" />
                  <span>Estrelas</span>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-white/60">DUBLADO?</p>
                <Select value={movie.isDubbedBr ? "Sim" : "Nao"} disabled className="w-24">
                  <option>{movie.isDubbedBr ? "Sim" : "Nao"}</option>
                </Select>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Button onClick={onRecommendAnother} disabled={loading}>
                Recomendar Outro
              </Button>
              <Button
                onClick={() => onConfirmWatched(Number(rating))}
                disabled={!rating || loading}
              >
                Ja Assistimos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
