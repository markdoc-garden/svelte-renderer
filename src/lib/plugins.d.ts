import type { Node } from "@markdoc/markdoc";

export type PluginReturn = {
  [others: string]: unknown;
  node: Node;
};

export type Plugin = (node: Node) => PluginReturn;
