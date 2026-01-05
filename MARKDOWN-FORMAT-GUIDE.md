# Markdown Format Guide for Codelabs

This guide explains how to write codelabs using Markdown. Codelabs are interactive tutorials that guide users through a hands-on learning experience.

## Quick Start

A minimal codelab requires:

1. **Metadata** - Information about your codelab
2. **Title** - Main heading with `#`
3. **Steps** - Sections with `##`
4. **Content** - Your tutorial content

## File Structure

```markdown
authors: Your Name
summary: Brief description of what users will learn
id: unique-codelab-id
categories: topic1, topic2
environments: Web
status: Published

# Your Codelab Title

## Step 1: Introduction

Duration: 2:00

Step content goes here...

## Step 2: Next Step

Duration: 5:00

More content...
```

---

## Metadata

Metadata **must** appear at the top of your file before the title. Each field is on its own line in `key: value` format.

### Required Fields

```markdown
id: unique-codelab-identifier
```

- Lowercase letters, numbers, and hyphens only
- Must be unique across all codelabs
- Used in URLs and file paths

### Supported Fields

| Field                   | Description                            | Example                                      |
| ----------------------- | -------------------------------------- | -------------------------------------------- |
| `id`                    | Unique identifier (lowercase, hyphens) | `my-first-codelab`                           |
| `summary`               | Short description (1-2 sentences)      | `Learn how to build a web app`               |
| `authors`               | Author name(s)                         | `John Doe`                                   |
| `categories`            | Comma-separated topics                 | `web, javascript, tutorial`                  |
| `environments`          | Where codelab appears (adds to tags)   | `Web`, `Kiosk`                               |
| `status`                | Publication status                     | `Draft`, `Published`, `Deprecated`, `Hidden` |
| `tags`                  | Additional tags (comma-separated)      | `beginner, frontend, interactive`            |
| `feedback link`         | URL for user feedback                  | `https://github.com/user/repo/issues`        |
| `home url`              | Back/Done button destination           | `/course_page/`                              |
| `source`                | Source document Name / ID / URL        | `1A2B3C4D5E6F`                               |
| `duration`              | Total duration in minutes              | `45`                                         |
| `analytics ga4 account` | Google Analytics 4 tracking ID         | `G-XXXXXXXXXX`                               |

---

## Title

Use a single `#` for the main title. This appears once, after metadata.

```markdown
# Building Your First Web App
```

---

## Steps

Each step is a `##` heading. Everything after the heading belongs to that step until the next `##` or end of file.

```markdown
## Step 1: Getting Started

Duration: 3:00

Your content here...

## Step 2: Writing Code

Duration: 10:00

More content...
```

### Duration

Add `Duration: mm:ss` on the line immediately after the step heading. This helps users estimate time to complete.

```markdown
## Deploy to Production

Duration: 15:00
```

Formats accepted:

- `mm:ss` - Minutes and seconds (e.g., `5:30`)
- `hh:mm:ss` - Hours, minutes, seconds (e.g., `1:30:00`)

---

## Content Elements

### Text Formatting

Standard Markdown works as expected:

```markdown
**bold text**
_italic text_
`inline code`
[link text](https://example.com)
```

### Headings

Use `###` for subheadings within a step:

```markdown
## Main Step

### Subsection Title

Content under the subsection...
```

### Lists

**Unordered:**

```markdown
- Item one
- Item two
- Item three
```

**Ordered:**

```markdown
1. First step
2. Second step
3. Third step
```

### Code Blocks

Use fenced code blocks with language hints for syntax highlighting:

````markdown
```javascript
function hello() {
  console.log("Hello, world!");
}
```
````

**Supported languages:** `javascript`, `python`, `java`, `go`, `bash`, `html`, `css`, `json`, `yaml`, etc.

**Disable highlighting:**

````markdown
```console
Plain text without highlighting
```
````

### Images

```markdown
![alt text](path/to/image.png)
```

Images should be in an `img/` folder relative to your markdown file.

### Info Boxes

Info boxes highlight important information with colored backgrounds.

**Positive** (green) - Tips, best practices:

```markdown
Positive
: This is a helpful tip that will save you time!

> aside positive
> This is a helpful tip that will save you time!

<aside class="positive">
This is a helpful tip that will save you time!
</aside>
```

**Negative** (yellow/orange) - Warnings, limitations:

