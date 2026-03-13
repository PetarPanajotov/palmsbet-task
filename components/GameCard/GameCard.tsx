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

export const GameCard = memo(function GameCard({ game, className }: GameCardProps) {
  const t = useTranslations("casino");
  const [imageSrc, setImageSrc] = useState(game.image);
  const FALLBACK_IMAGE_SRC = "https://actar.com/wp-content/uploads/2015/12/nocover.jpg";

  const isGif = imageSrc.toLowerCase().split("?")[0].endsWith(".gif");

  return (
    <motion.article
      tabIndex={0}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
      className={cn(
        "group relative h-full overflow-hidden rounded-xl border border-white/10 bg-[#141518]",
        "transition-transform duration-200 ease-out",
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
            "p-[0.6em] text-[0.64em]",
            "group-active:p-[0.8em] group-active:text-[0.78em]",
            "group-focus:p-[0.8em] group-focus:text-[0.78em]",
            "group-focus-within:p-[0.8em] group-focus-within:text-[0.78em]",
            "sm:p-[0.9em] sm:text-[0.85em]",
            "sm:group-active:p-[0.9em] sm:group-active:text-[0.85em]",
            "sm:group-focus:p-[0.9em] sm:group-focus:text-[0.85em]",
            "sm:group-focus-within:p-[0.9em] sm:group-focus-within:text-[0.85em]",
            "opacity-0 transition-all duration-300",
            "group-hover:opacity-100",
            "group-active:opacity-100",
            "group-focus:opacity-100",
            "group-focus-within:opacity-100"
          )}
        >
          <div className="flex flex-wrap gap-[0.3em] sm:gap-[0.5em]">
            <span className="rounded-md bg-black/55 px-[0.55em] py-[0.22em] text-[0.68em] font-medium text-white backdrop-blur-sm sm:px-[0.65em] sm:py-[0.3em] sm:text-[0.78em]">
              {t("lines")}: {game.lines}
            </span>
            <span className="rounded-md bg-black/55 px-[0.55em] py-[0.22em] text-[0.68em] font-medium text-white backdrop-blur-sm sm:px-[0.65em] sm:py-[0.3em] sm:text-[0.78em]">
              {t("volatility")}: {game.volatility}
            </span>
          </div>

          <div className="space-y-[0.65em] sm:space-y-[0.9em]">
            <div>
              <h3 className="truncate text-[0.95em] font-bold text-white sm:text-[1.05em]">{game.name}</h3>
              <p className="truncate text-[0.68em] tracking-[0.14em] text-zinc-300 uppercase sm:text-[0.78em]">{game.provider}</p>
            </div>

            <div className="flex gap-[0.45em]">
              <button
                type="button"
                className="flex-1 cursor-pointer rounded-lg border border-white/50 bg-white/30 px-[0.7em] py-[0.55em] text-[0.78em] font-semibold text-white shadow-md backdrop-blur-sm transition hover:bg-white/40"
              >
                {t("demo")}
              </button>
              <button
                type="button"
                className="flex-1 cursor-pointer rounded-lg bg-sky-500 px-[0.7em] py-[0.55em] text-[0.78em] font-semibold text-white transition hover:bg-sky-400"
              >
                {t("play")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
});
