# Codelab Format Guide Tools - Google Docs Add-on

A powerful Google Docs add-on that makes authoring codelabs effortless. Apply proper formatting with one click, validate your document, and ensure perfect compatibility with the [claat](https://github.com/Bit-Blazer/codelab-tools/tree/main/claat) parser.

[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)

<img width="375" height="1107" alt="Sidebar" src="https://github.com/user-attachments/assets/e70b72d8-259e-4fec-bc18-65ba96a89727" />

## 🎯 Features

- **One-Click Formatting**: Apply all codelab-specific formats instantly
- **Smart Context Detection**: Shows relevant options based on cursor position
- **Format Validation**: Catch formatting errors before export
- **Exact claat Compliance**: Uses precise colors and styles from claat parser
- **Beautiful UI**: Polished sidebar with organized format categories
- **Quick Actions**: Keyboard-friendly common operations

## 📋 Supported Formats

### Structure

- ✅ Step titles (H1)
- ✅ Section headers (H2-H4)
- ✅ Metadata table
- ✅ Duration/Environment annotations

### Special Blocks

- ✅ Positive infobox (tips, best practices)
- ✅ Negative infobox (warnings, restrictions)
- ✅ Code blocks (syntax highlighted)
- ✅ Console/Terminal blocks
- ✅ Survey questions

### Inline Formatting

- ✅ Inline code
- ✅ Download buttons
- ✅ Bold/Italic
- ✅ Links

### Advanced Features

- ✅ YouTube video embeds
- ✅ Iframe embeds
- ✅ FAQ sections
- ✅ "What you'll learn" checklists

## 🚀 Installation

### Option 1: Install from Google Workspace Marketplace (Recommended)

_Coming soon - add-on pending review_

### Option 2: Development with clasp (Recommended for Contributors)

[clasp](https://github.com/google/clasp) allows you to develop locally with VS Code and push to Google Apps Script.

#### First-time setup:

1. **Install clasp globally**

   ```bash
   npm install -g @google/clasp
   ```

2. **Clone this repo and navigate to add-on folder**

   ```bash
   cd gdoc-codelab-addon
   npm install
   ```

3. **Login to Google**

   ```bash
   npm run login
   # or: clasp login
   ```

4. **Create new Apps Script project**

   ```bash
   npm run create
   # or: clasp create --type standalone --title "Codelab Format Tools"
   ```

   This creates `.clasp.json` with your script ID.

5. **Push code to Google Apps Script**

   ```bash
   npm run push
   # or: clasp push
   ```

6. **Open in Apps Script editor** (optional)
   ```bash
   npm run open
   # or: clasp open
   ```

#### Development workflow:

- **Edit files** in VS Code
- **Push changes**: `npm run push`
- **Pull changes**: `npm run pull`
- **Open script**: `npm run open`

### Option 3: Manual Installation (No clasp)

1. **Open your Google Doc**

2. **Open Apps Script Editor**

   - Click `Extensions` > `Apps Script`

3. **Copy the code files**

   - Delete the default `Code.gs` content
   - Create new files for each `.gs` and `.html` file from this repo:
     - `Code.gs`
     - `ColorPalette.gs`
     - `Formatting.gs`
     - `Detection.gs`
     - `Validation.gs`
     - `Sidebar.html`

4. **Update the manifest**

   - Click the gear icon (⚙️) next to "Project Settings"
   - Replace `appsscript.json` content with the one from this repo

5. **Save and test**
   - Click the save icon (💾)
   - Refresh your Google Doc
   - Go to `Extensions` > `Codelab Format Guide Tools` > `Open Format Tools`

## 📖 Usage Guide

### Opening the Sidebar

After installation, open the sidebar via:

- Menu: `Extensions` > `Codelab Format Guide Tools` > `Open Format Tools`
- Or use Quick Actions from the menu

### Quick Actions

The sidebar provides instant access to common formats:

| Button       | Action           | Usage                           |
| ------------ | ---------------- | ------------------------------- |
| 📝 Step      | Insert H1        | Creates a new step heading      |
| 📄 Section   | Insert H2        | Creates a section within a step |
| ✅ Tip       | Positive Infobox | Green box for tips              |
| ⚠️ Warning   | Negative Infobox | Orange box for warnings         |
| 💻 Code      | Code Block       | Table with Courier New          |
| \`⌘\` Inline | Inline Code      | Courier New font                |

### Format Categories

#### 1. Headings & Structure

- **Step Title (H1)**: Required for table of contents
- **Section Heading (H2)**: Main sections within steps
- **Subsection (H3)**: Code filenames or subsections
- **Metadata Table**: Document metadata at start

#### 2. Blocks & Callouts

- **Positive Infobox**: Light green background (`#d9ead3`)
- **Negative Infobox**: Light orange background (`#fce5cd`)
- **Code Block**: Single-cell table with `Courier New`
- **Console Block**: Single-cell table with `Consolas`
- **Survey Question**: Light blue background with H4 + list

#### 3. Inline Formatting

- **Inline Code**: `Courier New` font for variable names
- **Download Button**: Green background (`#6aa84f`) + link
- **Duration**: `Duration: 5:00` in grey (`#b7b7b7`)
- **Environment**: `Environment: Web` in grey

#### 4. Special Features

- **YouTube Embed**: Image with alt text containing YouTube URL
- **Iframe Embed**: Image with alt text containing URL
- **FAQ Section**: H3 with exact text "Frequently Asked Questions"
- **What You'll Learn**: H2 with checklist

### Context-Aware Formatting

The sidebar detects your cursor position and shows:

- Current selection type
- Applied formatting
- Relevant actions
- Warnings if format is incorrect

### Validation

Click **"Validate Document"** to check:

- ✅ All steps have proper H1 headings
- ✅ Metadata table is present and complete
- ✅ Infoboxes use correct colors
- ✅ Duration/Environment have correct color
- ✅ Tables are properly formatted
- ✅ Common mistakes

## 🎨 Color Reference

These exact colors are required for claat compatibility:

| Element                     | Color          | Hex Code  |
| --------------------------- | -------------- | --------- |
| Meta (Duration/Environment) | Dark Grey 1    | `#b7b7b7` |
| Download Button             | Dark Green 1   | `#6aa84f` |
| Positive Infobox            | Light Green 3  | `#d9ead3` |
| Negative Infobox            | Light Orange 3 | `#fce5cd` |
| Survey Block                | Light Blue 3   | `#cfe2f3` |

## 🔧 Advanced Usage

### Custom Metadata Fields

The metadata table supports these fields:

- **Summary**: Brief description
- **URL**: Codelab URL suffix
- **Category**: Platform category (e.g., Web, Android)
- **Environment**: Target environments (comma-separated)
- **Status**: Draft, Published, Deprecated, Hidden
- **Feedback Link**: Bug report URL
- **Analytics Account**: Google Analytics ID

### YouTube Embeds

1. Insert an image (screenshot is fine)
2. Right-click > **Alt text**
3. In **Description**, paste: `https://www.youtube.com/watch?v=VIDEO_ID`
4. Image will be replaced with embedded video after export

### Iframe Embeds

Same as YouTube, but with any URL from allowlisted domains:

- glitch.com
- codepen.io
- jsfiddle.net
- repl.it
- And more...

## 📚 Export to Codelab

After formatting your document:

1. **Validate** using the add-on
2. **Publish** your Google Doc (make it viewable by anyone)
3. **Export** using claat:
   ```bash
   claat export <google-doc-url>
   ```

## 🛠️ Development

### Project Structure

```
gdoc-codelab-addon/
├── Code.gs              # Main add-on entry point
├── ColorPalette.gs      # Color constants
├── Formatting.gs        # Formatting functions
├── Detection.gs         # Context detection
├── Validation.gs        # Format validation
├── Sidebar.html         # UI sidebar
└── appsscript.json     # Manifest
```

### Testing Locally

1. Open Apps Script editor
2. Make changes to the files
3. Save and refresh your Google Doc
4. Test formatting functions

### Building Color Palette

Colors are extracted from `claat/parser/gdoc/css.go`:

```javascript
const DURATION_COLOR = "#b7b7b7";
const BUTTON_COLOR = "#6aa84f";
const INFOBOX_POSITIVE = "#d9ead3";
const INFOBOX_NEGATIVE = "#fce5cd";
const SURVEY_COLOR = "#cfe2f3";
```

## 🐛 Troubleshooting

### Sidebar Won't Open

- Check that script has authorization
- Refresh the document
- Try reopening from Extensions menu

### Colors Don't Match

- Ensure you're using exact hex values
- Don't rely on Google Docs color picker
- Use the add-on buttons for precise colors

### Validation Errors

- Check if metadata table is at document start
- Ensure H1 is used only for steps
- Verify infobox/code blocks are single-cell tables

### Export Issues

- Make sure document is published
- Check that all colors are exact
- Validate before exporting

## 📄 License

Apache 2.0 - Same as the parent claat-tools project

## 🙏 Credits

- Built for [claat-tools](https://github.com/Bit-Blazer/codelab-tools)
- Original claat by [Google Codelabs](https://github.com/googlecodelabs/tools)
- UX design inspired by modern Google Workspace add-ons

---

Made with ❤️ for the codelab community
