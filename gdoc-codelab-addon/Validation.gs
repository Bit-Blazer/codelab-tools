/**
 * Document validation to check claat format compliance.
 * Identifies issues and provides suggestions for fixes.
 */

/**
 * Perform comprehensive document validation
 */
function performValidation() {
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();

    const validation = {
        status: 'success',
        statusText: '✓ Format compliant',
        stats: countFormattedElements(),
        issues: [],
        warnings: [],
        suggestions: []
    };

    // Check 1: Must have at least one step (H1)
    if (validation.stats.steps === 0) {
        validation.issues.push({
            type: 'Error',
            severity: 'high',
            message: 'No steps found. Add at least one Heading 1 for step titles.'
        });
        validation.status = 'error';
    }

    // Check 2: Should have metadata table
    const metadata = getMetadataTable();
    if (!metadata.found) {
        validation.warnings.push({
            type: 'Warning',
            severity: 'medium',
            message: 'No metadata table found. Add one at the document start.'
        });
    } else {
        // Validate metadata completeness
        const requiredFields = ['Summary', 'URL', 'Category', 'Environment', 'Status'];
        const missingFields = requiredFields.filter(field => !metadata.data[field]);

        if (missingFields.length > 0) {
            validation.warnings.push({
                type: 'Warning',
                severity: 'medium',
                message: `Metadata missing fields: ${missingFields.join(', ')}`
            });
        }
    }

    // Check 3: Validate step structure
    const stepIssues = validateSteps();
    validation.issues.push(...stepIssues);

    // Check 4: Validate tables (infoboxes, code blocks)
    const tableIssues = validateTables();
    validation.issues.push(...tableIssues);

    // Check 5: Check for common mistakes
    const commonIssues = checkCommonMistakes();
    validation.warnings.push(...commonIssues);

    // Set overall status
    if (validation.issues.length > 0) {
        validation.status = 'error';
        validation.statusText = `❌ ${validation.issues.length} issue(s) found`;
    } else if (validation.warnings.length > 0) {
        validation.status = 'warning';
        validation.statusText = `⚠ ${validation.warnings.length} warning(s)`;
    }

    return validation;
}

/**
 * Validate step structure (H1 headings)
 */
function validateSteps() {
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();
    const paragraphs = body.getParagraphs();
    const issues = [];

    let stepCount = 0;
    let foundFirstStep = false;

    for (let i = 0; i < paragraphs.length; i++) {
        const para = paragraphs[i];
        const heading = para.getHeading();
        const text = para.getText().trim();

        if (heading === DocumentApp.ParagraphHeading.HEADING1) {
            foundFirstStep = true;
            stepCount++;

            // Check if step has duration
            let hasDuration = false;

            // Look ahead for Duration annotation
            if (i + 1 < paragraphs.length) {
                const nextPara = paragraphs[i + 1];
                const nextText = nextPara.getText();

                if (nextText.includes('Duration:')) {
                    const textObj = nextPara.editAsText();
                    if (textObj.getForegroundColor(0) === DURATION_COLOR) {
                        hasDuration = true;
                    } else {
                        issues.push({
                            type: 'Error',
                            severity: 'medium',
                            message: `Step "${text}" has Duration text but wrong color. Should be ${DURATION_COLOR}`
                        });
                    }
                }
            }

            if (!hasDuration) {
                issues.push({
                    type: 'Warning',
                    severity: 'low',
                    message: `Step "${text}" missing Duration annotation`
                });
            }

            // Check step title length
            if (text.length > 50) {
                issues.push({
                    type: 'Warning',
                    severity: 'low',
                    message: `Step "${text.substring(0, 30)}..." title is very long (${text.length} chars)`
                });
            }

            if (text.length === 0) {
                issues.push({
                    type: 'Error',
                    severity: 'high',
                    message: `Empty step title at position ${i + 1}`
                });
            }
        }

        // Check for H2-H4 before first step
        if (!foundFirstStep && (heading === DocumentApp.ParagraphHeading.HEADING2 ||
            heading === DocumentApp.ParagraphHeading.HEADING3 ||
            heading === DocumentApp.ParagraphHeading.HEADING4)) {
            // This is OK - might be intro content
        }
    }

    return issues;
}

/**
 * Validate tables (infoboxes, code blocks, surveys)
 */
