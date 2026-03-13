import { cn } from "@/lib/utils";

interface ProviderFilterSkeletonProps {
  className?: string;
}

export function ProviderFilterSkeleton({ className }: ProviderFilterSkeletonProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="flex gap-2 overflow-hidden py-1">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-9.5 flex-1 shrink-0 animate-pulse rounded-full border border-white/10 bg-white/5" />
        ))}
      </div>
    </div>
  );
}
