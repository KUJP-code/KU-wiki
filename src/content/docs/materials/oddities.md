---
title: Oddities
description: A list of miscellaneous oddities I felt needed to be documented
editUrl: false
---

## Separate schedules for each school

Jayson raised the possiblility of schools within an organisation needing their own offset to the organisation schedule.

As the lessons for a given day are currently calculated based on the start date of the organisation's plan, we currently don't have a way to allow this.

My judgement call is that this is reasonably unlikely, and if it turns out to be it'll be easy enough to add, so not adding it now.

If we end up needing to, right now I'm thinking a week_offset integer field (and day_offset if necessary) on the school, then taking it into account in a teacher's day_lessons method.
