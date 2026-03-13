"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn, debounce } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  className?: string;
}

export function SearchInput({ value, onChange, debounceMs = 300, className }: SearchInputProps) {
  const t = useTranslations("casino");
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const debouncedOnChange = useMemo(
    () =>
      debounce((...args: unknown[]) => {
        const nextValue = typeof args[0] === "string" ? args[0] : "";
        onChange(nextValue);
      }, debounceMs),
    [onChange, debounceMs]
  );

  /**
   * Updates the local input state immediately for responsive typing,
   * while propagating the value to the parent through a debounced callback.
   */
  const handleInputChange = (nextValue: string) => {
    setInputValue(nextValue);

    const trimmedValue = nextValue.trim();

    if (trimmedValue.length === 0) {
      onChange("");
      return;
    }

    if (trimmedValue.length < 2) {
      return;
    }

    debouncedOnChange(trimmedValue);
  };

  /**
   * Clears the input and immediately notifies the parent.
   */
  const handleClear = () => {
    setInputValue("");
    onChange("");
  };

  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />

      <input
        type="search"
        aria-label={t("searchPlaceholder")}
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className={cn(
          "w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pr-10 pl-10 text-sm text-white placeholder:text-zinc-500",
          "transition-colors outline-none",
          "focus:border-sky-400/60 focus:bg-white/10",
          "[&::-webkit-search-cancel-button]:appearance-none"
        )}
      />

      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute top-1/2 right-3 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/10 hover:text-white"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
