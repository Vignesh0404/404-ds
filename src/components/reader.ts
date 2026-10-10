// "Read this page": the text of the page's main content, in chunks a browser's
// speech synthesiser will accept. Moved here from the404labs.co's
// accessibility panel, unchanged in behaviour.

function isHiddenFromA11yTree(el: Element) {
  if (el.getAttribute("aria-hidden") === "true") return true;
  if (el.hasAttribute("hidden")) return true;
  const style = window.getComputedStyle(el);
  return style.display === "none" || style.visibility === "hidden";
}

function collectVisibleText(node: Node): string {
  let out = "";
  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      out += child.textContent ?? "";
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as Element;
      if (isHiddenFromA11yTree(el)) continue;
      out += collectVisibleText(el) + " ";
    }
  }
  return out;
}

/** Visible text of #content (or <main>), whitespace collapsed. */
export function getReadableText() {
  const main = document.getElementById("content") ?? document.querySelector("main");
  if (!main) return "";
  return collectVisibleText(main)
    .replace(/\s+/g, " ")
    .replace(/\s([.,!?;:])/g, "$1")
    .trim();
}

/** Splits on sentence ends where it can; long utterances get cut off by some browsers. */
export function chunkText(text: string, maxLen = 220) {
  if (text.length <= maxLen) return [text];
  const chunks: string[] = [];
  const sentences = text.match(/[^.!?]+[.!?]+\s*/g) ?? [text];
  let buf = "";
  for (const s of sentences) {
    if ((buf + s).length <= maxLen) {
      buf += s;
      continue;
    }
    if (buf) chunks.push(buf.trim());
    if (s.length > maxLen) {
      for (let i = 0; i < s.length; i += maxLen) chunks.push(s.slice(i, i + maxLen).trim());
      buf = "";
      continue;
    }
    buf = s;
  }
  if (buf) chunks.push(buf.trim());
  return chunks.filter(Boolean);
}
