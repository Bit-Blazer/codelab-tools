# Release v3.0.2

## What's Changed

### 🎯 Features

- **Add copy button functionality to step component** in [43b3455](https://github.com/Bit-Blazer/codelab-tools/commit/43b3455)

  - Removes Highlight.js copy button plugin dependency

- **Add dark mode across all custom web elements** in [d116dda](https://github.com/Bit-Blazer/codelab-tools/commit/d116dda)

- **Add New Google Codelab Catalog component** in [57fb052](https://github.com/Bit-Blazer/codelab-tools/commit/57fb052)

- **Add `claat catalog` command to build catalog site from CLI** in [887af80](https://github.com/Bit-Blazer/codelab-tools/commit/887af80)

- **Add home-url attribute support in google-codelab element metadata** in [7595c26](https://github.com/Bit-Blazer/codelab-tools/commit/7595c26)

- **Enhance author metadata to support clickable links in codelabs** in [ea156d8](https://github.com/Bit-Blazer/codelab-tools/commit/ea156d8)

  - Authors can now be linked to profiles or websites
  - Fixes [googlecodelabs/tools#236](https://github.com/googlecodelabs/tools/issues/236)

- **Allow iframe allowlist to be configurable via iframe-allowlist.json** in [15dfb95](https://github.com/Bit-Blazer/codelab-tools/commit/15dfb95)

  - Customizable iframe security settings
  - Fixes [googlecodelabs/tools#788](https://github.com/googlecodelabs/tools/issues/788)

### 🐛 Bug Fixes

- **Fix inline code in table not having inline code background** in [5e10b94](https://github.com/Bit-Blazer/codelab-tools/commit/5e10b94)

- **Fix parser: prevent paragraph splitting for inline formatted content** in [ce909b8](https://github.com/Bit-Blazer/codelab-tools/commit/ce909b8)

- **Fix: update command now preserves `source` metadata** in [5651474](https://github.com/Bit-Blazer/codelab-tools/commit/5651474)

  - Fixes [googlecodelabs/tools#302](https://github.com/googlecodelabs/tools/issues/302)

### 📚 Documentation

- **Improved claat help documentation** in [1032eba](https://github.com/Bit-Blazer/codelab-tools/commit/1032eba)

  - Enhanced command-line help text and usage examples

### 🧹 Maintenance

- **Cleanup - remove old test files** in [0663c30](https://github.com/Bit-Blazer/codelab-tools/commit/0663c30)

**Full Changelog**: https://github.com/Bit-Blazer/codelab-tools/compare/v3.0.1...v3.0.2

---

# Release v3.0.1

## What's Changed

### 🎯 Features

- **Add Google Docs Add-on for authoring codelabs** in [98a7646](https://github.com/Bit-Blazer/codelab-tools/commit/98a7646)

  - New [Google Docs Add-on](https://github.com/Bit-Blazer/codelab-tools/tree/main/gdoc-codelab-addon) to assist in authoring codelabs directly from Google Docs

- **Add modern standalone catalog for codelabs** in [3e2d094](https://github.com/Bit-Blazer/codelab-tools/commit/3e2d094)

  - Modern catalog design with improved user experience
  - Auto-build catalog workflow

- **Migrate to Google Analytics 4 (GA4)**

- **Wrap metadata block as YAML front matter**

- **Move away from deprecated Polymer components**

- **Add Survey functionality documentation**

### 🐛 Bug Fixes

- **Allow spaces in filenames of images via URL-encoded filenames** in [ca9135c](https://github.com/Bit-Blazer/codelab-tools/commit/ca9135c)

  - Fixes issue where `img/codelab%20example.png` would fail to resolve

- **Fix HTML escaping in code blocks** in [3b37123](https://github.com/Bit-Blazer/codelab-tools/commit/3b37123)

  - Reverts previous breaking change
  - Related to [googlecodelabs/tools#514](https://github.com/googlecodelabs/tools/pull/514)

- **Fix several inconsistencies** in [b1b7e0d](https://github.com/Bit-Blazer/codelab-tools/commit/b1b7e0d)

### 📚 Documentation

- **Add new comprehensive documentation** in [fa5769c](https://github.com/Bit-Blazer/codelab-tools/commit/fa5769c)

- **Add guides and sample codelabs** in [fe7b84e](https://github.com/Bit-Blazer/codelab-tools/commit/fe7b84e)

**Full Changelog**: https://github.com/Bit-Blazer/codelab-tools/compare/v3.0.0...v3.0.1

---

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
