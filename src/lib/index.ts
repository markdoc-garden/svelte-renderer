import type { Config as MarkdocTransformConfig } from "@markdoc/markdoc";
import type { Processed, PreprocessorGroup } from "svelte/compiler";
import type { Plugin, PluginReturn } from "./plugins.d.ts";
import type { SvelteComponent } from "svelte";

import md from "@markdoc/markdoc";
import { parse as YAMLparse } from "yaml";
import { FileFinder } from "./loader.js";

export type { Plugin, PluginReturn };
export type MarkdocOptions = {
  extensions: string[];
  markdocConfigPath: string;
};

type MarkupReturn = void | Processed;
type MDProcessInputs = {
  content: string;
  config: MarkdocTransformConfig;
  components: SvelteComponent;
  plugins: Plugin[];
};

export { default as Renderer } from "./Renderer.svelte";

export class MarkdocProcessor {
  private options: MarkdocOptions;
  private defaultOptions: MarkdocOptions = {
    extensions: [".mdoc", ".markdoc"],
    markdocConfigPath: "src/markdocConfigPath.",
  };

  constructor(markdocConfig: Partial<MarkdocOptions>) {
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
  import { Renderer, MarkdocProcessor } from "@mdoc-garden/svelte-renderer";
  import { components, config, plugins } from "${this.findConfigFilePath()}";

  const content = \`${content}\`;
  const input = { content, components, config, plugins };
</script>

{#await MarkdocProcessor.processMarkdown(input) then renderableTree}
  <Renderer {renderableTree} {components} />
{/await}
`;
  }

  private async findConfigFilePath() {
    const message = `The Markdoc config file could not be found. Please re-check the provided path: ${this.options.markdocConfigPath}`;
    const finder = new FileFinder(this.options.markdocConfigPath, message);
    return finder.getRelativePath();
  }

  public static processMarkdown(input: MDProcessInputs) {
    const processPlugin = (returned: PluginReturn, plugin: Plugin) => {
      const result = plugin(returned.node);
      return { ...returned, ...result, node: result.node };
    };

    const node = md.parse(input.content);
    const contents: PluginReturn = input.plugins.reduce(processPlugin, { node });
    const { node: ast, ...metadata } = contents;

    const frontmatterString: string = ast.attributes?.frontmatter ?? "";
    const frontmatter: object = YAMLparse(frontmatterString) ?? {};

    return md.transform(contents.node, {
      variables: { frontmatter, metadata, ...input.config.variables },
      ...input.config,
    });
  }
}
