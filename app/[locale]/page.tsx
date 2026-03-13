"use client";

import { GameCard, GameCardSkeleton } from "@/components/GameCard";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ProviderFilter, ProviderFilterSkeleton } from "@/components/ProviderFilter";
import { SearchInput } from "@/components/SearchInput";
import { useGames, useSearchQueryParam } from "@/hooks";
import { cn } from "@/lib/utils";
import { ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { Suspense, startTransition, useEffect, useRef, useState } from "react";

function CasinoContent() {
  const t = useTranslations("casino");

  const [searchTerm, setSearchTerm] = useSearchQueryParam("search");
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { games, providers, isLoading, error, mutate } = useGames({
    search: searchTerm,
    provider: selectedProvider ?? undefined,
  });

  const filteredGames = games;
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);

  const pageSize = 40;

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [pageSize, searchTerm, selectedProvider, filteredGames.length]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (first?.isIntersecting) {
          startTransition(() => {
            setVisibleCount((prev) => {
              if (prev >= filteredGames.length) return prev;
              return Math.min(prev + pageSize, filteredGames.length);
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
  }, [filteredGames.length, pageSize, isLoading]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const visibleGames = filteredGames.slice(0, visibleCount);

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-sky-400">{t("error")}</p>
        <button onClick={() => mutate()} className="mt-4 rounded-lg bg-sky-400 px-4 py-2 text-white">
          {t("retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-white">{t("title")}</h1>
        <LanguageSwitcher />
      </div>

      <div className="w-full md:w-96">
        <SearchInput value={searchTerm} onChange={setSearchTerm} />
      </div>

      {isLoading ? (
        <ProviderFilterSkeleton />
      ) : (
        <ProviderFilter providers={providers} selectedProvider={selectedProvider} onChange={setSelectedProvider} />
      )}

      {!isLoading && filteredGames.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-xl text-gray-400">{t("noGames")}</p>
          <p className="text-gray-500">{t("noGamesDescription")}</p>
        </div>
      ) : (
        <>
          <div className="3xl:grid-cols-6 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {isLoading
              ? Array.from({ length: pageSize }).map((_, index) => (
                  <div key={index} className={index === 0 ? "col-span-2 row-span-2" : "col-span-1"}>
                    <GameCardSkeleton />
                  </div>
                ))
              : visibleGames.map((game, index) => (
                  <div key={game.id} className={index === 0 ? "col-span-2 row-span-2" : "col-span-1"}>
                    <GameCard game={game} />
                  </div>
                ))}
          </div>

          {!isLoading && visibleCount < filteredGames.length && <div ref={loadMoreRef} className="h-10 w-full" />}
        </>
      )}

      <button
        type="button"
        onClick={handleScrollToTop}
        aria-label="Scroll to top"
        className={cn(
          "fixed right-4 bottom-4 z-50 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/70 text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-black/85 md:right-6 md:bottom-6",
          showScrollTop ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        )}
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </div>
  );
}

export default function CasinoPage() {
  return (
    <main className="min-h-screen p-2 sm:p-4 md:p-8">
      <div className="mx-auto">
        <Suspense
          fallback={
            <div className="py-12 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-white" />
            </div>
          }
        >
          <CasinoContent />
        </Suspense>
      </div>
    </main>
  );
}
