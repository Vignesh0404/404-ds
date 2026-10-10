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
