"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Manages a string search param in the URL and exposes it as a simple
 * state-like tuple: current value + setter.
 *
 * Empty values remove the param from the URL.
 *
 * @param key - Query param key to manage.
 * @returns A tuple containing the current param value and a setter.
 */
export function useSearchQueryParam(key: string): [string, (value: string) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const value = useMemo(() => searchParams.get(key) ?? "", [searchParams, key]);

  /**
   * Updates the query param in the URL.
   *
   * Empty or whitespace-only values remove the param entirely.
   *
   * @param nextValue - New value to persist in the URL.
   */
  const setValue = useCallback(
    (nextValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmedValue = nextValue.trim();

      if (trimmedValue) {
        params.set(key, trimmedValue);
      } else {
        params.delete(key);
      }

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [key, pathname, router, searchParams]
  );

  return [value, setValue];
}
