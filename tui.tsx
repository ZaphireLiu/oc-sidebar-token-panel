/** @jsxImportSource @opentui/solid */
import { Plugin, usePlugin } from "@opencode/plugin/tui"
import { createMemo } from "solid-js"

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
  const theme = () => context.theme
  return (
    <box flexDirection="column">
      <text fg={theme().text.base}>
        <b>Tokens</b>
      </text>
      <box flexDirection="row">
        <box width={9}>
          <text fg={theme().text.muted}>Hit Rate</text>
        </box>
        <text fg={theme().text.muted}>{stats().hitRate.toFixed(2)}%</text>
      </box>
      <box flexDirection="row">
        <box width={9}>
          <text fg={theme().text.muted}>Hit</text>
        </box>
        <text fg={theme().text.muted}>{compact(stats().hit)}</text>
      </box>
      <box flexDirection="row">
        <box width={9}>
          <text fg={theme().text.muted}>Miss</text>
        </box>
        <text fg={theme().text.muted}>{compact(stats().miss)}</text>
      </box>
      <box flexDirection="row">
        <box width={9}>
          <text fg={theme().text.muted}>Out</text>
        </box>
        <text fg={theme().text.muted}>{compact(stats().out)}</text>
      </box>
    </box>
  )
}

export default Plugin.define({
  id: "local.token-panel.tui",
  setup(context) {
    context.ui.slot({
      prepend: "sidebar.content",
      render: ({ sessionID }) => <Usage sessionID={sessionID} />,
    })
  },
})
