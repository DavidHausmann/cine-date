import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition",
        "disabled:cursor-not-allowed disabled:opacity-55",
        variant === "primary" &&
          "bg-[#7DA8B5] text-[#0D111A] hover:bg-[#8CB8C6]",
        variant === "secondary" &&
          "bg-[#E50914] text-white hover:bg-[#ff1d2a]",
        variant === "ghost" && "bg-transparent text-white hover:bg-white/10",
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