```markdown
Negative
: Warning: Make sure to back up your data before proceeding.

> aside negative
> Warning: Make sure to back up your data before proceeding.

<aside class="negative">
Warning: Make sure to back up your data before proceeding.
</aside>
```

### Buttons

Buttons can be created in two ways:

#### Method 1: Markdown links starting with "Download"

Any link that starts with "Download " (case-insensitive) will automatically render as a styled download button. Each button should be on its own line (separated by blank lines):

```markdown
[Download SDK](https://example.com/sdk.zip)

[Download Sample Code](https://example.com/sample.zip)
```

#### Method 2: HTML button with anchor element

```markdown
<button>
  <a href="https://example.com/docs">View Documentation</a>
</button>
```

### Tables

Standard Markdown tables:

```markdown
| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Row 1    | Data     | Data     |
| Row 2    | Data     | Data     |
```

**Table alignment:**

Use colons in the separator line to align columns:

```markdown
| Left Aligned | Center Aligned | Right Aligned |
| :----------- | :------------: | ------------: |
| Left         |     Center     |         Right |
| Text         |      Text      |          Text |
```

- `:---` - Left aligned (default)
- `:---:` - Center aligned
- `---:` - Right aligned

### Videos and Embedded Content

**YouTube videos:**

```markdown
<video id="VIDEO_ID"></video>
```

Replace `VIDEO_ID` with the actual YouTube video ID (e.g., `dQw4w9WgXcQ` from `https://www.youtube.com/watch?v=dQw4w9WgXcQ`).

**Embedded iframes:**

Embed interactive content from allowlisted domains using image syntax with the URL in the alt text:

```markdown
![https://codepen.io/example](https://codepen.io/example "Title")
```

**Allowlisted domains:** codepen.io, dartpad.dev, glitch.com, github.com, observablehq.com, repl.it, stackblitz.com, vimeo.com, and more (see [iframe.go](claat\nodes\iframe.go#L5) for full list). Only HTTPS URLs are allowed.

---

## Surveys

Surveys allow you to collect user feedback through multiple-choice questions. Responses are stored locally in the browser and sent to Google Analytics (if configured) as custom variables.

### Survey Syntax

Use HTML `<form>` elements with these components:

- `<name>` element - The question text (acts as a label)
- `<input type="radio" value="...">` elements - The answer options

### Example

```markdown
<form>
  <name>What is your experience level with Python?</name>
  <input type="radio" value="Beginner">
  <input type="radio" value="Intermediate">
  <input type="radio" value="Advanced">
  <input type="radio" value="Expert">
</form>
```

---

## Example Codelab

````markdown
authors: Jane Developer
summary: Learn the basics of creating interactive codelabs
id: getting-started-with-codelabs
categories: tutorial,markdown
environments: Web
status: Published
feedback link: https://github.com/example/issues

# Getting Started with Codelabs

## Overview

Duration: 2:00

Welcome! In this codelab, you'll learn how to create your own interactive tutorials.

**What you'll learn:**

- How to structure a codelab
- Markdown syntax for codelabs
- How to add code blocks and images

**What you'll need:**

- A text editor
- Basic Markdown knowledge

## Creating Your First Step

Duration: 5:00

Let's create a simple step.

### Step Structure

Each step starts with a `##` heading:

```markdown
## My Step Title

Duration: 3:00

Step content here...
```

Positive
: Remember to add duration estimates to help users plan their time!

## Adding Code Examples

Duration: 8:00

Code blocks use triple backticks with a language hint:

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```

### Testing Your Code

Always test code examples before publishing.

Negative
: Broken code examples frustrate users and reduce trust in your content.

## Congratulations!

Duration: 1:00

You've learned the basics of creating codelabs!

**What you learned:**

- Codelab structure
- Markdown syntax
- Best practices

**Next steps:**

- Create your first codelab
- Share it with others
- Gather feedback and iterate

<button>
  [Download Template](https://example.com/template.md)
</button>
```
````

---

## Exporting Your Codelab

Once your Markdown file is ready:

```bash
# Build the tool
cd claat
go build -o bin/claat.exe

# Export your codelab
.\bin\claat.exe export your-codelab.md

# Preview locally
.\bin\claat.exe serve
```

Open <http://localhost:9090> in your browser to preview.

---

## Resources

- [Sample Codelab](sample/codelab.md) - A complete example
- [Codelab Viewer](https://codelabs.developers.google.com) - See published examples
- [GitHub Issues](https://github.com/Bit-Blazer/codelab-tools/issues) - Report bugs or request features
