---
title: Local Dev Environment
description: Explains how to set up a local dev environment for this project.
---

## WP Environment

:::caution
You probably don't need this bit, was just so I could check ReactPress actually worked. Unless it's very important to test something in the context of the WP site, just follow the [react environment](#react-environment) instructions below but clone the repo wherever you like.
:::

Download and install [LocalWP](https://localwp.com/) to run kids-up.jp locally.

Create a new site using the same PHP/MySQL version as the live site, the default/latest should be fine since Mike seems to do a good job of keeping it up to date.

Export all the site content to an `.xml` file using `Tools/Export` in the WP Admin dashboard, then download the theme by downloading its folder through the 'WP File Manager' plugin. The theme folder can be found at `kidsup/wp-content/themes/kidsup`.

Once you have the site content and the theme `.zip`, open the admin panel of your LocalWP site and got to `Tools/Import`. Install the WordPress importer and run it to grab the site content from your `.xml` file. Then navigate to `Appearance/Themes` and add the KidsUp theme.

Congrats, you now have a local dev site that mostly resembles the live one! Only difference is some of the stuff which depends on plugins won't work, like the sliders. But that shouldn't be necessary for our purposes anyway.

## React Environment

I prefer Bun over Node because it's faster, so you'll need to install that. Basically it's an alternative all-in-one JS runtime, replaces Node, npm, your testing framework etc. as an integrated whole.

You can find the latest install instructions on their [homepage](https://bun.sh/), or if you like copying and pasting random code from strangers just run `curl -fsSL https://bun.sh/install | bash` in your terminal of choice.

Then clone the [git repo](https://github.com/Brett-Tanner/setsumeikai_calendar.git) into `/kids-up/app/public/wp-content/reactpress/apps` (`kids-up` should be the parent folder of your LocalWP site) and run `bun install` then marvel at how fast it is.

`bun dev` will start the dev server with HMR so you can see your changes applied as you save them, `bun run build` will build the app into the `.dist` folder ready to be uploaded to WP and `bun test` will hopefully run the test suite to check you didn't break anything.
