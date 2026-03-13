import { Game } from "@/types/game";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";

export const PAGE_SIZE = 40;

/**
 * Manages paginated rendering of a games list using an IntersectionObserver.
 * Automatically resets when the games list changes (e.g. filters applied).
 *
 * @param games - The full filtered list of games to paginate.
 * @returns Visible games slice, a sentinel ref for infinite scroll, and a hasMore flag.
 */
export function usePaginatedGames(games: Game[]) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [games.length]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          startTransition(() => {
            setVisibleCount((prev) => {
              if (prev >= games.length) return prev;
              return Math.min(prev + PAGE_SIZE, games.length);
            });
          });
        }
      },
      {
        root: null,
        rootMargin: "1200px 0px",
        threshold: 0,
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [games.length]);

  const visibleGames = useMemo(() => {
    return games.slice(0, visibleCount);
  }, [games, visibleCount]);

  return {
    visibleGames,
    hasMore: visibleCount < games.length,
    loadMoreRef,
  };
}
