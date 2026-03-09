import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale } from "@/i18n/request";

export const routing = defineRouting({
  locales,
  defaultLocale,
});
