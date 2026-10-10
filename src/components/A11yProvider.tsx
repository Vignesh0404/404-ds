import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { DEFAULT_A11Y, applyA11yToDocument, clearStoredA11y, normalizeA11ySettings, readStoredA11y, writeStoredA11y } from "../a11y.js";
import type { A11ySettings } from "../a11y.js";

/** Site-specific on/off settings stored next to the shared ones (404games: keyboardKick, audioCues). */
export type A11yExtras = Record<string, boolean>;

type A11yContextValue = {
  settings: A11ySettings;
  patchSettings: (patch: Partial<A11ySettings>) => void;
  extras: A11yExtras;
  patchExtras: (patch: A11yExtras) => void;
  reset: () => void;
};

const A11yContext = createContext<A11yContextValue | null>(null);

type Stored = { settings: A11ySettings; extras: A11yExtras };

const systemPrefersReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

function load(extraDefaults: A11yExtras): Stored {
  const raw = readStoredA11y();
  const settings = normalizeA11ySettings(raw);
  // Nothing saved for motion yet: start from the operating system's setting.
  // It reflects a real vestibular need, not a taste, so it should hold before
  // anyone has opened the panel. The panel's switch overrides it either way.
  // (The pre-paint script in a11y-init.ts makes the same call.)
  if (typeof raw.reduceMotion !== "boolean") {
    settings.reduceMotion = systemPrefersReducedMotion();
  }
  const extras: A11yExtras = {};
  for (const [key, fallback] of Object.entries(extraDefaults)) {
    extras[key] = typeof raw[key] === "boolean" ? (raw[key] as boolean) : fallback;
  }
  return { settings, extras };
}

/**
 * Holds the accessibility settings for the page, applies them to <html>, and
 * saves them. One provider for the whole family: the three sites each had
 * their own, under three storage keys and two shapes.
 *
 * `extras` declares a site's own switches and their defaults. They are saved
 * in the same record and reset with everything else.
 */
export function A11yProvider({ children, extras: extraDefaults = NO_EXTRAS }: { children: ReactNode; extras?: A11yExtras }) {
  const [state, setState] = useState<Stored>(() => load(extraDefaults));
  // What the next effect run should do with storage. Nothing is written
  // until the visitor actually changes a setting: someone who never opens
  // the panel gets no cookie and no stored record, which is what the sites'
  // privacy pages promise. Reset clears what was stored rather than saving a
  // record of defaults.
  const pending = useRef<"none" | "save" | "clear">("none");

  useEffect(() => {
    applyA11yToDocument(state.settings);
    if (pending.current === "save") writeStoredA11y({ ...state.settings, ...state.extras });
    if (pending.current === "clear") clearStoredA11y();
    pending.current = "none";
  }, [state]);

  const patchSettings = useCallback((patch: Partial<A11ySettings>) => {
    pending.current = "save";
    setState((prev) => ({ ...prev, settings: normalizeA11ySettings({ ...prev.settings, ...patch }) }));
  }, []);

  const patchExtras = useCallback((patch: A11yExtras) => {
    pending.current = "save";
    setState((prev) => ({ ...prev, extras: { ...prev.extras, ...patch } }));
  }, []);

  const reset = useCallback(() => {
    pending.current = "clear";
    // Back to what a first-time visitor gets, which includes following the
    // operating system on motion.
    setState({ settings: { ...DEFAULT_A11Y, reduceMotion: systemPrefersReducedMotion() }, extras: { ...extraDefaults } });
  }, [extraDefaults]);

  const value = useMemo(
    () => ({ settings: state.settings, extras: state.extras, patchSettings, patchExtras, reset }),
    [state, patchSettings, patchExtras, reset],
  );

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
}

const NO_EXTRAS: A11yExtras = {};

export function useA11y() {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error("useA11y must be used within <A11yProvider />");
  return ctx;
}
