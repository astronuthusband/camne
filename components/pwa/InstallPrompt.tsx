"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISSED_KEY = "camne-install-dismissed";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIos] = useState(
    () =>
      typeof window !== "undefined" &&
      /iphone|ipad|ipod/i.test(window.navigator.userAgent)
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Never show if already installed (standalone display mode).
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari-specific flag
      (window.navigator as unknown as { standalone?: boolean }).standalone;
    if (isStandalone) return;

    // Never show again once dismissed once — this is a soft, one-time nudge.
    if (localStorage.getItem(DISMISSED_KEY)) return;

    function handleBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // iOS has no beforeinstallprompt event — show the instructional
    // card directly, but only once, after a short delay so it doesn't
    // interrupt someone still reading the homepage.
    let iosTimer: ReturnType<typeof setTimeout> | undefined;
    if (isIos) {
      iosTimer = setTimeout(() => setVisible(true), 4000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      if (iosTimer) clearTimeout(iosTimer);
    };
  }, [isIos]);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-paper-raised px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] sm:bottom-4 sm:left-1/2 sm:right-auto sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:rounded-2xl sm:border">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal font-display text-sm text-gold">
          ?
        </span>
        <div className="flex-1 text-sm">
          {isIos ? (
            <p className="text-ink">
              Install CAMNE: tap{" "}
              <span className="font-medium">Share</span>, then{" "}
              <span className="font-medium">Add to Home Screen</span>.
            </p>
          ) : (
            <p className="text-ink">
              Install CAMNE for faster access and offline guides.
            </p>
          )}
        </div>
        {!isIos && (
          <button
            onClick={handleInstall}
            className="shrink-0 rounded-full bg-teal px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-deep"
          >
            Install
          </button>
        )}
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 text-ink-soft hover:text-ink"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
