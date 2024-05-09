---
title: Lessons
description: An overview of how the lesson resource works.
editUrl: false
---

Lessons are presented to internal staff as a set of editable fields, which automatically generate a PDF guide according to a defined template when modified. Modifications made by admins are applied directly while modifications by writers require approval by an admin, at which point they're automatically applied. Teachers and other school/organisation staff see lessons as a link to the guide and attached resources.

Though there are many lesson types, they're all stored in a single lessons table and inherit from the base `Lesson` class using Rails' built in single table inheritance. Shared behaviour like having attached resources and core validations are defined on the `Lesson` class, while more specific behaviour like type-specific enums and attributes for form generation are defined on the models for specific lesson types. Each lesson type for which a PDF guide is automatically generated `includes` the concern responsible for that type's template (e.g. `DailyActivity` includes the `DailyActivityPDF` concern, which contains the logic for automatically generating `DailyActivity` guides.

## Form Generation

Base lesson fields are provided by the `lessons/_form` partial. That partial uses the type of the lesson it's passed to call another, type-specific partial which adds the type-specific fields. Those fields are added manually with the exception of listable and linkable fields, which can be generated automatically using their respective field partials.

Re-ordering the field names within the `LISTABLE_ATTRIBUTES` constant of a model will change the order they're shown in on the form, and there is a `content_for :priority_fields` block available in the main form partial which allows fields to be inserted before the `title` field of the main form.

On a related note, you'll notice I assign the return value of rendering the type-specific fields to a variable in the main form and render them by calling it later. This is necessary to ensure the `:priority_fields` within the type-specific partial are accessible by `content_for`, as otherwise they would not be evaluated until well after the `content_for` resolves.

## Guide Generation

Handled by a collection of concerns found within `app/models/concerns/pdfs`. The base `Lesson` class includes the `Pdfable` concern which handles calling `generate_guide` on the type-specific model to generate a guide and attaching it to the lesson. It also prevents guide generation for lesson types which have a guide uploaded rather than generated.

`PdfDefaults` contains and sets up default values for values like font size, colors and fonts used in PDF generation. `Pdfable` includes it within the `included` block of the concern, which makes the defaults available to each type-specific concern as constants on the type-specific model.

The specifics of generating a guide for each lesson type are handled by the respective type-specific concerns (e.g. `DailyActivityPDF` for `DailyActivity` lessons). These concerns contain all the detailed logic related to adding and positioning images, text and bounding boxes on the page.

Guides are automatically generated on significant changes to a lesson through a controller callback calling the `attach_guide` provided by `Pdfable`. After generation, a job to generate a thumbnail of the PDF is queued and executed by SolidQueue when there are free resources.
