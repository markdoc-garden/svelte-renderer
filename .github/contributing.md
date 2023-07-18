# Contributing guidelines

Heya there, o/. This is the base repository for the `svelte-renderer` package. It aims to provide a smooth interface for reading the code for the latest, released version of the package. `svelte-renderer` acts as a binding point between using [Markdoc](https://markdoc.dev) for your templating needs and [Svelte](https://svelte.dev) as your base Javascript framework. It allows you to render markdoc directly using a pre-processor or use a svelte component to render generated markdown trees - as and when necessary.

The [Open Source Guides website](https://opensource.guide) has a collection of resources for individuals, communities, and companies. These resources help people who want to learn how to run and contribute to open source projects.

## Quick setup

#### Prerequisites

```yaml
# it may not work without these
node: "^>=18.0.0"
pnpm: "^8.6.2"
```

#### Setting up your local repository

This project follows the official [Sveltekit package guidelines](https://kit.svelte.dev/docs/packaging), while modifying certain basic components like script names. Using `pnpm install` from the top level helps you get started.

```bash
git clone [...] && cd [...]
pnpm install
```

To automatically handle merge conflicts in pnpm-lock.yaml, you should run the following commands locally.

```bash
pnpm add -g @pnpm/merge-driver
pnpm dlx npm-merge-driver install --driver-name pnpm-merge-driver --driver "pnpm-merge-driver %A %O %B %P" --files pnpm-lock.yaml
```

#### Useful scripts

This section mainly addresses what scripts are used for, in this repository. You'll find all of them under `package.json/scripts`.

Scripts prefixed with `app:*` are related to the website for documenting and handling the changes about the package. It lives under `src/routes`.

```json5
{
  "app:dev": "vite dev",
  "app:build": "vite build",
}
```

Scripts prefixed with `package:*` are related to the package itself, that lives under `src/lib`.

```json5
{
  "package:dev": "svelte-package --watch",
  "package:build": "svelte-package",
}
```

Certain package-prefixed scripts deal with the publish/documenting process of the package itself.

- `package:change` - Check out the [changesets documentation](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md) for this command. Feel free to add more detailing in the generated changeset itself!

```json5
{
  "package:change": "changeset",
  "package:version": "pnpm format && changeset version",
  "package:publish": "pnpm package:distribute && changeset publish",
  "package:distribute": "svelte-kit sync && svelte-package && publint",
}
```

The rest of the scripts include miscellaneous tasks like linting, formatting and type-checking.

```json5
{
  "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
  "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
  "lint": "prettier --plugin-search-dir . --check . && eslint .",
  "format": "prettier --plugin-search-dir . --write .",
}
```

## A recommended workflow

At it's core, every little change - regardless of how big or small it is, should follow the pattern of **one issue, one branch, and one pull request**. The main aim is that at any time down-the-line you can traverse your way from a piece of code via changesets to a commit on a pull request, and issue explaining the motivations behind it. We use changesets to facilitate this process.

To start working, initiate an issue. This helps for a flow of ideas to pass between people on any matter, regardless of how minor it is, or if you have a solution ready. Follow it up with an appropirately named branch, according to [the branch conventions](#branch-conventions). Once you are done, create a changeset to describe your changes, if it is a patch, minor or major change, with the `package:change` command, regardless of where you've made the changes. You do not need to create one if it's about the app itself.

Once you are done, open a pull request to the `dev` branch, not to `main` ([branch conventions strike again](#branch-conventions)) - and your code will be up for review. Once it gets satisfactorily reviewed, it can be merged. **However**, in the case of it being a part of a feature chain, or a singular planned bump - it gets merged to an integration branch which is later merged to `dev`.

## Branch conventions

#### `main`

The main branch points to a mirror of the package, currently shipped to npm for distribution. This is to allow for easy reading of the source code at any particular point of time. Any project using a package usually point to this.

#### `dev`

The in-development branch for this project usually reflects the "latest" version of code, and acts as a base to resolve merge conflicts.

#### `feat/[name]`

These are feature branches, usually created to work on any changes, and are made to make a pull-request from. These include any type of individual change, addressing an issue.

#### `integration/[version]`

These are integration branches usually used to act as a base for individual feature branches that result into a single bump. While uncommon for smaller changes, it can be helpful to map roadmaps with pull-requests.

## Releasing the package

This process is automated with the help of the Changesets bot and github action. Once ready to release, you can merge the `dev` branch into the `main` branch to trigger an automated publishing pull-request. Head over to the latest `VERSION PACKAGES` pull-request and merge it.
