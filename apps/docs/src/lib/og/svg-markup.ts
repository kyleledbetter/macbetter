import { Fragment, isValidElement, type ReactNode } from "react"

/*
 * A small static serializer for hookless SVG trees. Route handlers can't import
 * react-dom/server, and the Artwork's drawing is plain function components over SVG elements.
 */

/** SVG attributes that keep their camelCase; React turns the others into kebab-case. */
const camelAttributes = new Set([
  "viewBox",
  "preserveAspectRatio",
  "gradientUnits",
  "gradientTransform",
  "patternUnits",
  "stdDeviation",
  "baseFrequency",
  "numOctaves",
  "stitchTiles",
  "filterUnits",
  "pathLength",
])

const skipped = new Set(["children", "key", "ref", "className", "focusable", "role"])

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

const kebab = (name: string) => name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)

function style(value: Record<string, unknown>) {
  return Object.entries(value)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k.startsWith("--") ? k : kebab(k)}:${String(v)}`)
    .join(";")
}

function svgMarkup(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return ""
  if (typeof node === "string" || typeof node === "number") return escape(String(node))
  if (Array.isArray(node)) return node.map(svgMarkup).join("")
  if (!isValidElement(node)) return ""
  const props = node.props as Record<string, unknown> & { children?: ReactNode }
  if (node.type === Fragment) return svgMarkup(props.children)
  if (typeof node.type === "function") return svgMarkup((node.type as (p: unknown) => ReactNode)(props))
  if (typeof node.type !== "string") return ""
  const tag = node.type
  const attrs = Object.entries(props)
    .filter(([name, value]) => !skipped.has(name) && !name.startsWith("aria-") && value !== undefined && value !== null && value !== false)
    .map(([name, value]) => {
      const attr = camelAttributes.has(name) ? name : kebab(name)
      const text = name === "style" ? style(value as Record<string, unknown>) : String(value)
      return ` ${attr}="${escape(text)}"`
    })
    .join("")
  // The class is kept only where a blend mode hangs off it.
  const className = typeof props.className === "string" ? props.className : ""
  const keep = className.split(/\s+/).filter((c) => c === "mb-artwork-blend" || c === "mb-artwork-grain")
  const classAttr = keep.length ? ` class="${keep.join(" ")}"` : ""
  return `<${tag}${classAttr}${attrs}>${svgMarkup(props.children)}</${tag}>`
}

export { svgMarkup }
