interface AdSlotProps {
  side: "left" | "right";
}

export function AdSlot({ side }: AdSlotProps) {
  return (
    <aside className="hidden xl:flex w-28 shrink-0 items-center justify-center">
      <div className="h-[68vh] w-full rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-3 text-center text-xs text-white/45">
        {side.toUpperCase()} ADS
      </div>
    </aside>
  );
}
