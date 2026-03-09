import { Game, GamesResponse, FilterOptions } from "@/types/game";

// TODO: Define the shape of a single game object returned by the external API (interface ExternalGame)

// TODO: Define the shape of the full API response (interface ExternalGamesResponse)

// TODO: Define the CDN URL constant for the games endpoint
// https://cdn.palmsbet.com/static/games_bg.json

// TODO: Implement the fetcher function
// It should:
// 1. Fetch from the CDN URL
// 2. Throw an error if the response is not ok
// 3. Parse the JSON response
// 4. Map each external game to the app's Game interface:
//    - id: parse to number if needed
//    - name: game name
//    - provider: vendor_code field
//    - image: prefix active_image with "https://cdn.palmsbet.com"
//    - lines: lines field
//    - volatility: volatility field
// 5. Extract a unique list of provider codes
// 6. Return { games, providers }

/**
 * Custom hook for fetching and filtering casino games from the CDN.
 * Uses SWR for caching and revalidation.
 * @param options - Optional filter criteria (search term, provider code).
 * @returns Object containing filtered games, provider list, loading/error state, and a mutate function for re-fetching.
 */
export function useGames(options?: FilterOptions) {
  // TODO: Use SWR to fetch games with the fetcher above
  // Suggested SWR options: revalidateOnFocus: false, dedupingInterval: 5 minutes
  const data = undefined as GamesResponse | undefined;
  const error = undefined;
  const isLoading = false;
  const mutate = () => {};

  // TODO: Filter games by provider (options?.provider)
  // TODO: Filter games by search term (options?.search) — match against name and provider
  const filteredGames: Game[] = data?.games ?? [];

  return {
    games: filteredGames,
    providers: data?.providers ?? [],
    isLoading,
    error,
    mutate,
  };
}
