---
title: "Handover from old forms"
---

The process for switching to the React setsumeikai inquiry form/new general inquiry form.

## Adding the setsumeikai form

### Test page setup

You can skip this for switching over as it should already be set up, just notes for my future reference.

1. Create a new page with the slug 'book-appointment'
2. Make a copy of the theme php template `page-entry.php` and rename the copy to `page-book-appointment.php`.
3. Edit that renamed template to remove the iframe and replace it with `<div id="root"></div>`.
4. Use ReactPress to add the app to this new page.

### Switching over

1. Edit the `page-inquiry.php` template to remove the iframe and replace it with `<div id="root"></div>`.
2. Trash the existing 'entry' page, freeing up its slug to be used by the new one.
3. Change the slug of the test page to 'entry'.
4. Open it and verify the new form appeared.
5. If something goes wrong, change the test slug back to 'book-appointment' then retrieve the old entry page from the trash.

## Adding the general inquiry form

1. Open the 'page-inquiry.php' template in the theme editor.
2. Go to the [Github repo](https://github.com/KUJP-code/inquiry-form) and copy:
   - the css file into a style tag before the form
   - ONLY THE FORM from the HTML file to replace the current form
   - The js file into a script tage under the form
3. Update the file, then load the page to verify the new form is there and works.

## GAS changes

Modify the 'apiSet' sheet in the drive to use the API endpoints from my site, rather than the old one.

```
api_get_kids_customer = https://kids-up.app/gas_inquiries
api_kids_update = https://kids-up.app/gas_update
api_kids_get_school = https://kids-up.app/gas_schools
```

## Analytics changes

Apply my trigger on the 4 items Jack sent for the setsumeikai form, general inquiry one is fine as it redirects to the same place.
