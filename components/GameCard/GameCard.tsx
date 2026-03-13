"use client";

import { useTranslations } from "next-intl";
import { Game } from "@/types/game";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { memo, useState } from "react";
import { motion } from "motion/react";

interface GameCardProps {
  game: Game;
  className?: string;
}

const FALLBACK_IMAGE_SRC = "https://actar.com/wp-content/uploads/2015/12/nocover.jpg";

const BADGE_CLASS =
  "rounded-md bg-black/55 px-[0.55em] py-[0.22em] text-[0.68em] font-medium text-white backdrop-blur-sm sm:px-[0.65em] sm:py-[0.3em] sm:text-[0.78em] max-w-full break-words";

const BUTTON_BASE_CLASS =
  "flex-1 cursor-pointer rounded-lg px-[0.7em] py-[0.55em] text-[0.78em] font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-0";

export const GameCard = memo(function GameCard({ game, className }: GameCardProps) {
  const t = useTranslations("casino");
  const [imageSrc, setImageSrc] = useState(game.image);

  const isGif = imageSrc.toLowerCase().split("?")[0].endsWith(".gif");

  return (
    <motion.article
      aria-label={game.name}
      tabIndex={0}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
      className={cn(
        "group relative h-full overflow-hidden rounded-xl border border-white/10",
        "transition-transform duration-200 ease-out will-change-transform",
        "hover:-translate-y-0.5 hover:scale-[1.02]",
        "active:scale-[0.99]",
        "hover:border-sky-400/40 hover:shadow-lg hover:shadow-black/20",
        "focus:outline-none",
        className
      )}
    >
      <div className="relative aspect-3/2 h-full w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={game.name}
          sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, (max-width: 1279px) 25vw, (max-width: 1535px) 20vw, 16vw"
          fill
          loading="lazy"
          decoding="async"
          unoptimized={isGif}
          onError={() => {
            if (imageSrc !== FALLBACK_IMAGE_SRC) {
              setImageSrc(FALLBACK_IMAGE_SRC);
            }
          }}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div
          className={cn(
            "absolute inset-0 flex flex-col justify-between bg-black/75",
            "p-[0.6em] text-[0.64em] opacity-0 transition-all duration-300",
            "group-hover:p-[0.8em] group-hover:text-[0.78em] group-hover:opacity-100",
            "sm:p-[0.9em] sm:text-[0.85em]",
            "sm:group-hover:p-[0.9em] sm:group-hover:text-[0.85em]",
            "group-focus-within:p-[0.8em] group-focus-within:text-[0.78em] group-focus-within:opacity-100",
            "sm:group-focus-within:p-[0.9em] sm:group-focus-within:text-[0.85em]"
          )}
        >
          <div className="flex flex-wrap gap-[0.35em] sm:gap-[0.5em]">
            {game.lines && (
              <span className={BADGE_CLASS}>
                <span className="text-white/75">{t("lines")}: </span>
                <span className="text-[1.08em] font-extrabold text-white">{game.lines}</span>
              </span>
            )}

            {game.volatility && (
              <span className={BADGE_CLASS}>
                <span className="text-white/75">{t("volatility")}: </span>
                <span className="text-[1.08em] font-extrabold text-white">{game.volatility}</span>
              </span>
            )}
          </div>
          <div className="space-y-[0.65em] sm:space-y-[0.9em]">
            <div>
              <h3 className="truncate text-[0.8em] font-bold text-white sm:text-[1.05em]">{game.name}</h3>
              <p className="truncate text-[0.6em] tracking-[0.14em] text-zinc-300 uppercase sm:text-[0.8em]">{game.provider}</p>
            </div>

            <div className="flex gap-[0.45em]">
              <button
                type="button"
                className={cn(
                  BUTTON_BASE_CLASS,
                  "border border-white/50 bg-white/30 shadow-md backdrop-blur-sm",
                  "hover:bg-white/40 focus:ring-white/50"
                )}
              >
                {t("demo")}
              </button>
              <button type="button" className={cn(BUTTON_BASE_CLASS, "bg-sky-500", "hover:bg-sky-400 focus:ring-sky-400")}>
                {t("play")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
});
