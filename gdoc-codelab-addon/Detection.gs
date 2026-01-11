/**
 * Smart detection and analysis of document formatting.
 * Provides context-aware information about current selection/cursor position.
 */

/**
 * Detect if element is a meta annotation (Duration/Environment)
 */
function isMetaAnnotation(element) {
    if (element.getType() !== DocumentApp.ElementType.TEXT) {
        return false;
    }

    const text = element.asText();
    const color = text.getForegroundColor(0);

    return color && color.toLowerCase() === DURATION_COLOR.toLowerCase();
}

/**
 * Detect if element is inline code (Courier New)
 */
function isInlineCode(element) {
    if (element.getType() !== DocumentApp.ElementType.TEXT) {
        return false;
    }

    const text = element.asText();
    const font = text.getFontFamily(0);

    return font && font.toLowerCase() === FONT_CODE.toLowerCase();
}

/**
 * Detect if element is a download button
 */
function isDownloadButton(element) {
    if (element.getType() !== DocumentApp.ElementType.TEXT) {
        return false;
    }

    const text = element.asText();
    const bgColor = text.getBackgroundColor(0);
    const linkUrl = text.getLinkUrl(0);

    return bgColor && bgColor.toLowerCase() === BUTTON_COLOR.toLowerCase() && linkUrl;
}

/**
 * Detect table cell type based on background color
 */
function detectTableCellType(cell) {
    const bgColor = cell.getBackgroundColor();

    if (!bgColor) {
        return 'unknown';
    }

    const color = bgColor.toLowerCase();

    if (color === INFOBOX_POSITIVE.toLowerCase()) {
        return 'positive-infobox';
    } else if (color === INFOBOX_NEGATIVE.toLowerCase()) {
        return 'negative-infobox';
    } else if (color === SURVEY_COLOR.toLowerCase()) {
        return 'survey';
    }

    // Check if it's a code or console block by font
    const text = cell.editAsText();
    if (text.getText().length > 0) {
        const font = text.getFontFamily(0);
        if (font) {
            if (font.toLowerCase() === FONT_CODE.toLowerCase()) {
                return 'code-block';
            } else if (font.toLowerCase() === FONT_CONSOLE.toLowerCase()) {
                return 'console-block';
            }
        }
    }

    return 'table-cell';
}

/**
 * Analyze current selection or cursor position
 */
function analyzeCurrentPosition() {
    const doc = DocumentApp.getActiveDocument();
    const selection = doc.getSelection();
    const cursor = doc.getCursor();

    const analysis = {
        type: 'none',
        details: {},
        suggestions: [],
        warnings: []
    };

    if (selection) {
        const elements = selection.getRangeElements();

        if (elements.length === 0) {
            return analysis;
        }

        const element = elements[0].getElement();
        analysis.type = 'selection';
        analysis.details.elementType = element.getType().toString();

        // Analyze text selection
        if (element.getType() === DocumentApp.ElementType.TEXT) {
            const text = element.asText();
            const startOffset = elements[0].getStartOffset();
            const endOffset = elements[0].getEndOffsetInclusive();

            analysis.details.text = text.getText().substring(startOffset, endOffset + 1);
            analysis.details.length = analysis.details.text.length;

            // Check formatting
            if (startOffset >= 0) {
                analysis.details.fontFamily = text.getFontFamily(startOffset);
                analysis.details.foregroundColor = text.getForegroundColor(startOffset);
                analysis.details.backgroundColor = text.getBackgroundColor(startOffset);
                analysis.details.isBold = text.isBold(startOffset);
                analysis.details.isItalic = text.isItalic(startOffset);
                analysis.details.linkUrl = text.getLinkUrl(startOffset);

                // Detect special formats
                if (isMetaAnnotation(element)) {
                    analysis.details.format = 'meta-annotation';
                } else if (isInlineCode(element)) {
                    analysis.details.format = 'inline-code';
                } else if (isDownloadButton(element)) {
                    analysis.details.format = 'download-button';
                }
            }

            // Suggestions based on selection
            if (analysis.details.text.length > 0 && analysis.details.text.length < 100) {
                if (!analysis.details.format) {
                    analysis.suggestions.push('Apply inline code formatting');
                    analysis.suggestions.push('Create download button');
                }
            }

            if (analysis.details.text.startsWith('Duration:') || analysis.details.text.startsWith('Environment:')) {
                if (!isMetaAnnotation(element)) {
                    analysis.warnings.push('This looks like a meta annotation but is not properly formatted');
                    analysis.suggestions.push('Apply meta annotation color');
                }
            }
        }

        // Analyze table cell selection
        else if (element.getType() === DocumentApp.ElementType.TABLE_CELL) {
            const cell = element.asTableCell();
            analysis.details.cellType = detectTableCellType(cell);
            analysis.details.backgroundColor = cell.getBackgroundColor();

            const table = cell.getParent().getParent();
            analysis.details.isTableSingleCell = table.getNumRows() === 1 && table.getRow(0).getNumCells() === 1;

            if (analysis.details.isTableSingleCell) {
                analysis.suggestions.push('This is a single-cell table');

                if (analysis.details.cellType === 'table-cell') {
                    analysis.suggestions.push('Convert to infobox, code block, or survey');
                }
            }
        }

        // Analyze paragraph selection
        else if (element.getType() === DocumentApp.ElementType.PARAGRAPH) {
            const para = element.asParagraph();
            analysis.details.heading = para.getHeading().toString();
            analysis.details.text = para.getText();

            if (analysis.details.heading === 'NORMAL') {
                analysis.suggestions.push('Apply heading style (H1-H4)');
            }
        }
    }

    // Analyze cursor position (no selection)
    else if (cursor) {
        const element = cursor.getElement();
        analysis.type = 'cursor';
        analysis.details.elementType = element.getType().toString();

        const parent = element.getParent();

        if (parent.getType() === DocumentApp.ElementType.PARAGRAPH) {
            const para = parent.asParagraph();
            analysis.details.heading = para.getHeading().toString();
            analysis.details.paragraphText = para.getText();

            if (analysis.details.heading === 'HEADING1') {
                analysis.details.context = 'step-heading';
                analysis.suggestions.push('This is a step heading');
            } else if (analysis.details.heading === 'NORMAL') {
                analysis.suggestions.push('Insert infobox, code block, or format text');
            }
        }

        else if (parent.getType() === DocumentApp.ElementType.TABLE_CELL) {
            const cell = parent.asTableCell();
            analysis.details.cellType = detectTableCellType(cell);
            analysis.details.context = 'table-cell';

            analysis.suggestions.push('Cursor is in a table cell: ' + analysis.details.cellType);
        }

        else if (parent.getType() === DocumentApp.ElementType.LIST_ITEM) {
            analysis.details.context = 'list-item';
            analysis.suggestions.push('Cursor is in a list item');
        }
    }

    return analysis;
}

