import "./preview.css";
import tokens from "../dist/tokens.json";
import tones from "../dist/tones.json";

const entries = (group) => Object.entries(tokens[group]).filter(([key]) => !key.startsWith("$"));
const el = (tag, props = {}, children = []) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
};

// Same WCAG maths as scripts/lib.mjs, repeated here only to print the ratios
// next to each tone — the build's contrast test is what actually enforces them.
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => ((Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05)).toFixed(2);

const section = (eyebrow, title, body) =>
  el("section", {}, [el("p", { className: "eyebrow", textContent: eyebrow }), el("h2", { textContent: title }), body]);

const colours = el(
  "div",
  { className: "grid" },
  entries("color").map(([name, token]) => {
    const chip = el("div", { className: "swatch-chip" });
    chip.style.background = token.$value;
    return el("div", { className: "swatch" }, [
      chip,
      el("div", { className: "swatch-meta" }, [el("b", { textContent: name }), el("span", { textContent: token.$value })]),
    ]);
  }),
);

const toneCards = el(
  "div",
  { className: "tones" },
  Object.entries(tones).map(([name, t]) => {
    const field = el("input", { placeholder: "Field placeholder" });
    field.setAttribute("aria-label", `Example field on ${name}`);
    const card = el("div", { className: "tone" }, [
      el("p", { className: "eyebrow", textContent: `data-tone="${name}"` }),
      el("h3", { textContent: "Accent headline" }),
      el("p", { textContent: "Body text sits in the tone's foreground colour." }),
      el("p", { className: "muted", textContent: "Muted text is derived to pass AA on this tone." }),
      field,
      el("div", { className: "row" }, [
        el("button", { className: "pill", type: "button", textContent: "Rest" }),
        el("button", { className: "pill is-hover", type: "button", textContent: "Hover" }),
        el("button", { className: "pill ring", type: "button", textContent: "Focus" }),
      ]),
      el("p", {
        className: "ratios",
        textContent: `text ${ratio(t.fg, t.bg)} · muted ${ratio(t["fg-muted"], t.bg)} · accent ${ratio(t.accent, t.bg)} · focus ${ratio(t.focus, t.bg)}`,
      }),
    ]);
    card.dataset.tone = name;
    return card;
  }),
);

const typeRows = el("div", {}, [
  ...entries("font").map(([name]) => {
    const sample = el("p", { className: "type-sample", textContent: "the404labs — small apps, free to use" });
    sample.style.cssText = `font-family: var(--font-${name}); font-size: 2rem;`;
    return el("div", { className: "type-row" }, [el("code", { textContent: `font-${name}` }), sample]);
  }),
  ...entries("text")
    .reverse()
    .map(([name]) => {
      const display = name.startsWith("display") || name === "hero-body";
      const sample = el("p", {
        className: "type-sample",
        textContent: display ? "404 not found" : "The quick brown fox jumps over the lazy dog",
      });
      sample.style.cssText = `font-family: var(--font-${display ? "display" : "body"}); font-size: var(--text-${name}); line-height: 1.1;`;
      return el("div", { className: "type-row" }, [el("code", { textContent: `text-${name}` }), sample]);
    }),
]);

const radii = el(
  "div",
  { className: "scale" },
  entries("radius").map(([name, token]) => {
    const box = el("div", { className: "radius-box" });
    box.style.borderRadius = `var(--radius-${name})`;
    return el("div", {}, [box, el("code", { textContent: `radius-${name} · ${token.$value}` })]);
  }),
);

document.getElementById("content").append(
  el("p", { className: "eyebrow", textContent: "@the404labs/ds" }),
  el("h1", { className: "page-title", textContent: "the404labs design system" }),
  section("Tier 1", "Colour primitives", colours),
  section("Tier 2", "Tones", toneCards),
  section("Type", "Families and scale", typeRows),
  section("Shape", "Radii", radii),
);
