import { Plugin } from "@opencode/plugin"

// Server-side entrypoint. This plugin only contributes a TUI sidebar panel, so
// the server side is intentionally empty. Keeping it here lets OpenCode load
// the directory as a normal package.
export default Plugin.define({
  id: "oc-sidebar-token-panel",
  setup() {},
})
