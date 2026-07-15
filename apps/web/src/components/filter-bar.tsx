import { zodResolver } from "@hookform/resolvers/zod";
import type { MovieFilters } from "@movie-picker/shared/types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CATEGORIES, RATINGS } from "@/constants/movie";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const schema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  watched: z.enum(["", "true", "false"]).optional(),
  rating: z.enum(["", "1", "2", "3", "4", "5"]).optional(),
});

type FormValues = z.infer<typeof schema>;

interface FilterBarProps {
  filters: MovieFilters;
  onChange: (next: MovieFilters) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const { register, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      search: filters.search,
      category: filters.category,
      watched:
        filters.watched === undefined ? "" : filters.watched ? "true" : "false",
      rating: filters.rating ? String(filters.rating) : "",
    },
  });

  const values = watch();

  useEffect(() => {
    if (values.watched !== "true") {
      setValue("rating", "");
    }

    onChange({
      ...filters,
      page: 1,
      search: values.search || undefined,
      category: values.category || undefined,
      watched:
        values.watched === ""
          ? undefined
          : values.watched === "true"
            ? true
            : false,
      rating: values.watched === "true" && values.rating ? Number(values.rating) : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.search, values.category, values.watched, values.rating]);

  return (
    <div className="grid grid-cols-1 gap-3 border-b border-white/20 p-4 md:grid-cols-4">
      <Input {...register("search")} placeholder="Pesquisar" />

      <Select {...register("category")}>
        <option value="">Categorias</option>
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </Select>

      <Select {...register("watched")}>
        <option value="">Visto?</option>
        <option value="true">Sim</option>
        <option value="false">Nao</option>
      </Select>

      <Select {...register("rating")} disabled={values.watched !== "true"}>
        <option value="">Nota</option>
        {RATINGS.map((rating) => (
          <option key={rating} value={String(rating)}>
            {rating} estrela{rating > 1 ? "s" : ""}
          </option>
        ))}
      </Select>
    </div>
  );
}
