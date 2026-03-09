"use client";

import { useTranslations } from "next-intl";
import { Game } from "@/types/game";
import { cn } from "@/lib/utils";

interface GameCardProps {
  game: Game;
  className?: string;
}

// TODO: Implement GameCard component
// This component should:
// 1. Display game image, name, and provider
// 2. Show "Play" and "Demo" buttons (buttons are non-functional)
// 3. Display game info: lines and volatility

export function GameCard({ game, className }: GameCardProps) {
  const t = useTranslations("casino");

  // TODO: Implement hover state
  // TODO: Implement play/demo button overlay (non-functional)
  // TODO: Add lazy loading for game images

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg bg-gray-800",
        "transition-all duration-300 hover:shadow-xl hover:shadow-sky-400/20",
        className
      )}
      data-testid="game-card"
    >
      {/* TODO: Implement game card content
          Suggested structure:
          - Image container with aspect ratio
          - Play/Demo buttons (non-functional)
          - Game info (name, provider, lines, volatility) */}

      <div className="p-4">
        <p className="text-gray-500">GameCard Component - TODO</p>
        <p className="text-sm text-gray-400">{game.name}</p>
      </div>
    </div>
  );
}
