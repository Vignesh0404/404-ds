// Icons the shared components need. Stroke and fill are currentColor, so each
// takes the colour of the text around it.

export function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/** The four-point star that leads every sheet title, and the large a11y cursor. */
export function StarIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 28.8" fill="currentColor" aria-hidden="true">
      <path d="M12 0c.86 4.86 2.28 8.36 4.26 10.34C18.24 12.32 21.7 13.71 24 14.4c-2.3.69-5.76 2.08-7.74 4.06C14.28 20.44 12.86 23.94 12 28.8c-.86-4.86-2.28-8.36-4.26-10.34C5.76 16.48 2.3 15.09 0 14.4c2.3-.69 5.76-2.08 7.74-4.06C9.72 8.36 11.14 4.86 12 0z" />
    </svg>
  );
}

// The accessibility panel's icons. No width or height: the stylesheet sizes
// them, so they follow the text-size setting.

const stroke = { stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function AccessibilityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="6.4" r="2.4" fill="currentColor" />
      <path d="M4.5 9.6c2.6 1 5 1.5 7.5 1.5s4.9-.5 7.5-1.5M12 11.1v3.7M12 14.8l-3.4 5M12 14.8l3.4 5" {...stroke} strokeWidth={2.1} />
    </svg>
  );
}

export function AaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <text x="1" y="17" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="15" fill="currentColor">
        A
      </text>
      <text x="12.5" y="18.5" fontFamily="system-ui, sans-serif" fontWeight="500" fontSize="10.5" fill="currentColor">
        a
      </text>
    </svg>
  );
}

export function TextIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M4 12h10M4 18h7" {...stroke} />
    </svg>
  );
}

export function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9.5 14.5l5-5M8 16H6a4 4 0 0 1 0-8h2M16 8h2a4 4 0 0 1 0 8h-2" {...stroke} />
    </svg>
  );
}

export function CursorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 3l6 15.5 2.2-6.3L20.5 10 6 3z" {...stroke} />
    </svg>
  );
}

export function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="10" r="1.6" fill="currentColor" />
      <path d="M4 17l5-5 4 4 3-3 4 4" {...stroke} />
      <path d="M3 21L21 3" {...stroke} />
    </svg>
  );
}

export function MotionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" {...stroke} />
    </svg>
  );
}

export function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5l-5 4H4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M17 8.5a5 5 0 0 1 0 7" {...stroke} />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 4.5v15l13-7.5-13-7.5z" />
    </svg>
  );
}

export function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="1.5" />
    </svg>
  );
}

export function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12a8 8 0 1 1 2.7 6M4 12V6M4 12h6" {...stroke} />
    </svg>
  );
}
