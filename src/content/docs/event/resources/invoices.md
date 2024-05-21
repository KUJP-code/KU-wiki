---
title: Invoices
description: An overview of how the app handles invoices
---

## Calculation

Split into 3 separate process, each of which is found in a concern. The InvoiceCalculatable concern gathers and calculates all the necessary data before returning a data hash with all the information InvoiceSummarisable needs to generate the summary. Once SolidQueue is set up it will also be used to generate the PDF on save in a background job, but until then the PDF will be generated on demand for attachment to confirmation emails.

### InvoiceCalculatable

I prefer to only add to the data hash within second level functions (those directly called from the top level function, which are the top level functions of their own 'Calculator' modules) to make it easier to track what's added and where.

So for example, rather than adding `@data[:snack_cost]` and `@data[:snack_count]` within `calc_snack_cost`, a 3rd level function, I would return them from that function and assign them in the calling second level function `calc_course_cost` like so.

```ruby
def calc_cost()
# top level function of the concern
# creates the data hash
    calc_course_cost(@data[:time_slots])
# calls some other sections calculations
end

private

# these two are found in the CourseCalculator module
def calc_course_cost(slots)
    # second level function, calls the calc functions related to its topic
    # and assigns the results to the data hash
    @data[:snack_cost], @data[:snack_count] = snack_cost(slots)
    @data[:extra_cost], @data[:extra_count] = extra_cost(slots)
end

def snack_cost(slots)
    # third level function, calculates data for specific thing and returns
    # to second level function for destructuring
    snack_count = slots.count(&:snack)
    snack_cost = snack_count * 165
    [snack_cost, snack_count]
end
```

This keeps all related assignments in one place so they can quickly be scanned for the one you need.

### InvoiceSummarisable
