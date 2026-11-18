// Bun emits the automatic JSX development runtime in some environments, so
// mirror the regular shim under the dev entrypoint as well.
export { Fragment, jsx, jsxDEV, jsxs } from "./jsx-runtime"
