// Minimal JSX runtime shim for OpenTUI's Solid renderer.
//
// OpenCode maps the bare specifier `@opentui/solid` at runtime, but not the
// `@opentui/solid/jsx-runtime` subpath for plugins installed from npm/Git. This
// shim reproduces the automatic-runtime glue while importing only the bare
// specifier, so the same `tui.tsx` works for local-path and package installs.
import { createComponent, createElement, spread } from "@opentui/solid"

export function jsx(type: any, props: any = {}) {
  let normalized = props ?? {}
  if (normalized && "key" in normalized) {
    const { key: _key, ...rest } = normalized
    normalized = rest
  }
  if (typeof type === "function") return createComponent(type, normalized)
  const element = createElement(type)
  spread(element, normalized)
  return element
}

export const jsxs = jsx
export const jsxDEV = jsx

export function Fragment(props: any) {
  return props?.children ?? null
}
