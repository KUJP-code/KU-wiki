---
title: GAS Sheet
description: Documentation for the old GAS sheet.
---

Hopefully we're going to replace this entirely, but we'll likely have to work with in parallel with it for a while till management is confident in my replacement.

Docs for Google App Script are [here](https://developers.google.com/apps-script), you probably want the Guides or Reference tab.

## Spreadsheet

### Sheet 1 - 問合入力 - Query Input

The actual sheet where inquiries are stored/PDFs can be generated. There's one for each school.

#### Green buttons

These are actually drawings btw, not buttons. Seems you can assign functions to them.

1. HP 情報取得

Text translates to something like "Information Acquisition".
It calls the [`getCustomer`](#getcustomer) script from `Main.gs` on click.

2. 説明会参加名簿 発行

Translates to something like 'Publication of briefing session participant list'.
Calls [`createSetsumeikaiMeibo`](#createsetsumeikaimeibo)

3. 問合記録表 PDF 発行

Translates to something like 'Inquiry record table PDF issue'.
Calls [`createRecordMain`](#createrecordmain)

#### Stats

At the top of the sheet are what appear to be some stats generated from the sheet contents.

There are a bunch of columns which sum everything under them, and at the start some summary stats which translate (from left to right) to something like 'Uptake Rate', 'Inquiries', 'Waiting', 'Join' and 'Capture'.

Uptake rate is inquiries / capture, so probably the percentage of inquiries that result in a signup. Though Okurayama seems to be over 100% here.

Inquiries counts the inquiries, but only if >A. Also noticed here that there seems to be hundreds of hidden rows between the header and visible first row. The hidden rows are still counted.

Capture is the sum of columns V & W, which seem to be dates indicating when the customer joined or made a reservation to join. Waiting is the count of column P, which is a date somehow related to the parent waiting for an interview.

#### Columns

A - The inquiry number. The leading letter indicates the source of the inquiry, not sure how numbers are generated since they don't seem even a little sequential

B - The date the inquiry was made

C - Name (probably the child's)

D - Guardian (this would be the parent's name)

E - A link to the generated PDF or Kanji saying it's done

F - Phone number

G - Email

H - Inquiry details (this might be where the text area on the form goes, also could be a dumping ground for stuff put in the various optional fields)

I - Followup details (seems to be SM notes on how the inquiry is progressing)

J - Their grade at school

K-M - The date of the setsumeikai they registered for? Columns are day, time and school

N-O - Individual interviews/trials. Columns are date and time

P-U - The expected date of certain events. From L-R waiting for interview, waiting for trial, waiting for theory A, waiting for reply, need TEL and waiting for procedure.

V-AE - Fixed dates for certain events. From L-R enrollment, reservation membership, external student, followup, not seen yet, interview date, feeling lost???, cancel reservation, outside area, cooling off

AF-AU - Medium the inquiry was received through. From L-R introduction/reviews, kidsHP, search engine, other web, posting, town plus, arrangements, leaflet, look at school, look at the bus, youtube, Facebook, Insta, insert, town magazine, other. These are just marked with 1s, so booleans.

AV-BC - Purpose of inquiry. From L-R ele course, morning toddler, afternoon toddler, ele reservation, kindy reservation, external students participate, summer school, other. These are just marked with 1s, so booleans.

BD - Post code

BE - Address

#### Rows

Seem to be color coded, both backgrounds and occasionally the text.

### Sheet 2 - 一ヶ月管理表 - Monthly Management Table

No clue what this is but it seems to go back to 2016 and the most recent date is in 2019, so maybe not used anymore?

### Sheet 3 - 問合記録表\_雛形 - Inquiry Record Sheet Template

Seems like a paper version of the inquiry form?

### Sheet 4 - 既存 - Existing

Same as sheet 1, but maybe from existing customers?

## Main.gs

The scripts which trigger stuff happening in the sheet. They all just call code from the [kidsCustomerGAS](#kidscustomergas) library.

Before running any of them the current spreadsheet and its ID are set as global variables in `ss` and `_current_id` respectively.

Basically all of these just get the function of the same name from `kidsCustomerGAS`, bind it to a local variable, call that function with with the current sheet id as an argument then log the result.

#### backSetsumeikaiMeibo()

Seems to add the followup status to the mysterious 'Briefing List' sheet daily at 9pm.

#### createRecordMain()

Creates something in the school's spreadsheet, presumably entries for any new inquiries? Runs daily between 4 and 5pm.

#### createSetsumeikaiMeibo()

Creates something in the 'Briefing list' spreadsheet, maybe a separate one to the school-specific one? Runs daily between 3 and 4pm.

#### getCustomer()

Gets new inquiries from wherever they're currently stored after being made, runs hourly.

#### getSchool()

Updates the master list of schools, scheduled to run every Monday.

#### onOpen()

Uses `moveLast` from `kidscustomerGAS` to move to the bottom of the sheet, then according to the comment, creates a 'Script' menu so PDF creation functions can be executed from the spreadsheet. However the functions passed are `createRecordMain` and `getCustomer`, and the names associated with them don't match the green buttons. Also there are 3 green buttons and only two items passed to `addMenu`. Not sure where this menu is if it exists.

## kidsCustomerGAS

The (shared) library containing all the code for fetching data to put in the sheet. Declares a bunch of global variables at the start, then declares a function for setting them which seems to be called at the beginning of all the other functions. The rest of the file provides the actual implementation of the functions bound and called by `Main.gs` above.

### コード.gs

Seems to contain the library API exposed to external scripts.

#### Globals

##### Assigned by `setGrobals`

###### \_spread_id

Is declared but never assigned a value or used. The spreadsheet id is instead passed as an argument to the function being called.

###### ss

The spreadsheet matching the ID passed to `setGrobals`

###### 設定シート (setting sheet)

The sheet from `ss` with a name matching this variable.

###### 問合入力 (query input)

The sheet from `ss` with a name matching this variable.

###### 付加情報 (additional info)

The sheet from `ss` with a name matching this variable.

###### マスタ

The sheet of the same name in the master/weekly report spreadsheet.

###### wk1

The `wk1` sheet from `ss`. Which is odd because that should be the school spreadsheet, and I see no `wk1` sheet.

###### schoolName

Set from range(4, 3) in `設定シート`.
There's another note about order being important next to where its set.

###### param_customer

An object containing `accessKey` and `schoolName`.
Used as part of an API request to get customers for a school in `getCustomer`

###### school_mst

There's a note on this one about it being bad if the position changed, so maybe the school ids are hard-coded somewhere? Might need a translation layer.

##### Assigned at initialization

###### accessKey && options

These are for making POST requests to the API.

###### school_mst_arr

Amusingly, this is initialized to an empty object.

###### 名簿ヘッダ (roster header)

`[['No','児童氏名','年齢・学年','保護者氏名','問合せ内容', 'フォロー状況', '連絡先','前日連絡','出席','申込スクール','結果','メモ欄']]`

I'm guessing the headers for the mystery briefing list sheet. Wonder why its an array directly nested inside another array.

###### 各種雛 ss (spreadsheet with various templates)

Opened by an id which I'm not copying here just in case.

###### apiSet

Seems to be a sheet within the template spreadsheet which contains the api endpoints. `api_kids_get_customer`, `api_kids_update` and `api_kids_get_school` are all set from ranges in here.

###### now & today

`now` is `new Date()`, `today` gets the full year, month and date from `now`.

#### Functions

##### setGrobal(\_in_spread_id)

Assigns the unassigned variables mentioned above based on a passed spreadsheet id.

Assigns the master spreadsheet id to `_mst_ss_id` and the spreadsheet itself to `週間ss`. The master spreadsheet is also referred to as 'Weekly Report Form', maybe it's the mystery sheet?

Assigns all data from the master sheet to `school_mst`, which is not used before promptly being overwritten by the exact same call. Indexes 0, 1, 7 and 8 of `school_mst` are added to `school_mst_arr` (which is an object, not an array) at the key `data[0]`. Curiously, this is done by iterating over `school_mst` with `forEach`. Since the key of `school_mst_arr` being written to is `data[0]` for every iteration, only the values from the last iteration will ever be preserved.

0 is school name, 1 is the school folder, 7 is the folder id of the inquiry record table and 8 is the file if of the information session participation list.

##### getCustomer(\_in_spread_id)

Calls `setGrobal`

Sets the 'payload' key of the global `options` object to the `param_customer` global.

Makes a POST (????) request to the `api_kids_get_customer` endpoint and assigns the response to `response`.

Parses the json from `response` and assigns it to `responseJSON`.

Extracts the contents of `resonseJSON['results]` and assigns it to `results`.

`console.log`s `response` and `responseJSON` in some test code someone forgot to clean up.

If the `counts` key of the response == 0, logs a message that the request succeeded but there was nothing to return. Else calls `printMain` (from `module.gs`) with `results` as an argument.

Finally, returns `responseJSON` to be logged by the school sheet's `Main.gs`.

##### getSchool(\_in_spread_id)

Calls `setGrobal`.

Gets a list of schools from the `api_kids_get_school` endpoint, parses it and assigns the `result` key of the response json to `results`.

`o_data` is initialized as an empty array, `mst` is set to `マスタ.getDataRange().getValues();` (again, this seems to happen a lot despite it being global).

For each of the schools in `result`, if it matches the school name in any of the rows in `mst` return. Else, push the school name that's not in `mst` to `arr`, which is then pushed to `o_data`.

If `o_data` is empty at this point (because the schools are all present in `mst`), the function returns.

Otherwise, the unregistered schools are added to `mst` and also some stuff is done with folders.

##### createRecordMain(\_in_spread_id)

Calls `setGrobal`.

Assigns the contents of the inquiry input sheet to `data` and the contents of the additional information sheet to `data_sub`.

`data_sub` is then iterated over with `forEach`, and each row is repeatedly assigned to the `data[0]` key of `arr_sub` (again, not an array, again, only the last value would be retained??)

The following is done for each inquiry in `data`

- If a PDF has been generated for the inquiry or there's no setsumeikai scheduled for them, skip and go to the next inquiry.
- `ss.getSheetByName('問合記録表_雛形')` (the template sheet of the current spreadsheet, the 3rd one) is assigned to the `雛形` (prototype) variable
- Information from the inquiry (and associated `arr_sub`) is used to fill in the template sheet (`雛形`)
- Initializes a `pdfFlg` to false, then sets it true if a PDF has already been generated.
- If the flag is true, go next and don't generate a PDF. Also don't generate a PDF if the setsumeikai date was in the past.
- If `pdfFlg` is false a PDF is generated with `createRecord()` (from `PDF作成.gs`) with column 12 of the inquiry as an argument (that's the column with the name of the school the reservation is for).
- A URL to the PDF is added to the sheet, seems to have a different symbol based on whether additional info was provided **THIS IS THE 'MEDICAL RECORDS' THING, IT'S ACTUALLY THE GENERATED PDF**

##### createSetsumeikaiMeibo(\_in_spread_id)

##### moveLast(\_in_spread_id)

### module.gs

Seems to contain stuff used in a lot of different scripts/functions

#### printMain(results)

The purpose of this one seems to be adding inquiries to the school's inquiry data sheet from the API response.

`o_data` and `o_data_sub` are initialized as empty arrays.

`results` is an array of inquiries, iterated over and mutated with `forEach`. In `forEach`, each inquiry is referred to as `data`.

In each iteration, the following occurs:

- `reservation_date`, `reservation_time` and `reservation_school` are initialized as blank strings
- If `kinder_attend`, `primary_attend`, `start_season`, `trigger` or `attend` are present, those values are prepended to `data[body]` with some title text.
- If `event_schedule` is present it is used to set `reservation_date`, `reservation_time` and `reservation_school`
- The following keys from `data` (the inquiry) are added to `arr` in the following order, than `arr` is pushed to `o_data`
  - category + id
  - created_at: the day of (union?)
  - name_child
  - name (parent's)
  - '' (an empty string for the PDF generated column)
  - tel
  - email
  - body (the details I noticed in the inquiry sheet and thought might be from the text area/optional fields)
  - '' (an empty string for the followup status column)
  - age
  - reservation date, time and school from the local variables set above
- The following keys from `data` (the inquiry) are added to `arr_sub` in the following order, than `arr_sub` is pushed to `o_data_sub`
  - category + id
  - created_at: the day of (union?)
  - name_child
  - name (parent's)
  - birth

Eventually the data processed while iterating over `results` is pushed to `o_data` and `o_data_sub`. `o_data` is written to the query input sheet, while `o_data_sub` is written to `付加情報` (additional information). The date fields are set to use the desired date format.

`o_data` is passed to `updateFlagMain`, which seems to update whether the inquiries have been recorded in the sheet and mark them as not needing to be sent anymore. The return value of that function is assigned to `responseJson`, which is printed to the log.

#### updateFlagMain(o_data)

An empty `update` array is initialized.

For each inquiry in `o_data`, an object (even though the variable is called `arr`) is created with `id` and `category` keys extracted from the first index of the inquiry array (the id) then pushed to the `update` array. `category` is the letter prepended to the numerical id, while `id` is the numerical id.

`update` is converted to JSON and added to the `param` object along with the `accessKey` KV pair. The `param` object is then added to the global `options` object as the `payload` key, and sent as a request to `api_kids_update`.

The response is parsed and logged, then returned.

#### print(sheet, array, startRow)

Prints the data in `array` to `sheet`, at `startRow` if specified but otherwise at the end of the sheet.
