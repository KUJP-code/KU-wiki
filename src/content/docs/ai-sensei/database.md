---
title: Database Design
description: Draft AI-Sensei models, schema, and unresolved design choices.
editUrl: false
sidebar:
  order: 3
---

Still a draft. Main design uses memberships; Rails notes below put users directly on one organisation. Still to decide.

## Model Relationships

| Parent | Child | Relationship |
| --- | --- | --- |
| Organisation | School | contains (zero or more) |
| Organisation | Membership | has (zero or more) |
| User | Membership | has (zero or more) |
| School | CoursePlan | follows (zero or more) |
| Course | CoursePlan | scheduled by (zero or more) |
| Course | Week | contains (zero or more) |
| Week | WeeklyVocabularyItem | contains (zero or more) |
| Week | Lesson | contains (zero or more) |
| Lesson | Video | contains (zero or more) |
| Video | Chapter | contains (zero or more) |
| Lesson | LessonResource | provides (zero or more) |
| Story | StoryChapter | contains (zero or more) |

**Design decision still open**

---

## Core Structure

```text
Organisation
└── Schools
└── Course Plans
└── Course
└── Weeks
├── Weekly Vocabulary
└── Lessons
```

Story Time exists separately as a shared library.

---

## Organisation

The customer/company.

### Fields

- id
- name

### Relationships

- has many schools
- has many users through memberships

---

## School

An individual school/location.

Each school can independently follow a Course Plan even if multiple
schools belong to the same Organisation.

### Fields

- id
- organisation_id
- name
- active

### Relationships

- belongs to organisation
- has many course plans

---

## User

### Fields

- id
- name
- email
- password
- active

### Relationships

- belongs to organisations through memberships

---

## Membership

Connects Users to Organisations and defines their role.

### Fields

- id
- user_id
- organisation_id
- role

Possible roles:

- admin
- teacher

---

## Course

Represents a complete course/curriculum.

### Fields

- id
- name
- description
- published_at

### Relationships

- has many weeks

---

## Course Plan

Defines which Course a School is following and when.

### Fields

- id
- school_id
- course_id
- start_date
- end_date

### Relationships

- belongs to school
- belongs to course

Potential future improvement:
Use explicit plan/week dates rather than calculating everything from
start_date so holidays and skipped weeks can be supported.

---

## Week

Represents one week of Course content.

### Fields

- id
- course_id
- title
- position
- target_phrases
- background_image
- intro_image

### Relationships

- belongs to course
- has many lessons
- has many weekly vocabulary items

The Teacher UI should automatically know the week based on the plan.

Teachers can also navigate to previous/next Weeks.

---

## Weekly Vocabulary Item

Represents vocabulary available during a Week.

For MVP, vocabulary should appear as a reusable tray/panel rather than
being embedded as clickable areas in the background image.

Example Teacher UI:

[ Vocabulary ]

→ Opens:

[ Apple ] [ Banana ] [ Book ] [ Chair ]

Each item can be tapped to play its English pronunciation.

### Fields

- id
- week_id
- name
- position

### Attachments

- image
- audio_clip

### Relationships

- belongs to week

Potential future fields:

- display_text
- translation
- phonetic_text

---

## Weekly Vocabulary UI

For MVP:

- Teacher can open a Vocabulary panel/tray from the Week/Lesson view.
- Vocabulary items display as large image cards.
- Tapping a card plays the attached English audio clip.
- Cards should be large and tablet-friendly.
- Vocabulary order should be configurable by Admin.
- Tray should be easy to open and dismiss during a lesson.

This avoids requiring Admin users to position clickable elements on
each background image.

---

## Lesson

Represents a lesson contained within a Week.

### Fields

- id
- week_id
- lesson_type
- title
- position

### Lesson Types

- Basic English
- Activity Time

Story Time should not initially be treated as a normal weekly Lesson
because it comes from a shared library.

### Relationships

- belongs to week
- has many videos
- has many resources

---

## Video

Represents a playable video within a Lesson.

Basic English may have one main video.

Activity Time may have multiple videos, currently planned as roughly
three.

### Fields

- id
- lesson_id
- title
- vimeo_url / vimeo_id
- position

### Relationships

- belongs to lesson
- has many chapters

---

## Chapter

Represents a manually defined section/timestamp within a Video.

Used for:

- chapter forward/back controls
- displaying current chapter
- potentially changing the Teacher Guide based on playback position

### Fields

- id
- video_id
- title
- timestamp_seconds
- position
- teacher_guide

### Relationships

- belongs to video

Potential future functionality:
The Video Player can determine the current chapter based on playback
time and automatically display the relevant Teacher Guide.

---

## Lesson Resource

Represents downloadable/viewable Lesson materials.

