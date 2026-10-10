// Scales a desktop-tuned pixel value down fluidly for narrower viewports
// instead of snapping between fixed breakpoint sizes. `basePx` is reached at
// `basisWidth` (our page container max) and holds steady above it. Below
// `minWidth` (our smallest supported phones) the size holds steady at
// `basePx * minRatio`. Between those two widths it interpolates linearly, so
// typical phone viewports (~360-430px) land close to minRatio instead of
// overshooting straight to it the way a slope anchored at zero width would.
export function fluidPx(basePx: number, minRatio = 0.55, basisWidth = 1440, minWidth = 360) {
  const minPx = basePx * minRatio;
  const slope = (basePx - minPx) / (basisWidth - minWidth);
  const intercept = minPx - minWidth * slope;
  const preferredVw = slope * 100;
  return `clamp(${minPx.toFixed(1)}px, ${intercept.toFixed(1)}px + ${preferredVw.toFixed(3)}vw, ${basePx}px)`;
}
