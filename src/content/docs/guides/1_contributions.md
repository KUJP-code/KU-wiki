---
title: Contributing to the wiki
description: A guide to creating your own wiki entries.
editUrl: false
---

## Getting started

- We're using `bun` rather than `npm`/`pnpm`/`yarn` because it's fast, an all-in-one package manager/test runner/js runtime and because I like shiny new things.
- You can install it [here](https://bun.sh/) or by copying this into your terminal `curl -fsSL https://bun.sh/install | bash`

## Adding a Page

1. Create a `.md` or `.mdx` file in the appropriate topic directory of `src/content/docs`, **not in the docs directory itself**
2. Add frontmatter to the new page per [Starlight Frontmatter Documentation](https://starlight.astro.build/reference/frontmatter/). Title and description are the minimum. Starlight will automatically use the title given in frontmatter as the page title.
3. Add your content, remembering not to use &lt;h1&gt;, and that &lt;h2&gt;/&lt;h3&gt; will be automatically added to the sidebar as primary/secondary anchor links.
4. Commit your changes, push them to your branch and create a pull request for the admin to merge to the main branch.

## Fun Markdown features

- Standard [Markdown](https://www.markdownguide.org/cheat-sheet/) syntax applies
- Headings will automatically be generated with anchor links
- &lt;h2&gt; and &lt;h3&gt; are automatically added to the table of contents. Don't use &lt;h1&gt;, it's reserved for the main page title
- Use `&lt;` and `&gt;` for &lt; &gt; outside code blocks
- In code blocks, you can put the name of the relevant language after the opening backticks and Starlight will handle syntax highlighting for you.