function validateTables() {
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();
    const tables = body.getTables();
    const issues = [];

    for (let i = 0; i < tables.length; i++) {
        const table = tables[i];
        const numRows = table.getNumRows();
        const numCols = table.getRow(0).getNumCells();

        // Check single-cell tables (special blocks)
        if (numRows === 1 && numCols === 1) {
            const cell = table.getRow(0).getCell(0);
            const bgColor = cell.getBackgroundColor();
            const text = cell.getText();
            const textObj = cell.editAsText();
            const font = textObj.getFontFamily(0);

            // Detect what it's supposed to be
            if (bgColor) {
                const color = bgColor.toLowerCase();

                if (color === INFOBOX_POSITIVE.toLowerCase()) {
                    // Valid positive infobox
                    if (text.trim().length === 0) {
                        issues.push({
                            type: 'Warning',
                            severity: 'low',
                            message: 'Positive infobox is empty'
                        });
                    }
                }
                else if (color === INFOBOX_NEGATIVE.toLowerCase()) {
                    // Valid negative infobox
                    if (text.trim().length === 0) {
                        issues.push({
                            type: 'Warning',
                            severity: 'low',
                            message: 'Negative infobox is empty'
                        });
                    }
                }
                else if (color === SURVEY_COLOR.toLowerCase()) {
                    // Valid survey - check structure
                    const paras = [];
                    const numChildren = cell.getNumChildren();

                    for (let j = 0; j < numChildren; j++) {
                        const child = cell.getChild(j);
                        if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
                            paras.push(child.asParagraph());
                        }
                    }

                    const hasH4 = paras.some(p => p.getHeading() === DocumentApp.ParagraphHeading.HEADING4);

                    if (!hasH4) {
                        issues.push({
                            type: 'Error',
                            severity: 'medium',
                            message: 'Survey block should have an H4 question'
                        });
                    }
                }
                else if (color !== '#ffffff' && color !== '#fff' && color !== 'rgb(255, 255, 255)') {
                    // Unknown background color
                    issues.push({
                        type: 'Warning',
                        severity: 'medium',
                        message: `Single-cell table has unexpected background color: ${bgColor}`
                    });
                }
            }

            // Check font for code blocks
            if (font) {
                const fontLower = font.toLowerCase();

                if (fontLower === FONT_CODE.toLowerCase()) {
                    // Valid code block
                    if (text.trim().length === 0) {
                        issues.push({
                            type: 'Warning',
                            severity: 'low',
                            message: 'Code block is empty'
                        });
                    }
                }
                else if (fontLower === FONT_CONSOLE.toLowerCase()) {
                    // Valid console block
                    if (text.trim().length === 0) {
                        issues.push({
                            type: 'Warning',
                            severity: 'low',
                            message: 'Console block is empty'
                        });
                    }
                }
            }
        }

        // Check 2-column tables (might be metadata)
        else if (numCols === 2 && i === 0) {
            // First table should be metadata
            const firstKey = table.getRow(0).getCell(0).getText().trim();

            if (firstKey !== 'Summary' && firstKey !== 'summary') {
                issues.push({
                    type: 'Warning',
                    severity: 'low',
                    message: 'First 2-column table might not be metadata (should start with "Summary")'
                });
            }
        }
    }

    return issues;
}

/**
 * Check for common formatting mistakes
 */
function checkCommonMistakes() {
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();
    const issues = [];

    // Check 1: Look for "Duration:" text without proper color
    const searchResult = body.findText('Duration:');
    let searchElement = searchResult;

    while (searchElement) {
        const element = searchElement.getElement();
        if (element.getType() === DocumentApp.ElementType.TEXT) {
            const text = element.asText();
            const startOffset = searchElement.getStartOffset();
            const color = text.getForegroundColor(startOffset);

            if (!color || color.toLowerCase() !== DURATION_COLOR.toLowerCase()) {
                issues.push({
                    type: 'Warning',
                    severity: 'medium',
                    message: `Found "Duration:" text without proper meta color formatting`
                });
            }
        }

        searchElement = body.findText('Duration:', searchElement);
    }

    // Check 2: Look for "Environment:" text without proper color
    const envSearch = body.findText('Environment:');
    let envElement = envSearch;

    while (envElement) {
        const element = envElement.getElement();
        if (element.getType() === DocumentApp.ElementType.TEXT) {
            const text = element.asText();
            const startOffset = envElement.getStartOffset();
            const color = text.getForegroundColor(startOffset);

            if (!color || color.toLowerCase() !== DURATION_COLOR.toLowerCase()) {
                issues.push({
                    type: 'Warning',
                    severity: 'medium',
                    message: `Found "Environment:" text without proper meta color formatting`
                });
            }
        }

        envElement = body.findText('Environment:', envElement);
    }

    // Check 3: Look for inline code that should use Courier New
    // This is harder to detect automatically, so we'll skip for now

    return issues;
}

