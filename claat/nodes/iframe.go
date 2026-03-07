package nodes

import (
	"encoding/json"
	"log"
	"os"
	"path/filepath"
)

var defaultIframeAllowlist = []string{
	"carto.com",
	"codepen.io",
	"dartlang.org",
	"dartpad.dev",
	"demo.arcade.software",
	"github.com",
	"glitch.com",
	"google.com",
	"google.dev",
	"observablehq.com",
	"repl.it",
	"stackblitz.com",
	"vimeo.com",
	"web.dev",
}

// IframeAllowlist contains domains allowed to embed as iframes.
// Loaded from iframe-allowlist.json (if exists) + defaults.
var IframeAllowlist []string

func init() {
	IframeAllowlist = loadIframeAllowlist()
}

func loadIframeAllowlist() []string {
	allowlist := make([]string, len(defaultIframeAllowlist))
	copy(allowlist, defaultIframeAllowlist)
	
	exe, err := os.Executable()
	if err != nil {
		return allowlist
	}
	
	configPath := filepath.Join(filepath.Dir(exe), "iframe-allowlist.json")
	data, err := os.ReadFile(configPath)
	if err != nil {
		return allowlist
	}
	
	var config struct {
		Allowlist []string `json:"allowlist"`
	}
	if err := json.Unmarshal(data, &config); err == nil && len(config.Allowlist) > 0 {
		allowlist = append(allowlist, config.Allowlist...)
		log.Printf("Loaded iframe allowlist from: %s (+%d custom domains, %d total)", 
			configPath, len(config.Allowlist), len(allowlist))
	}
	
	return allowlist
}

func NewIframeNode(url string) *IframeNode {
	return &IframeNode{
		node: node{typ: NodeIframe},
		URL:  url,
	}
}

// IframeNode is an embeddes iframe.
type IframeNode struct {
	node
	URL string
}

// Empty returns true if iframe's URL field is empty.
func (iframe *IframeNode) Empty() bool {
	return iframe.URL == ""
}
