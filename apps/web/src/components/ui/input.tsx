import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full rounded-md border border-white/30 bg-transparent px-4 text-sm text-white outline-none",
      "placeholder:text-white/50 focus:border-[#7DA8B5]",
      className,
    )}
    {...props}
  />
));

Input.displayName = "Input";
