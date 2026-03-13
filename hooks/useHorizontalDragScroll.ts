"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UseHorizontalDragScrollOptions {
  itemCount: number;
  scrollStepRatio?: number;
  minScrollStep?: number;
  dragThreshold?: number;
}

export function useHorizontalDragScroll({
  itemCount,
  scrollStepRatio = 0.7,
  minScrollStep = 180,
  dragThreshold = 6,
}: UseHorizontalDragScrollOptions) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const isDraggingRef = useRef(false);
  const movedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  /**
   * Keeps the arrow button visibility in sync with the scroll position.
   *
   * Runs when:
   * - the component mounts (so arrows are correct from the start)
   * - itemCount changes (new items = different scroll width)
   * - the user scrolls (left/right arrow might need to appear or disappear)
   * - the window resizes (container width chhanged, overflow might be different now)
   */
  useEffect(() => {
    updateScrollButtons();

    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [itemCount, updateScrollButtons]);

  /**
   * Scrolls the container left or right by a calculated amount.
   * The distance is based on the visible container width times scrollStepRatio,
   * but never less than minScrollStep px.
   * @param direction - The direction to scroll (left or right)
   */
  const scrollByAmount = useCallback(
    (direction: "left" | "right") => {
      const el = scrollRef.current;
      if (!el) return;

      const amount = Math.max(el.clientWidth * scrollStepRatio, minScrollStep);

      el.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    },
    [scrollStepRatio, minScrollStep]
  );

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;

    isDraggingRef.current = true;
    movedRef.current = false;
    startXRef.current = e.pageX;
    scrollLeftRef.current = el.scrollLeft;

    // If the pointer went down on a child button (e.g. a filter pill), dont capture yet —
    // we want the button to still receive its click event if the user doesnt drag.
    // If they do drag past the threshold, we capture lazily in onPointerMove.
    if (!(e.target as HTMLElement).closest("button")) {
      el.setPointerCapture(e.pointerId);
    }
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = scrollRef.current;
      if (!el || !isDraggingRef.current) return;

      const dx = e.pageX - startXRef.current;

      if (Math.abs(dx) > dragThreshold) {
        movedRef.current = true;

        setIsDragging((prev) => {
          if (prev) return prev;
          return true;
        });

        // Lazily capture the pointer once we're sure its a drag.
        // This lets the drag continue outside the container without losing the gesture.
        if (!el.hasPointerCapture(e.pointerId)) {
          el.setPointerCapture(e.pointerId);
        }
      }

      el.scrollLeft = scrollLeftRef.current - dx;
    },
    [dragThreshold]
  );

  const stopDragging = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  const shouldCancelClick = useCallback(() => movedRef.current, []);

  const containerProps = useMemo(
    () => ({
      onPointerDown,
      onPointerMove,
      onPointerUp: stopDragging,
      onPointerCancel: stopDragging,
    }),
    [onPointerDown, onPointerMove, stopDragging]
  );

  return {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    isDragging,
    scrollByAmount,
    shouldCancelClick,
    containerProps,
  };
}
