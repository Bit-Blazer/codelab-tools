# Development with clasp

Quick reference for developing the Codelab Format Tools add-on using clasp.

## Initial Setup

```bash
# Install clasp globally (one-time)
npm install -g @google/clasp

# Install project dependencies
cd gdoc-codelab-addon
npm install

# Login to Google account
npm run login

# Create new Apps Script project
npm run create
```

The `create` command will generate a `.clasp.json` file with your script ID.

## Daily Development

### Edit → Push → Test

1. **Edit files** in VS Code (better than online editor)
2. **Push to Google**: `npm run push`
3. **Test** in Google Docs

### Common Commands

```bash
# Push local changes to Google Apps Script
npm run push

# Pull changes from Google Apps Script
npm run pull

# Open project in browser Apps Script editor
npm run open

# Deploy a new version
npm run deploy

# List all deployments
npm run deployments

# Create a version
npm run version

# List all versions
npm run versions
```

## Project Structure

Only these files are pushed (see `.claspignore`):

- `*.gs` - Google Apps Script files
- `*.html` - HTML files (sidebar)
- `appsscript.json` - Manifest

These are ignored:

- `README.md`, `QUICKSTART.md`
- `package.json`, `node_modules/`
- Git files

## Tips

### TypeScript Support

For better IntelliSense, install types:

```bash
npm install --save-dev @types/google-apps-script
```

Create `jsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES6",
    "lib": ["ES6"]
  },
  "include": ["*.gs", "*.js"]
}
```

### Watch Mode (Auto-push)

```bash
# Install watch tool
npm install -g onchange

# Auto-push on file changes
onchange '*.gs' '*.html' 'appsscript.json' -- clasp push
```

### Multiple Environments

Create different `.clasp.json` files:

```bash
# Development
cp .clasp.json .clasp.dev.json

# Production
cp .clasp.json .clasp.prod.json

# Switch environments
cp .clasp.dev.json .clasp.json
npm run push
```

### Debugging

1. Push code: `npm run push`
2. Open in editor: `npm run open`
3. Use `Logger.log()` or `console.log()` in code
4. View logs: Executions → View logs

## Troubleshooting

### "Script ID not found"

Make sure `.clasp.json` has your script ID:

```json
{
  "scriptId": "YOUR_SCRIPT_ID_HERE",
  "rootDir": "."
}
```

### "Login required"

Run `npm run login` again.

### "Files not pushing"

Check `.claspignore` - make sure your files aren't excluded.

### "Permission denied"

1. Open script: `npm run open`
2. Run any function manually
3. Grant permissions
4. Try push again

## Links

- [clasp documentation](https://github.com/google/clasp)
- [Apps Script reference](https://developers.google.com/apps-script/reference)
- [Apps Script guides](https://developers.google.com/apps-script/guides)
