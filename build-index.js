#!/usr/bin/env node

/**
 * Build Codelabs Index
 * 
 * Scans directories for codelab.json files and generates a single
 * codelabs.json index file for the catalog.
 * 
 * Usage:
 *   node build-index.js [codelabs-dir] [output-file]
 * 
 * Example:
 *   node build-index.js ../output codelabs.json
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CODELABS_DIR = process.argv[2] || './codelabs';
const OUTPUT_FILE = process.argv[3] || 'codelabs.json';
const METADATA_FILENAME = 'codelab.json';

/**
 * Recursively find all codelab.json files
 */
function findCodelabMetadata(dir) {
    const results = [];

    if (!fs.existsSync(dir)) {
        console.error(`Directory not found: ${dir}`);
        return results;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            // Check if this directory contains codelab.json
            const metadataPath = path.join(fullPath, METADATA_FILENAME);
            if (fs.existsSync(metadataPath)) {
                results.push(metadataPath);
            }
            // Recursively search subdirectories
            results.push(...findCodelabMetadata(fullPath));
        }
    }

    return results;
}

/**
 * Read and parse a codelab metadata file
 */
function readCodelabMetadata(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const metadata = JSON.parse(content);

        // Add relative URL path
        const dir = path.dirname(filePath);
        const relativePath = path.relative(path.resolve(CODELABS_DIR), dir);
        const urlPath = relativePath.split(path.sep).join('/');

        return {
            id: metadata.id || path.basename(dir),
            title: metadata.title || 'Untitled',
            summary: metadata.summary || '',
            categories: metadata.categories || [],
            tags: metadata.tags || [],
            duration: metadata.duration || 0,
            updated: metadata.updated || '',
            authors: metadata.authors || [],
            status: metadata.status || 'draft',
            url: urlPath + '/index.html',
            source: metadata.source || ''
        };
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return null;
    }
}

/**
 * Main build function
 */
function buildIndex() {
    console.log('🔍 Scanning for codelabs...');
    console.log(`   Directory: ${path.resolve(CODELABS_DIR)}`);

    const metadataFiles = findCodelabMetadata(CODELABS_DIR);
    console.log(`   Found ${metadataFiles.length} codelab(s)`);

    if (metadataFiles.length === 0) {
        console.warn('⚠️  No codelabs found. Make sure you have exported codelabs to the directory.');
        // Still create an empty array file
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2));
        console.log(`✅ Created empty index: ${OUTPUT_FILE}`);
        return;
    }

    console.log('\n📚 Processing codelabs...');
    const codelabs = metadataFiles
        .map(file => {
            const metadata = readCodelabMetadata(file);
            if (metadata) {
                console.log(`   ✓ ${metadata.title}`);
            }
            return metadata;
        })
        .filter(Boolean); // Remove nulls

    // Sort by title
    codelabs.sort((a, b) => a.title.localeCompare(b.title));

    // Write output
    const outputPath = path.resolve(OUTPUT_FILE);
    fs.writeFileSync(outputPath, JSON.stringify(codelabs, null, 2));

    console.log(`\n✅ Index built successfully!`);
    console.log(`   Output: ${outputPath}`);
    console.log(`   Total: ${codelabs.length} codelab(s)`);

    // Show statistics
    const categories = new Set();
    const tags = new Set();
    codelabs.forEach(codelab => {
        (codelab.categories || []).forEach(cat => categories.add(cat));
        (codelab.tags || []).forEach(tag => tags.add(tag));
    });

    console.log(`\n📊 Statistics:`);
    console.log(`   Categories: ${categories.size}`);
    console.log(`   Tags: ${tags.size}`);
}

// Run the build
try {
    buildIndex();
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}