/**
 * Find all elements of a specific type in document
 */
function findAllElements(elementType) {
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();
    const elements = [];

    function searchElement(element) {
        if (element.getType() === elementType) {
            elements.push(element);
        }

        // Recursively search children
        if (element.getNumChildren) {
            const numChildren = element.getNumChildren();
            for (let i = 0; i < numChildren; i++) {
                searchElement(element.getChild(i));
            }
        }
    }

    searchElement(body);
    return elements;
}

/**
 * Count specific formatted elements in document
 */
function countFormattedElements() {
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();

    const counts = {
        steps: 0,
        positiveInfoboxes: 0,
        negativeInfoboxes: 0,
        codeBlocks: 0,
        consoleBlocks: 0,
        surveys: 0,
        buttons: 0,
        metaAnnotations: 0
    };

    // Count H1 (steps)
    const paragraphs = body.getParagraphs();
    for (let i = 0; i < paragraphs.length; i++) {
        const para = paragraphs[i];
        if (para.getHeading() === DocumentApp.ParagraphHeading.HEADING1) {
            counts.steps++;
        }
    }

    // Count tables (infoboxes, code, surveys)
    const tables = body.getTables();
    for (let i = 0; i < tables.length; i++) {
        const table = tables[i];

        // Check if single-cell
        if (table.getNumRows() === 1 && table.getRow(0).getNumCells() === 1) {
            const cell = table.getRow(0).getCell(0);
            const cellType = detectTableCellType(cell);

            switch (cellType) {
                case 'positive-infobox':
                    counts.positiveInfoboxes++;
                    break;
                case 'negative-infobox':
                    counts.negativeInfoboxes++;
                    break;
                case 'code-block':
                    counts.codeBlocks++;
                    break;
                case 'console-block':
                    counts.consoleBlocks++;
                    break;
                case 'survey':
                    counts.surveys++;
                    break;
            }
        }
    }

    return counts;
}

/**
 * Get document metadata from table (if exists)
 */
function getMetadataTable() {
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();

    // Look for 2-column table at the start
    const tables = body.getTables();

    for (let i = 0; i < tables.length; i++) {
        const table = tables[i];

        // Check if it's likely metadata (2 columns, near start)
        if (table.getRow(0).getNumCells() === 2) {
            const metadata = {};

            for (let j = 0; j < table.getNumRows(); j++) {
                const row = table.getRow(j);
                const key = row.getCell(0).getText().trim();
                const value = row.getCell(1).getText().trim();

                if (key && value) {
                    metadata[key] = value;
                }
            }

            // Check if it has typical metadata keys
            if (metadata['Summary'] || metadata['URL'] || metadata['Category']) {
                return {
                    found: true,
                    table: table,
                    data: metadata
                };
            }
        }
    }

    return {
        found: false,
        table: null,
        data: {}
    };
}
