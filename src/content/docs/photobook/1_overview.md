---
title: Overview
description: Summary of the Photobook app.
---

This page serves as an overview of the Photobook app and how to work with it.

## Customer Flow

### Viewing Event Photos

1. Parents receive a unique link from their school, this event is tied to the individual event they have purchased photo-service for.
2. The app fetches all uploaded photos for the selected event through the API and displays them in a responsive grid (infinite-scroll on mobile, paginated on desktop).
3. Parents can tap/click any photo to open the full-size preview.
4. Parents can download individual photos.
5. If the link has expired or the event is marked private, the user is shown an access error message.


## Admin Flow

### Uploading Event Photos

1. The admin can create folders in the kids up drive, one for each event.
2. Photos are uploaded into the appropriate folders.
3. The drive link is then forwarded to that event in the sheet.

### Managing Events

1. The admin can open the appropriate spreadsheets and view active events under the "events" tab
2. The admin can add an event and set codes up for each school.
3. An expiry date can be set next to the event name.
4. Events can be set based on folder ids within drive.

## Oddities

### Google Drive Integration

Photos are stored in Google Drive, and the drive API is used to access both sheets and picture access.
Ideally sheets are not used as a database, but in this case it was the way the legacy system was put in place, as the admin understands this way of doing it we decided to keep it this way.


### Sorting Order

Events are sorted chronologically by event date, with pinned or featured events appearing first.
Photos within each event are displayed in upload order (newest first).

---
