---
title: Cron Jobs
description: List of all our cron jobs, times and what they do.
editUrl: false
---

## List of Cron Jobs

| Name                                      | App         | Time           | Short Description                   |
| ----------------------------------------- | ----------- | -------------- | ----------------------------------- |
| [SolidQueue Cleanup](#solidqueue-cleanup) | Event & LMS | Sun @ midnight | Removes completed jobs > 7 days old |

We also have an unofficial 'cron' job that needs to be done at the end of each seasonal event. Every student who attended that event needs to have their 'first_seasonal' column toggled to `false`, or they won't get a repeater discount for the next seasonal event. This should be done after all invoices are confirmed to avoid applying the discount to the event which just finished.

## Details

### SolidQueue Cleanup

SolidQueue is our async job backend, backed by postgres so we don't need a separate server to run Redis. Since all jobs are persisted to the DB, you can end up with huge tables over time.

While there is a setting to delete finished jobs after a certain period, you need a cron job to actually run the process which does the cleaning. This is that job. It's run by `ClearFinishedTransactionsJob` in both the LMS and event site.

The period to wait before clearing a finished job is in `config/initializers/solid_queue.rb`
