---
title: Overview
description: An overview of the materials site.
editUrl: false
---

## Teachers

### Homepage

<Image src="/materials/teacher_profile.avif" alt="Teacher homepage" width={1200} height={800} />

### Student list

<Image src="/materials/student_list.avif" alt="Student list" width={1200} height={800} />

### Test Results

<Image src="/materials/results.avif" alt="Results" width={1200} height={800} />

<hr class="!mt-12 h-1 bg-[#f4bb8c] rounded-xl" />
<hr class="h-1 bg-[#f4bb8c] rounded-xl" />

## School Managers

### Support requests

<Image src="/materials/support.avif" alt="Support" width={1200} height={800} />

<hr class="!mt-12 h-1 bg-[#f4bb8c] rounded-xl" />
<hr class="h-1 bg-[#f4bb8c] rounded-xl" />

## Organisation Admins

<hr class="!mt-12 h-1 bg-[#f4bb8c] rounded-xl" />
<hr class="h-1 bg-[#f4bb8c] rounded-xl" />

## Curriculum Team

<hr class="!mt-12 h-1 bg-[#f4bb8c] rounded-xl" />
<hr class="h-1 bg-[#f4bb8c] rounded-xl" />

## Sales

<hr class="!mt-12 h-1 bg-[#f4bb8c] rounded-xl" />
<hr class="h-1 bg-[#f4bb8c] rounded-xl" />

## Admins

<hr class="!mt-12 h-1 bg-[#f4bb8c] rounded-xl" />
<hr class="h-1 bg-[#f4bb8c] rounded-xl" />

## Tech Stack

The site is a Ruby on Rails application hosted on the AWS Elastic Beanstalk Docker platform, with the frontend/backend handled by Rails and templating done with HAML. Client side interactivity is handled by Stimulus.js and Turbo, while Tailwind handles styling.

The database is an RDS postgres instance, email is handled by SES and object storage by S3.

We use SolidQueue for a DB-based background job queue, mission-control-jobs to view them and PGHero to monitor DB health.

Authentication is handled by Devise, then Pundit handles authorisation for authenticated users.

### Automated Deployment

I added a custom rake task to deploy the app to elastic beanstalk.

It requires you to be authenticated with the eb cli and docker, as well as for the docker daemon to be running. In order, it:

1. Is invoked with `rails "eb:deploy"`
2. Runs all tests, prompts if you're sure you want to continue if any fail while providing the failing tests' output
3. Fetches the current deployed version and asks you to input the new version
4. Offers a prompt comparing that with the version you're planning to deploy and requires confirmation to continue
5. Builds a docker image with the current state of your directory (including uncommitted files)

- It's tagged with the version you provided

6. Pushes that image to docker hub
7. Updates 'dockerrun.aws.json' with the new image/tag
8. Commits any outstanding changes with 'Deploy #{version}' as the commit message
9. Deploys 'dockerrun.aws.json' to elastic beanstalk as an artifact
10. Tails the deployment logs from 'eb deploy'

<hr class="!mt-12 h-1 bg-[#f4bb8c] rounded-xl" />
<hr class="h-1 bg-[#f4bb8c] rounded-xl" />

## Full Feature Overview

The entire customer-facing section of the site is localised to both Japanese & English, with the internal section being primarily English but localised as necessary. The active locale can be toggled with a link in the main nav.

Full unit test coverage of authorisation for all controllers, a system spec for creating each resource and unit/request/system specs as necessary to verify the functionality of non-standard features/prevent regressions.

### Users

All roles are derived from a single 'users' table in the DB using Rails' built-in single table inheritance mechanisms. Each role has a dynamically generated main nav bar with links specific to the permissions of their role, which highlights the link most closely related to the current page.

While the actual database fields for all user types are nearly identical, their associations and permissions are very different. Having a User model to contain all common logic and role models inheriting from it and extending with their own logic seemed the best way to model that.

All users belong to an organisation and have their sign ins/IP tracked. They can view and respond to support messages they're involved in or authorized to view.

I defined a convenience method `#is?` on the User model to replace the `#admin?/#customer?` methods which would usually be made available when using a role enum for authorisation. It takes an array of strings and checks if the user's type is included in them.

#### Parents

- Can search for and claim their children by student ID, level and school
- Can access their children's profiles
  - Can view their children's test results, summarized or for individual tests with a radar graph based on the 4 skills
  - Can edit their child's details
- Can access any homework materials assigned to their children
- Can receive messages from teachers
- Can sign in using multiple different emails
  - Users can add new emails, but only staff can remove them

#### Teachers

- Are immediately presented with all the materials they need for that day's lessons upon login
  - Have a `#day_lessons(date)` instance method to facilitate this using their org's plans
  - Can access materials for future or past lessons within the current week with one click from their homepage
  - Can always return to the current day's materials with a single click
