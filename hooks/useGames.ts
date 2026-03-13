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
export function useGames({ provider, search }: FilterOptions = {}) {
  const { data, error, isLoading, mutate } = useSWR<GamesResponse>(GAMES_CDN_URL, fetchGames, {
    revalidateOnFocus: SWR_REVALIDATE_ON_FOCUS,
    dedupingInterval: SWR_DEDUPING_INTERVAL_MS,
  });

  const filteredGames = useMemo(() => {
    const games = data?.games ?? [];
    return filterGamesBySearch(filterGamesByProvider(games, provider), search);
  }, [data?.games, provider, search]);

  return {
    games: filteredGames,
    providers: data?.providers ?? [],
    isLoading,
    error: error as Error | undefined,
    mutate,
  };
}

/**
 * Fetches games from the PalmsBet CDN, maps them to the app's `Game` format,
 * and returns the normalized game list with unique providers.
 *
 * @param url - The CDN URL to fetch games from.
 * @returns A promise resolving to the mapped games and provider list.
 * @throws {Error} If the request fails or the response shape is invalid.
 */
async function fetchGames(url: string): Promise<GamesResponse> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch games: ${response.status} ${response.statusText}`);
  }

  const json: ExternalGamesResponse = await response.json();

  // Runtime guard to prevent the CDN from returning invalid json.
  if (!json?.game_list || typeof json.game_list !== "object") {
    throw new Error("Invalid response shape: missing game_list");
  }

  const games = Object.values(json.game_list).map(mapExternalGame);
  const providers = [...new Set(games.map((game) => game.provider))].sort((a, b) => a.localeCompare(b));

  return { games, providers };
}

/**
 * Maps a raw external game object to the app's internal Game format.
 *
 * @param game - The raw game object from the CDN response.
 * @returns The mapped Game object.
 */
function mapExternalGame(game: ExternalGamesResponse["game_list"][string]): Game {
  return {
    id: game.id,
    name: game.name,
    provider: game.vendor_code,
    image: transformGameImage(game.active_image),
    lines: game.lines,
    volatility: game.volatility,
  };
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
 *
 * @param rawPath The image raw url path.
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
