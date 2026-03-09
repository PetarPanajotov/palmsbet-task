"use client";

import { cn } from "@/lib/utils";

interface ProviderFilterProps {
  providers: string[];
  selectedProvider: string | null;
  onChange: (provider: string | null) => void;
  className?: string;
}

// BONUS: Implement ProviderFilter component
// This component should:
// 1. Display a horizontal scrollable list of provider chips/buttons
// 2. Support single-select (click to select, click again to deselect)
// 3. Highlight selected provider

export function ProviderFilter({ providers, selectedProvider, onChange, className }: ProviderFilterProps) {
  // TODO: Implement provider selection logic
  // TODO: Implement horizontal scroll

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {/* TODO: Implement provider filter UI */}
      <div className="rounded-lg bg-gray-800 p-4">
        <p className="text-gray-500">ProviderFilter Component - BONUS</p>
      </div>
    </div>
  );
}
