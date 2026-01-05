# Codelab Elements

Web components (custom elements) that power the interactive codelab experience. These elements provide the UI framework for displaying codelabs in a web browser. Based on [Custom Elements Spec](https://html.spec.whatwg.org/multipage/custom-elements.html)

## Overview

This directory contains the client-side JavaScript and CSS for rendering codelabs as interactive web tutorials. The elements are built using web component standards and compiled with Closure Compiler for optimal performance.

## Components

### Core Elements

- **`google-codelab`** - Main container element that orchestrates the entire codelab experience

  - Manages navigation between steps
  - Handles progress tracking
  - Coordinates with analytics
  - Controls the drawer/sidebar

- **`google-codelab-step`** - Individual step/page within a codelab

  - Renders step content
  - Displays duration
  - Handles step-specific styling
  - Supports buttons, code blocks, images, etc.

- **`google-codelab-about`** - About section displaying metadata

  - Shows codelab title
  - Lists authors
  - Displays last updated date

- **`google-codelab-survey`** - Interactive survey/quiz element

  - Radio button groups for multiple choice
  - Stores responses in LocalStorage
  - Sends analytics events

- **`google-codelab-analytics`** - Google Analytics integration
  - Tracks page views
  - Records user interactions
  - Monitors survey responses
  - Measures completion rates

## Build System

Uses **[Bazel](https://bazel.build)** for building and bundling:

```bash
# Install Bazel
npm i

# Build all elements
npm run build

# Output: codelab-elements/build/
# - codelab-elements.min.js (minified)
# - codelab-elements.min.css (minified)
```

The build process:

1. Compiles SCSS to CSS
2. Processes Closure Templates (Soy)
3. Bundles JavaScript with Closure Compiler
4. Generates minified outputs

## Architecture

### Technology Stack

- **Web Components** - [Custom element](https://html.spec.whatwg.org/multipage/custom-elements.html) APIs
- **SCSS** - Styling with Sass preprocessing
- **Closure Compiler** - JavaScript optimization (ADVANCED mode)
- **Closure Templates** - Template system for HTML rendering
- **Bazel** - Build system and dependency management

## Development

### Building

```bash
# Clean previous build
npm run clean

# Build elements
npm run build

# Run tests
npm run test
```

### Testing

The build includes a test suite in `demo/`:

```bash
npm run test
```

### Local Development

To test changes with a live codelab:

```bash
# 1. Build elements
npm run build

# 2. Export a test codelab pointing to local build
npm run demo

# 3. Open exported codelab in browser
```
