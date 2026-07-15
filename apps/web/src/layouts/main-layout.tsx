import { Outlet } from "react-router-dom";
import { AdSlot } from "@/components/ad-slot";

export function MainLayout() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1600px] gap-6 px-4 py-8 md:px-8">
      <AdSlot side="left" />
      <main className="flex-1">
        <Outlet />
      </main>
      <AdSlot side="right" />
    </div>
  );
}
