---
title: Refactoring
description: Guidelines for refactoring old projects.
editUrl: false
---

Find an issue on the [Seasonal Site](https://github.com/KUJP-code/db_prototype_v2_official/issues) or [Setsumeikai Calendar](https://github.com/Brett-Tanner/setsumeikai_calendar/issues) repos. Comment on it to let others know you're working on it so we don't all work on the same issue.

Start with an easy or two to get an idea of the language/codebase, then move up to mediums and hards if you'd like. If you find any bugs yourself or want to suggest improvements/changes, feel free to open an issue on either of those repos as well.

To learn about Ruby/Rails I recommend [The Odin Project](https://www.theodinproject.com/paths/full-stack-ruby-on-rails), and the official [Rails Guides](https://guides.rubyonrails.org/)/[API Reference](https://api.rubyonrails.org/) are good places to refer to for specifics/reminders. I'll try to include helpful resources on each issue, but learning how to actually use the language/framework will be a big help.

1. Write tests for existing behaviour
2. Enforce separation of concerns.
3. Remove dead/duplicated code
4. Simplify and modularize.
5. Performance improvements
6. Manual testing
7. Submit a pull request. Nice job making it this far!

## Prerequisites

If it's your first time working on the Seasonal site, you'll want to follow the directions for getting it set up locally in [WSL Dev Environment](../wsl_dev_env).

For the Setsumeikai Calendar, setup instructions can be found [here](../../setsumeikai/dev_env).

If using VSCode install the RubyLSP and Rubocop extensions, as well as Prettier. If you're using Neovim they're both available for that too, unsure about Vim.

The two ruby extensions will give you a lot of handy feedback on any mistakes you make, as well as suggesting potential improvements in some cases.

Prettier enforces consistent formatting rules, so we're not all formatting things differently and getting annoyed at pointless stuff like others' formatting.

:::danger
Whenever you're working on a new feature, [create a new branch from the issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue#manually-linking-a-pull-request-or-branch-to-an-issue-using-the-issue-sidebar) to work on it and keep the branch up to date with main as frequently as possible. Also let the others know what files you're mostly working on to avoid complex merges when the time comes for your pull request.
:::

## 1 - Tests

If there aren't any tests covering the current behaviour, write them. If you're adding a new feature, write tests for it first then write the code that makes them pass. This allows us to make sure changes don't break the current functionality/the code we're writing does what we want it to.

Tests should be written with [RSpec](https://rspec.info/features/3-12/rspec-expectations/built-in-matchers/), as well as Capybara if you need to use the browser.

Use factories (from [factory_bot](https://github.com/thoughtbot/factory_bot), found in the `/factories` subfolder of `spec`) to create instances of a model.

#### Testing Examples

[Unit (model level)](https://github.com/KUJP-code/db_prototype_v2_official/blob/main/spec/models/survey_spec.rb)

Controller (no examples yet)

Integration (no examples yet)

## 2 - Separation of Concerns

Presentation logic in Views, data fetching/processing in Models, Controllers only pass information between the other two. Don't fetch data in Views, use the controller to call a Model method/association and provide that data to the View.

Basically most stuff not related to presentation should go in the Model, so it can be re-used across all Controllers/Views which use that Model.

Presentation stuff should be extracted into a [helper method](https://www.rubyguides.com/2020/01/rails-helpers/).

#### Controller Example

Take a look at this snippet, from UsersController:

```ruby
// users_controller.rb
def copy_invoices(from, to)
    if to.invoices.empty?
      move_invoices(from, to)
    else
      merge_invoices(from, to)
    end
end

def merge_invoices(from, to)
    from_regs = from.invoices.map(&:registrations).flatten
    to_regs = to.invoices.map(&:registrations).flatten
    to_active_invoice = to.invoices.find_by(in_ss: false) || to.invoices.create(event_id: from.invoices.first.event_id)

    from_regs.each do |reg|
      # Skip if already registered
      next if already_registered?(to_regs, reg)

      # Check the created and SS child are same level, adjust options if not
      registerable_id = if reg.registerable_type == 'Option' && from.kindy != to.kindy
                          find_equivalent_id(reg.registerable)
                        else
                          reg.registerable_id
                        end

      # Else associate reg with to child and their open invoice
      reg.update(child_id: to.id, invoice_id: to_active_invoice.id, registerable_id: registerable_id)
    end

    # Update the newly merged invoice
    to_active_invoice.reload && to_active_invoice.save
  end

  def move_invoices(from, to)
    from.invoices.each do |invoice|
      # Change the child associated with the invoice
      invoice.update(child_id: to.id)
      # Same for each registration on the invoice
      invoice.registrations.each do |reg|
        # Check the created and SS child are same level, adjust options if not
        registerable_id = if reg.registerable_type == 'Option' && from.kindy != to.kindy
                            find_equivalent_id(reg.registerable)
                          else
                            reg.registerable_id
                          end

        reg.update(child_id: to.id, registerable_id: registerable_id)
      end
      # Update the invoice to reflect its new owner
      invoice.reload && invoice.save
    end
end

def already_registered?(t_regs, o_reg)
  t_regs.any? do |t_reg|
    t_reg.registerable_id == o_reg.registerable_id && t_reg.registerable_type == o_reg.registerable_type
  end
end
```

This is an abomination for several reasons, not least of which is that it's the code for copying registrations from one child's **invoice** to their sibling's, but it's in the **User**Controller. It's also only in this controller because it's used when merging a parent-created child with their SS counterpart; there's another almost identical version in the InvoicesController which deals with copying the registrations for a child who already registered for an event to one of their siblings.

Having this code in the controller, rather than the model where it belongs, makes changes much more difficult. If a bug is found in the InvoicesController version, will we remember to fix it in the UsersController version? Do we need to write 2 sets of tests, one for each? It's better to move the code from both to the Invoice Model so there's one source of truth for the process of copying invoices.

It would also be wise to extract the code related to choosing which invoices to copy to the Child Model, since it's really related to merging children rather than invoices and thus having it here violates the [Single Responsibility Principle](https://www.freecodecamp.org/news/solid-principles-single-responsibility-principle-explained/). In an ideal world the ChildController would call something like `non_ss_child.merge_to(ss_child)` and the `Child#merge_to` method would handle copying the child's details, then call something like `invoice.move/copy_regs(target_invoice)` so `Invoice#merge_regs` or `Invoice#copy_regs` as appropriate can handle the Invoice related tasks.

#### View Example

All data used in views should be passed from the controller as instance (@) variables. Fetching data in views (especially in partials) can lead to N+1 queries and incredibly slow renders as the view has wait for data from the controller, start rendering, then stop and wait for more data to be fetched. If you're fetching data in a partial that's rendered 100 times on a page (like the \_child on Child#index) you end up making 100 SQL queries during a render, and waiting for each of them to resolve before continuing to render.

However, don't take this to extremes. Passing 20 different instance variables to a view is also a problem, we should probably have 5 at the absolute most. Use tricks like loading associated records with `#includes` or sending object instance variables which group related data and can be destructured in the view. It's also ok to use Ruby methods on instance variables passed to the view rather than sending two separate variables which are just derivatives of a parent. For example, rather than sending @internal_kids, @reservation_kids, and @external_kids to the profile view for staff, I just send @children then use `@children.select(&:internal?)` etc. to split them into local variables as needed.

## 3 - Dead/Duplicated Code

There are a LOT of random methods lying around that I created to fix a specific problem, then either solved a different way, removed the problem or created another method that's basically a copy of the original but in another place. When you're looking a models, do a quick search for some of the methods to see where/if they're used. If they don't seem to be used at all, check with me but you're probably fine to delete them. If they're only used in one view maybe we move them to that view to avoid bloating the model.

Similarly, if you see a lot of similar methods being called in different places/on different things we should try to condense them as much as possible, either into a view helper or a module/concern depending on the type of method.

#### DRY

Don't repeat yourself! Duplicated code makes files harder to read, and increases the possibility of bugs when changes need to be made in many places rather than just one. Having said that, you'll find about a billion examples of me doing just that because I didn't know any better.

For example, here is what the filter headers of the table in the Inquiries#index view looked like before refactoring:

#### Old Inquiries#index filter headers

![Inquiry index table](/refactoring/DRY_bad.avif)

The file was about 3 screens long cos of these, and if you wanted to make a change to how filter headers worked you needed to make a change to each of them, without missing any (also in the 3-4 other views which use filter headers, scattered across the project). Compare that to the index view after, and the `filter_header.html.erb` partial I extracted the repeated code into:

#### New index view

![New inquiry index table](/refactoring/DRY_good.avif)

The whole view now fits in half a screen, and the filter headers take up all of 4 lines (5 if you count the `columns` variable shared with the regular headers). Much easier to read.

#### New `filter_header` partial

![filter_header partial](/refactoring/DRY_partial.avif)

Now that the logic for filter headers is all concentrated in one place, it's trivial to make changes to every instance of them in the site. Being at the lowest level of indentation as opposed to nested in a table also helps a lot with readability.

## 4 - Simplify/Modularize

If Rubocop is yelling at you, look up why its yelling at you and that's usually a good place to start.

Generally, ensure logical flow/groupings and prefer short methods with a single responsibility. There are a lot of methods (especially on the Invoice Model) which ramble on for 20 or 30 lines doing a bunch of different loosely coupled things. These would be much more readable, and thus easier to optimise, if they were shorter and had their different responsibilities separated out into smaller functions. For example, take a look at `Invoice#calc_course_cost`:

```ruby
// invoice.rb
  def calc_course_cost
    num_regs = if @ignore_slots
                 slot_regs.size - @ignore_slots.size
               else
                 slot_regs.size
               end

    course_cost = if child.member?
                    best_price(num_regs, member_prices)
                  else
                    best_price(num_regs, non_member_prices)
                  end

    snack_count = slot_regs.count do |reg|
      !reg._destroy && reg.registerable.snack
    end
    snack_cost = snack_count * 165

    # Needs to be filter_map because next in #map returns nil
    extra_cost_slots = slot_regs.filter_map do |reg|
      slot = reg.registerable

      next if reg._destroy
      next if child.external? && slot.ext_modifier.zero?
      next if child.internal? && slot.int_modifier.zero?

      slot
    end

    extra_cost = extra_cost_slots.reduce(0) do |sum, slot|
      child.external? ? sum + slot.ext_modifier : sum + slot.int_modifier
    end

    course_cost += extra_cost + snack_cost

    unless @breakdown.nil?
      @breakdown << '</div>'
      @breakdown.prepend(
        "<h4 class='fw-semibold'>コース:</h4>
        <div class='d-flex flex-column align-items-start gap-1'>
        <p>#{yenify(course_cost)} (#{num_regs}回)</p>
        <p>追加料金 x #{extra_cost_slots.size}: #{yenify(extra_cost)}</p>
        <p>午後コースおやつ代 x #{snack_count}: #{yenify(snack_cost)}</p>"
      )
    end

    course_cost
  end
```

This method purports to be about calculating the course cost of the invoice, but it actually determines the number of registrations on the invoice, calculates the cost from just activity registrations, the snack cost and the extra costs from special day registrations. It then randomly adds a div closing tag to the @breakdown instance variable before prepending a summary of the various course related costs to that same @breakdown. While this function does need to do some of those things, there are also some which shouldn't be its responsibility like determining the number of registrations and adding text to the breakdown. If you want a great example of how NOT to structure code, go [here](https://github.com/KUJP-code/db_prototype_v2_official/blob/9f5c9ff82f87d234fae77c3e51f69529237fadfc/app/models/invoice.rb) and CTRL+F '@breakdown'. The fact this actually works 99% of the time is a miracle.

Ideally `Invoice#calc_course_cost` from above would look more like this, with num_regs calculation being extracted up to the calling function (and giving the actual activities instead, since that's what we really want) and the breakdown related code moved into a new `Invoice#generate_details` function that's only called once all calculations are done.

```ruby
// invoice.rb
def calc_activities_cost(activities)
    course_cost = child.member? ? best_price(activities.size, member_prices) : best_price(activities.size, non_member_prices)
    snack_cost = calc_snack_cost(activities)
    extra_cost = calc_extra_cost(activities)

    course_cost + snack_cost + calc_extra_cost
end
```

Now the method only does what it says in the name, and by delegating details to smaller methods it becomes much easier to scan and understand what exactly makes up the activities cost. If implementation details are needed, they can be found in the individual functions which will now also be more readable as they're not mixed in with other, unrelated code. If mecessary, we could assign the various components of the cost to instance variables so they don't need to be recalculated when constructing the summary.

## 5 - Performance

As you click around the site, you'll notice two badges popping up. The top right one is from 'rack-mini-profiler', which tracks your page load time and gives you a bunch of different breakdowns when clicked, from how much time you spent on SQL queries vs rendering to a flamegraph of how much time individual method calls consumed while preparing the page.

As a general rule we try to stay under 500ms for heavy pages like the admin/AM profiles, event attendance sheets and some of the stat pages. For lighter stuff like a user/child profile or list of invoices, ideally we're under 100ms. Anything over a second is something we're going to need to pay some attention to optimising.

Common culprits for slow page loads are a lot of heavy calculations or data-fetching in the view, especially in partials. Rendering a lot of complex partials chews up resources too, so try to keep them simple if there'll be a lot or paginate aggressively if they need to be complex.

In the bottom left corner you'll sometimes see a little angry little red badge yelling at you about bullets. This guy's job is to look out for N+1 queries, or the opposite where you're grabbing a bunch of stuff from the database that you don't need. It'll basically tell you what to do, but keeping in mind some of the potential [drawbacks of eager loading](https://engineering.gusto.com/a-visual-guide-to-using-includes-in-rails/) is also wise, since we're not often gonna be dealing with such huge numbers of records that it makes a big difference.

Also use some logic, Bullet will often tell you to remove eager loading from queries becuase there's only one or a few records present in the test data, but if you know there are gonna be a bunch more in reality feel free to ignore it. Or even better, add a heap of test records and compare the performace with/without eager loading yourself using rack-mini-profiler.

## 6 - Manual Testing

If you haven't been doing it as you write, fire up `rails s` and run through the area you've changed like a customer/staff member would. Check there are no bugs and that everything works as intended. Also think about any usability improvements/extra features you could add to improve the experience. Could be something small like adding a back button to the index for that Model, or something bigger like making a table filterable/adding the ability for managers to construct arbitrary SQL queries from the front end.

## 7 - Submit a Pull Request

Since you created your pull request from the issue you're working on, it'll be automatically linked to the issue. Go to your branch on Github and [follow these instructions](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) to open a pull request. I'll take a look at it and if it's all good, merge it to main!

If you noticed any other issues during your work, feel free to create a new issue on the repo using the template. Thanks for your help!
