import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationBarProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationBar({ page, totalPages, onPageChange }: PaginationBarProps) {
  return (
    <div className="flex items-center gap-3 text-white/85">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="disabled:opacity-45"
      >
        <ChevronLeft />
      </button>
      <span className="text-sm">{page}</span>
      <span className="text-xs text-white/45">/</span>
      <span className="text-sm">{totalPages}</span>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="disabled:opacity-45"
      >
        <ChevronRight />
      </button>
    </div>
  );
}
