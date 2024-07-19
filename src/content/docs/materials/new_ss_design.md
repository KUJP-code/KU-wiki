---
title: New SS Design
description: Notes on designing new SS
---

For each of the sections, a good way to get a list of all the fields would be to download the sample CSV from the import page. They seem to be pretty comprehensive.

Will need to have org-specific translations. Maybe a way to add it to I18n as a sub-hash?

## Addons

- Need to track what extras they've paid for (like online, keep up)

## Announcements

- We'll use the same model for staff and parent announcements
- Need filters to narrow down recipients
  - For parent announcements will need to filter by child info
- Will want to set start and expiry dates

## Contracts - 契約

These can be monthly (roll over each month, the main contract for regular attendance) or individual (mostly used for seasonal schools). They need to be rolled over monthly rather than one big one because parents are billed monthly, and we don't have any rules for how to charge if they change partway through a month.

Probably makes sense to have some kind of parent contract that determines how long they roll over for? Or if it's just that just make it a field on the student record?

They can have multiple courses, which determine how many days the kids can attend, and sales which are one-off purchases not affecting attendance. Can't apply sales to the monthly contract because they'd roll over to the next month (can probably solve that by just not copying sales right?).

- Can be paused for up to 2 months each year, multiple pauses allowed
  - Probably implemented as a jsonb col that stores the start and end dates
  - When one is added or edited the end date of the contract is auto updated
  - Will need a validation checking the total pause length is <= 2 months in a year

## Courses - コース

These are anything affecting schedule/attendance, like kindy 5 hour course or seasonal 3 course. They can be selected from a template then added to a contract.

An SM requested that you be able to set an attendance limit for the whole kindy course, rather than individually for 3.5 hour and 5 hour courses.

## Elementary schools

Kids need to be linked to/searchable by elementary school, and the schools need to have a 'release time' to make calculating the bus schedule easier.

## Emails

- Non-admin users may need to be able to schedule/search scheduled email jobs, probably make a separate queue to enable this.
- Need to be able to create email templates for sending to multiple recipients
  - Need to be able interpolated in the subject and body
  - Will probably want to make a standard set of instance variables available which methods can be called on
  - And list them on the template form
  - Need to be able to copy a past template as basis for a new one
  - templates should be searchable

## Lessons - レッスン

These are templates for creating the rooms, which are created for each day for each school each month.

## Rooms - ルーム

These are the things students can attend, created from lessons.

## Search Forms

Will need a way to save and retrieve search filters.

- Could be in a JSONB col on that user
- Or in a separate table per model
- Or a combined table for all models
- Or, something like prepared statements or materialized views (basically an internal DB thing)

## Students

Students seem to have basically everything on them, especially the search form allows searching for stuff like parent/contract details which would probably be better to search from a controller specific to them.

Need to have some stuff configurable per organisation, like maybe levels? Also additional fields for details (maybe, will talk about likelihood of unique stuff here).

### New fields

- Gender (including unknown)
- Join/withdrawal dates
- Card status/number
- Pickup/dropoff location

## Parents

### New fields

- Payments related details
- Multiple emails
