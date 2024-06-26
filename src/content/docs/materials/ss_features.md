---
title: SS Features
description: Breakdown of what the SS could do, notes on how to replace
---

Organised by tab in the top navbar, then subheadings within that tab's dropdown menu.

## Student Management

### Student Search - 生徒

Takes you to a search form for students. You can save search filters to reuse later.

Buttons to:

- Create a new student: Opens a new student form in a modal
- Save your search filter
- Load criteria from your saved filters
- Reveal detailed filters
- Search
- Clear filters
- Save results as CSV/Excel

Can search by:

- Standard filters:

  - Status (Inquirer: 問合せ者, Student: 生徒)
  - SSID: Two boxes for some reason, joined by a ~.
  - Name: Has partial matching
  - School
  - School Manager
  - Contract status (Non-contractor: 未契約者, Student: 受講者, Former Student: 元受講者): has a checkbox to check/uncheck all
    - Can be searched based on contract status at a given date
  - Join date: As a range
  - Order by (Name/SSID, Asc/Desc)

- Advanced filters:
  - Specify 'x' as a search condition
  - Registered staff (登録スタッフ)
  - Updated at: as a range
  - Last updated staff
  - Aggregation destination type (集約先種別): Has 3 checkboxes and check/uncheck all
  - Consolidated students: Seems like you can search for them, not sure what it does
  - Using bank transfer or not
  - Account transfer request destination: List of Zeus with a date and fallback date
  - Withdrawal date: as a range, or no withdrawal date
  - Management ID: same split field as SSID
  - Phone number: Single input, but with checkboxes to search by home/mobile/emergency numbers and lack of those
  - Has restrictions on phone contact
  - Contact email: One input, but with checkboxes to search by email1/2 and lack of email1/2
    - Reception settings for both
  - App notification available or not
  - Prefecture select
  - Grade select: Can select multiple with checkboxes
  - Birthday: As a range
  - Gender: includes unknown
  - Last login: as a range, can also check boxes for logged in or not
  - Photos allowed
  - Card registered or not
  - Card number
  - Student category: 内部生, 予約生, ◆キャンセル待ち（予約生）, 休会生, 休会オンライン生, オンライン生, 外部生, 退会者, 予約キャンセル, 【使用不可】, 【使用不可２】, 未選択
  - Scheduled start date of lessons: As a range
  - Scheduled withdrawal date: As a range
  - Transfer period: As a range
  - Allergy
  - Pickup location
  - Dropoff location
  - Kindy early arrival: y/n/unknown
  - Has siblings: y/n/both
  - Sibling DOBs
  - Part of online lessons
  - IB english level
  - School English level: checkboxes, multi-select

#### Category Filters

- Contract Info
  - Type: Individual/Monthly
  - Status: not finalized/confirmed/cancelled/invalid
  - Acceptance date: as a range
  - School
  - Staff who created/was responsible for the contract
  - Course format: Fixed attendance/reservation
  - Contract course: has a 'specify course' checkbox
  - Contract period: as a range
  - Contract start date: as a range
  - Contract end date: as a range
  - Course period: as a range
  - Course start date: as a range
  - Course end date: as a range
  - Number remaining: Days?
  - Courses remaining
- Contract group info
  - Course period: as range
  - Course start date: as range
  - Course end date: as range
  - Last continue date: as range
  - Continuous suspension period: as range
- Course info
  - reservation reception date: as a range
  - school
  - room
  - student date: as a range
  - class time: range of times
  - course format: fixed attendance/reservation
  - course: has a 'specify course' checkbox
  - lesson
  - teacher
  - attendance status: unregistered/attendance/absence
- Non-attendance information
  - school
  - room
  - Non-attendance period: as a range
  - missed time: as a range
  - course format: fixed attendance/reservation
  - course: has a 'specify course' checkbox
  - lesson
  - teacher

#### Notable Features

- Contract statuses are stored by date, with history
- Can export CSV which matches filters

#### Questions

1. Why is SSID split into 2 fields?
2. Does anyone use the ability to save search filters?
3. What does 'registered staff' (登録スタッフ) do?
4. What are 'consolidated students' (集約先生徒) and what do they do?
5. What does ' 集約先種別' do?
6. What does 'account transfer request destination' (口座振替依頼先) do?
7. How is management ID different to SSID?
8. Does anyone have restrictions on phone contact? As text or just yes/no?
9. How is 'scheduled start date of lessons' (レッスン開始予定年月) different from start date? Same for 退会月/予約キャンセル受付月 and quit date?
10. What's a 'transfer period' (転籍時期)?
11. Which fields do we actually use?
12. What's "契約コース, コースを指定する" (contract course/specify course)
13. What are number remaining and courses remaining (残数, 受講残数)?
14. How is 'contract group info' (契約グループ情報指定) different from 'contract info' (契約情報指定)?
15. What do the 4 course/contract dropdowns that add extra fields represent? How are they different?
16. Do we want SSIDs as a range? Anyone use that? And what for?

