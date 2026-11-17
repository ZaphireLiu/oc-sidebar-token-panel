# opencode-token-panel

Minimal OpenCode TUI sidebar plugin. It shows three numbers for the current
session **and every sub-agent session below it**:

```text
Tokens
Hit Rate          95.71%
Hit                17.9M
Miss              803.3k
Out               313.2k
```

Values are right-aligned in a fixed data column, leaving a margin before the
sidebar's right edge.

- `Hit Rate` — cache-hit share of all input side tokens: `hit / (hit + miss)`, two decimals
- `Hit` — cache-hit prompt tokens (`tokens.cache.read`)
- `Miss` — uncached input tokens (`tokens.input + tokens.cache.write`)
- `Out` — generated tokens (`tokens.output + tokens.reasoning`)

Numbers are abbreviated with `k` / `M`. Data comes from the sessions' cumulative
token counters, summed over `data.session.family(sessionID)` (the session itself
plus all descendants). It updates live while the session streams.

## Install

Add the checkout path to `plugins` in `~/.config/opencode/cli.json`:

```json
{
  "$schema": "https://opencode.ai/v2/cli.json",
  "plugins": ["/home/liuhan/Workshop/opencode-token-panel"]
}
```

Restart the TUI once; afterwards edits hot-reload.

## Notes

- TUI only (OpenCode 2.x plugin API), no npm dependencies.
- Parent session counters do not include child sessions; the plugin sums the
  whole family, so sub-agent usage is counted exactly once.
- Token counters are per session, so deleting a sub-agent session removes its
  usage from the panel.
