import { defineConfig } from "vite";

// Only serves the preview page (npm run dev). The package itself is built by
// scripts/build-tokens.mjs and tsc — see package.json.
export default defineConfig({
  root: "preview",
  server: { host: "127.0.0.1", port: 5180, fs: { allow: [".."] } },
});
