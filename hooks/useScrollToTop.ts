import { useEffect, useState } from "react";

/**
 * Tracks whether the page has scrolled past a threshold and exposes a scroll-to-top handler.
 *
 * @param threshold - Scroll distance in px before the button becomes visible. Defaults to 500.
 * @returns show flag and scrollToTop handler.
 */
export function useScrollToTop(threshold = 500) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > threshold);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return { show, scrollToTop };
}
