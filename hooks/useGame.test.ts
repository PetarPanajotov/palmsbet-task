import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SWRConfig } from "swr";
import React from "react";
import { useGames } from "./useGames";

// ─── SWR Cache Isolation ──────────────────────────────────────────────────────

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(SWRConfig, { value: { provider: () => new Map() } }, children);

// ─── Fixtures ────────────────────────────────────────────────────────────────

const MOCK_API_RESPONSE = {
  game_list: {
    "1": {
      id: "1",
      name: "Book of Dead",
      vendor_code: "playngo",
      active_image: "/images/gamesImages/book-of-dead.jpg",
      lines: "10",
      volatility: "3",
    },
    "2": {
      id: "2",
      name: "Starburst",
      vendor_code: "netent",
      active_image: "//cdn.netent.com/starburst.jpg",
      lines: "10",
      volatility: "2",
    },
    "3": {
      id: "3",
      name: "Gates of Olympus",
      vendor_code: "pragmatic",
      active_image: "/images/gamesImages/gates-of-olympus.jpg",
      lines: "20",
      volatility: "1",
    },
    "4": {
      id: "4",
      name: "Legacy Slots",
      vendor_code: "playngo",
      active_image: null,
      lines: "5",
      volatility: "4",
    },
  },
};

const MAPPED_GAMES = [
  {
    id: "1",
    name: "Book of Dead",
    provider: "playngo",
    image: "https://cdn.palmsbet.com/images/legacy/gamesImages/book-of-dead.jpg",
    lines: "10",
    volatility: "3",
  },
  {
    id: "2",
    name: "Starburst",
    provider: "netent",
    image: "https://cdn.netent.com/starburst.jpg",
    lines: "10",
    volatility: "2",
  },
  {
    id: "3",
    name: "Gates of Olympus",
    provider: "pragmatic",
    image: "https://cdn.palmsbet.com/images/legacy/gamesImages/gates-of-olympus.jpg",
    lines: "20",
    volatility: "1",
  },
  {
    id: "4",
    name: "Legacy Slots",
    provider: "playngo",
    image: "",
    lines: "5",
    volatility: "4",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mockFetchSuccess(data = MOCK_API_RESPONSE) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => data,
  });
}

function mockFetchFailure(status = 500, statusText = "Internal Server Error") {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status,
    statusText,
  });
}