- Can access a list of all their classes, and all students in those classes
  - Can view the profiles of their students, which contain summarized past and current test results
  - Can leave comments for other teachers on a child's profile
  - Can add test results for their students, with percentages and a suggested level automatically calculated based on predefined thresholds
  - Can override the suggested level, and are prompted to provide a reason if they do

#### School Managers

- All capabilities of teachers for students of their managed schools
- Can search teachers, students and parents of their school by name, email and student id as applicable, with partial matching enabled
- Can view test results for their school
- Can manage all students, teachers and classes associated with their school
  - Assign teachers to classes
  - Assign students to classes
  - Create new students at their school
  - Add parents to students without them

#### Organisation Admins

- All capabilities of teachers and school managers within their organisation
- Can create new schools and assign managers/teachers to them
- Can view test results for all their organisation's schools
  - Have a special overview statistics dashboard of test results
- Can view the courses their organisation is signed up for and the categories/lessons they grant access to

#### Curriculum Team

- Can create new (unreleased) lessons
- Can propose changes to existing lessons
- Can approved of changes proposed by other curriculum team members
- Can view support requests related to typos

#### Sales

- Can create new plans linking organisations and courses
- Can create & manage organisations
- Can view, respond to and manage all support requests

#### Admins

- All capabilities of any other role
- Can create & manage courses
  - Can add lessons to courses, and change their week/day within that course
  - Can mark courses released or unreleased
- Can create & manage lessons
  - Can directly edit lessons without going through the 'proposed change' system
  - Can mark lessons as released once approved
- Can review proposed changes
  - Interface for side-by-side comparison of changes in text form and the generated PDF guides`
  - Can accept/reject changes with a comment, either automatically applying the changes or sending them back to the proponent for further changes
- Can interact with all support messages
- Can create new tests
  - Tests have a level, corresponding the the main rather than minor levels of our system (kindy/land/sky/galaxy/keep up/specialist)
  - Tests have an array of max scores for each of the 4 skills; reading, listening, speaking and writing
  - They also have a threshold required to reach each possible level, for example a sky test might require 80% for sky two, 90% for sky three & 100% for galaxy one
- Can access the statistics dashboard showing all revenue from courses, anonymised student test result data and organisation stats like number of schools/students

### Courses

These are what organisations sign up for, they group collections of lessons (and probably tests) which are made available on a weekly schedule to form a curriculum. They're linked to organisations through a 'plans' join table which specifies necessary metadata like the start and end dates for the course at a given organisation, student limitsand more to be determined. They're linked to lessons through a 'course_lessons' join table which allows the day and week of the lesson within the course to be calculated.

#### Lessons

Like users, lessons are derived from a single 'lessons' table in the DB using Rails' built-in single table inheritance mechanisms.

They inherit common functionality like PDF generation and attached resources from the parent class, and use varying numbers of fields from the parent table with the rest left at their default values.

In some cases the same column may be represented with a different name on the frontend for different lesson types due to minor semantic differences, but all data in a given column should belong to the same general category.

Most lesson types (e.g. Daily Activity, English Class, Exercise) has its own lesson plan template which is used together with the entered information to automatically generate a PDF lesson plan when the lesson is created/updated. Those which don't make use of this functionality allow a script to be uploaded instead (in the case of Stand Show Speak lessons) or simply don't require a guide.

Lessons can be marked as released or unreleased, and cannot be released without a configurable number of approvals from admins/curriculum team members (tracked separately).

Lessons can belong to many courses, and the join table allows the week and day if the lesson within that course to be specified.

### Students

- Have names, student ids and levels. Associated with many classes, tests, test results and teachers, and belong to a school.
- Names are automatically redacted to '\*\*\*\*' for any user outside their organisation, and encrypted in the database
- Their profile gives an overview of their personal details, classes and teachers, while displaying a summary of their test results
  - The test dates in the summary table can be clicked to switch the radar graph on the other half of the page to show only results for that test
  - As well as revelaing a more detailed table of results for that test
  - By default only tests for the student's current level are shown, there is also a link to view all test results sorted by all past levels
  - And a bar graph showing their score progression through the levels
- Comments can be left on their profile by organisation members with authorization to view the child, and their details can be edited as necessary
- Can be assigned to a new class by authorized users within their organisation, and removed from existing classes

### Support Requests

- Have categories, so far 'General', 'Bug', 'Feature request' and 'Typo'
- Belong to the creator of the Request
  - can be replied to with media uploads by the creator
  - higher level employees in their management chain
  - any KU employee with access to that category of support request
- Are marked seen per user with access
  - Seen status is reset for all users on change or new message
