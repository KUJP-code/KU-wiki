---
title: Overview
description: Summary of the Setsumeikai Calendar app
---

This page serves as an overview of the Setsumeikai Calendar app and how to work with it.

## Customer Flow

### Making Setsumeikai Inquiry

1. Customer navigates to the [page containing the React App](https://kids-up.jp/book-appointment), either from the navbar link or from a school page.
2. If from the navbar link, customer is presented with a searchable list of schools. Once they click on a school they're taken to step 3.
3. If from a school page or they have selected a school, customer is presented with a list of available appointments for the school they selected.
4. Customer selects an available appointment, from a calendar view on desktop or list view on mobile.
5. Customer enters their information and confirms their appointment.
6. If successful, customer is presented with a success message and a summary of their appointment. If unsucessful, customer is presented with an error message.

### Making General Inquiry

1. Customer navigates to the page with the [general inquiry form](https://kids-up.jp/inquiry-test/).
2. Customer enters their information and submits the form, which is replaced by a confirmation screen. They can submit the inquiry or go back to make changes.
3. If successful, customer is presented with a success message and redirected to the thank you page. If unsucessful, customer is presented with an error message.

## Staff Flow

### Creating a Setsumeikai

1. Staff log into the Seasonal Registration Site and navigate to the [Setsumeikai index](https://kids-up.app/setsumeikais).
2. Staff create a new setsumeikai by filling out the form or copying and editing an existing setsumeikai with one of the copy buttons.
3. The setsumeikai is created and staff are presented with a success message. Unless the release date has not yet passed, it is immediately available for display to customers.

### Viewing Setsumeikai Inquiries

1. Staff log into the Seasonal Registration Site and navigate to the [Setsumeikai index](https://kids-up.app/setsumeikais) or [Inquiries index](https://kids-up.app/inquiries).
2. Staff select the setsumeikai they want to view inquiries for, or select an inquiry from the list to edit.
3. When viewing a list of inquiries, staff can edit the notes in place or click the edit button to edit other aspects of the inquiry.

### Viewing Setsumeikai Inquiries in Google Sheets

No changes, once we switch the URLs defined in the API endpoint sheet the system will work exactly as it does now.

## Data Flow

![Setsumeikai Data](/setsu_data_flow.avif)

1. Visiting the [page containing the React App](https://kids-up.jp/book-appointment) triggers a requests to the Schools#index API endpoint of the Seasonal Registration Site.
2. The API endpoint returns a list of schools, along with their upcoming setsumeikais which have passed their release date.
3. The React App displays the list of schools and their upcoming setsumeikais, customer goes through the customer flow described above.
4. When the customer submits their form in the last step, a POST request is made to the Inquiries#create API endpoint of the Seasonal Registration Site.
5. The API endpoint creates an inquiry in the database and returns a success message, which tells the React App to display a summary of the inquiry.
6. At the scheduled time, the GAS script for each school's sheet makes a request to the Sheets#inquiries API endpoint of the Seasonal Registration Site.
7. The API endpoint returns a list of inquiries for the school in the same format as the previous API.
8. GAS then sends a POST request to the Sheets#update API endpoint, which marks the inquiry as sent so it will not be resent.

There is also a Sheets#schools endpoint that returns a list of all school names like the previous one.
