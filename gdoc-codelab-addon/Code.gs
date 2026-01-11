/**
 * Codelab Format Guide Tools - Main Add-on File
 * 
 * This Google Docs add-on helps authors create properly formatted codelabs
 * that work seamlessly with the claat (Codelab As A Tool) parser.
 */

/**
 * Runs when the add-on is installed or document is opened
 */
function onOpen(e) {
    DocumentApp.getUi()
        .createAddonMenu()
        .addItem('Open Format Tools', 'showSidebar')
        .addSeparator()
        .addItem('Validate Format', 'validateDocument')
        .addItem('Show Format Guide', 'showFormatGuide')
        .addToUi();
}

/**
 * Runs when add-on is installed
 */
function onInstall(e) {
    onOpen(e);
}

/**
 * Open the sidebar
 */
function showSidebar() {
    const html = HtmlService.createHtmlOutputFromFile('Sidebar')
        .setTitle('Codelab Format Tools');

    DocumentApp.getUi().showSidebar(html);
}

/**
 * Wrapper functions for menu items
 */
function insertSectionH2() {
    insertSectionHeading(2);
}

function insertSectionH3() {
    insertSectionHeading(3);
}

/**
 * Show format guide in a dialog
 */
function showFormatGuide() {
    const html = HtmlService.createHtmlOutput(`
    <h2>Codelab Format Guide</h2>
    <h3>Structure</h3>
    <ul>
      <li><strong>Heading 1:</strong> Step titles (creates table of contents)</li>
      <li><strong>Heading 2-4:</strong> Section headers within steps</li>
      <li><strong>Metadata Table:</strong> 2-column table at document start</li>
    </ul>
    
    <h3>Special Blocks</h3>
    <ul>
      <li><strong>Positive Infobox:</strong> Light green background for tips</li>
      <li><strong>Negative Infobox:</strong> Light orange background for warnings</li>
      <li><strong>Survey:</strong> Light blue background with H4 + bullet list</li>
      <li><strong>Code Block:</strong> Single-cell table with Courier New</li>
      <li><strong>Console Block:</strong> Single-cell table with Consolas</li>
    </ul>
    
    <h3>Text Formatting</h3>
    <ul>
      <li><strong>Inline Code:</strong> Courier New font</li>
      <li><strong>Meta (Duration/Environment):</strong> Dark grey text</li>
      <li><strong>Download Button:</strong> Dark green background + link</li>
    </ul>
    
    <h3>Special Features</h3>
    <ul>
      <li><strong>YouTube:</strong> Image with alt text containing youtube.com URL</li>
      <li><strong>FAQ Section:</strong> H3 with text "Frequently Asked Questions"</li>
      <li><strong>What You'll Learn:</strong> H2 with exact text creates checklist</li>
    </ul>
    
    <p><a href="https://github.com/googlecodelabs/tools" target="_blank">Full Documentation</a></p>
  `)
        .setWidth(500)
        .setHeight(600);

    DocumentApp.getUi().showModalDialog(html, 'Codelab Format Guide');
}

/**
 * Validate document format
 */
function validateDocument() {
    const validation = performValidation();

    const html = HtmlService.createHtmlOutput(`
    <style>
      body { font-family: Arial, sans-serif; padding: 16px; }
      .status { padding: 12px; border-radius: 4px; margin-bottom: 16px; }
      .success { background: #d9ead3; border: 1px solid #6aa84f; }
      .warning { background: #fce5cd; border: 1px solid #e69138; }
      .error { background: #f4cccc; border: 1px solid #cc0000; }
      .issue { margin: 8px 0; padding: 8px; background: #f8f9fa; border-left: 3px solid #1a73e8; }
      ul { margin: 8px 0; }
      li { margin: 4px 0; }
    </style>
    
    <h2>Format Validation Results</h2>
    
    <div class="status ${validation.status}">
      <strong>${validation.statusText}</strong>
    </div>
    
    <h3>Document Stats</h3>
    <ul>
      <li>Steps (H1): ${validation.stats.steps}</li>
      <li>Positive Infoboxes: ${validation.stats.positiveInfoboxes}</li>
      <li>Negative Infoboxes: ${validation.stats.negativeInfoboxes}</li>
      <li>Code Blocks: ${validation.stats.codeBlocks}</li>
      <li>Survey Blocks: ${validation.stats.surveys}</li>
    </ul>
    
    ${validation.issues.length > 0 ? `
      <h3>Issues Found</h3>
      ${validation.issues.map(issue => `
        <div class="issue">
          <strong>${issue.type}:</strong> ${issue.message}
        </div>
      `).join('')}
    ` : '<p>✓ No issues found!</p>'}
    
    <button onclick="google.script.host.close()">Close</button>
  `)
        .setWidth(500)
        .setHeight(600);

    DocumentApp.getUi().showModalDialog(html, 'Validation Results');
}
