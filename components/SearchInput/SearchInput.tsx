"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  className?: string;
}

// BONUS: Implement SearchInput component
// This component should:
// 1. Show a search input field with icon
// 2. Support debounced search (default 300ms)
// 3. Show clear button when has value

export function SearchInput({ value, onChange, debounceMs = 300, className }: SearchInputProps) {
  const t = useTranslations("casino");
  const [inputValue, setInputValue] = useState(value);

  // TODO: Implement debounce logic
  // TIP: import { debounce } from "@/lib/utils" and use it to wrap the onChange callback
  // TODO: Handle input changes with debounce
  // TODO: Implement clear button functionality

  return (
    <div className={cn("relative", className)}>
      {/* TODO: Implement search input with icon */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-sky-400 focus:outline-none"
      />
      <p className="mt-1 text-xs text-gray-500">SearchInput Component - BONUS</p>
    </div>
  );
}
