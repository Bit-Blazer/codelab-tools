# CLAAT User Guide

## What is CLAAT?

CLAAT (Codelabs As A Thing) is a command-line tool that converts documents into interactive codelabs. It takes input from Google Docs or local Markdown files and generates HTML codelabs in various formats.

## Installation

### Download Pre-compiled Binary

The easiest way is to download pre-compiled binaries from the [Releases page](https://github.com/Bit-Blazer/codelab-tools/releases/latest).

### Install with Go

If you have Go installed:

```bash
go install github.com/Bit-Blazer/codelab-tools/claat@latest
```

### Build from Source

1. Install [Go](https://golang.org/dl/)
2. Navigate to the claat directory
3. Run `make` to build the binary

## Commands

CLAAT provides four main commands:

### 1. Export Command

Converts source documents into codelabs in the specified format.

**Basic Usage:**

```bash
claat export [options] <source> [source ...]
```

**Examples:**

```bash
# Export a local markdown file to HTML
claat export path/to/codelab.md

# Export a Google Doc (use doc ID)
claat export 1ABC-XYZ123_docID

# Export to specific directory
claat export -o ./output path/to/codelab.md

# Export to stdout (no images or metadata)
claat export -o - path/to/codelab.md

# Export in markdown format
claat export -f md path/to/codelab.md

# Export in offline HTML format
claat export -f offline path/to/codelab.md
```

**Options:**

- `-o <dir>`: Output directory (default: current directory). Use `-` for stdout.
- `-f <format>`: Output format. Built-in formats:
  - `html` (default): Static HTML files
  - `md`: Markdown format
  - `offline`: Plain HTML for offline consumption
  - Or specify a path to custom Go template file
- `-e <env>`: Codelab environment (default: `web`)
- `-prefix <url>`: URL prefix for HTML format (default: `https://cdn.jsdelivr.net/gh/Bit-Blazer/codelab-tools@main/codelab-elements/build/`)
- `-ga4 <account>`: Global Google Analytics 4 account (default: `G-XXXXXXXXXX`)
- `-auth <token>`: OAuth2 Bearer token for Google Drive API
- `-pass_metadata <fields>`: Comma-delimited list of metadata fields to pass through
- `-extra <json>`: Additional template variables as JSON object (e.g., `{"key":"value"}`)

**Supported Source Formats:**

- Google Docs (Codelab Format)
- Markdown files (local)

**Notes:**

- For Google Docs, provide only the doc ID (not the full URL)
- Built-in templates are not guaranteed to be stable; use custom templates for production
- Multiple sources can be exported in one command
- Returns non-zero exit code if any source fails

### 2. Serve Command

Starts a local web server to preview exported codelabs.

**Usage:**

```bash
claat serve [options]
```

**Examples:**

```bash
# Serve on default address (localhost:9090)
claat serve

# Serve on custom address
claat serve -addr localhost:8080

# Serve on all interfaces
claat serve -addr 0.0.0.0:8080
```

**Options:**

- `-addr <host:port>`: Hostname and port to bind to (default: `localhost:9090`)

### 3. Update Command

Re-exports existing codelabs by scanning directories for `codelab.json` metadata files.

**Usage:**

```bash
claat update [options] [directory ...]
```

**Examples:**

```bash
# Update all codelabs in current directory
claat update

# Update codelabs in specific directories
claat update ./codelabs ./more-codelabs

# Update with custom prefix
claat update -prefix https://my-cdn.com

# Update with custom GA4
claat update -ga4 G-MYTRACKING123
```

**Options:**

- `-prefix <url>`: Override URL prefix from metadata
- `-ga4 <account>`: Override GA4 account from metadata
- `-auth <token>`: OAuth2 Bearer token for Google Drive API
- `-pass_metadata <fields>`: Comma-delimited metadata fields to pass through
- `-extra <json>`: Additional template variables as JSON

**Behavior:**

- Scans directories recursively for `codelab.json` files
- Re-exports each found codelab using stored metadata
- Deletes unused assets and images
- If codelab ID changed, deletes old directory and creates new one
- Doesn't follow symbolic links
- Returns non-zero if no metadata found or any update fails

### 4. Version Command

Displays the version of CLAAT.

**Usage:**

```bash
claat version
```
