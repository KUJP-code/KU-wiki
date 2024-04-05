---
title: Oddities
description: A list of miscellaneous oddities I felt needed to be documented
editUrl: false
---

## Charts disappearing

If your charts generated with @stimulus-components/chartjs suddenly start disappearing, check application.js in the 'javascript/controllers' folder to make sure it's still being registered and hasn't been removed/overriden by `rails g stimulus <controllername>`.

## Separate schedules for each school

Jayson raised the possiblility of schools within an organisation needing their own offset to the organisation schedule.

As the lessons for a given day are currently calculated based on the start date of the organisation's plan, we currently don't have a way to allow this.

My judgement call is that this is reasonably unlikely, and if it turns out to be it'll be easy enough to add, so not adding it now.

If we end up needing to, right now I'm thinking a week_offset integer field (and day_offset if necessary) on the school, then taking it into account in a teacher's day_lessons method.

## Student ID uniqueness

Ideally we'd have globally unique student IDs, but since we're working with a bunch of different schools with different existing ID systems we want to let them use that's not feasible. As a compromise, student IDs are validated to be unique within that student's school.

On a related note, if a student ID isn't provided/they don't have a student ID system, we'll generate one for them based on the student's DB id, school id and a string of random characters.

## Themes

Themes can be set in `tailwind.config.js` by adding them as decribed by the [plugin docs](https://github.com/crswll/tailwindcss-theme-swapper) and naming them like 'org\_<org_id>'.

You also need to add them to the `org_theme` helper by including the id of the organisation you added a theme for in the `org_themes` array.

And to allow admins to switch between them at will, add the theme name to the data-theme attribute of a new button in the 'admins/theme_select' partial.
