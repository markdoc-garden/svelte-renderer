import { FileFinder } from "./file_loader.js";

import type { Processed, PreprocessorGroup } from "svelte/compiler";

export const markdocPreprocess = (config: MarkdocProcessorConfig) =>
  new MarkdocProcessor(config).preprocessor;
export { default as Renderer } from "./Renderer.svelte";
export { processMarkdown } from "./processor.js";

export type { MarkdocProcessorConfig };
export type { Plugin, PluginReturn } from "./plugins.js";

type MarkdocProcessorConfig = {
  extensions: string[];
  markdocConfigPath: string;
};

type MarkupReturn = void | Processed;

class MarkdocProcessor {
  private options: MarkdocProcessorConfig;
  private defaultOptions: MarkdocProcessorConfig = {
    extensions: [".mdoc", ".markdoc"],
    markdocConfigPath: "src/markdocConfigPath.",
  };

  constructor(markdocConfig: Partial<MarkdocProcessorConfig>) {
    this.options = { ...markdocConfig, ...this.defaultOptions };
  }

  public preprocessor: PreprocessorGroup = { markup: this.markup };

  private markup({ content = "", filename = "" }): MarkupReturn {
    const fileNameCondition = (suffix: string) => filename.endsWith(suffix);
    if (!this.options.extensions.find(fileNameCondition)) return;
    return { code: this.useSvelteRenderer(content) };
  }

  private useSvelteRenderer(content: string) {
    return `<script lang="ts">
  import { Renderer, processMarkdown } from "@mdoc-garden/svelte-renderer";
  import { components, config, plugins } from "${this.findConfigFilePath()}";

  const content = \`${content}\`;
  const input = { content, components, config, plugins };
</script>

{#await processMarkdown(input) then renderableTree}
  <Renderer {renderableTree} {components} />
{/await}
`;
  }

  private async findConfigFilePath() {
    const message = `The Markdoc config file could not be found. Please re-check the provided path: ${this.options.markdocConfigPath}`;
    const finder = new FileFinder(this.options.markdocConfigPath, message);
    return finder.getRelativePath();
  }
}
