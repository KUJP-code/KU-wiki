---
title: Refactoring
description: Guidelines for refactoring old projects.
editUrl: false
---

Find an issue [here](https://github.com/KUJP-code/db_prototype_v2_official/issues) or [here](https://github.com/Brett-Tanner/setsumeikai_calendar/issues). Start with an easy or two to get an idea of the language/codebase, then move up to mediums and hards if you'd like. If you find any bugs yourself or want to suggest improvements/changes, feel free to open an issue on either of those links as well.

1. If there aren't any tests covering the current behaviour, write them. If you're adding a new feature, write tests for it first then write the code that makes them pass.
2. Enforce separation of concerns. Presentation logic in Views, data fetching/processing in Models and Controllers only pass information between the other two.
3. For bonus points, try to find stuff that's either not used anymore and remove it, or stuff that has the same/similar functionality but is duplicated many different places.
   - A good example of the second one would be dates and times, I know there are a bunch of different `#strftime` related methods/just plain uses of `#strftime` floating around views and models which could be combined into Date/Time concerns
4. Simplify and modularize. If Rubocop is yelling at you, look up why its yelling at you and that's usually a good place to start. Generally, ensure logical flow/groupings and prefer short methods with a single responsibility.
5. Consider performance. Are there N+1 queries? Are we fetching more data than we need? Do you need every column from a database table?
6. Test your work by using it like a user would. Do a run through for each user role which could possibly interact with the area being refactored.
7. Submit a pull request. Nice job making it this far!

## Prerequisites

If it's your first time working on the Seasonal site, you'll want to follow the directions for getting it set up locally in [WSL Dev Environment](../wsl_dev_env).

If using VSCode install the RubyLSP and Rubocop extensions, as well as Prettier. If you're not using VSCode you'll need to at least find a way to run Prettier before submitting your pull request.

The two ruby extensions will give you a lot of handy feedback on any mistakes you make, as well as suggesting potential improvements in some cases.

Prettier enforces consistent formatting rules, so we're not all formatting things differently and getting annoyed at pointless stuff like others' formatting.

## 1 - Writing Tests

## 2 - Separation of Concerns

## 3 - Pruning

### DRY

Don't repeat yourself! Duplicated code makes files harder to read, and increases the possibility of bugs when changes need to be made in many places rather than just one. Having said that, you'll find about a billion examples of me doing just that because I didn't know any better.

For example, here is what the filter headers of the table in the Inquiries#index view looked like before refactoring:

#### Old Inquiries#index filter headers

![Inquiry index table](/refactoring/DRY_bad.avif)

The file was about 3 screens long cos of these, and if you wanted to make a change to how filter headers worked you needed to make a change to each of them, without missing any (also in the 3-4 other views which use filter headers, scattered across the project). Compare that to the index view after, and the `filter_header.html.erb` partial I extracted the repeated code into:

#### New index view

![New inquiry index table](/refactoring/DRY_good.avif)

The whole view now fits in half a screen, and the filter headers take up all of 4 lines (5 if you count the `columns` variable shared with the regular headers). Much easier to read.

#### New `filter_header` partial

![filter_header partial](/refactoring/DRY_partial.avif)

Now that the logic for filter headers is all concentrated in one place, it's trivial to make changes to every instance of them in the site. Being at the lowest level of indentation as opposed to nested in a table also helps a lot with readability.

## 4 - Simplify/Modularize

## 5 - Performance

## 6 - User Testing

## 7 - Submit a Pull Request
