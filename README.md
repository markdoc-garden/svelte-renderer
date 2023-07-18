<h1 align="center">@markdoc-garden/svelte-renderer</h1>

> Packaging tool use to transpile between [Markdoc](https://markdoc.dev) for your templating needs and [Svelte](https://svelte.dev) as your base Javascript framework. It allows you to render markdoc directly using a pre-processor or use a svelte component to render generated markdown trees - as and when necessary.

<h2 align="center">Features</h2>

- ✅ Offers a svelte component to render markdoc snippets.
- ✅ Offers a svelte preprocessor to render markdoc files as svelte files.
- ✅ Integrates with svelte-kit with ease, along with layouts.
- ✅ Uses a simple config file to get markdoc configuration and custom svelte commponents.
- ✅ Provides a plugin API with basic typing to parse [markdoc-rendered, post-parsing AST](https://markdoc.dev/docs/render#parse).
- ✅ Pipes results from frontmatter and plugins into variables.
- ✅ First class typescript usage, follows conventions set by svelte-kit documentation.

<h2 align="center">Usage</h2>

### Setup

- `NPM` - `npm install --save-dev @markdoc-garden/svelte-renderer`
- `YARN` - `yarn add --dev @markdoc-garden/svelte-renderer`
- `PNPM` - `pnpm add --save-dev @markdoc-garden/svelte-renderer`

### As a preprocessor

The first step is to add it to your svelte configuration. NOTE, that this preprocessor _must_ be passed before `vitePreprocess` and extensions must include _only_ those files that are markdoc pages.

```js
// svelte.config.js
import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/kit/vite";
import { markdocPreprocess } from "@markdoc-garden/svelte-renderer";

const extensions = [".md", ".markdoc"];

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [markdocPreprocess({ extensions }), vitePreprocess()],
  extensions: [...extensions, ".svelte"],
  kit: {
    adapter: adapter(),
  },
};

export default config;
```

The full reference for the passed configuration to the preprocessor is:

```js
import { markdocPreprocess } from "@markdoc-garden/svelte-renderer";

const config = {
  preprocess: [
    markupPreprocess({
      // Mandatory. These files are passed as markdoc pages
      extensions: [".md", ".markdoc"],
      // Optional, defaults to the given value. Refers an absolute path to your exported config file.
      markdocConfigPath: "src/lib/markdoc.config.js",
    }),
  ],
};
```

The second step is to add your own markdoc config file. You can configure the path to it, as given, and it must have three KEY exports.

```js
// src/lib/markdoc.config.js
import type { Plugin } from "@markdoc-garden/svelte-renderer";
import type { Config } from "@markdoc/markdoc";
import type { SvelteComponent } from "svelte";

export const plugins: Plugin[] = [];
export const config: Config = {};
export const components: Record<string, typeof SvelteComponent> = [];
```

### In a svelte-component

You can render a markdoc-renderable-tree within a svelte component too! Simply follow the markdoc documentation on [how to generate a Renderable Tree Node](https://markdoc.dev/docs/render) and plug that into props along with an Object of custom svelte components.

```svelte
<script>
  import { Renderer } from "@markdoc-garden/svelte-renderer";
  import md from "@markdoc/markdoc";

  import Button from "@components/Button.svelte";
  import Notification from "@components/Notification.svelte";

  const components = {
    button: Button,
    notification: Notification
  }

  const text = `# Hey, this is some markdoc!`;
  const ast = md.parse(text);
  const renderabletree = md.transform(ast);
</script>

<Renderer content={renderabletree} {components}>
```

### Piping variable values from frontmatter

Any values declared in the frontmatter of your markdoc file will be available as a variable under the `$frontmatter.[variable]` scope.

```markdown
---
title: Simbaaaaa!
---

# {% $frontmatter.title %}
```

### Layouts

Since it transpiles to simple svelte components, you can add layouts and more! Simply use the standard `+layout` structure of svelte-kit and it _simply_ works!

### Plugins

TBD(ocumented).
