// Copyright 2018 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// The claat command generates one or more codelabs from "source" documents,
// specified as either Google Doc IDs or local markdown files.
// The command also allows one to preview generated codelabs from local drive
// using "claat serve".
// See more details at https://github.com/googlecodelabs/tools.
package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"math/rand"
	"os"
	"strings"
	"time"

	"github.com/googlecodelabs/tools/claat/cmd"

	// allow parsers to register themselves
	_ "github.com/googlecodelabs/tools/claat/parser/gdoc"
	_ "github.com/googlecodelabs/tools/claat/parser/md"
)

var (
	version string // set by linker -X

	// Flags.
	addr         = flag.String("addr", "localhost:9090", "hostname and port to bind web server to")
	authToken    = flag.String("auth", "", "OAuth2 Bearer token; alternative credentials override.")
	catalogTitle = flag.String("title", "Codelabs", "catalog title")
	catalogDesc  = flag.String("description", "", "catalog description")
	expenv       = flag.String("e", "web", "codelab environment")
	extra        = flag.String("extra", "", "Additional arguments to pass to format templates. JSON object of string,string key values.")
	globalGA4    = flag.String("ga4", "G-XXXXXXXXXX", "global Google Analytics 4 account")
	output       = flag.String("o", ".", "output directory or '-' for stdout")
	passMetadata = flag.String("pass_metadata", "", "Metadata fields to pass through to the output. Comma-delimited list of field names.")
	prefix       = flag.String("prefix", "https://cdn.jsdelivr.net/gh/Bit-Blazer/codelab-tools@main/codelab-elements/build", "URL prefix for html format")
	serve        = flag.Bool("serve", false, "serve catalog after generation")
	tmplout      = flag.String("f", "html", "output format")
)

func main() {
	log.SetFlags(0)
	rand.Seed(time.Now().UnixNano())
	if len(os.Args) == 1 {
		log.Fatalf("Need subcommand. Try '-h' for options.")
	}
	if os.Args[1] == "-h" || os.Args[1] == "--help" || os.Args[1] == "help" {
		usage()
		return
	}

	// Check for command-specific help flags BEFORE parsing
	if len(os.Args) > 2 && (os.Args[2] == "-h" || os.Args[2] == "--help") {
		showCommandHelp(os.Args[1])
		return
	}

	flag.Usage = usage
	flag.CommandLine.Parse(os.Args[2:])

	extraVars, err := ParseExtraVars(*extra)
	if err != nil {
		os.Exit(1)
	}

	pm := parsePassMetadata(*passMetadata)

	exitCode := 0
	switch os.Args[1] {
	case "export":
		exitCode = cmd.CmdExport(cmd.CmdExportOptions{
			AuthToken:    *authToken,
			Expenv:       *expenv,
			ExtraVars:    extraVars,
			GlobalGA4:    *globalGA4,
			Output:       *output,
			PassMetadata: pm,
			Prefix:       *prefix,
			Srcs:         flag.Args(),
			Tmplout:      *tmplout,
		})
	case "serve":
		exitCode = cmd.CmdServe(*addr)
	case "catalog":
		exitCode = cmd.CmdCatalog(cmd.CmdCatalogOptions{
			Output:      *output,
			Title:       *catalogTitle,
			Description: *catalogDesc,
			Prefix:      *prefix,
			Serve:       *serve,
			Addr:        *addr,
		})
	case "update":
		exitCode = cmd.CmdUpdate(cmd.CmdUpdateOptions{
			AuthToken:    *authToken,
			ExtraVars:    extraVars,
			GlobalGA4:    *globalGA4,
			PassMetadata: pm,
			Prefix:       *prefix,
		})
	case "help":
		usage()
	case "version":
		fmt.Println(version)
	default:
		log.Fatalf("Unknown subcommand. Try '-h' for options.")
	}

	os.Exit(exitCode)
}

// parsePassMetadata parses metadata fields to parse that are not explicitly handled elsewhere.
// It expects the fields to be passed in as a comma separated list (extraneous spaces are autoremoved), and returns a set of strings.
func parsePassMetadata(passMeta string) map[string]bool {
	fields := map[string]bool{}
	for _, v := range strings.Split(passMeta, ",") {
		fields[strings.ToLower(strings.TrimSpace(v))] = true
	}
	return fields
}

// ParseExtraVars parses extra template variables from command line.
// extra is any additional arguments to pass to format templates. Should be formatted as JSON objects of string:string KV pairs.
func ParseExtraVars(extra string) (map[string]string, error) {
	vars := map[string]string{}
	if extra == "" {
		return vars, nil
	}
	b := []byte(extra)
	err := json.Unmarshal(b, &vars)
	if err != nil {
		log.Printf("Error parsing additional template data: %v", err)
		return nil, err
	}
	return vars, nil
}

