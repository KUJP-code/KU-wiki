---
title: PDF Generation
description: Docs for the PDF controller
---

I originally decided between prawn and hexapdf since wicked_pdf and pdfkit rely on wkhtmltopdf to convert from HTML to PDF, which adds overhead and dependencies.

Went with prawn in the end since hexapdf needs a license for commercial use. Also prawn doesn't include stuff we don't need like parsing PDFs. [Docs](https://prawnpdf.org/api-docs/2.3.0/) and the [manual](https://prawnpdf.org/manual.pdf).

## PDF Objects

PDFs are essentially a bunch of serialized PDF objects, any additional info in the file is just to locate and load those objects.

The objects define everything you see in a PDF, from metadata to how certain parts of the page are defined as form fields.

#### Booleans

`true` or `false`, as usual

#### Numerics

Includes integers and floats

#### Strings

Can be serialized as a normal string with parentheses `(string)` or angle brackets with hex-encoding `<54657374>`.

#### Names

Like symbols in Ruby, serialized by appending a slash to the name `/Name`

#### Arrays

Serialized with brackets `[123 (Test) /Name]`

#### Dictionaries

Like a hash in Ruby but can only have names (symbols) as keys. Serialized by double angle brackets, each key followed by it's value e.g. `<</Key (Value) /AnotherKey 12345>>`

#### Null

Represented by `nil`, serialized as `null`

#### Streams

A sequence of potentially unlimited bytes. Serialized as a dictionary followed by `stream\n...stream bytes...\nendstream`. A stream is always an indirect object (see below).

#### Indirect Objects

An object of any of the above types that is additionally assigned an object identifier consisting of an object number (a positive integer) and a generation number (a non-negative integer).

Serialized by putting the object between `OID GEN obj` and `endobj`, like this `4 0 obj (SomeObject) endobj`. Can be referenced in serialized form from another object like this: `4 0 R`.

Indirect objects are special in that they don’t define a separate type but allow an object of any other type to be referenced.

## Basic Concepts

### Document Creation

You can create a new document using `Prawn::Document`, either alone and assigned to a variable or with `#generate` called with/without arguments.

If generate is used, the PDF object will be rendered after exiting the block. If you use the plain `Prawn::Document` you'll need to call `#render_file`.

```ruby
# Assignment
pdf = Prawn::Document.new
pdf.text 'Hello World'
pdf.render_file 'assignment.pdf'

# Implicit Block
Prawn::Document.generate('implicit.pdf') do
    text 'Hello World'
end

# Explicit Block
Prawn::Document.generate('explicit.pdf') do |pdf|
    pdf.text 'Hello World'
end
```

Documents are automatically created with one page, and some methods like `text` will automatically add another if necessary. If you need to add one manually just use `start_new_page`.

prawn's base unit is a PDF Point, which is 1/72 of an inch. But you don't need to remember/convert that, just `require 'prawn/measurement_extensions'` and call the unit you want on your measurement like `10.mm` or `1.cm`.

If you want to extend prawn, `include Prawn::View` in your custom class to get access to all the `Prawn::Document` methods while avoiding name collisions with `Prawn::Document`.

### Origin

The origin of a PDF is `[0, 0]` at the bottom left of the page.

Bounding boxes are structures providing boundaries for inserting content, and can be created relative to the origin by specifying the coordinates of their top right corner. Bounding boxes have their own origin at the bottom left of the box.

The following example creates a circle centered on the origin, then creates and draws a boundary box with a circle positioned at its origin. Stroke axis draws the x and y axes.

```ruby
stroke_axis
stroke_circle [0, 0], 10
bounding_box([100, 300], width: 300, height: 200) do
    stroke_bounds
    stroke_circle [0, 0], 10
end
```

### Cursor

The cursor starts at the top of the document and automatically progresses toward the bottom as content is added. Its position is available through the `cursor` variable.

Adding a line with `text` automatically moves the cursor to the next line after writing, there are also `move_down`. `move_up` and `move_cursor_to` which accept a position on the y axis to move to.

```ruby
text "the cursor is here: #{cursor}"
text "now it is here: #{cursor}"

move_down 200
text "on the first move the cursor went down to: #{cursor}"

move_up 100
text "on the second move the cursor went up to: #{cursor}"

move_cursor_to 50
text "on the last move the cursor went directly to: #{cursor}"
```

`pad`, `pad_top` and `pad_bottom` all take numeric values and a block, then move the cursor down by that value on the specified side of the passed block.
`float` lets you temporarily move the cursor to insert some content, then snap the cursor back to its original location after the block resolves.

```ruby
stroke_horizontal_rule
pad(20) { text 'Text padded both before and after.' }

stroke_horizontal_rule
pad_top(20) { text 'Text padded on the top.' }

stroke_horizontal_rule
pad_bottom(20) { text 'Text padded on the bottom.' }

stroke_horizontal_rule
move_down 30
text 'Text written before the float block.'

float do
    move_down 30
    bounding_box([0, cursor], width: 200) do
        text 'Text written inside the float block.'
        stroke_bounds
    end
end
text 'Text written after the float block.'
```

## Bounding Boxes

A bounding box can be created with the bounding_box method. Just provide the top left corner, a required `:width` option and an optional `:height`. If `:height` is not provided the bounding box will get taller to fit its content.

```ruby
bounding_box([200, cursor - 100], width: 200, height: 100) do
    text 'Just your regular bounding box'
    transparent(0.5) { stroke_bounds }
end
```

BBs can be nested, nested BBs have their coordinates expressed relative to the containing BB rather than the margin box.

### `bounds`

The bounds method returns the current bounding box. This is useful because Prawn::BoundingBox exposes some nice boundary helpers.
`top`, `bottom`, `left` and `right` methods return the bounding box boundaries relative to its translated origin. `top_left`, `top_right`, `bottom_left` and `bottom_right` return those boundaries pairs inside arrays.

All these methods have an "absolute" version like `absolute_right`. The absolute version returns the same boundary relative to the page's absolute coordinates.

The following snippet shows the boundaries for the margin box side by side with the boundaries for a custom bounding box.

```ruby
def print_coordinates
    text "top: #{bounds.top}"
    text "bottom: #{bounds.bottom}"
    text "left: #{bounds.left}"
    text "right: #{bounds.right}"

    move_down 10
    text "absolute top: #{bounds.absolute_top.to_f.round(2)}"
    text "absolute bottom: #{bounds.absolute_bottom.to_f.round(2)}"
    text "absolute left: #{bounds.absolute_left.to_f.round(2)}"
    text "absolute right: #{bounds.absolute_right.to_f.round(2)}"
end

text 'Margin box bounds:'
move_down 5
print_coordinates

bounding_box([250, cursor + 140], width: 200, height: 150) do
    text 'This bounding box bounds:'
    move_down 5
    print_coordinates
    transparent(0.5) { stroke_bounds }
end
```

## Graphics

Most content is added as a graphic, even text is rendered like a rectangle.

There are a lot of extra graphics I skipped over making notes on cos I didn't need them for the Invoice PDF, if we end up needing them in the future the manual linked above has a _comprehensive_ list.

### `fill` & `stroke`

These are the methods which actually draw stuff on the document. Others like `rectangle`, `circle` or `line_to` just define drawing paths which must be stroked or filled to be shown in the document.

Calling either without a block will act on the drawing path defined prior to the call, with a block will act on the drawing path set within the block. Most methods which create a drawing path have variants prefixed with `fill_` or `stroke_` which create the path then act on it.

```ruby
# No block
line [0, 200], [100, 150]
stroke
rectangle [0, 100], 100, 100
fill

# With block
stroke { line [200, 200], [300, 150] }
fill { rectangle [200, 100], 100, 100 }

# Method hook
stroke_line [400, 200], [500, 150]
fill_rectangle [400, 100], 100, 100
```

### `circle` & `ellipse`

`circle` only needs the center point and radius. `ellipse` needs the same, plus a second radius value. If the second is omitted you'll just draw a circle based on the first.

```ruby
stroke_circle [100, 300], 100
fill_ellipse [200, 100], 100, 50
fill_ellipse [400, 100], 50
```

### Color

We can change the stroke and fill colors providing an HTML rgb 6 digit color code string ("AB1234") or 4 values for CMYK.

```ruby
# Fill with Yellow using RGB (Unlike css, there is no leading #)
fill_color 'FFFFCC'
fill_polygon [50, 150], [150, 200], [250, 150], [250, 50], [150, 0], [50, 50]

# Stroke with Purple using CMYK
stroke_color 50, 100, 0, 0
stroke_rectangle [300, 300], 200, 100

# Both together
fill_and_stroke_circle [400, 100], 50
```

### Common lines

`vertical_line` and `horizontal_line` take a start point, end point and `at:` coordinate in the axis relevant to them.

`horizontal_rule` draws a horizontal line across the current bounding box from border to border, using the current y position.

```ruby
stroke do
    # just lower the current y position
    move_down 50
    horizontal_rule
    vertical_line 100, 300, at: 50
    horizontal_line 200, 500, at: 150
end
```

### `line`, `curve` and their `_to` variants

`line` and `curve` set the drawing path between specified points.

The `_to` variants set the drawing path from the current position to the specified point. The initial position can be set with `move_to`. Useful when chaining calls because the drawing position will be set to the specified point afterwards.

`curve` methods define a Bezier curve bounded by two additional points provided in the `bounds:` param.

```ruby
# line_to and curve_to
stroke do
    move_to 0, 0
    line_to 100, 100
    line_to 0, 100
    curve_to [150, 250], bounds: [[20, 200], [120, 200]]
    curve_to [200, 0], bounds: [[150, 200], [450, 10]]
end

# line and curve
stroke do
    line [300, 200], [400, 50]
    curve [500, 0], [400, 200], bounds: [[600, 300], [300, 390]]
end
```

### `line_width=`

Sets the line_width for the block its called in. If you use `generate` with implicit params you'll need to call it on self, so probably best to use the explicit `generate` to avoid rubocop yelling at me.

```ruby
y = 250

3.times do |i|
    case i
    when 0 then line_width = 10 # This call will have no effect
    when 1 then self.line_width = 10
    when 2 then self.line_width = 25
    end

    stroke do
        horizontal_line 50, 150, at: y
        rectangle [275, y + 25], 50, 50
        circle [500, y], 25
    end

    y -= 100
end
```

### `polygon`

Just pass a comma-separated sequence of points to one of the polygon family of methods. They all have `rounded_` variants, with the only difference being that the radius param comes before the sequence of points.

```ruby
# Triangle
stroke_polygon [50, 200], [50, 300], [150, 300]

# Hexagon
fill_polygon [50, 150], [150, 200], [250, 150], [250, 50], [150, 0], [50, 50]

# Pentagram
pentagon_points = [500, 100], [430, 5], [319, 41], [319, 159], [430, 195]
pentagram_points = [0, 2, 4, 1, 3].map { |i| pentagon_points[i] }
stroke_rounded_polygon(20, *pentagram_points)
```

### `rectangle`

Takes the upper left corner (point array), width and height. Also has a `rounded_rectangle` variant.

```ruby
stroke do
    rectangle [100, 300], 100, 200
    rounded_rectangle [300, 300], 100, 200, 20
end
```

### `stroke_axis`

Draws x and y axes, takes a variety of arguments like `at` (to set the origin of the axes), `height`, `width`, `step_length` (to control the distance between axis labels), `negative_axes_length` and `color`.

### `stroke_cap`

Defines how the end of a line or curve will be drawn. Default is `:butt` which just stops at the provided coordinate, `:rounded` extends and rounds the ends and `:projecting_square` also extends beyond the ends but in a square shape.

Like line_width, needs to be called on `self` or the `pdf` param.

```ruby
self.line_width = 25

%i[butt round projecting_square].each_with_index do |cap, i|
    self.cap_style = cap
    y = 250 - i * 100
    stroke_horizontal_line 100, 300, at: y
    stroke_circle [400, y], 15
end
```

### `stroke_join`

Defines how the intersection between two lines is drawn. Default is `:miter` (sharp corner), `:round` and `:bevel` (points cut off).

```ruby
self.line_width = 25

%i[miter round bevel].each_with_index do |style, i|
    self.join_style = style
    y = 200 - i * 100

    stroke do
        move_to(100, y)
        line_to(200, y + 100)
        line_to(300, y)
    end

    stroke_rectangle [400, y + 75], 50, 50
end
```

### `stroke_dash`

This sets the dashed pattern for lines and curves. The (dash) length defines how long each dash will be.

The :space option defines the length of the space between the dashes.

The :phase option defines the start point of the sequence of dashes and spaces.

Complex dash patterns can be specified by using an array with alternating dash/gap lengths for the first parameter (note that the :space option is ignored in this case).

```ruby
dash([1, 2, 3, 2, 1, 5], phase: 6)
stroke_horizontal_line 50, 500, at: 230
dash([1, 2, 3, 4, 5, 6, 7, 8])
stroke_horizontal_line 50, 500, at: 220

base_y = 210

24.times do |i|
    length = (i / 4) + 1
    space = length # space between dashes same length as dash
    phase = 0 # start with dash

    case i % 4
    when 0 then base_y -= 5
    when 1 then phase = length # start with space between dashes
    when 2 then space = length * 0.5 # space between dashes half as long as dash
    when 3
        space = length * 0.5 # space between dashes half as long as dash
        phase = length # start with space between dashes
    end

    base_y -= 5
    dash(length, space: space, phase: phase)
    stroke_horizontal_line 50, 500, at: base_y - (2 * i)
end
```

## Layout

prawn supports 2D grid layouts as a table-like structure with a defined number of rows and columns.

Create a grid with `define_grid`, which takes `:rows`, `:columns`, `:gutter`, `:row_gutter` and `:column_gutter` as options.

`define_grid(columns: 5, rows: 8, gutter: 10)`

### Boxes

After definition the grid is there but nothing happens. To use it, we need grid boxes.

`grid` has three different return values based on the arguments received. With no arguments it will return the grid itself. With integers it will return the grid box at those indices. With two arrays it will return a multi-box spanning the region of the two grid boxes at the arrays indices.

```ruby
grid(4, 0).show
grid(5, 1).show

grid([6, 2], [7, 3]).show

grid([4, 4], [7, 4]).show
grid([7, 0], [7, 1]).show
```

Content can be added to a box by calling `bounding_box` on it and passing the content as a block.

```ruby
grid([5, 0], [7, 1]).bounding_box do
    text "Adding some content to this multi_box.\n" + ' _ ' * 200
end

grid(6, 3).bounding_box do
    text "Just a little snippet here.\n" + ' _ ' * 10
end
```

## Text

The most basic method is `text`, meant for free flowing text. The provided string will flow according to the current bounding box width and height. It will also flow onto the next page if the bottom of the bounding box is reached.

It will be rendered from the current cursor position and when it finishes rendering the cursor is left directly below the text.

Multiple identical lines can be added by appending `* n` to the method.

```ruby
move_cursor_to 50
text 'This text will flow to the next page. ' * 20

y_position = cursor - 50
bounding_box([0, y_position], width: 200, height: 150) do
    transparent(0.5) { stroke_bounds }
    text 'This text will flow along this bounding box we created for it. ' * 5
end

bounding_box([300, y_position], width: 200, height: 150) do
    transparent(0.5) { stroke_bounds } # This will stroke on one page
    text 'Now look what happens when the free flowing text reaches the end ' \
    'of a bounding box that is narrower than the margin box.' +
    ' . ' * 200 +
    'It continues on the next page as if the previous bounding box ' \
    'was cloned. If we want it to have the same border as the one on ' \
    'the previous page we will need to stroke the boundaries again.'
    transparent(0.5) { stroke_bounds } # And this will stroke on the next
end

move_cursor_to 200
span(350, position: :center) do
    text 'Span is a different kind of bounding box as it lets the text ' \
    "flow gracefully onto the next page. It doesn't matter if the text " \
    'started on the middle of the previous page, when it flows to the ' \
    'next page it will start at the beginning.' + ' _ ' * 500 +
    'I told you it would start on the beginning of this page.'
end
```

`bounding_box` sounds like what I should use for the fixed size stuff like invoice number and contact details, whereas `span` sounds good for the breakdown since it'll flow onto the beginning of the next page. A bounding box would duplicate itself and its position on the next page, then flow into that.

### Font

The font method can be used in three different ways.

If we don't pass it any arguments it will return the current font being used to render text.

If we just pass it a font name it will use that font for rendering text through the rest of the document.

It can also be used by passing a font name and a block. In this case the specified font will only be used to render text inside the block.

The default font is Helvetica.

It's possible Japanese characters might not be renderable with the built-in PDF fonts, in which case I'll need to use an external font.

```ruby
text "Let's see which font we are using: #{font.inspect}"

move_down 20
font 'Times-Roman'
text 'Written in Times.'

move_down 20
font('Courier') do
    text 'Written in Courier because we are inside the block.'
end

move_down 20
text 'Written in Times again as we left the previous block.'

move_down 20
text "Let's see which font we are using again: #{font.inspect}"

move_down 20
font 'Helvetica'
text 'Back to normal.'
```

`font_size` works the same as `font`, in fact you can even pass `:size` to `font`. Can also supply the `:size` option to text methods. The default size is 12.

```ruby
text "Let's see which is the current font_size: #{font_size.inspect}"

move_down 10
font_size 16
text 'Yeah, something bigger!'

move_down 10
font_size(25) { text 'Even bigger!' }

move_down 10
text 'Back to 16 again.'

move_down 10
text 'Single line on 20 using the :size option.', size: 20

move_down 10
text 'Back to 16 once more.'

move_down 10
font('Courier', size: 10) do
    text 'Yeah, using Courier 10 courtesy of the font method.'
end

move_down 10
    font('Helvetica', size: 12)
text 'Back to normal'
```

And `:style` can be passed as an option to `font` or `text` methods.

```ruby
%w[Courier Helvetica Times-Roman].each do |example_font|
    move_down 20

    %i[bold bold_italic italic normal].each do |style|
        font example_font, style: style
        text "I'm writing in #{example_font} (#{style})"
    end
end
```

Same with color as RGB hex format or 4-value CMYK.

```ruby
text 'Default color is black'

move_down 25
text 'Changed to red', color: 'FF0000'

move_down 25
text 'CMYK color', color: [22, 55, 79, 30]

move_down 25
text(
    "Also works with <color rgb='ff0000'>inline</color> formatting",
    color: '0000FF',
    inline_format: true
)
```

Also options for alignment and a `leading` option which sets the gap between lines. It's possible to do inline formatting in a HTML-style syntax like so:

```ruby
%w[b i u strikethrough sub sup].each do |tag|
    text "Just your regular text <#{tag}>except this portion</#{tag}> " \
    "is using the #{tag} tag",
    inline_format: true
    move_down 10
end

text "This <font size='18'>line</font> uses " \
"<font name='Courier'>all the font tag</font> attributes in " \
"<font character_spacing='2'>a single line</font>. ",
inline_format: true
move_down 10

text "Coloring in <color rgb='FF00FF'>both RGB</color> " \
"<color c='100' m='0' y='0' k='0'>and CMYK</color>",
inline_format: true

move_down 10
text 'This an external link to the ' \
"<u><link href='https://github.com/prawnpdf/prawn/wiki'>Prawn wiki" \
'</link></u>',
inline_format: true
```

### Positioned Text

#### `column_box`

Allows you to define columns which flow their contents from one to the next. You can set a number of columns per page, and only when the last overflows will a new page be created.

```ruby
text 'The Prince', align: :center, size: 18
text 'Niccolò Machiavelli', align: :center, size: 14
move_down 12
column_box([0, cursor], columns: 2, width: bounds.width) do
    text((<<-TEXT.gsub(/\s+/, ' ') + "\n\n") * 3)
        All the States and Governments by which men are or ever have been ruled,
        have been and are either Republics or Princedoms. Princedoms are either
        hereditary, in which the sovereignty is derived through an ancient line
        of ancestors, or they are new. New Princedoms are either wholly new, as
        that of Milan to Francesco Sforza; or they are like limbs joined on to
        the hereditary possessions of the Prince who acquires them, as the
        Kingdom of Naples to the dominions of the King of Spain. The States thus
        acquired have either been used to live under a Prince or have been free;
        and he who acquires them does so either by his own arms or by the arms of
        others, and either by good fortune or by merit.
    TEXT
end
```

#### `draw_text`

Renders starting at the position provided to the `:at` option, won't flow to a new line even if it hits the document boundaries. So use it for short text with a fixed length.

```ruby
draw_text "This draw_text line is absolute positioned. However don't " \
    'expect it to flow even if it hits the document border',
    at: [200, 300]
```

#### `text_box`

Gives more control over the output. Can provide `:width` and `:height` which the text will flow within, even if `:width` isn't provided text will flow to a new line if it reaches the right border of the page.

```ruby
text_box 'This is a text box, you can control where it will flow by ' \
    'specifying the :height and :width options',
    at: [100, 250],
    height: 100,
    width: 100
text_box 'Another text box with no :width option passed, so it will ' \
    'flow to a new line whenever it reaches the right margin. ',
    at: [200, 100]
```

You can set the `:overflow` property to decide whether overflowing text will `:truncate` (default), `:expand` (the text box grows to fit the text) or `:shrink_to_fit` (the font size shrinks to fit in the text box). When using `:shrink_to_fit`, set `disable_wrap_by_char: true` to avoid wrapping breaking up the middle of words.
