---
title: Generating Views
description: An overview of methods to generate views in Rails
editUrl: false
---

I think the component based systems might be more trouble than they're worth unfortunately, there seem to be a lot of issues integrating them with Rails. Might try HAML for the Invoice#new rewrite but I'm not convinced it's worth converting all the views to it. Will wait till I read the chapter on helpers at least so I can see the 'Rails' way to extract business logic from your views.

## Templating Engines

Broadly speaking, these operate on a HTML file and use string interpolation to add content to it.

### ERB

The default templating system for Rails. Syntax is pretty messy, especially when there's a lot of logic in the view. Also considerably slower that the other options.

Basically uses string interpolation to add Rails content to a HTML file, has the benefit of basically being just HTML and Rails so not much to learn.

If you need Ruby code in the view, use <% %> to run code which won't be displayed and <%= %> to print the return value of the code to the page.

```erb
<div class="title">
    <h1><%= @object.name %></h1>
</div>
```

### HAML

A DSL in Ruby, much simpler/cleaner than ERB, recommended by 'The Rails 7 Way'. Uses indentation for nesting, and symbols like %= to determine what to render.

```ruby
.title %h1= @object.name
```

### Slim

Also a Ruby DSL, even more minimalistic than HAML. More of a markdown style syntax but you still write the tag names, and use = to execute Ruby code you want displayed.

```ruby
div(class="title")
  h1 = @object.name
```

## Presenters

These allow you to have your logic separated from the view but in the same file, which looks neater. However stuff like current_user has to be passed explicitly, and translations need to be in files next to the component which would be a big hassle to rework for me.

### Phlex

Turns each view into a Ruby class with a template method. The template method handles rendering the view, while private methods handle the logic separately. The intialize method of the class receives instance variables from the controller.

This approach aligns really well with what I've been doing lately when I need complex logic in a view by extracting it up to the top as a local variable.

Being an PORO, it should be easier and quicker to test.

```ruby
class TestResults < Phlex::HTML
  def initialize(score:)
    @score = score
  end

  def template
    p { "You scored #{@score} points." }
    judgement
  end

  def judgement
    div(class: 'judgement') do
      if @score > 5
        'Great job!'
      else
        'You could do better.'
      end
    end
  end
end
```

### ViewComponents

ViewComponents take a similar approach to Phlex, however with the backing of GitHub rather than some dude. Unfortunately I think this is the best option, has better docs, a big company behind it and you can choose between ERB/Slim/HAML for your templating language.

Not a fan of the folder structure/explosion of files necessary though. Unsure if it actually works but Phlex seemed to have a better solution for that, which allows translations to stay where they are. That might not actually be a good example, translations in the same place as components could be a good thing. But I don't like the inability to put it all in a single folder, controller has to be outside. And seems you can't nest components? Problematic compared to partials.
