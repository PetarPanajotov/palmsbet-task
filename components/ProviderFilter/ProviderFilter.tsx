"use client";

import { useHorizontalDragScroll } from "@/hooks";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProviderFilterProps {
  providers: string[];
  selectedProvider: string | null;
  onChange: (provider: string | null) => void;
  className?: string;
}

export function ProviderFilter({ providers, selectedProvider, onChange, className }: ProviderFilterProps) {
  const { scrollRef, canScrollLeft, canScrollRight, isDragging, scrollByAmount, shouldCancelClick, containerProps } =
    useHorizontalDragScroll({
      itemCount: providers.length,
    });

  const handleProviderClick = (provider: string) => {
    onChange(selectedProvider === provider ? null : provider);
  };

  return (
    <div className={cn("relative", className)}>
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollByAmount("left")}
          className="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-black/70 p-2 text-white backdrop-blur-sm transition hover:bg-black/85"
          aria-label="Scroll providers left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollByAmount("right")}
          className="absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-black/70 p-2 text-white backdrop-blur-sm transition hover:bg-black/85"
          aria-label="Scroll providers right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pt-1 pb-1 select-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        {...containerProps}
      >
        {providers.map((provider) => {
          const isSelected = selectedProvider === provider;

          return (
            <button
              key={provider}
              type="button"
              onClick={(e) => {
                if (shouldCancelClick()) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }

                handleProviderClick(provider);
              }}
              className={cn(
                "shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                isSelected
                  ? "border-sky-400 bg-sky-400 text-white"
                  : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
              )}
              aria-pressed={isSelected}
            >
              {provider}
            </button>
          );
        })}
      </div>
    </div>
  );
}
