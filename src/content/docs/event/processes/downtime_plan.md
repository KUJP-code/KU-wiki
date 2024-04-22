---
title: Downtime Plan
description: The plan for our May downtime to handle necessary maintenance.
edit_url: false
---

This downtime is necessary to:

- Switch our Domain Registrar from Onamae to Cloudflare
  - As a side effect, refresh our SSL cert which expires in late May
- Upgrade our EB platform version, as it moved from deprecated to unsupported in September
  - We'll be dockerizing the app to match the new LMS as a side effect of this
- Refresh the RDS SSL cert, which expires in late August
- Move the site from our Org AWS account to the parent company's account

Steps are listed in the order they're planned to be executed.

## 1. Backup RDS

1. Backup the DB manually when I start, get a local copy somehow as well.
2. Try to share it with the parent company account and initialize it independently of EB
3. Connect to EB once you get the app up and running on the parent company account
4. Verify the data is all still there & accessible, everything still works

## 2. Dockerize

We need both an EB platform upgrade and Ruby upgrade, both of which are currently problematic since we're not using Docker.

1. Get the current version of the app running on Docker
2. Deploy it successfully to EB on the parent company account
3. Upgrade to the latest Ruby version
4. Get that running properly

## 3. Switch Domain Registrar

We want to get off Onamae so we can actually read what the buttons do, so switching the domain to Cloudflare.

Will also need to get a new SSL cert once we switch, as the current one expires in late May. I assume the CNAME records used to validate it were deleted at some point.
