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

// Site chrome.

export function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" {...stroke} />
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" {...stroke} />
      <circle cx="12" cy="12" r="4" {...stroke} />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

export function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.66 5.58.66 11.85c0 5.02 3.26 9.28 7.77 10.78.57.1.78-.25.78-.55v-1.94c-3.16.69-3.83-1.52-3.83-1.52-.52-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.74 2.66 1.24 3.31.95.1-.73.4-1.24.72-1.52-2.52-.29-5.17-1.26-5.17-5.6 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.45.11-3.02 0 0 .95-.31 3.12 1.16.9-.25 1.87-.38 2.83-.38.96 0 1.93.13 2.83.38 2.17-1.47 3.12-1.16 3.12-1.16.62 1.57.23 2.73.11 3.02.73.79 1.17 1.8 1.17 3.04 0 4.35-2.65 5.31-5.18 5.59.41.35.77 1.05.77 2.12v3.14c0 .31.21.66.79.55 4.5-1.5 7.76-5.76 7.76-10.78C23.34 5.58 18.26.5 12 .5z" />
    </svg>
  );
}
