"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

function subscribeToHoverCapability(callback: () => void) {
  const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getHoverCapabilitySnapshot() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function getHoverCapabilityServerSnapshot() {
  // No pointer info during SSR — default to disabled, matches touch/mobile.
  return false;
}

// A small teal dot that trails the pointer and grows slightly over
// clickable elements. Desktop + fine-pointer only — it never mounts on
// touch devices, and the site is fully usable without it either way.
export function CustomCursor() {
  const enabled = useSyncExternalStore(
    subscribeToHoverCapability,
    getHoverCapabilitySnapshot,
    getHoverCapabilityServerSnapshot
  );
  const dotRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("custom-cursor-active");

    function handleMove(e: PointerEvent) {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      const target = e.target as HTMLElement;
      setHovering(!!target.closest("a, button, input, [role='button']"));
    }

    window.addEventListener("pointermove", handleMove);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal transition-[width,height] duration-150 ease-out ${
        hovering ? "h-7 w-7 bg-teal/20 ring-2 ring-teal" : "h-2.5 w-2.5"
      }`}
    />
  );
}
