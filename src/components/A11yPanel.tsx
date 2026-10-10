import { useEffect, useRef, useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useA11y } from "./A11yProvider.js";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";
import { Segmented } from "./controls.js";
import { Sheet } from "./Sheet.js";
import type { SheetTone } from "./Sheet.js";
import { chunkText, getReadableText } from "./reader.js";
import {
  AaIcon,
  AccessibilityIcon,
  CursorIcon,
  ImageIcon,
  LinkIcon,
  MotionIcon,
  PlayIcon,
  ResetIcon,
  SpeakerIcon,
  StopIcon,
  TextIcon,
} from "./icons.js";
import type { CursorSize, TextSize } from "../a11y.js";

const TEXT_SIZES: Array<{ value: TextSize; label: string }> = [
  { value: "sm", label: "S" },
  { value: "md", label: "M" },
  { value: "lg", label: "L" },
  { value: "xl", label: "XL" },
];

const CURSOR_SIZES: Array<{ value: CursorSize; label: string }> = [
  { value: "default", label: "Default" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "XL" },
];

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

// ------------------------------------------------------------ building blocks
// Exported so a site can add its own sections that look like the built-in ones.

/** A titled card grouping related settings. */
export function A11ySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="ds-a11y-section">
      <div className="ds-label">{title}</div>
      <div className="ds-a11y-section-body">{children}</div>
    </div>
  );
}

/** One on/off setting: icon, label, a line of explanation, and a switch. The whole row is the button. */
export function A11yToggle({
  label,
  description,
  icon,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  icon: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button type="button" className="ds-a11y-toggle" aria-pressed={checked} onClick={() => onChange(!checked)}>
      <span className="ds-a11y-toggle-text">
        <span className="ds-a11y-row-label">
          {icon}
          <span>{label}</span>
        </span>
        <span className="ds-a11y-help">{description}</span>
      </span>
      <span aria-hidden="true" className="ds-switch" data-on={checked ? "" : undefined} />
    </button>
  );
}

/** The round button that opens the panel. Always the first control on a page. */
export function A11yButton(props: Omit<ComponentPropsWithoutRef<"button">, "children" | "aria-label">) {
  return (
    <IconButton label="Accessibility settings" aria-haspopup="dialog" {...props}>
      <AccessibilityIcon />
    </IconButton>
  );
}

// ------------------------------------------------------------------ the panel

export type A11yPanelProps = {
  open: boolean;
  onClose: () => void;
  onCloseAutoFocus?: () => void;
  tone?: SheetTone;
  subtitle?: string;
  /**
   * Which optional sections to show. All on by default. A site with almost
   * no body text, links or images (404games) turns these off rather than
   * offer switches that do nothing.
   */
  features?: { links?: boolean; cursor?: boolean; images?: boolean; reader?: boolean };
  /** Site-specific sections, shown first. Build them from A11ySection and A11yToggle. */
  children?: ReactNode;
  /** Wording that differs by site. */
  copy?: { dyslexicFont?: string; textSize?: string; textSizeHelp?: string; reduceMotion?: string };
  /** Called after any setting changes — 404games plays its UI tick here. */
  onChange?: () => void;
};

/**
 * The accessibility panel. Reads and writes the nearest A11yProvider.
 *
 * The three sites each had a copy of this, already different: the studio and
 * shop had a page reader the games lacked; the games had its own switch and
 * segmented control styles.
 */