### Student Import

Just a file upload input and a dropdown that lets you select the import format. Import format controls the columns in the DB that'll be updated, and there's a button to download a sample CSV with those columns.

The second step, once the file is uploaded, is a confirmation tab. Shows a list of all records uploaded with errors highlighted, whole upload fails if any errors.

Seems basically the same as my implementation, but with more stuff we might not need.

### Bulk Student Deletion

Also seems to be a CSV upload followed by a confirmation tab.

#### Questions

1. Why do we use this?
2. What data does the CSV upload contain?
3. Would you be open to a version which doesn't require a CSV? What should it look like in terms of fields to search by etc.

### Medical Record

Search form for medical data, has the same filters as basic/advanced student search so I assume it gets the data through the student it's attached to.

The form for creating new medical data has:

- Child status: Inquirer/Student
- Student
- Date & time of entry
- Created by: autofills with current user
- Details

#### Questions

1. Why is there a date and time of entry? Is that not when you submit the form?
2. What exactly is a medical record? Health info? Or when a kid gets hurt?

### Medical Record Import

Same as the other import screens, seems no one uses this though.

### Messages

Search form for messages, with following filters:

- Message status: Outgoing: draft/unread/read and Incoming: unread/read
- Created at: as a range
- Message content
- Staff
- School
- Student
- Student's school
- Reply sent: boolean (only affects incoming messages)

### Student Email Distribution

Seems to be a way of scheduling emails/searching scheduled emails. Bit like creating a job in our version.

Scheduling an email to be sent has a confirmation screen.

Fields for the form to create a new email are:

- Scheduled sending time
- Recipient options: checkboxes for email 1/2, app notification and whether to send to people who opted out of receiving emails
- from address: defaults to school email if sent by a school, has radio buttons for HQ, selecting from a list of school emails, sending from the email of the assigned school or specifying an email to send from
- Importance: just a checkbox which makes it high priority
- Assigned school
- Staff
- A button that reveals inputs for adding read receipts by embedding a provided link in the email
- Checkbox to show separate subject/body for PC/mobile
- 'Embedded characters': there's a long list of select options
- Subject
- Body
- Attachments
- Internal notes

Has search fields for:

- Subject
- Scheduled sending date/time: as a range
- School
- Staff
- Status: draft/waiting/sent
- Order by: sending date asc/desc

#### Questions

1. Confirm it is for scheduling emails to be sent en masse later/that you can search for past mass emails.
2. What are embedded characters?
3. Do we ever send separate body/subject for PC/mobile?

### Student Announcements

Form to create new announcement has:

- Subject
- School
- Staff
- Notice period: as a range
- announcement location: checkboxes for PC/smartphone/both
- content for PC
- content for smartphone
- attachments
- internal notes
- send email notification: checkbox to determine whether students should receive an email about the announcement
- some way of adding filters to narrow down the recipients
  - There are also options to filter the recipients by contract or child info, unsure if this is part of the earlier heading or in addition to it
- a way of adding schools to send the notification to, seems groups are possible
- buttons to save as draft (it won't be published when the date hits) or save (it will)

Search form for student announcements, with following filters:

- Subject
- School
- Staff
- Notice period: as a range
- publication status: draft/waiting/published/publication finished

#### Questions

1. Do we use the separate PC/smartphone content?
2. What options do you have for narrowing down the recipients in お知らせ対象?

### Student Attendance

Fields are:

- SSID: as a range
- name
- attendance date: as a range
- school
- room
- checkboxes for arrived or not and a time range to narrow it
- checkboxes for left or not and a time range to narrow it
- order by attendance date, SSID, entry time, departure time in asc or desc

The form adds internal notes and a checkbox to notify parents or not.

### Questions

1. Is this actually attendance? Google translates as entry/exit
2. What is 'room'(ルーム)/ do we need it?

### School year registration

Seems to be a way of setting the year kids are in at school based on their age?

#### Questions

1. This is marked as used by basically everyone, but I don't understand why it would ever be used after being initially set/why it would need to be configurable?

### School year update

You can choose to update by incrementing their grade by one year, or calculating it from their birthday.

There's a table showing the history of updates and who did them. Based on that they do in fact manually update every single year.

#### Questions

1. Why is this manual? I can't think of any possible reason, and can think of so many for it to not be manual. I want to make sure I'm not missing something here, cos this and the last one seem completely pointless to me.

## Contract Management

## Lesson Management

## Instructor Management

## School Management

## System Management
