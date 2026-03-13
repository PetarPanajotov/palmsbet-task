import { cn } from "@/lib/utils";

interface GameCardSkeletonProps {
  className?: string;
}

export function GameCardSkeleton({ className }: GameCardSkeletonProps) {
  return (
    <div className={cn("animate-pulse overflow-hidden rounded-xl border border-white/10 bg-[#141518]", "flex h-full flex-col", className)}>
      <div className="aspect-3/2 shrink-0 bg-white/5" />

      <div className="px-2.5 py-2 sm:px-3 sm:py-2.5">
        <div className="mb-1.5 h-3.5 w-3/4 rounded-md bg-white/10 sm:h-4" />
        <div className="h-2.5 w-1/2 rounded-md bg-white/5" />
      </div>
    </div>
  );
}
