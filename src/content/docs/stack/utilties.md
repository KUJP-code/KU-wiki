---
title: Utilities
description: A collection of useful utilities
editUrl: false
---

## Image Processing

Use `sharp-cli`. Install with `npm install -g sharp-cli` (it won't run on Bun, has a heavy dependence on Node).

Common usage is to `cd` into the folder containing your images, then run `npx sharp -i ./filename -o ./ -f "avif"`. You can append the `--nearLossless` option if you're unhappy with the resulting image quality, and it's possible to mass convert images using a blob matcher like `npx sharp -i './*.png' -o ./ -f "avif"`.

A full list of commands and options can be found [here](https://github.com/vseventer/sharp-cli), there are more than you can even think of.

