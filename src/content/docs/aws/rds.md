---
title: RDS
description: A guide to managing our RDS database.
editUrl: false
---

## Analyze && Vacuum

RDS has automatic settings for these, they seem to be fine so far. Apparently can be insufficient when the DB gets really big though.

If you need a quick way to check the dead tuple/vacuum/analyze stats, open up a Rails console session through SSH and use

```ruby
ActiveRecord::Base.connection.exec_query("")
```

with

```sql
SELECT
relname AS TableName
,n_live_tup AS LiveTuples
,n_dead_tup AS DeadTuples
,last_autovacuum AS Autovacuum
,last_autoanalyze AS Autoanalyze
FROM pg_stat_user_tables;

```

as the passed string.
