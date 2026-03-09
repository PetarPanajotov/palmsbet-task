"use client";

import { useState, Suspense } from "react";
import { useTranslations } from "next-intl";
import { useGames } from "@/hooks/useGames";
import { GameCard } from "@/components/GameCard";
import { ProviderFilter } from "@/components/ProviderFilter";
import { SearchInput } from "@/components/SearchInput";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

// TODO: Implement Casino Page
// This page should:
// 1. Fetch games using useGames hook
// 2. Show loading state while fetching
// 3. Show empty state when no games match filters
// 4. Handle errors gracefully with retry button
// 5. Be fully responsive

function CasinoContent() {
  const t = useTranslations("casino");

  // TODO: Implement filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  // TODO: Fetch games with filters
  // Pass both search and provider to useGames: { search: searchTerm, provider: selectedProvider }
  const { games, providers, isLoading, error, mutate } = useGames({ search: searchTerm, provider: selectedProvider ?? undefined });

  // TODO: Filter games by selected provider
  const filteredGames = games;

  // TODO: Show loading state
  // TIP: Use <GameCardSkeleton /> from "@/components/GameCard" to render skeleton placeholders in a grid
  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-400">{t("loading")}</p>
      </div>
    );
  }

  // TODO: Show error state
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
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-white">{t("title")}</h1>
        <LanguageSwitcher />
      </div>

      {/* Search */}
      <div className="w-full md:w-96">
        <SearchInput value={searchTerm} onChange={setSearchTerm} />
      </div>

      {/* Provider Filter */}
      <ProviderFilter providers={providers} selectedProvider={selectedProvider} onChange={setSelectedProvider} />

      {/* Games Grid */}
      {filteredGames.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-xl text-gray-400">{t("noGames")}</p>
          <p className="text-gray-500">{t("noGamesDescription")}</p>
        </div>
      ) : (
        // TODO: Implement responsive games grid
        // - Refer to the Figma file for the grid layout and breakpoints
        // - First card should be visually featured/larger
        <div>
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CasinoPage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
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
