import { cn } from "@/lib/utils";

interface GameCardSkeletonProps {
  className?: string;
}

// TODO: Implement GameCardSkeleton component
// This component should:
// 1. Show a loading placeholder that matches GameCard dimensions
// 2. Use Tailwind's animate-pulse for loading animation
// 3. Be used when games are loading

export function GameCardSkeleton({ className }: GameCardSkeletonProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-gray-800", "animate-pulse", className)}>
      {/* TODO: Implement skeleton content */}
      <div className="aspect-3/4 bg-gray-700" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-3/4 rounded bg-gray-700" />
        <div className="h-3 w-1/2 rounded bg-gray-700" />
      </div>
    </div>
  );
}
