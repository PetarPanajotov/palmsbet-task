import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSearchQueryParam } from "./useSearchQueryParam";

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockReplace = vi.fn();
const mockPathname = "/en/";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
}));

let mockSearchParams = new URLSearchParams();

describe("useSearchQueryParam", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  // ── Reading the value ──────────────────────────────────────────────────────

  describe("reading the value", () => {
    it("returns empty string when param is not in the URL", () => {
      const { result } = renderHook(() => useSearchQueryParam("search"));

      expect(result.current[0]).toBe("");
    });

    it("returns the current param value when it exists in the URL", () => {
      mockSearchParams = new URLSearchParams("search=starburst");

      const { result } = renderHook(() => useSearchQueryParam("search"));

      expect(result.current[0]).toBe("starburst");
    });

    it("returns empty string when param exists but is empty", () => {
      mockSearchParams = new URLSearchParams("search=");

      const { result } = renderHook(() => useSearchQueryParam("search"));

      expect(result.current[0]).toBe("");
    });
  });

  // ── Setting the value ──────────────────────────────────────────────────────

  describe("setting the value", () => {
    it("adds the param to the URL when a value is set", () => {
      const { result } = renderHook(() => useSearchQueryParam("search"));

      act(() => {
        result.current[1]("starburst");
      });

      expect(mockReplace).toHaveBeenCalledWith("/en/?search=starburst", { scroll: false });
    });

    it("updates an existing param value in the URL", () => {
      mockSearchParams = new URLSearchParams("search=book");

      const { result } = renderHook(() => useSearchQueryParam("search"));

      act(() => {
        result.current[1]("starburst");
      });

      expect(mockReplace).toHaveBeenCalledWith("/en/?search=starburst", { scroll: false });
    });

    it("removes the param from the URL when value is empty string", () => {
      mockSearchParams = new URLSearchParams("search=starburst");

      const { result } = renderHook(() => useSearchQueryParam("search"));

      act(() => {
        result.current[1]("");
      });

      expect(mockReplace).toHaveBeenCalledWith("/en/", { scroll: false });
    });

    it("removes the param from the URL when value is only whitespace", () => {
      mockSearchParams = new URLSearchParams("search=starburst");

      const { result } = renderHook(() => useSearchQueryParam("search"));

      act(() => {
        result.current[1]("   ");
      });

      expect(mockReplace).toHaveBeenCalledWith("/en/", { scroll: false });
    });

    it("trims whitespace from the value before setting it", () => {
      const { result } = renderHook(() => useSearchQueryParam("search"));

      act(() => {
        result.current[1]("  starburst  ");
      });

      expect(mockReplace).toHaveBeenCalledWith("/en/?search=starburst", { scroll: false });
    });
  });

  // ── Preserving other params ────────────────────────────────────────────────

  describe("preserving other params", () => {
    it("preserves existing params when adding a new one", () => {
      mockSearchParams = new URLSearchParams("provider=netent");

      const { result } = renderHook(() => useSearchQueryParam("search"));

      act(() => {
        result.current[1]("starburst");
      });

      expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining("provider=netent"), { scroll: false });
      expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining("search=starburst"), { scroll: false });
    });

    it("preserves existing params when removing the managed param", () => {
      mockSearchParams = new URLSearchParams("search=starburst&provider=netent");

      const { result } = renderHook(() => useSearchQueryParam("search"));

      act(() => {
        result.current[1]("");
      });

      expect(mockReplace).toHaveBeenCalledWith("/en/?provider=netent", { scroll: false });
    });

    it("does not affect other params when updating its own param", () => {
      mockSearchParams = new URLSearchParams("search=book&provider=playngo");

      const { result } = renderHook(() => useSearchQueryParam("search"));

      act(() => {
        result.current[1]("starburst");
      });

      expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining("provider=playngo"), { scroll: false });
    });
  });

  // ── scroll: false ──────────────────────────────────────────────────────────

  describe("navigation options", () => {
    it("always calls router.replace with scroll: false", () => {
      const { result } = renderHook(() => useSearchQueryParam("search"));

      act(() => {
        result.current[1]("starburst");
      });

      expect(mockReplace).toHaveBeenCalledWith(expect.any(String), { scroll: false });
    });
  });

  // ── Different keys ─────────────────────────────────────────────────────────

  describe("different param keys", () => {
    it("manages the provider param independently from search", () => {
      mockSearchParams = new URLSearchParams("search=book");

      const { result } = renderHook(() => useSearchQueryParam("provider"));

      act(() => {
        result.current[1]("netent");
      });

      expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining("provider=netent"), { scroll: false });
      expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining("search=book"), { scroll: false });
    });
  });
});
