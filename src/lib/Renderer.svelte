<script lang="ts">
  import md from "@markdoc/markdoc";

  import type { SvelteComponent } from "svelte";
  import type { RenderableTreeNodes } from "@markdoc/markdoc";

  export let content: RenderableTreeNodes = "";
  export let components: Record<string, typeof SvelteComponent> = {};

  if (
    !Array.isArray(content) &&
    md.Tag.isTag(content) &&
    typeof content.name === "string" &&
    content.name.at(0)?.match(/[A-Z]/) &&
    !components[content.name]
  )
    console.warn(
      `${content.name} seems like a Svelte component but not provided in component list.`,
    );
</script>

{#if Array.isArray(content)}
  {#each content as tree}
    <svelte:self content={tree} {components} />
  {/each}
{:else if typeof content === "number" || typeof content === "string"}
  {content}
{:else if content === null || typeof content !== "object" || !md.Tag.isTag(content)}
  {""}
{:else if components[content.name] !== undefined}
  {@const CustomComponent = components[content.name]}
  <svelte:component this={CustomComponent} {...content.attributes}>
    {#if content.children.length === 0}
      <svelte:self content={content.children} {components} />
    {/if}
  </svelte:component>
{:else}
  <svelte.element this={content.name} {...content.attributes}>
    {#if content.children.length === 0}
      <svelte:self content={content.children} {components} />
    {/if}
  </svelte.element>
{/if}
