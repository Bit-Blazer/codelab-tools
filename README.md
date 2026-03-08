# Codelabs Catalog

A modern, lightweight static catalog for browsing codelabs.

## Features

- 🎨 **Modern Design** - Clean, responsive card-based layout
- 🔍 **Instant Search** - Real-time search across titles, summaries, categories, and tags
- 🏷️ **Filter & Sort** - Filter by category, sort by title/date/duration
- 🌓 **Dark Mode** - Automatic theme switching with persistence
- 📱 **Responsive** - Works perfectly on mobile, tablet, and desktop
- ⚡ **Zero Dependencies** - Pure HTML/CSS/JS, no frameworks needed
- 🚀 **Static** - No server required, works on file:// protocol

## Quick Start

### Setup Workflow

1. **Download/Clone** this catalog folder
2. **Navigate** into the catalog directory:

   ```bash
   cd catalog
   ```

3. **Create** a `codelabs` folder for source markdown files:

   ```bash
   mkdir codelabs
   ```

4. **Write** your codelab markdown files in the `codelabs` folder
5. **Export** them to the catalog root:

   ```bash
   cd codelabs
   claat export -o .. your-tutorial.md
   ```

6. **Build** the index:

   ```bash
   cd ..
   node build-index.js . codelabs.json
   ```

7. **Serve** the catalog:

   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx http-server

   # Or just open index.html in your browser
   ```

## File Structure

```
catalog/
├── index.html         # Main catalog page
├── style.css          # Styles (light/dark theme)
├── app.js             # Search/filter/sort logic
├── build-index.js     # Index generator script
├── codelabs.json      # Generated index file
├── README.md          # This file
├── tutorial-1/        # Exported codelab (at root for clean URLs)
│   ├── index.html
│   └── codelab.json
├── tutorial-2/        # Exported codelab (at root for clean URLs)
│   ├── index.html
│   └── codelab.json
└── codelabs/          # Source markdown files
    ├── tutorial-1.md
    └── tutorial-2.md
```

**URL Structure:**

- Catalog homepage: `https://yoursite.com/`
- Codelab pages: `https://yoursite.com/tutorial-1/`
- Source files: `https://yoursite.com/codelabs/tutorial-1.md`

## Build Index Options

```bash
# Scan current directory for exported codelabs, write to codelabs.json
node build-index.js . codelabs.json

# Scan specific directory (legacy structure)
node build-index.js ./codelabs codelabs.json

# Custom output file
node build-index.js . output.json
```

## Integration with CLAAT

### Automatic Index Updates

Add to your build script:

```bash
#!/bin/bash
# Export all markdown files from codelabs/ to root
cd codelabs
for file in *.md; do
  claat export -o .. "$file"
done

# Rebuild catalog index
cd ..
node build-index.js . codelabs.json
```