export function A11yPanel({
  open,
  onClose,
  onCloseAutoFocus,
  tone = "green",
  subtitle = "Adjust reading and interaction preferences.",
  features,
  children,
  copy,
  onChange,
}: A11yPanelProps) {
  const { settings, patchSettings, reset } = useA11y();
  const show = { links: true, cursor: true, images: true, reader: true, ...features };

  const [readerStatus, setReaderStatus] = useState<"idle" | "reading" | "unsupported">("idle");
  // Bumped whenever reading is stopped or restarted, so a chunk queued by an
  // earlier run can tell it has been superseded and not speak.
  const sessionRef = useRef(0);

  const stopReading = () => {
    sessionRef.current += 1;
    try {
      window.speechSynthesis?.cancel();
    } catch {
      // Web Speech API unavailable
    }
    setReaderStatus((s) => (s === "unsupported" ? s : "idle"));
  };

  const startReading = () => {
    const synth = window.speechSynthesis;
    if (!synth || typeof SpeechSynthesisUtterance === "undefined") {
      setReaderStatus("unsupported");
      return;
    }
    const text = getReadableText();
    if (!text) return;
    stopReading();
    const session = sessionRef.current;
    const chunks = chunkText(text);
    setReaderStatus("reading");
    const speak = (i: number) => {
      if (sessionRef.current !== session) return;
      if (i >= chunks.length) {
        setReaderStatus("idle");
        return;
      }
      const utterance = new SpeechSynthesisUtterance(chunks[i]);
      utterance.rate = clamp(settings.readerRate, 0.5, 2);
      utterance.lang = document.documentElement.lang || "en";
      utterance.onend = () => speak(i + 1);
      utterance.onerror = () => setReaderStatus("idle");
      try {
        synth.speak(utterance);
      } catch {
        setReaderStatus("idle");
      }
    };
    speak(0);
  };

  // Closing the panel, or leaving the page, stops the voice.
  useEffect(() => {
    if (!open) stopReading();
    return stopReading;
  }, [open]);

  const set = (patch: Parameters<typeof patchSettings>[0]) => {
    patchSettings(patch);
    onChange?.();
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      onCloseAutoFocus={onCloseAutoFocus}
      tone={tone}
      title="Accessibility"
      subtitle={subtitle}
      closeLabel="Close accessibility settings"
    >
      <div className="ds-a11y">
        {children}

        <A11ySection title="Typography">
          <A11yToggle
            label="Dyslexia-friendly font"
            description={copy?.dyslexicFont ?? "Switches to a more readable typeface across the site."}
            icon={<AaIcon />}
            checked={settings.dyslexicFont}
            onChange={(dyslexicFont) => set({ dyslexicFont })}
          />
          <div>
            <div className="ds-a11y-row">
              <span className="ds-a11y-row-label">
                <TextIcon />
                <span>{copy?.textSize ?? "Text size"}</span>
              </span>
              <Segmented value={settings.textSize} onChange={(textSize) => set({ textSize })} options={TEXT_SIZES} aria-label="Text size" />
            </div>
            {copy?.textSizeHelp !== "" && <p className="ds-a11y-help">{copy?.textSizeHelp ?? "Scales text and spacing."}</p>}
          </div>
        </A11ySection>

        {(show.links || show.cursor) && (
          <A11ySection title="Navigation">
            {show.links && (
              <A11yToggle
                label="Highlight links"
                description="Makes links easier to spot with a stronger underline."
                icon={<LinkIcon />}
                checked={settings.highlightLinks}
                onChange={(highlightLinks) => set({ highlightLinks })}
              />
            )}
            {show.cursor && (
              <div>
                <div className="ds-a11y-row">
                  <span className="ds-a11y-row-label">
                    <CursorIcon />
                    <span>Cursor size</span>
                  </span>
                  <Segmented value={settings.cursorSize} onChange={(cursorSize) => set({ cursorSize })} options={CURSOR_SIZES} aria-label="Cursor size" />
                </div>
                <p className="ds-a11y-help">Swaps the pointer for a larger one.</p>
              </div>
            )}
          </A11ySection>
        )}

        {show.images && (
          <A11ySection title="Content">
            <A11yToggle
              label="Hide images"
              description="Hides images while keeping the layout intact."
              icon={<ImageIcon />}
              checked={settings.hideImages}
              onChange={(hideImages) => set({ hideImages })}
            />
          </A11ySection>
        )}

        <A11ySection title="Motion">
          <A11yToggle
            label="Reduced motion"
            description={copy?.reduceMotion ?? "Pauses motion and scrolling effects."}
            icon={<MotionIcon />}
            checked={settings.reduceMotion}
            onChange={(reduceMotion) => set({ reduceMotion })}
          />
        </A11ySection>

        {show.reader && (
          <A11ySection title="Reader">
            <div className="ds-a11y-row">
              <span className="ds-a11y-row-label">
                <SpeakerIcon />
                <span>Read this page</span>
              </span>
              {readerStatus === "reading" ? (
                <Button tone="ghost" size="sm" onClick={stopReading}>
                  <StopIcon />
                  <span>Stop</span>
                </Button>
              ) : (
                <Button tone="ghost" size="sm" onClick={startReading}>
                  <PlayIcon />
                  <span>Play</span>
                </Button>
              )}
            </div>
            <div>
              <div className="ds-a11y-row">
                <label htmlFor="ds-a11y-reader-rate" className="ds-a11y-row-label">
                  Reader speed
                </label>
                <span className="ds-a11y-help ds-a11y-value">{settings.readerRate.toFixed(2)}×</span>
              </div>
              <input
                id="ds-a11y-reader-rate"
                className="ds-a11y-range"
                type="range"
                min={0.75}
                max={1.5}
                step={0.05}
                value={settings.readerRate}
                onChange={(e) => set({ readerRate: clamp(Number(e.target.value), 0.75, 1.5) })}
              />
              <p className="ds-a11y-help">
                {readerStatus === "unsupported" ? "Reading isn't supported in this browser." : "Uses your browser's built-in text-to-speech."}
              </p>
            </div>
            <div aria-live="polite" className="ds-sr-only">
              {readerStatus === "reading" ? "Reading page…" : "Stopped reading"}
            </div>
          </A11ySection>
        )}

        <div className="ds-a11y-row">
          <p className="ds-a11y-help">Saved on this device, for all the404labs sites.</p>
          <Button
            tone="ghost"
            size="sm"
            onClick={() => {
              stopReading();
              reset();
              onChange?.();
            }}
          >
            <ResetIcon />
            <span>Reset</span>
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
