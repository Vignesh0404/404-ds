import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { IconButton } from "./IconButton.js";
import { CloseIcon, StarIcon } from "./icons.js";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

// Match --motion-sheet and --motion-drawer. The panel stays mounted this
// long after `open` goes false so its exit transition can play.
const EXIT_MS = { end: 220, left: 300 };

export type SheetTone = "paper" | "cream" | "yellow" | "purple-light" | "red" | "green" | "blue" | "brown" | "purple" | "ink";

export type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  /** Accessible name of the close button, e.g. "Close cart". */
  closeLabel: string;
  /** The panel's surface. Pick one that contrasts with the page behind it. */
  tone?: SheetTone;
  /**
   * "end" (default): a bottom sheet on a phone, a right-hand panel from
   * 768px. "left": a panel from the left edge at every width — the site menu.
   */
  side?: "end" | "left";
  children: ReactNode;
  /**
   * Overrides the default "return focus to whatever had it before the sheet
   * opened". 404games uses it to hand focus back to the game canvas rather
   * than park it on the settings button that opened the panel.
   */
  onCloseAutoFocus?: () => void;
};

/**
 * The family's slide-in panel: a bottom sheet on a phone, a right-hand side
 * sheet from 768px. Handles the backdrop, focus trap, Escape, scroll lock
 * and focus restore, so every sheet on every site behaves the same.
 *
 * This is 404games' implementation, which had two fixes the other two
 * sites' copies lacked: the close button is focused only once it is actually
 * in the DOM, and onCloseAutoFocus.
 */
export function Sheet({ open, onClose, title, subtitle, closeLabel, tone = "green", side = "end", children, onCloseAutoFocus }: SheetProps) {
  const headingId = useId();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  // Read through refs inside the [open] effect below rather than listed as
  // its dependencies: callers usually pass inline arrow functions, new on
  // every render, which would otherwise re-run that effect (and re-capture
  // previouslyFocusedRef mid-session) on every unrelated re-render while the
  // sheet is open.
  const onCloseRef = useRef(onClose);
  const onCloseAutoFocusRef = useRef(onCloseAutoFocus);
  useEffect(() => {
    onCloseRef.current = onClose;
    onCloseAutoFocusRef.current = onCloseAutoFocus;
  });

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    setVisible(false);
    const timer = window.setTimeout(() => setMounted(false), EXIT_MS[side]);
    return () => window.clearTimeout(timer);
  }, [open, side]);

  useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !sheetRef.current) return;
      const focusable = Array.from(sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null,
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (onCloseAutoFocusRef.current) onCloseAutoFocusRef.current();
      else previouslyFocusedRef.current?.focus();
    };
  }, [open]);

  // Separate from the effect above: the close button only exists once
  // `mounted` flips true (the component returns null until then), so
  // focusing it in an [open]-only effect races the mount and silently
  // no-ops.
  useEffect(() => {
    if (open && mounted) closeButtonRef.current?.focus();
  }, [open, mounted]);

  if (!mounted) return null;

  return (
    <div className="ds-sheet-root" data-visible={visible ? "" : undefined}>
      <div aria-hidden="true" className="ds-sheet-backdrop" onMouseDown={onClose} />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="ds-sheet"
        data-tone={tone}
        data-side={side === "left" ? "left" : undefined}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="ds-sheet-header">
          <div>
            <h2 id={headingId} className="ds-sheet-title">
              <StarIcon />
              {title}
            </h2>
            {subtitle && <p className="ds-sheet-subtitle">{subtitle}</p>}
          </div>
          <IconButton ref={closeButtonRef} label={closeLabel} tone="ghost" size="sm" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className="ds-sheet-body">{children}</div>
      </div>
    </div>
  );
}
