---
title: Cron Jobs
description: List of all our cron jobs, times and what they do.
editUrl: false
---

## List of Cron Jobs

| Name                                      | App         | Time           | Short Description                   |
| ----------------------------------------- | ----------- | -------------- | ----------------------------------- |
| [SolidQueue Cleanup](#solidqueue-cleanup) | Event & LMS | Sun @ midnight | Removes completed jobs > 7 days old |

## Details

### SolidQueue Cleanup

SolidQueue is our async job backend, backed by postgres so we don't need a separate server to run Redis. Since all jobs are persisted to the DB, you can end up with huge tables over time.

While there is a setting to delete finished jobs after a certain period, you need a cron job to actually run the process which does the cleaning. This is that job. It's run by `ClearFinishedTransactionsJob` in both the LMS and event site.

The period to wait before clearing a finished job is in `config/initializers/solid_queue.rb`
