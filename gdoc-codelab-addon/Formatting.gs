/**
 * Core formatting functions for codelab authoring.
 * All functions apply claat-compliant formatting to Google Docs.
 */

/**
 * Helper: Get insertion index for cursor position
 * @returns {number|null} - Returns insertion index or null if no cursor
 */
function getInsertionIndex(cursor) {
  if (!cursor) {
    showAlert("Please place your cursor where you want to insert content.");
    return null;
  }

  const body = DocumentApp.getActiveDocument().getBody();
  const position = cursor.getElement();
  const parent = position.getParent();

  if (parent.getType() === DocumentApp.ElementType.BODY_SECTION) {
    return body.getChildIndex(position);
  }

  let currentParent = parent;
  while (currentParent && currentParent.getType() !== DocumentApp.ElementType.BODY_SECTION) {
    const tempParent = currentParent.getParent();
    if (tempParent && tempParent.getType() === DocumentApp.ElementType.BODY_SECTION) {
      return body.getChildIndex(currentParent);
    }
    currentParent = tempParent;
  }

  return 0;
}

/**
 * Insert duration annotation at cursor
 */
function insertDuration() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const insertIndex = getInsertionIndex(doc.getCursor());

  if (insertIndex === null) return;

  // Insert duration paragraph with default 5:00
  const metaPara = body.insertParagraph(insertIndex + 1, "Duration: 5:00");
  metaPara.editAsText().setForegroundColor(DURATION_COLOR);
  metaPara.editAsText().setBold(false);
  metaPara.editAsText().setItalic(false);

  // Insert blank normal paragraph after so format doesn't continue
  body.insertParagraph(insertIndex + 2, "");

  return "Duration added - Edit the time (format: MM:SS)";
}

/**
 * Create a single-cell table for infobox, code, or survey
 * @param {string} type - 'positive', 'negative', 'code', 'console', 'survey'
 * @param {string} content - Initial content for the cell
 */
function createSingleCellTable(type, content = "") {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const insertIndex = getInsertionIndex(doc.getCursor());

  if (insertIndex === null) return null;

  // Create table
  const table = body.insertTable(insertIndex + 1);
  const row = table.appendTableRow();
  const cell = row.appendTableCell(content);

  // Apply formatting based on type
  switch (type) {
    case "positive":
      cell.setBackgroundColor(INFOBOX_POSITIVE);
      cell.editAsText().setFontFamily("Arial");
      break;

    case "negative":
      cell.setBackgroundColor(INFOBOX_NEGATIVE);
      cell.editAsText().setFontFamily("Arial");
      break;

    case "code":
      cell.setBackgroundColor("#ffffff");
      cell.editAsText().setFontFamily(FONT_CODE);
      break;

    case "console":
      cell.setBackgroundColor("#ffffff");
      cell.editAsText().setFontFamily(FONT_CONSOLE);
      break;

    case "survey":
      cell.setBackgroundColor(SURVEY_COLOR);
      cell.editAsText().setFontFamily("Arial");
      break;
  }

  // Set padding
  cell.setPaddingTop(8);
  cell.setPaddingBottom(8);
  cell.setPaddingLeft(8);
  cell.setPaddingRight(8);

  return table;
}

/**
 * Create positive infobox (green background)
 */
function createPositiveInfobox() {
  createSingleCellTable("positive", "Add your note here...");
  return "Positive infobox created - Use for tips and best practices";
}

/**
 * Create negative infobox (orange background)
 */
function createNegativeInfobox() {
  createSingleCellTable("negative", "Add your warning here...");
  return "Negative infobox created - Use for warnings and limitations";
}

/**
 * Create code block (Courier New font)
 */
function createCodeBlock() {
  createSingleCellTable("code", "// Your code here");
  return "Code block created - Add H3 with filename above";
}

/**
 * Create console/terminal block (Consolas font)
 */
function createConsoleBlock() {
  createSingleCellTable("console", "$ your command here");
  return "Terminal block created - Add commands";
}

/**
 * Create survey block (blue background)
 */
