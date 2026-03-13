"use client";

import { useEffect, useRef, useState } from "react";

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

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    updateScrollButtons();

    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => updateScrollButtons();

    el.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [itemCount]);

  /**
   * Scroll the container based by a calculated amount.
   * The distance is based on a ratio of the visible container width,
   * but never smaller than the configured minimum step.
   *
   * @param direction - Direction to scroll toward.
   */
  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const amount = Math.max(el.clientWidth * scrollStepRatio, minScrollStep);

    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;

    isDraggingRef.current = true;
    movedRef.current = false;
    startXRef.current = e.pageX;
    scrollLeftRef.current = el.scrollLeft;
    setIsDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el || !isDraggingRef.current) return;

    const dx = e.pageX - startXRef.current;

    if (Math.abs(dx) > dragThreshold) {
      movedRef.current = true;
    }

    el.scrollLeft = scrollLeftRef.current - dx;
  };

  const stopDragging = () => {
    isDraggingRef.current = false;
    setIsDragging(false);

    window.setTimeout(() => {
      movedRef.current = false;
    }, 0);
  };

  const shouldCancelClick = () => movedRef.current;

  return {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    isDragging,
    scrollByAmount,
    shouldCancelClick,
    containerProps: {
      onMouseDown,
      onMouseMove,
      onMouseUp: stopDragging,
      onMouseLeave: stopDragging,
    },
  };
}
