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

## Contract Management

## Lesson Management

## Instructor Management

## School Management

## System Management
