import { cn } from "@/lib/utils";

interface GameCardSkeletonProps {
  className?: string;
}

export function GameCardSkeleton({ className }: GameCardSkeletonProps) {
  return (
    <div className={cn("animate-pulse overflow-hidden rounded-xl border border-white/10 bg-[#141518]", "flex h-full flex-col", className)}>
      <div className="aspect-3/2 shrink-0 bg-white/5" />
    </div>
  );
}