/**
 * Auto-fix common issues
 */
function autoFixIssues() {
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();
    let fixCount = 0;

    // Fix 1: Apply meta color to Duration: and Environment: text
    const durationSearch = body.findText('Duration:');
    let element = durationSearch;

    while (element) {
        const textElement = element.getElement();
        if (textElement.getType() === DocumentApp.ElementType.TEXT) {
            const text = textElement.asText();
            const startOffset = element.getStartOffset();
            const para = text.getParent();

            if (para.getType() === DocumentApp.ElementType.PARAGRAPH) {
                const paraText = para.asParagraph().editAsText();
                const fullText = paraText.getText();
                const lineEnd = fullText.indexOf('\n', startOffset);
                const endOffset = lineEnd > -1 ? lineEnd : fullText.length - 1;

                paraText.setForegroundColor(startOffset, endOffset, DURATION_COLOR);
                fixCount++;
            }
        }

        element = body.findText('Duration:', element);
    }

    // Similar for Environment:
    const envSearch = body.findText('Environment:');
    element = envSearch;

    while (element) {
        const textElement = element.getElement();
        if (textElement.getType() === DocumentApp.ElementType.TEXT) {
            const text = textElement.asText();
            const startOffset = element.getStartOffset();
            const para = text.getParent();

            if (para.getType() === DocumentApp.ElementType.PARAGRAPH) {
                const paraText = para.asParagraph().editAsText();
                const fullText = paraText.getText();
                const lineEnd = fullText.indexOf('\n', startOffset);
                const endOffset = lineEnd > -1 ? lineEnd : fullText.length - 1;

                paraText.setForegroundColor(startOffset, endOffset, DURATION_COLOR);
                fixCount++;
            }
        }

        element = body.findText('Environment:', element);
    }

    return fixCount;
}

/**
 * Generate validation report as plain text
 */
function generateValidationReport() {
    const validation = performValidation();
    const metadata = getMetadataTable();

    let report = '=== CODELAB FORMAT VALIDATION REPORT ===\n\n';

    // Metadata section
    report += '📋 METADATA\n';
    if (metadata.found) {
        report += 'Status: ✓ Found\n';
        Object.keys(metadata.data).forEach(key => {
            report += `  ${key}: ${metadata.data[key]}\n`;
        });
    } else {
        report += 'Status: ✗ Not found\n';
    }
    report += '\n';

    // Stats section
    report += '📊 STATISTICS\n';
    report += `  Steps (H1): ${validation.stats.steps}\n`;
    report += `  Positive Infoboxes: ${validation.stats.positiveInfoboxes}\n`;
    report += `  Negative Infoboxes: ${validation.stats.negativeInfoboxes}\n`;
    report += `  Code Blocks: ${validation.stats.codeBlocks}\n`;
    report += `  Console Blocks: ${validation.stats.consoleBlocks}\n`;
    report += `  Survey Blocks: ${validation.stats.surveys}\n`;
    report += '\n';

    // Issues section
    if (validation.issues.length > 0) {
        report += '❌ ERRORS\n';
        validation.issues.forEach((issue, i) => {
            report += `  ${i + 1}. [${issue.severity}] ${issue.message}\n`;
        });
        report += '\n';
    }

    // Warnings section
    if (validation.warnings.length > 0) {
        report += '⚠️  WARNINGS\n';
        validation.warnings.forEach((warning, i) => {
            report += `  ${i + 1}. [${warning.severity}] ${warning.message}\n`;
        });
        report += '\n';
    }

    // Overall status
    report += `OVERALL: ${validation.statusText}\n`;

    return report;
}
