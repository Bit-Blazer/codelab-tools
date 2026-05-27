//go:build js && wasm

package main

import (
	"bytes"
	"fmt"
	"strings"
	"syscall/js"
	"time"

	"github.com/googlecodelabs/tools/claat/parser"
	_ "github.com/googlecodelabs/tools/claat/parser/md"
	"github.com/googlecodelabs/tools/claat/render"
	"github.com/googlecodelabs/tools/claat/types"
)

func main() {
	js.Global().Set("codelabRender", js.FuncOf(codelabRender))
	select {}
}

func codelabRender(this js.Value, args []js.Value) (result interface{}) {
	defer func() {
		if r := recover(); r != nil {
			result = js.ValueOf(fmt.Sprintf(`<!-- ERROR -->
<div style="background:#fee;color:#c00;padding:10px;font-family:monospace;border:1px solid #c00;">
<strong>Codelab Preview Error:</strong> %v
</div>`, r))
		}
	}()

	markdown := args[0].String()
	reader := strings.NewReader(markdown)

	opts := parser.NewOptions()
	clab, err := parser.Parse("md", reader, *opts)
	if err != nil {
		panic(err.Error())
	}

	// Make sure we have something to render.
	if len(clab.Steps) == 0 {
		return js.ValueOf(`<div style="padding: 20px;">No steps found. Add some '# Step title' headers.</div>`)
	}

	data := &struct {
		render.Context
		Current *types.Step
		StepNum int
		Prev    bool
		Next    bool
	}{Context: render.Context{
		Env:     "web",   
		Format:  "html",  
		Prefix:  "https://cdn.jsdelivr.net/gh/Bit-Blazer/codelab-tools@main/codelab-elements/build",
		Updated: time.Now().Format(time.RFC3339),
		Meta:    &clab.Meta,
		Steps:   clab.Steps,
		Extra:   map[string]string{},
	}}

	var buf bytes.Buffer
	if err := render.Execute(&buf, "html", data); err != nil {
		panic(err.Error())
	}

	return js.ValueOf(buf.String())
}
