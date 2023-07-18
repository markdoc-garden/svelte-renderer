import autoAdapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/kit/vite";

const SVELTE_EXT = ".svelte";
const MARKDOC_EXT = ".markdoc";

const adapter = autoAdapter();
const alias = {
  "@static/*": "static/*",
  "@components/*": "src/components/*",
  "@routes/*": "src/routes/*",
  "@lib/*": "src/lib/*",
  "@markdoc-garden/svelte-renderer": "src/lib/index",
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [vitePreprocess()],
  extensions: [SVELTE_EXT, MARKDOC_EXT],
  kit: { adapter, alias },
};

export default config;
