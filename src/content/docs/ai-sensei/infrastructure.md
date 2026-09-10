---
title: Infrastructure
description: Proposed AI-Sensei application hosting and storage.
editUrl: false
sidebar:
  order: 4
---

```text
Rails 8.1 / Ruby 4
├── PostgreSQL / RDS
├── Active Storage
│   └── S3
├── Vimeo
│   └── Main lesson videos
└── Elastic Beanstalk
    └── Rails application server
```

## Application

- Rails 8.1
- Ruby 4
- Puma
- Initially one application instance
- Expected instance size around `t3.medium`, potentially `t3.large`

## Database

- PostgreSQL
- Hosted on Amazon RDS
- Stores application data and Active Storage metadata

## File Storage

Active Storage backed by Amazon S3.

Used for:

- PDFs
- Worksheets
- Lesson resources
- Background images
- Intro images
- Vocabulary images
- Vocabulary audio clips

Files are not stored directly in PostgreSQL.

## Video

Main lesson videos hosted on Vimeo.

Rails stores:

- Vimeo URL / ID
- Video title
- Ordering
- Chapter timestamps
- Teacher guide metadata

Vimeo handles video streaming and delivery.

## AWS

Region:

- `ap-northeast-1` / Tokyo

Likely services:

- Elastic Beanstalk — Rails application
- RDS PostgreSQL — database
- S3 — uploaded lesson assets

## Development

- PostgreSQL locally
- Active Storage uses local disk
- Production switches Active Storage to S3

## Future / Optional

Potential additions if required:

- Automated RDS backups