// showCommandHelp displays help for a specific command
func showCommandHelp(command string) {
	switch command {
	case "export":
		fmt.Fprint(os.Stderr, exportHelpText)
		fmt.Fprintf(os.Stderr, "\nFLAGS:\n")
		fmt.Fprintf(os.Stderr, "  -o string\n        Output directory or '-' for stdout (default \".\")\n")
		fmt.Fprintf(os.Stderr, "  -f string\n        Output format: html, md, offline, or path to custom template (default \"html\")\n")
		fmt.Fprintf(os.Stderr, "  -e string\n        Target environment (default \"web\")\n")
		fmt.Fprintf(os.Stderr, "  -prefix string\n        URL prefix for html format resources (default \"%s\")\n", *prefix)
		fmt.Fprintf(os.Stderr, "  -ga4 string\n        Google Analytics 4 measurement ID (default \"%s\")\n", *globalGA4)
		fmt.Fprintf(os.Stderr, "  -auth string\n        OAuth2 Bearer token for Google Drive API\n")
		fmt.Fprintf(os.Stderr, "  -pass_metadata string\n        Comma-separated metadata fields to include\n")
		fmt.Fprintf(os.Stderr, "  -extra string\n        Additional template variables as JSON object (e.g., '{\"author\":\"Name\"}')\n")
	case "catalog":
		fmt.Fprint(os.Stderr, catalogHelpText)
		fmt.Fprintf(os.Stderr, "\nFLAGS:\n")
		fmt.Fprintf(os.Stderr, "  -o string\n        Output directory containing exported codelabs (default \".\")\n")
		fmt.Fprintf(os.Stderr, "  -title string\n        Catalog title (default \"Codelabs\")\n")
		fmt.Fprintf(os.Stderr, "  -description string\n        Catalog description\n")
		fmt.Fprintf(os.Stderr, "  -prefix string\n        URL prefix for assets (default \"%s\")\n", *prefix)
		fmt.Fprintf(os.Stderr, "  -serve\n        Start server after generating catalog\n")
		fmt.Fprintf(os.Stderr, "  -addr string\n        Server address if -serve is used (default \"%s\")\n", *addr)
	case "serve":
		fmt.Fprint(os.Stderr, serveHelpText)
		fmt.Fprintf(os.Stderr, "\nFLAGS:\n")
		fmt.Fprintf(os.Stderr, "  -addr string\n        Network address to bind to (default \"%s\")\n", *addr)
	case "update":
		fmt.Fprint(os.Stderr, updateHelpText)
		fmt.Fprintf(os.Stderr, "\nFLAGS:\n")
		fmt.Fprintf(os.Stderr, "  -auth string\n        OAuth2 Bearer token for Google Drive API\n")
		fmt.Fprintf(os.Stderr, "  -prefix string\n        Override URL prefix from metadata\n")
		fmt.Fprintf(os.Stderr, "  -ga4 string\n        Override Google Analytics 4 ID from metadata\n")
		fmt.Fprintf(os.Stderr, "  -pass_metadata string\n        Comma-separated metadata fields to include\n")
		fmt.Fprintf(os.Stderr, "  -extra string\n        Additional template variables as JSON object\n")
	default:
		usage()
	}
}

// usage prints usageText and program arguments to stderr.
func usage() {
	fmt.Fprint(os.Stderr, usageText)
}

const usageText = `┌─────────────────────────────────────────────────────────────────────────────┐
│                         CLAAT - Codelab As A Thing                          │
│              Generate and manage beautiful interactive codelabs             │
└─────────────────────────────────────────────────────────────────────────────┘

USAGE:
    claat <command> [options] [arguments]

COMMANDS:
    export      Convert source documents into codelabs
    catalog     Generate a searchable catalog site from exported codelabs
    serve       Start a local web server to preview codelabs
    update      Re-export existing codelabs with latest content
    version     Display the claat version
    help        Show this help message

Get detailed help for any command:
    claat <command> --help

Examples:
    claat export --help
    claat catalog --help
    claat serve --help
    claat update --help

For more information, visit: https://github.com/googlecodelabs/tools
`

const exportHelpText = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMAND: export
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DESCRIPTION:
    Convert one or more source documents (Google Docs or Markdown files) into
    interactive codelab format. Supports multiple output formats and can process
    multiple sources concurrently.

USAGE:
    claat export [options] <source> [source...]

SOURCE FORMATS:
    • Google Doc - Specify the document ID (not the full URL)
      Example: 1wiDgP0VPfWJ4KOx8Gfx1bE0xwUdsVbd8-jQfE8rBYTc
    
    • Markdown File - Local .md file path
      Example: my-codelab.md or /path/to/codelab.md
    
    • URL - Remote HTTP/HTTPS resource
      Example: https://example.com/codelab.md

OUTPUT FORMATS:
    • html     - Static HTML file (default)
    • md       - Markdown format
    • offline  - Plain HTML for offline consumption
    • custom   - Path to custom Go template file