async function renderUseGames(options?: Parameters<typeof useGames>[0]) {
  const rendered = renderHook(() => useGames(options), { wrapper });

  await waitFor(() => {
    expect(rendered.result.current.isLoading).toBe(false);
  });

  return rendered;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("useGames", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── Loading state ──────────────────────────────────────────────────────────

  describe("loading state", () => {
    it("returns isLoading=true while fetch is in-flight", () => {
      global.fetch = vi.fn().mockReturnValue(new Promise(() => {}));

      const { result } = renderHook(() => useGames(), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.games).toEqual([]);
      expect(result.current.providers).toEqual([]);
      expect(result.current.error).toBeUndefined();
    });

    it("returns isLoading=false after fetch resolves", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames();

      expect(result.current.isLoading).toBe(false);
    });
  });

  // ── Successful fetch ───────────────────────────────────────────────────────

  describe("successful fetch", () => {
    it("fetches from the games CDN URL", async () => {
      mockFetchSuccess();

      await renderUseGames();

      expect(global.fetch).toHaveBeenCalledWith("https://cdn.palmsbet.com/static/games_bg.json");
    });

    it("returns all mapped games with correct shape", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames();

      expect(result.current.games).toHaveLength(4);
      expect(result.current.games).toEqual(expect.arrayContaining(MAPPED_GAMES));
    });

    it("returns a sorted, deduplicated provider list", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames();

      expect(result.current.providers).toEqual(["netent", "playngo", "pragmatic"]);
    });

    it("sets error=undefined on success", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames();

      expect(result.current.error).toBeUndefined();
    });
  });

  // ── game_list guard ────────────────────────────────────────────────────────

  describe("game_list validation guard", () => {
    it("throws when game_list is missing from the response", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ not_game_list: {} }),
      });

      const { result } = renderHook(() => useGames(), { wrapper });

      await waitFor(() => expect(result.current.error).toBeDefined());

      expect(result.current.error?.message).toMatch(/missing game_list/);
      expect(result.current.games).toEqual([]);
      expect(result.current.providers).toEqual([]);
    });

    it("throws when game_list is null", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ game_list: null }),
      });

      const { result } = renderHook(() => useGames(), { wrapper });

      await waitFor(() => expect(result.current.error).toBeDefined());

      expect(result.current.error?.message).toMatch(/missing game_list/);
    });

    it("returns empty games array when game_list is an empty object", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ game_list: {} }),
      });

      const { result } = await renderUseGames();

      expect(result.current.games).toEqual([]);
      expect(result.current.providers).toEqual([]);
      expect(result.current.error).toBeUndefined();
    });
  });

  // ── game mapping ───────────────────────────────────────────────────────────

  describe("game mapping", () => {
    it("preserves id from the API response", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames();

      result.current.games.forEach((game) => {
        expect(typeof game.id).toBe("string");
      });
    });

    it("maps vendor_code to provider", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames();

      const starburst = result.current.games.find((g) => g.name === "Starburst");
      expect(starburst?.provider).toBe("netent");
    });

    it("maps all expected fields correctly", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames();

      const bookOfDead = result.current.games.find((g) => g.name === "Book of Dead");
      expect(bookOfDead).toEqual({
        id: "1",
        name: "Book of Dead",
        provider: "playngo",
        image: "https://cdn.palmsbet.com/images/legacy/gamesImages/book-of-dead.jpg",
        lines: "10",
        volatility: "3",
      });
    });
  });

  // ── Image transformation ───────────────────────────────────────────────────

  describe("image URL transformation", () => {
    it("replaces legacy path and prefixes CDN base URL", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames();

      const bookOfDead = result.current.games.find((g) => g.name === "Book of Dead");
      expect(bookOfDead?.image).toBe("https://cdn.palmsbet.com/images/legacy/gamesImages/book-of-dead.jpg");
    });

    it("adds https: scheme for protocol-relative URLs", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames();

      const starburst = result.current.games.find((g) => g.name === "Starburst");
      expect(starburst?.image).toBe("https://cdn.netent.com/starburst.jpg");
    });

    it("returns empty string for null image paths", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames();

      const legacySlots = result.current.games.find((g) => g.name === "Legacy Slots");
      expect(legacySlots?.image).toBe("");
    });
  });

  // ── Error state ────────────────────────────────────────────────────────────

  describe("error handling", () => {
    it("sets a typed error when HTTP response is not ok", async () => {
      mockFetchFailure(404, "Not Found");

      const { result } = renderHook(() => useGames(), { wrapper });

      await waitFor(() => expect(result.current.error).toBeDefined());

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toMatch(/404/);
      expect(result.current.error?.message).toMatch(/Not Found/);
    });

    it("sets error when fetch rejects (network failure)", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network failure"));

      const { result } = renderHook(() => useGames(), { wrapper });

      await waitFor(() => expect(result.current.error).toBeDefined());

      expect(result.current.error?.message).toBe("Network failure");
    });

    it("returns empty games and providers on error", async () => {
      mockFetchFailure();

      const { result } = renderHook(() => useGames(), { wrapper });

      await waitFor(() => expect(result.current.error).toBeDefined());

      expect(result.current.games).toEqual([]);
      expect(result.current.providers).toEqual([]);
    });
  });

  // ── Provider filter ────────────────────────────────────────────────────────

  describe("provider filter", () => {
    it("returns only games from the specified provider", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames({ provider: "playngo" });

      expect(result.current.games).toHaveLength(2);
      result.current.games.forEach((g) => expect(g.provider).toBe("playngo"));
    });

    it("is case-insensitive", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames({ provider: "PlayNGO" });

      expect(result.current.games).toHaveLength(2);
    });

    it("trims provider before filtering", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames({ provider: "  playngo  " });

      expect(result.current.games).toHaveLength(2);
      result.current.games.forEach((g) => expect(g.provider).toBe("playngo"));
    });

    it("returns all games when provider is empty string", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames({ provider: "" });

      expect(result.current.games).toHaveLength(4);
    });

    it("returns all games when provider is only whitespace", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames({ provider: "   " });

      expect(result.current.games).toHaveLength(4);
    });

    it("returns empty array for unknown provider", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames({ provider: "unknown" });

      expect(result.current.games).toHaveLength(0);
    });
  });

  // ── Search filter ──────────────────────────────────────────────────────────

  describe("search filter", () => {
    it("filters games by name (case-insensitive)", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames({ search: "book" });

      expect(result.current.games).toHaveLength(1);
      expect(result.current.games[0].name).toBe("Book of Dead");
    });

    it("filters games by provider via search term", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames({ search: "netent" });

      expect(result.current.games).toHaveLength(1);
      expect(result.current.games[0].name).toBe("Starburst");
    });

    it("trims search before filtering", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames({ search: "  book  " });

      expect(result.current.games).toHaveLength(1);
      expect(result.current.games[0].name).toBe("Book of Dead");
    });

    it("returns all games when search is empty", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames({ search: "" });

      expect(result.current.games).toHaveLength(4);
    });

    it("returns all games when search is only whitespace", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames({ search: "   " });

      expect(result.current.games).toHaveLength(4);
    });

    it("returns empty array when no games match", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames({ search: "zzz_no_match" });

      expect(result.current.games).toHaveLength(0);
    });
  });

  // ── Combined filters ───────────────────────────────────────────────────────

  describe("combined provider + search filters", () => {
    it("applies both filters simultaneously", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames({ provider: "playngo", search: "book" });

      expect(result.current.games).toHaveLength(1);
      expect(result.current.games[0].name).toBe("Book of Dead");
    });

    it("returns empty array when provider matches but search does not", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames({ provider: "netent", search: "olympus" });

      expect(result.current.games).toHaveLength(0);
    });
  });

  // ── No options ─────────────────────────────────────────────────────────────

  describe("called without options", () => {
    it("returns all games with no filtering", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames();

      expect(result.current.games).toHaveLength(4);
    });
  });

  // ── mutate ─────────────────────────────────────────────────────────────────

  describe("mutate", () => {
    it("exposes a mutate function", async () => {
      mockFetchSuccess();

      const { result } = await renderUseGames();

      expect(typeof result.current.mutate).toBe("function");
    });
  });
});
