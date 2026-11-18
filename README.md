# oc-sidebar-token-panel

Minimal OpenCode TUI sidebar panel. It shows prompt-cache and token usage for
the current session **and every sub-agent session below it**:

```text
Tokens    95.71%
Hit        17.9M
Miss      803.3k
Out       313.2k
```

## What it shows

- **Header** — cache hit rate: `Hit / (Hit + Miss)`, two decimals
- **Hit** — cache-hit prompt tokens (`tokens.cache.read`)
- **Miss** — uncached input tokens (`tokens.input + tokens.cache.write`)
- **Out** — generated tokens (`tokens.output + tokens.reasoning`)

Values are abbreviated with `k` / `M`, rendered in gray and right-aligned inside
a fixed data column, which leaves a margin before the sidebar's right edge. The
panel sits at the top of the sidebar content, above the built-in `Context`
section.

## Sub-agent aggregation

The panel sums `data.session.family(sessionID)` — the session itself plus all of
its descendants. A parent session's token counters do not include its child
sessions, so nothing is counted twice.

## Requirements

- OpenCode 2.x with the TUI (V2 plugin API)
- No other dependencies: OpenCode provides Solid and OpenTUI at runtime

## Install

### With the OpenCode plugin manager

```sh
opencode plugin add github:ZaphireLiu/oc-sidebar-token-panel
```

This installs the package into OpenCode's plugin cache and adds it to the global
`opencode.jsonc` plugin list, so it applies to every project. Pin a release for
reproducible installs:

```sh
opencode plugin add github:ZaphireLiu/oc-sidebar-token-panel#v0.1.4
```

Update with `opencode plugin update`, and remove with
`opencode plugin remove github:ZaphireLiu/oc-sidebar-token-panel`.

### From a local checkout

Clone the repository and add the checkout path to `plugins` in
`~/.config/opencode/cli.json`:

```sh
git clone https://github.com/ZaphireLiu/oc-sidebar-token-panel.git ~/Workshop/oc-sidebar-token-panel
```

```json
{
  "$schema": "https://opencode.ai/v2/cli.json",
  "plugins": ["/home/<you>/Workshop/oc-sidebar-token-panel"]
}
```

Restart the TUI once. Afterwards, edits hot-reload.

## Layout

The sidebar content area is 42 columns wide. `DATA_WIDTH` in `tui.tsx` controls
the value column (default `16`): increasing it moves the numbers closer to the
right edge, decreasing it adds more right-hand whitespace.

## Development

No build step. `index.ts` is an empty server entry that lets OpenCode load the
directory as a package; `tui.tsx` registers the `sidebar.content` slot. Imports
of `@opencode/plugin/tui`, `solid-js` and OpenTUI resolve from OpenCode's own
runtime.

## License

MIT