EXAMPLES:
    # Export a Google Doc to HTML (default format)
    claat export 1wiDgP0VPfWJ4KOx8Gfx1bE0xwUdsVbd8-jQfE8rBYTc

    # Export multiple sources at once
    claat export doc-id-1 doc-id-2 my-codelab.md

    # Export a local Markdown file to HTML
    claat export my-codelab.md

    # Export to a specific directory
    claat export -o ./output my-codelab.md

    # Export to Markdown format
    claat export -f md my-codelab.md

    # Export to stdout (useful for piping)
    claat export -o - my-codelab.md

    # Export with custom Google Analytics
    claat export -ga4 G-ABC123XYZ my-codelab.md

    # Export with custom template variables
    claat export -extra '{"author":"John Doe","year":"2026"}' my-codelab.md

    # Export with authentication for private Google Docs
    claat export -auth "your-oauth-token" private-doc-id

    # Export for offline use
    claat export -f offline my-codelab.md

NOTES:
    • Google Doc sources require only the document ID, not the full URL
    • When outputting to stdout (-o -), images and metadata are not exported
    • Built-in templates are not guaranteed stable; use custom templates for production
    • The program runs exports concurrently for better performance
    • Exit code is non-zero if any source fails to export
`

const serveHelpText = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMAND: serve
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DESCRIPTION:
    Start a local web server to preview exported codelabs in your browser.
    Serves the current directory and automatically opens your default browser.

USAGE:
    claat serve [options]

EXAMPLES:
    # Start server on default port (9090)
    claat serve

    # Start server on custom port
    claat serve -addr localhost:8080

    # Bind to all network interfaces (accessible from other devices)
    claat serve -addr 0.0.0.0:9090

    # Use a specific hostname
    claat serve -addr mycomputer.local:9090

NOTES:
    • Server starts in the current working directory
    • Browser automatically opens to http://<addr>
    • Press Ctrl+C to stop the server
    • All exported codelabs in subdirectories will be accessible
    • Serves static files with proper dependencies loaded
`

const updateHelpText = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMAND: update
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DESCRIPTION:
    Re-export existing codelabs by scanning directories for codelab.json metadata
    files. Fetches the latest content from source and regenerates the codelab,
    cleaning up unused assets automatically.

USAGE:
    claat update [options] [directory...]

ARGUMENTS:
    [directory...]     One or more directories to scan (default: current directory)

EXAMPLES:
    # Update all codelabs in current directory
    claat update

    # Update codelabs in specific directory
    claat update ./my-codelabs

    # Update codelabs in multiple directories
    claat update ./dir1 ./dir2 ./dir3

    # Update with new Analytics ID
    claat update -ga4 G-NEWID123

    # Update with authentication for private Google Docs
    claat update -auth "your-oauth-token"

    # Update with new CDN prefix URL
    claat update -prefix "https://new-cdn.example.com"

HOW IT WORKS:
    1. Recursively scans specified directories for codelab.json files
    2. Reads metadata from each codelab.json
    3. Fetches the latest content from the source (Google Doc or Markdown)
    4. Re-exports the codelab using stored parameters
    5. Removes unused assets (images no longer referenced)
    6. If codelab ID changed, removes old directory and creates new one

NOTES:
    • Update uses metadata stored during the original export
    • Only -prefix and -ga4 can override metadata; other flags are ignored
    • Symbolic links are not followed during directory scan
    • Unused images are automatically cleaned up
    • If codelab ID changes, a new directory is created alongside the old one
    • Exports run concurrently with random delays to avoid rate limits
    • Exit code is non-zero if no codelabs found or any update fails
`

const catalogHelpText = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMAND: catalog
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DESCRIPTION:
    Generate a modern, searchable catalog site from your exported codelabs.
    Creates an interactive index with filtering, sorting, and dark mode support.

USAGE:
    claat catalog [options]

FEATURES:
    • Real-time search across titles, summaries, categories, and tags
    •  Advanced filtering by categories, tags, and authors
    • Automatic dark mode with theme persistence
    • Fully responsive design for all devices
    • Modern card-based layout with hover effects
    • tistics and result counts

EXAMPLES:
    # Generate catalog in current directory
    claat catalog

    # Generate catalog with custom title
    claat catalog -title "My Awesome Tutorials"

    # Generate catalog with description
    claat catalog -description "Learn web development step by step"

    # Generate catalog in specific directory
    claat catalog -o ./my-codelabs

    # Generate and immediately serve
    claat catalog -serve

    # Generate and serve on custom port
    claat catalog -serve -addr localhost:8080

    # Use custom CDN prefix for assets
    claat catalog -prefix "https://my-cdn.example.com"

HOW IT WORKS:
    1. Recursively scans the output directory for codelab.json files
    2. Extracts metadata from each codelab
    3. Generates codelabs.json index file
    4. Creates index.html with the catalog web component
    5. Optionally starts a local server to preview

OUTPUT FILES:
    • codelabs.json - Index of all codelabs with metadata
    • index.html    - Interactive catalog page

NOTES:
    • Run this command after exporting your codelabs
    • The catalog uses the google-codelab-catalog web component
    • All assets are loaded from CDN by default (no local files needed)
    • Catalog automatically updates when you rebuild the index
    • Server automatically opens your browser when using -serve
`
