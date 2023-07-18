import type { Config as MarkdocTransformConfig } from "@markdoc/markdoc";
import type { Plugin, PluginReturn } from "./plugins.js";

import md from "@markdoc/markdoc";
import { parse as YAMLparse } from "yaml";

type MDProcessInputs = {
  content: string;
  config: MarkdocTransformConfig;
  plugins: Plugin[];
};

export const processMarkdown = (input: MDProcessInputs) => {
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
};