function createSurveyBlock() {
  const table = createSingleCellTable("survey", "");
  if (table) {
    const cell = table.getRow(0).getCell(0);

    // Add H4 question
    const question = cell.appendParagraph("Your survey question?");
    question.setHeading(DocumentApp.ParagraphHeading.HEADING4);

    // Add bullet list
    const list = cell.appendListItem("Option 1");
    list.setGlyphType(DocumentApp.GlyphType.BULLET);
    cell.appendListItem("Option 2").setGlyphType(DocumentApp.GlyphType.BULLET);
    cell.appendListItem("Option 3").setGlyphType(DocumentApp.GlyphType.BULLET);
  }
  return "Survey created - Customize question & options";
}

/**
 * Apply inline code formatting (Courier New)
 */
function applyInlineCode() {
  const doc = DocumentApp.getActiveDocument();
  const selection = doc.getSelection();

  if (!selection) {
    showAlert("Please select text to format as inline code.");
    return;
  }

  const elements = selection.getRangeElements();
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i].getElement();
    if (element.getType() === DocumentApp.ElementType.TEXT) {
      const text = element.asText();
      text.setFontFamily(FONT_CODE);
    }
  }
  return "Inline code applied - Courier New font";
}

/**
 * Create button with placeholder text and link
 */
function createButton() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const insertIndex = getInsertionIndex(doc.getCursor());

  if (insertIndex === null) return "Button creation failed - no cursor position";

  // Create paragraph with button
  const para = body.insertParagraph(insertIndex + 1, "Download Sample");
  const text = para.editAsText();
  text.setBackgroundColor(BUTTON_COLOR);
  text.setForegroundColor("#ffffff");
  text.setBold(true);
  text.setLinkUrl("https://example.com/download");

  return "Button created - Edit text and link directly in doc";
}

/**
 * Insert step heading (H1)
 */
function insertStepHeading() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const insertIndex = getInsertionIndex(doc.getCursor());

  if (insertIndex === null) return;

  // Always insert a NEW paragraph after the current position
  const paragraph = body.insertParagraph(insertIndex + 1, "");
  paragraph.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  paragraph.setText("Step Title");
  return "Step heading created - Edit the title";
}

/**
 * Insert section heading (H2)
 */
function insertSectionHeading(level = 2) {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const insertIndex = getInsertionIndex(doc.getCursor());

  if (insertIndex === null) return;

  // Always insert a NEW paragraph after the current position
  const paragraph = body.insertParagraph(insertIndex + 1, "");

  const heading =
    level === 2
      ? DocumentApp.ParagraphHeading.HEADING2
      : level === 3
        ? DocumentApp.ParagraphHeading.HEADING3
        : DocumentApp.ParagraphHeading.HEADING4;

  paragraph.setHeading(heading);
  paragraph.setText(`Heading ${level}`);
  return `H${level} heading created - Edit the text`;
}

/**
 * Insert codelab title (before metadata table)
 */
function insertCodelabTitle() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();

  // Insert title at the very top
  const title = body.insertParagraph(0, "My Codelab Title");
  title.setHeading(DocumentApp.ParagraphHeading.TITLE);
  title.setAlignment(DocumentApp.HorizontalAlignment.CENTER);

  // Add blank line after
  body.insertParagraph(1, "");
  return "Title added at document top - Edit the text";
}

/**
 * Insert metadata table
 */
function insertMetadataTable() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();

  // Insert at the top
  const table = body.insertTable(0);

  // All metadata fields recognized by claat parser
  const metadata = [
    ["ID", "your-codelab-name"],
    ["Summary", "A brief description of your codelab"],
    ["Authors", "Your Name"],
    ["Categories", "Web"],
    ["Environments", "Web"],
    ["Tags", "Web, JavaScript"],
    ["Status", "Draft"],
    ["Feedback Link", "https://github.com/yourrepo/issues"],
    ["Home URL", "https://yoursite.com"],
    ["Analytics GA4 Account", ""],
  ];

  metadata.forEach(([key, value]) => {
    const row = table.appendTableRow();
    row.appendTableCell(key).editAsText().setBold(true);
    row.appendTableCell(value);
  });
  return "Metadata table created - Fill in your info";
}

