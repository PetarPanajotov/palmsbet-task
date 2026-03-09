"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("language");
  const params = useParams();
  const pathname = usePathname();
  const currentLocale = params.locale as string;

  // Remove current locale from pathname to get the base path
  const basePath = pathname.replace(/^\/[a-z]{2}/, "") || "/";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex gap-1">
        {routing.locales.map((locale) => (
          <Link
            key={locale}
            href={`/${locale}${basePath}`}
            className={cn(
              "rounded px-2 py-1 text-sm font-medium transition-colors",
              currentLocale === locale ? "bg-sky-400 text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"
            )}
          >
            {t(locale)}
          </Link>
        ))}
      </div>
    </div>
  );
}
