/** @jsx h */
import { Plugin, usePlugin } from "@opencode/plugin/tui"
import { createComponent, createElement, spread } from "@opentui/solid"
import { createMemo } from "solid-js"

// Classic JSX factory for OpenTUI's Solid renderer.
//
// OpenCode maps the bare `@opentui/solid` specifier at runtime but not the
// `@opentui/solid/jsx-runtime` subpath for plugins installed from npm/Git. A
// classic factory keeps every bare import in this entry module, so the same
// source works for local-path and package installs without a build step.
function h(type: any, props: any, ...children: any[]) {
  const next = { ...(props ?? {}) }
  if (children.length === 1) next.children = children[0]
  else if (children.length > 1) next.children = children
  if (typeof type === "function") return createComponent(type, next)
  const element = createElement(type)
  spread(element, next)
  return element
}

// Token accounting for the current session tree:
//   hit  = cache.read                       (prompt cache hits)
//   miss = input + cache.write              (fresh input, including cache writes)
//   out  = output + reasoning               (reasoning is billed as output)
//   hit rate = hit / (hit + miss)
function compact(value: number): string {
  if (value < 1000) return String(value)
  if (value < 1_000_000) return `${oneDecimal(value / 1000)}k`
  return `${oneDecimal(value / 1_000_000)}M`
}

function oneDecimal(value: number): string {
  return value.toFixed(1).replace(/\.0$/, "")
}

// Right-align values inside a fixed-width data area so they end well before the
// sidebar edge, leaving a margin on the right.
const DATA_WIDTH = 16

function Row(props: { label: string; value: string }) {
  const context = usePlugin()
  return (
    <box flexDirection="row" width={DATA_WIDTH} justifyContent="space-between">
      <text fg={context.theme.text.muted}>{props.label}</text>
      <text fg={context.theme.text.muted}>{props.value}</text>
    </box>
  )
}

function Usage(props: { sessionID: string }) {
  const context = usePlugin()
  const stats = createMemo(() => {
    let hit = 0
    let miss = 0
    let out = 0
    for (const id of context.data.session.family(props.sessionID)) {
      const tokens = context.data.session.get(id)?.tokens
      if (!tokens) continue
      hit += tokens.cache.read
      miss += tokens.input + tokens.cache.write
      out += tokens.output + tokens.reasoning
    }
    const total = hit + miss
    return { hit, miss, out, hitRate: total > 0 ? (hit / total) * 100 : 0 }
  })
  return (
    <box flexDirection="column">
      <box flexDirection="row" width={DATA_WIDTH} justifyContent="space-between">
        <text fg={context.theme.text.base}>
          <b>Tokens</b>
        </text>
        <text fg={context.theme.text.muted}>{stats().hitRate.toFixed(2)}%</text>
      </box>
      <Row label="Hit" value={compact(stats().hit)} />
      <Row label="Miss" value={compact(stats().miss)} />
      <Row label="Out" value={compact(stats().out)} />
    </box>
  )
}

export default Plugin.define({
  id: "oc-sidebar-token-panel.tui",
  setup(context) {
    context.ui.slot({
      prepend: "sidebar.content",
      render: ({ sessionID }) => <Usage sessionID={sessionID} />,
    })
  },
})
