authors: Test Author, Another Author
summary: A comprehensive test codelab demonstrating all supported markdown features
id: test-all-features
categories: testing, markdown, demo
environments: Web
status: Published
tags: sample, comprehensive, test
feedback link: https://github.com/example/feedback
home url: /sample-course/
source: test-source-doc
duration: 30
analytics ga4 account: G-4LV2JBSBPM

# Test All Features Codelab

## Overview

Duration: 2:00

This is a **comprehensive test codelab** that demonstrates _all supported markdown features_. It includes every type of element you can use in a codelab.

### What you'll learn

- How to use all markdown elements
- Different types of content blocks
- Special codelab syntax

### What you'll need

- A text editor
- Basic markdown knowledge
- `claat` tool installed

Positive
: This is a positive infobox! Use it for tips and best practices.

Negative
: This is a negative/warning infobox! Use it for warnings and important notes.

## Text Formatting

Duration: 3:00

This section demonstrates various text formatting options.

### Basic Formatting

Here's **bold text**, _italic text_, and `inline code`.

You can also combine them: **_bold and italic_**, **`bold code`**, and _`italic code`_.

### Links

Here's a [link to Google](https://www.google.com) and another [link to GitHub](https://github.com).

### Paragraphs

This is a paragraph with multiple sentences. It contains regular text that spans across lines. The renderer will handle line breaks appropriately.

This is a second paragraph separated by a blank line.

## Lists and Structure

Duration: 4:00

### Unordered Lists

- First item
- Second item
- Third item
  - Nested item 1
  - Nested item 2
- Fourth item

### Ordered Lists

1. First step
2. Second step
3. Third step
   1. Sub-step A
   2. Sub-step B
4. Fourth step

### Mixed Lists

1. Start with ordered
2. Continue ordered
   - Nested unordered item
   - Another nested item
3. Back to ordered

## Code Blocks

Duration: 5:00

### JavaScript

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
  return true;
}

// Call the function
greet("World");
```

### Python

```python
def calculate_sum(numbers):
    """Calculate the sum of a list of numbers."""
    total = sum(numbers)
    return total

result = calculate_sum([1, 2, 3, 4, 5])
print(f"Sum: {result}")
```

### HTML

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Test Page</title>
  </head>
  <body>
    <h1>Hello World</h1>
    <p>This is a test.</p>
  </body>
</html>
```

### CSS

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.button {
  background-color: #4285f4;
  color: white;
  border: none;
  padding: 10px 20px;
}
```

### Bash/Shell

```bash
#!/bin/bash

echo "Starting deployment..."
npm install
npm run build
npm test

if [ $? -eq 0 ]; then
  echo "Tests passed!"
else
  echo "Tests failed!"
  exit 1
fi
```

### Console (No Highlighting)

```console
$ npm install
$ npm run build
$ npm test

> test@1.0.0 test
> jest

PASS  tests/example.test.js
✓ should pass (2 ms)
```

### JSON

```json
{
  "name": "test-project",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.0",
    "lodash": "^4.17.21"
  }
}
```

### Go

```go
package main

import "fmt"

func main() {
    message := "Hello, Go!"
    fmt.Println(message)

    numbers := []int{1, 2, 3, 4, 5}
    sum := 0
    for _, num := range numbers {
        sum += num
    }
    fmt.Printf("Sum: %d\n", sum)
}
```

## Info Boxes

Duration: 3:00

### Positive Info Boxes

Positive
: Use positive info boxes for helpful tips and best practices. They can contain **formatted text**, _italics_, and `inline code` too!

> aside positive
> Same message using blockquote syntax.

<aside class="positive">
Same message using HTML syntax.
</aside>

### Negative Info Boxes

Negative
: Warning! This is important information you shouldn't ignore.

> aside negative
> Same warning using blockquote syntax.

<aside class="negative">
Same warning using HTML syntax.
</aside>

## Tables

Duration: 4:00

### Simple Table

| Name    | Age | City          |
| ------- | --- | ------------- |
| Alice   | 30  | New York      |
| Bob     | 25  | San Francisco |
| Charlie | 35  | London        |

### Table with Alignment

| Left Aligned | Center Aligned | Right Aligned |
| :----------- | :------------: | ------------: |
| Left         |     Center     |         Right |
| A            |       B        |             C |
| 1            |       2        |             3 |

### Image

![Sample Image](img/codelabexample.png)

## Videos and Media

Duration: 2:00

### YouTube Video

Embed YouTube videos using the video tag with the video ID:

<video id="dQw4w9WgXcQ"></video>

### Embedded Iframes

Embed interactive content from allowlisted domains (CodePen, Glitch, StackBlitz, etc.):

![https://codepen.io/team/codepen/embed/preview/PNaGbb](https://codepen.io/team/codepen/embed/preview/PNaGbb "CodePen Example")

## Buttons and Downloads

Duration: 2:00

### Download Buttons

[Download SDK](https://example.com/sdk.zip)

[Download Source Code](https://example.com/source.zip)

## Congratulations

Duration: 1:00

You've successfully tested all codelab features!

### What we've covered

- ✅ Text formatting (bold, italic, code)
- ✅ Lists (ordered, unordered, nested)
- ✅ Code blocks with syntax highlighting
- ✅ Info boxes (positive and negative)
- ✅ Tables with alignment
- ✅ Images
- ✅ Download buttons
- ✅ Advanced combinations

### Following links have special List Styling

#### [github repo](https://github.com/googlecodelabs/tools)

### Frequently Asked Questions

- [Stack Overflow](https://stackoverflow.com/questions/tagged/google-codelabs)
- [Google Cloud Console Help](https://cloud.google.com/support/docs/)
- [Android Developers Help](https://developer.android.com/support)
- [Google webmaster Help](https://support.google.com/webmasters/)

### Next steps

- Create your own codelab
- Experiment with different elements
- Share your codelabs with others

<button>
  <a href="https://github.com/googlecodelabs/tools">View Documentation</a>
</button>

<button>
  <a href="https://github.com/googlecodelabs/tools/tree/master/claat">Create Your Own</a>
</button>

Positive
: Thanks for testing! If you found any issues, please report them.