### Fields

- id
- lesson_id
- name
- resource_type
- position

### Attachment

- file

### Resource Types

- worksheet
- teacher_prep
- lesson_guide
- other

### Relationships

- belongs to lesson

---

## Story

Story Time should initially exist as a shared content library rather
than being assigned separately to every Week.

Teachers can open Story Time and select from the currently available
stories.

### Fields

- id
- title
- description
- video_url / vimeo_id
- active
- position

Potential relationships:

- has many story chapters

---

## Story Chapter

Optional depending on Story Time requirements.

### Fields

- id
- story_id
- title
- timestamp_seconds
- position
- teacher_guide

---

# Approximate Model Relationships

```text
Organisation
├── Memberships
│ └── Users
│
└── Schools
└── Course Plans
└── Course
└── Weeks
├── Weekly Vocabulary Items
│ ├── Image
│ └── Audio Clip
│
└── Lessons
├── Videos
│ └── Chapters
│
└── Lesson Resources
```

Separate shared library:

```text
Stories
└── Story Chapters
```

Future:

```text
Week
└── Hotspots
└── Weekly Vocabulary Item
```

---

# Specific rails structure for DB

## Organisation

has_many :schools
has_many :users

Fields:

- name

---

## School

belongs_to :organisation
has_many :course_plans

Fields:

- name
- active

---

## User

belongs_to :organisation

Fields:

- name
- email
- encrypted_password
- role
- active

Roles:

- admin
- teacher

---

## Course

has_many :weeks

Fields:

- name
- description
- published_at

---

## Week

belongs_to :course
has_many :lessons
has_many :weekly_vocabulary_items

Fields:

- title
- position
- target_phrases

Attachments:

- background_image
- intro_image

---

## CoursePlan

belongs_to :school
belongs_to :course

Fields:

- start_date
- end_date

---

## Lesson

belongs_to :week
has_many :videos
has_many :lesson_resources

Fields:

- lesson_type
- title
- position

Lesson types:

- basic_english
- activity_time

---

## Video

belongs_to :lesson
has_many :chapters

Fields:

- title
- vimeo_url
- position

---

## Chapter

belongs_to :video

Fields:

- title
- timestamp_seconds
- teacher_guide
- position

---

## LessonResource

belongs_to :lesson

Fields:

- name
- resource_type
- position

Attachment:

- file

Resource types:

- worksheet
- teacher_prep
- lesson_guide
- other

---

## WeeklyVocabularyItem

belongs_to :week

Fields:

- name
- position

Attachments:

- image
- audio_clip

---

## Story

has_many :story_chapters

Fields:

- title
- description
- video_url
- active
- position

---

## StoryChapter

belongs_to :story

Fields:

- title
- timestamp_seconds
- teacher_guide
- position

---

## Detailed Schema

Draft application schema with proposed data types. `PK` means primary key,
`FK` means foreign key, and `UK` means unique key. Each child belongs to
exactly one parent; a parent can have zero or more children.

This uses the Membership model from the main design: users can belong to
multiple organisations, with a role on each membership. The alternative
single-organisation User model in the Rails notes is not used here.

#### Organisation

| Type | Field | Constraint / note |
| --- | --- | --- |
| bigint | `id` | PK |
| string | `name` | — |
| datetime | `created_at` | — |
| datetime | `updated_at` | — |

#### School

| Type | Field | Constraint / note |
| --- | --- | --- |
| bigint | `id` | PK |
| bigint | `organisation_id` | FK |
| string | `name` | — |
| boolean | `active` | — |
| datetime | `created_at` | — |
| datetime | `updated_at` | — |

#### User

| Type | Field | Constraint / note |
| --- | --- | --- |
| bigint | `id` | PK |
| string | `name` | — |
| string | `email` | UK |
| string | `encrypted_password` | — |
| boolean | `active` | — |
| datetime | `created_at` | — |
| datetime | `updated_at` | — |

#### Membership

| Type | Field | Constraint / note |
| --- | --- | --- |
| bigint | `id` | PK |
| bigint | `user_id` | FK |
| bigint | `organisation_id` | FK |
| string | `role` | admin or teacher |
| datetime | `created_at` | — |
| datetime | `updated_at` | — |

#### Course

| Type | Field | Constraint / note |
| --- | --- | --- |
| bigint | `id` | PK |
| string | `name` | — |
| text | `description` | — |
| datetime | `published_at` | Nullable until published |
| datetime | `created_at` | — |
| datetime | `updated_at` | — |

#### CoursePlan

| Type | Field | Constraint / note |
| --- | --- | --- |
| bigint | `id` | PK |
| bigint | `school_id` | FK |
| bigint | `course_id` | FK |
| date | `start_date` | — |
| date | `end_date` | — |
| datetime | `created_at` | — |
| datetime | `updated_at` | — |

