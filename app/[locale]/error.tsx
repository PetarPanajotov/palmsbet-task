"use client";

import { useTranslations } from "next-intl";

interface CasinoErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CasinoErrorPage({ error, reset }: CasinoErrorPageProps) {
  const t = useTranslations("casino");
  console.error(error);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="text-2xl font-bold text-white">{t("error")}</h2>
      <p className="mt-2 text-gray-400">{t("unexpectedError")}</p>

      <button
        type="button"
        onClick={reset}
        className="mt-6 cursor-pointer rounded-lg bg-sky-500 px-4 py-2 font-medium text-white transition hover:bg-sky-400"
      >
        {t("retry")}
      </button>
    </div>
  );
}
