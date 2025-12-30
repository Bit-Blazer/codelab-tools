# Release v3.0.0

## What's Changed

### 🎯 Features

- **Add home URL metadata support for navigation buttons** in 487db61

  - Customize back button and done button destinations with `home url:` metadata
  - Fixes googlecodelabs/tools#103 and googlecodelabs/tools#535
  - Discussion: [Thread 1](https://groups.google.com/g/codelab-authors/c/UX-tcdc0P20/m/Arl0UdbBBAAJ) | [Thread 2](https://groups.google.com/g/codelab-authors/c/x0CwV2yg6tA/m/WjRqNCNpBwAJ)

- **Replace prettify with Highlight.js and add copy button plugin** in d32f3ea

  - Modern syntax highlighting with 190+ languages
  - Copy button on all code blocks
  - Fixes googlecodelabs/tools#523, googlecodelabs/tools#412, googlecodelabs/tools#133, googlecodelabs/tools#52

- **Add alignment support for tables in HTML rendering** in 6f1749e

  - Tables now respect left/center/right alignment from markdown syntax

- **Auto-wrap download links in button nodes** in df14cc9

  - Links starting with "Download " automatically render as styled buttons
  - Fixes googlecodelabs/tools#816, googlecodelabs/tools#402, googlecodelabs/tools#55

- **Fix infobox parsing** in 69bd0a3
  - Fixes googlecodelabs/tools#627

### 🚀 CI/CD

- **Add GitHub Actions workflow for release automation** in 4c21fb8
  - Automated builds for macOS, Linux, and Windows (32/64-bit)

**Full Changelog**: https://github.com/Bit-Blazer/codelab-tools/compare/873fe39...v3.0.0