/**
 * Insert YouTube video placeholder
 */
function insertYouTubeVideo() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const insertIndex = getInsertionIndex(doc.getCursor());

  if (insertIndex === null) return "YouTube insertion failed - no cursor position";

  // Create a small placeholder image (1x1 red pixel PNG)
  const base64Image = "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"
  const blob = Utilities.newBlob(Utilities.base64Decode(base64Image), 'image/png', 'youtube-placeholder.png');

  // Insert image
  const para = body.insertParagraph(insertIndex + 1, "");
  const image = para.appendInlineImage(blob);

  // Set alt text
  image.setAltDescription("https://www.youtube.com/watch?v=VIDEO_ID");

  return "YouTube placeholder added - Edit alt text with video URL";
}

/**
 * Insert special heading with specific text
 */
function insertWhatYouLearn() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const insertIndex = getInsertionIndex(doc.getCursor());

  if (insertIndex === null) return;

  const paragraph = body.insertParagraph(insertIndex + 1, "What you'll learn");
  paragraph.setHeading(DocumentApp.ParagraphHeading.HEADING2);

  // Add sample bullet points
  const item1 = body.insertListItem(insertIndex + 2, "How to build the application");
  item1.setGlyphType(DocumentApp.GlyphType.BULLET);

  const item2 = body.insertListItem(insertIndex + 3, "How to test your code");
  item2.setGlyphType(DocumentApp.GlyphType.BULLET);

  const item3 = body.insertListItem(insertIndex + 4, "How to deploy to production");
  item3.setGlyphType(DocumentApp.GlyphType.BULLET);

  return "'What you'll learn' section added";
}

/**
 * Insert "What we've covered" heading
 */
function insertWhatCovered() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const insertIndex = getInsertionIndex(doc.getCursor());

  if (insertIndex === null) return;

  const paragraph = body.insertParagraph(insertIndex + 1, "What we've covered");
  paragraph.setHeading(DocumentApp.ParagraphHeading.HEADING2);

  // Add sample bullet points
  const item1 = body.insertListItem(insertIndex + 2, "Built a complete application");
  item1.setGlyphType(DocumentApp.GlyphType.BULLET);

  const item2 = body.insertListItem(insertIndex + 3, "Tested and debugged the code");
  item2.setGlyphType(DocumentApp.GlyphType.BULLET);

  const item3 = body.insertListItem(insertIndex + 4, "Deployed to production");
  item3.setGlyphType(DocumentApp.GlyphType.BULLET);

  return "'What we've covered' section added";
}

/**
 * Insert FAQ heading
 */
function insertFAQSection() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const insertIndex = getInsertionIndex(doc.getCursor());

  if (insertIndex === null) return;

  const paragraph = body.insertParagraph(
    insertIndex + 1,
    "Frequently Asked Questions"
  );
  paragraph.setHeading(DocumentApp.ParagraphHeading.HEADING3);

  // Add sample FAQ links
  const link1 = body.insertListItem(insertIndex + 2, "How do I troubleshoot common issues?");
  link1.setGlyphType(DocumentApp.GlyphType.BULLET);
  link1.setLinkUrl("https://stackoverflow.com/questions/tagged/your-topic");

  const link2 = body.insertListItem(insertIndex + 3, "Where can I find more documentation?");
  link2.setGlyphType(DocumentApp.GlyphType.BULLET);
  link2.setLinkUrl("https://cloud.google.com/");

  const link3 = body.insertListItem(insertIndex + 4, "Android development resources?");
  link3.setGlyphType(DocumentApp.GlyphType.BULLET);
  link3.setLinkUrl("https://developer.android.com/");

  return "FAQ section added with sample links - Edit URLs";
}

/**
 * Helper: Show alert dialog
 */
function showAlert(message) {
  DocumentApp.getUi().alert(
    "Codelab Format Tools",
    message,
    DocumentApp.getUi().ButtonSet.OK
  );
}


