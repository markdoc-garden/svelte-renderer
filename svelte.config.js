import autoAdapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/kit/vite";

const SVELTE_EXT = ".svelte";
const MARKDOC_EXT = ".markdoc";

const adapter = autoAdapter();
const alias = {
  "@static/*": "static/*",
  "@components/*": "src/components/*",
  "@content/*": "src/content/*",
  "@layouts/*": "src/layouts/*",
  "@lib/*": "src/lib/*",
  "@markdoc/*": "src/markdoc-pipe/*",
  "@routes/*": "src/routes/*",
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [vitePreprocess()],
  extensions: [SVELTE_EXT, MARKDOC_EXT],
  kit: { adapter, alias },
};

export default config;
