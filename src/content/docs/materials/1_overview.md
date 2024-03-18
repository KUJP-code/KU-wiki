---
title: Materials Site Overview
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

### Support requests

<Image src="/materials/support.avif" alt="Support" width={1200} height={800} />

<hr class="!mt-12 h-1 bg-[#f4bb8c] rounded-xl" />
<hr class="h-1 bg-[#f4bb8c] rounded-xl" />

## School Managers


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

### Users

All roles are derived from a single 'users' table in the DB using Rails' built-in single table inheritance mechanisms.

While the actual database fields for all user types are nearly identical, their associations and permissions are very different. Having a User model to contain all common logic and role models inheriting from it and extending with their own logic seemed the best way to model that.

All users belong to an organisation and have their sign ins/IP tracked. They can view and respond to support messages they're involved in or authorized to view.

I defined a convenience method `#is?` on the User model to replace the `#admin?/#customer?` methods which would usually be made available when using a role enum for authorisation. It takes an array of strings and checks if the user's type is included in them.

#### Teachers

- Are immediately presented with all the materials they need for that day's lessons upon login
  - Can access materials for future or past lessons within the current week with one click from their homepage
  - Can always return to the current day's materials with a single click
- Can access a list of all their classes, and all students in those classes
  - Can view the profiles of their students, which contain summarized past and current test results
  - Can leave comments for other teachers on a child's profile
  - Can add test results for their students, with percentages and a suggested level automatically calculated based on predefined thresholds
  - Can override the suggested level, and are prompted to provide a reason if they do

#### School Managers

- All capabilities of teachers for students of their managed schools
- Can manage all students, teachers and classes associated with their school
  - Assign teachers to classes
  - Assign students to classes
  - Create new students at their school

#### Organisation Admins

- All capabilities of teachers and school managers within their organisation
- Can create new schools and assign managers/teachers to them
- Can view test results for all their organisation's schools
  - Have a special overview statistics dashboard of test results
- Can view the courses their organisation is signed up for and the categories/lessons they grant access to

#### Curriculum Team



#### Sales

#### Admins

### Courses


#### Lessons

Like users, lessons are derived from a single 'lessons' table in the DB using Rails' built-in single table inheritance mechanisms.

They inherit common functionality like PDF generation and attached resources from the parent class, and use varying numbers of fields from the parent table with the rest left at their default values.

In some cases the same column may be represented with a different name on the frontend for different lesson types due to minor semantic differences, but all data in a given column should belong to the same general category.


### Organisations


### Students

### Support Requests

- Have categories, so far 'General', 'Bug', 'Feature request' and 'Typo'
- Belong to the creator of the Request
  - can be replied to with media uploads by the creator
  - higher level employees in their management chain
  - any KU employee with access to that category of support request
- Are marked seen per user with access
  - Seen status is reset for all users on change or new message
