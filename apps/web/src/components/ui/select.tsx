import { forwardRef, SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "h-11 w-full rounded-md border border-white/30 bg-[#0D111A] px-4 text-sm text-white outline-none",
      "focus:border-[#7DA8B5]",
      className,
    )}
    {...props}
  >
    {children}
  </select>
));

Select.displayName = "Select";