#### Week

| Type | Field | Constraint / note |
| --- | --- | --- |
| bigint | `id` | PK |
| bigint | `course_id` | FK |
| string | `title` | — |
| integer | `position` | — |
| text | `target_phrases` | — |
| attachment | `background_image` | Logical attachment, not a column |
| attachment | `intro_image` | Logical attachment, not a column |
| datetime | `created_at` | — |
| datetime | `updated_at` | — |

#### WeeklyVocabularyItem

| Type | Field | Constraint / note |
| --- | --- | --- |
| bigint | `id` | PK |
| bigint | `week_id` | FK |
| string | `name` | — |
| integer | `position` | — |
| attachment | `image` | Logical attachment, not a column |
| attachment | `audio_clip` | Logical attachment, not a column |
| datetime | `created_at` | — |
| datetime | `updated_at` | — |

#### Lesson

| Type | Field | Constraint / note |
| --- | --- | --- |
| bigint | `id` | PK |
| bigint | `week_id` | FK |
| string | `lesson_type` | basic_english or activity_time |
| string | `title` | — |
| integer | `position` | — |
| datetime | `created_at` | — |
| datetime | `updated_at` | — |

#### Video

| Type | Field | Constraint / note |
| --- | --- | --- |
| bigint | `id` | PK |
| bigint | `lesson_id` | FK |
| string | `title` | — |
| string | `vimeo_url` | — |
| integer | `position` | — |
| datetime | `created_at` | — |
| datetime | `updated_at` | — |

#### Chapter

| Type | Field | Constraint / note |
| --- | --- | --- |
| bigint | `id` | PK |
| bigint | `video_id` | FK |
| string | `title` | — |
| decimal | `timestamp_seconds` | — |
| integer | `position` | — |
| text | `teacher_guide` | — |
| datetime | `created_at` | — |
| datetime | `updated_at` | — |

#### LessonResource

| Type | Field | Constraint / note |
| --- | --- | --- |
| bigint | `id` | PK |
| bigint | `lesson_id` | FK |
| string | `name` | — |
| string | `resource_type` | worksheet, teacher_prep, lesson_guide, other |
| integer | `position` | — |
| attachment | `file` | Logical attachment, not a column |
| datetime | `created_at` | — |
| datetime | `updated_at` | — |

#### Story

| Type | Field | Constraint / note |
| --- | --- | --- |
| bigint | `id` | PK |
| string | `title` | — |
| text | `description` | — |
| string | `video_url` | — |
| boolean | `active` | — |
| integer | `position` | — |
| datetime | `created_at` | — |
| datetime | `updated_at` | — |

#### StoryChapter

| Type | Field | Constraint / note |
| --- | --- | --- |
| bigint | `id` | PK |
| bigint | `story_id` | FK |
| string | `title` | — |
| decimal | `timestamp_seconds` | — |
| integer | `position` | — |
| text | `teacher_guide` | — |
| datetime | `created_at` | — |
| datetime | `updated_at` | — |


### Proposed constraints and implementation choices

- IDs use `bigint`; `created_at` and `updated_at` are proposed Rails timestamps
  on every table. Types are design suggestions, not final migrations.
- Every foreign key shown should be required, indexed, and enforced by a
  database foreign key constraint. Deletion behaviour still needs deciding.
- `User.email` should be required and unique, with consistent case
  normalisation. `encrypted_password` represents the stored password hash,
  following the Rails notes; plaintext passwords are not stored.
- Membership should have a composite unique index on `(user_id, organisation_id)`.
  Each pair gets one membership and one role. Neither column is individually unique.
- `role`, `lesson_type`, and `resource_type` should be restricted to the
  values shown in the tables.
- `position` orders records within their parent; Story positions order the
  shared library. Position uniqueness is not assumed in this draft.
- Chapter timestamps should be non-negative. Decimal seconds allow fractional
  timestamps; precision and scale remain to be chosen.
- Course Plan dates should satisfy `end_date >= start_date` when both are
  present. Whether end dates are required and whether plans can overlap
  remain open decisions.
- Attachment rows describe model attachments, not SQL columns. If Rails
  Active Storage is chosen, its supporting tables hold attachment metadata;
  those framework tables are outside this application schema.
- URLs are used for Video and Story instead of separate Vimeo IDs, following
  the Rails notes. `target_phrases` is provisionally text.
- Story Chapters remain optional as a feature. Future vocabulary fields,
  Hotspots, explicit plan/week dates, and authentication framework support
  fields are not part of this draft.
- Required fields beyond IDs, foreign keys, and email, along with defaults
  for active flags and other fields, still need to be specified.
