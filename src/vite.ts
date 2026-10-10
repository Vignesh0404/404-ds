import type { Plugin } from "vite";
import { a11yInitScript } from "./a11y-init.js";

/**
 * Add to a site's vite.config.ts:
 *
 *   import { ds404 } from "@the404labs/ds/vite";
 *   export default defineConfig({ plugins: [react(), ds404()] });
 *
 * Injects the pre-paint accessibility script at the top of <head>, replacing
 * the inline <script> each site's index.html carried by hand.
 */
export function ds404(): Plugin {
  return {
    name: "the404labs-ds",
    transformIndexHtml() {
      return [{ tag: "script", children: a11yInitScript, injectTo: "head-prepend" }];
    },
  };
}
