// Catalog command for generating codelab catalog sites

package cmd

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

// CmdCatalogOptions contains options for the catalog command.
type CmdCatalogOptions struct {
	Output      string // Output directory
	Title       string // Catalog title
	Description string // Catalog description
	Prefix      string // URL prefix for assets
	Serve       bool   // Serve after generation
	Addr        string // Server address
}

// CodelabMetadata represents a codelab's metadata from codelab.json.
type CodelabMetadata struct {
	ID         string   `json:"id"`
	Title      string   `json:"title"`
	Summary    string   `json:"summary"`
	Categories []string `json:"categories"`
	Tags       []string `json:"tags"`
	Duration   int      `json:"duration"`
	Updated    string   `json:"updated"`
	Authors    []string `json:"authors"`
	Status     string   `json:"status"`
	URL        string   `json:"url"`
	Source     string   `json:"source"`
}

// CmdCatalog generates a catalog site from exported codelabs.
func CmdCatalog(opts CmdCatalogOptions) int {
	log.Println("Scanning for codelabs...")
	log.Printf("   Directory: %s", opts.Output)

	// Find all codelab.json files
	metadataFiles, err := findCodelabMetadataFiles(opts.Output)
	if err != nil {
		log.Printf("Error scanning directory: %v", err)
		return 1
	}

	log.Printf("   Found %d codelab(s)", len(metadataFiles))

	if len(metadataFiles) == 0 {
		log.Println("  No codelabs found. Make sure you have exported codelabs to the directory.")
	}

	// Read and process metadata
	log.Println("\ncessing codelabs...")
	codelabs := make([]CodelabMetadata, 0, len(metadataFiles))

	for _, file := range metadataFiles {
		metadata, err := readCodelabMetadata(file, opts.Output)
		if err != nil {
			log.Printf("     Error reading %s: %v", file, err)
			continue
		}
		log.Printf("   ✓ %s", metadata.Title)
		codelabs = append(codelabs, metadata)
	}

	// Sort by title
	sort.Slice(codelabs, func(i, j int) bool {
		return codelabs[i].Title < codelabs[j].Title
	})

	// Write codelabs.json
	indexPath := filepath.Join(opts.Output, "codelabs.json")
	if err := writeCodelabsIndex(indexPath, codelabs); err != nil {
		log.Printf("Error writing index: %v", err)
		return 1
	}

	log.Printf("\ndex built successfully!")
	log.Printf("   Output: %s", indexPath)
	log.Printf("   Total: %d codelab(s)", len(codelabs))

	// Show statistics
	categories := make(map[string]bool)
	tags := make(map[string]bool)
	for _, codelab := range codelabs {
		for _, cat := range codelab.Categories {
			categories[cat] = true
		}
		for _, tag := range codelab.Tags {
			tags[tag] = true
		}
	}

	log.Printf("\nStatistics:")
	log.Printf("   Categories: %d", len(categories))
	log.Printf("   Tags: %d", len(tags))

	// Generate catalog HTML
	catalogPath := filepath.Join(opts.Output, "index.html")
	if err := generateCatalogHTML(catalogPath, opts); err != nil {
		log.Printf("Error generating catalog HTML: %v", err)
		return 1
	}

	log.Printf("   Catalog: %s", catalogPath)

	// Serve if requested
	if opts.Serve {
		log.Println("\nStarting server...")
		return CmdServe(opts.Addr)
	}

	return 0
}

// findCodelabMetadataFiles recursively finds all codelab.json files.
func findCodelabMetadataFiles(dir string) ([]string, error) {
	var results []string

	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if !info.IsDir() && info.Name() == "codelab.json" {
			results = append(results, path)
		}

		return nil
	})

	return results, err
}

// readCodelabMetadata reads and parses a codelab.json file.
func readCodelabMetadata(filePath, baseDir string) (CodelabMetadata, error) {
	var metadata CodelabMetadata

	data, err := os.ReadFile(filePath)
	if err != nil {
		return metadata, err
	}

	if err := json.Unmarshal(data, &metadata); err != nil {
		return metadata, err
	}

	// Calculate relative URL path
	dir := filepath.Dir(filePath)
	relPath, err := filepath.Rel(baseDir, dir)
	if err != nil {
		relPath = filepath.Base(dir)
	}

	// Convert to URL path (use forward slashes)
	urlPath := filepath.ToSlash(relPath)
	metadata.URL = urlPath + "/index.html"

	// Use directory name as ID if not set
	if metadata.ID == "" {
		metadata.ID = filepath.Base(dir)
	}

	return metadata, nil
}

// writeCodelabsIndex writes the codelabs index JSON file.
func writeCodelabsIndex(path string, codelabs []CodelabMetadata) error {
	data, err := json.MarshalIndent(codelabs, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(path, data, 0644)
}

// generateCatalogHTML generates the catalog index.html file.
func generateCatalogHTML(path string, opts CmdCatalogOptions) error {
	title := opts.Title
	if title == "" {
		title = "Codelabs"
	}

	description := opts.Description
	if description == "" {
		description = "Google Developers Codelabs provide a guided, tutorial, hands-on coding experience. Most codelabs will step you through the process of building a small application, or adding a new feature to an existing application."
	}

	prefix := opts.Prefix
	if prefix == "" {
		prefix = "https://cdn.jsdelivr.net/gh/Bit-Blazer/codelab-tools@main/codelab-elements/build"
	}

	html := fmt.Sprintf(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="%s">
  <title>%s</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <link rel="stylesheet" href="%s/codelab-elements.min.css">
  <style>
    body {
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  <google-codelab-catalog
    data-source="codelabs.json"
    catalog-title="%s"
    catalog-description="%s">
  </google-codelab-catalog>

  <script src="%s/native-shim.js"></script>
  <script src="%s/codelab-elements.min.js"></script>
</body>
</html>
`, escapeHTML(description), escapeHTML(title), prefix, escapeHTML(title), escapeHTML(description), prefix, prefix)

	return os.WriteFile(path, []byte(html), 0644)
}

// escapeHTML escapes special HTML characters.
func escapeHTML(s string) string {
	replacer := strings.NewReplacer(
		"&", "&amp;",
		"<", "&lt;",
		">", "&gt;",
		"\"", "&quot;",
		"'", "&#39;",
	)
	return replacer.Replace(s)
}
