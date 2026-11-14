import { renderArtwork, type ArtworkPalette, type ArtworkVariant } from "macbetter/artwork"
import { hexToOklch, oklchToHex } from "macbetter/derive"
import { svgMarkup } from "@/lib/og/svg-markup"

/*
 * Satori and resvg can't evaluate CSS custom properties, color-mix() or oklch(), so the
 * Artwork is rendered to markup here and every color is resolved to sRGB hex, the way the
 * browser would resolve artwork.css in the dark scheme of the Ember theme.
 */

/** System colors, dark scheme (tokens.css; Ember sets the same orange, green and mint). */
const system = {
  red: "#ff5a4f",
  orange: "#f67f01",
  yellow: "#ffd23c",
  green: "#44bd8b",
  mint: "#52c6a0",
  teal: "#4fc3d6",
  cyan: "#5cc4f5",
  blue: "#4c9dff",
  indigo: "#7d7aff",
  purple: "#c57bff",
  pink: "#ff5c93",
  brown: "#b8956f",
} as const

/** `color-mix(in oklch, a p%, b)`. A gray has no hue, so the other color's hue is used. */
function mixOklch(a: string, b: string, percentOfA: number) {
  const t = percentOfA / 100
  const ca = hexToOklch(a)
  const cb = hexToOklch(b)
  let h: number
  if (ca.c === 0) h = cb.h
  else if (cb.c === 0) h = ca.h
  else {
    let delta = ca.h - cb.h
    if (delta > 180) delta -= 360
    if (delta < -180) delta += 360
    h = (cb.h + delta * t + 360) % 360
  }
  return oklchToHex({ l: ca.l * t + cb.l * (1 - t), c: ca.c * t + cb.c * (1 - t), h })
}

/** `oklch(from color l c h)`, keeping the color's hue. */
const relative = (color: string, l: number, c: number) => oklchToHex({ l, c, h: hexToOklch(color).h })

type Resolved = Record<"1" | "2" | "3" | "4" | "ground" | "light" | "paper" | "ink", string>

function palette(hues: [string, string, string, string], ground: string, light?: string): Resolved {
  const white = "#ffffff"
  return {
    1: hues[0],
    2: hues[1],
    3: hues[2],
    4: hues[3],
    ground,
    light: light ?? mixOklch(hues[0], white, 16),
    paper: mixOklch(hues[3], mixOklch(system.yellow, white, 9), 5),
    ink: ground,
  }
}

const s = system
const white = "#ffffff"

const palettes: Record<Exclude<ArtworkPalette, "accent" | "mono">, Resolved> = {
  sunset: palette([s.orange, s.pink, s.yellow, s.purple], relative(s.purple, 0.2, 0.08), mixOklch(s.yellow, white, 18)),
  ocean: palette([s.blue, s.cyan, s.teal, s.indigo], relative(s.blue, 0.18, 0.07), mixOklch(s.cyan, white, 14)),
  forest: palette([s.green, s.mint, s.yellow, s.teal], relative(s.green, 0.19, 0.045), mixOklch(s.yellow, white, 14)),
  berry: palette([s.pink, s.purple, s.red, s.indigo], relative(s.purple, 0.17, 0.07), mixOklch(s.pink, white, 14)),
  citrus: palette([s.yellow, s.orange, s.mint, s.green], relative(s.green, 0.22, 0.06), mixOklch(s.yellow, white, 20)),
  dusk: palette([s.indigo, s.pink, s.orange, s.purple], relative(s.indigo, 0.16, 0.07), mixOklch(s.orange, white, 14)),
  ember: palette([s.red, s.orange, s.yellow, s.brown], relative(s.red, 0.16, 0.06), mixOklch(s.yellow, white, 20)),
  glacier: palette(
    [s.cyan, s.mint, s.blue, mixOklch(s.cyan, white, 35)],
    relative(s.blue, 0.2, 0.06),
    mixOklch(s.cyan, white, 10)
  ),
  candy: palette(
    [mixOklch(s.pink, white, 72), mixOklch(s.cyan, white, 68), mixOklch(s.yellow, white, 72), mixOklch(s.purple, white, 70)],
    relative(s.purple, 0.32, 0.1),
    mixOklch(s.pink, white, 8)
  ),
}

type OgPalette = keyof typeof palettes

const named: Record<string, string> = { white: "#ffffff", black: "#000000" }

/** Replaces every var(--mb-artwork-*) and color-mix(in oklch, …) in the markup with hex. */
function resolveColors(markup: string, colors: Resolved) {
  let out = markup.replace(/var\(--mb-artwork-([a-z0-9]+)\)/g, (_, key: keyof Resolved) => colors[key])
  const innermost = /color-mix\(in oklch,\s*(#[0-9a-f]{6}|white|black)\s+(\d+(?:\.\d+)?)%,\s*(#[0-9a-f]{6}|white|black)\)/i
  for (let guard = 0; innermost.test(out) && guard < 10_000; guard++) {
    out = out.replace(innermost, (_, a: string, p: string, b: string) =>
      mixOklch(named[a] ?? a, named[b] ?? b, Number(p))
    )
  }
  if (/color-mix|var\(/.test(out)) throw new Error("Artwork markup has a color the OG resolver can't read")
  return out
}

/** The Artwork as a standalone SVG document, every color concrete, sized for a 1200×630 card. */
function artworkSvg({
  seed,
  variant,
  palette: name,
  width = 1200,
  height = 630,
}: {
  seed: string
  variant: ArtworkVariant
  palette: OgPalette
  width?: number
  height?: number
}) {
  const html = svgMarkup(renderArtwork({ seed, variant, palette: name, aspect: width / height, finish: "flat" }, "og"))
  const svg = html.match(/<svg[\s\S]*<\/svg>/)?.[0]
  if (!svg) throw new Error("Artwork rendered no SVG")
  const resolved = resolveColors(svg, palettes[name])
  // artwork.css applies these blend modes by class; a standalone file carries them in its own sheet.
  const sheet =
    "<style>.mb-artwork-blend path,.mb-artwork-blend rect{mix-blend-mode:screen}.mb-artwork-grain{mix-blend-mode:overlay}</style>"
  return resolved.replace(
    /^<svg([^>]*)>/,
    (_, attrs: string) =>
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"${attrs}><rect width="100%" height="100%" fill="${palettes[name].ground}"/>${sheet}`
  )
}

export { artworkSvg, mixOklch, palettes }
export type { OgPalette }
