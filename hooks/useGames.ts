import { ExternalGamesResponse, FilterOptions, Game, GamesResponse } from "@/types/game";
import { useMemo } from "react";
import useSWR from "swr";

const GAMES_CDN_URL = "https://cdn.palmsbet.com/static/games_bg.json";
const SWR_DEDUPING_INTERVAL_MS = 300000; // 5 minutes
const SWR_REVALIDATE_ON_FOCUS = false;

/**
 * Custom hook for fetching and filtering casino games from the given CDN.
 * Uses SWR for caching and revalidation.
 * @param options - Optional filter criteria (search term, provider code).
 * @returns Object containing filtered games, provider list, loading/error state, and a mutate function for re-fetching.
 */
export function useGames(options?: FilterOptions) {
  const { data, error, isLoading, mutate } = useSWR<GamesResponse>(GAMES_CDN_URL, fetchGames, {
    revalidateOnFocus: SWR_REVALIDATE_ON_FOCUS,
    dedupingInterval: SWR_DEDUPING_INTERVAL_MS,
  });

  const filteredGames = useMemo(() => {
    const games = data?.games ?? [];
    const filteredByProvider = filterGamesByProvider(games, options?.provider);
    return filterGamesBySearch(filteredByProvider, options?.search);
  }, [data?.games, options?.provider, options?.search]);

  return {
    games: filteredGames,
    providers: data?.providers ?? [],
    isLoading,
    error,
    mutate,
  };
}

/**
 * Fetches games from the PalmsBet CDN, maps them to the app's `Game` format,
 * and returns the normalized game list with unique providers.
 *
 * @returns A promise resolving to the mapped games and provider list.
 * @throws {Error} If the request fails.
 */
async function fetchGames(): Promise<GamesResponse> {
  const response = await fetch(GAMES_CDN_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch games: ${response.status} ${response.statusText}`);
  }

  const json: ExternalGamesResponse = await response.json();

  const games: Game[] = Object.values(json.game_list).map((game) => ({
    id: Number(game.id),
    name: game.name,
    provider: game.vendor_code,
    image: transformGameImage(game.active_image),
    lines: game.lines,
    volatility: game.volatility,
  }));

  const providers = [...new Set(games.map((game) => game.provider))].sort((a, b) => a.localeCompare(b));

  return { games, providers };
}

/**
 * Filters games by exact provider match.
 *
 * @param games The list of games to filter.
 * @param provider Optional provider name to match.
 * @returns The filtered games list.
 */
function filterGamesByProvider(games: Game[], provider?: string): Game[] {
  if (!provider?.trim()) {
    return games;
  }

  const normalizedProvider = provider.trim().toLowerCase();

  return games.filter((game) => game.provider.toLowerCase() === normalizedProvider);
}

/**
 * Filters games by search term against name and provider.
 *
 * @param games The list of games to filter.
 * @param search Optional search term.
 * @returns The filtered games list.
 */
function filterGamesBySearch(games: Game[], search?: string): Game[] {
  if (!search?.trim()) {
    return games;
  }

  const normalizedSearch = search.trim().toLowerCase();

  return games.filter(
    (game) => game.name.toLowerCase().includes(normalizedSearch) || game.provider.toLowerCase().includes(normalizedSearch)
  );
}

/**
 * Transforms the raw image path from the API into a valid, working URL.
 * Handles legacy path replacement and domain prefixing.
 * @param rawPath The image raw url path
 * @returns The transformed image to correct url path.
 */
function transformGameImage(rawPath: string | undefined | null): string {
  if (!rawPath || typeof rawPath !== "string") {
    return "";
  }

  const CDN_BASE_URL = "https://cdn.palmsbet.com";
  const LEGACY_TRIGGER = "/images/gamesImages/";
  const LEGACY_REPLACEMENT = "/images/legacy/gamesImages/";

  if (rawPath.includes(LEGACY_TRIGGER)) {
    const correctedPath = rawPath.replace(LEGACY_TRIGGER, LEGACY_REPLACEMENT);
    return `${CDN_BASE_URL}${correctedPath}`;
  }

  if (rawPath.startsWith("//")) {
    return `https:${rawPath}`;
  }

  return rawPath;
}
