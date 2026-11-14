import { readFileSync } from "node:fs"
import { join } from "node:path"
import type { ArtworkVariant } from "macbetter/artwork"
import { ImageResponse } from "next/og"
import { markDataUri } from "@/components/brand-art"
import { artworkSvg, palettes, type OgPalette } from "@/lib/og/artwork-svg"
import { ogSize, type OgCard } from "@/lib/og/routes"

/*
 * Satori reads ttf, otf and woff, not woff2. SF Pro can't be redistributed, so the cards use
 * Inter, read from @fontsource/inter at build time.
 */
const fontDir = join(process.cwd(), "node_modules", "@fontsource", "inter", "files")
const font = (weight: 500 | 600 | 700) => ({
  name: "Inter",
  data: readFileSync(join(fontDir, `inter-latin-${weight}-normal.woff`)),
  weight,
  style: "normal" as const,
})
const fonts = [font(500), font(600), font(700)]

/** The variants that survive Satori and resvg intact and leave room for type. */
const ogVariants: ArtworkVariant[] = ["aurora", "bloom", "orbit", "strata", "prism", "rays", "ribbon", "topo", "grain"]
const ogPalettes = Object.keys(palettes) as OgPalette[]

function hash(input: string) {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  h ^= h >>> 15
  h = Math.imul(h, 0x2c1b3c6d)
  h ^= h >>> 12
  return h >>> 0
}

/** Same path, same picture; neighbouring pages land on different art. */
function artFor(path: string) {
  const key = `/${path}`
  // The home page wears the brand: Ember petals.
  if (key === "/") return { seed: key, variant: "bloom" as ArtworkVariant, palette: "ember" as OgPalette }
  return {
    seed: key,
    variant: ogVariants[hash(`${key}#v`) % ogVariants.length] as ArtworkVariant,
    palette: ogPalettes[hash(`${key}#p`) % ogPalettes.length] as OgPalette,
  }
}

/** Inter Bold at the card's tracking averages a little under half an em per character. */
const measure = 1040
const em = 0.5

/**
 * A headline size that keeps a title to two balanced lines. A tagline's sentences each keep a
 * line of their own, so they have to fit it.
 */
function titleSize(lines: string[]) {
  const longest = Math.max(...lines.map((line) => line.length))
  const longestWord = Math.max(...lines.join(" ").split(/\s+/).map((word) => word.length))
  const byLength = longest <= 10 ? 128 : longest <= 16 ? 116 : longest <= 24 ? 100 : longest <= 34 ? 88 : 76
  const fit = lines.length > 1 ? longest : longestWord
  return Math.min(byLength, Math.floor(measure / (fit * em)))
}

function renderCard(path: string, card: OgCard, override?: Partial<ReturnType<typeof artFor>>) {
  const art = { ...artFor(path), ...override }
  const svg = artworkSvg({ ...art, ...ogSize })
  const background = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`
  const lines = card.title.split(/(?<=\.)\s+(?=\S)/)
  const size = titleSize(lines)
  // One line or none: a description that would wrap is left to the page.
  const description = card.description && card.description.length <= 64 ? card.description : undefined

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", fontFamily: "Inter", color: "#ffffff" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse draws a plain <img> */}
        <img src={background} width={ogSize.width} height={ogSize.height} alt="" style={{ position: "absolute", top: 0, left: 0 }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: ogSize.width,
            height: ogSize.height,
            display: "flex",
            backgroundImage:
              "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.66) 34%, rgba(0,0,0,0.3) 64%, rgba(0,0,0,0.08) 100%), linear-gradient(to right, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.16) 45%, rgba(0,0,0,0) 75%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: ogSize.width,
            height: ogSize.height,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "64px 80px 56px",
          }}
        >
          <div style={{ display: "flex", fontSize: 30, fontWeight: 500, letterSpacing: "-0.012em", color: "rgba(255,255,255,0.74)" }}>
            {card.eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 14,
              maxWidth: measure,
              fontSize: size,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: "-0.042em",
            }}
          >
            {lines.map((line) => (
              <span key={line} style={{ textWrap: "balance" }}>
                {line}
              </span>
            ))}
          </div>
          {description ? (
            <div
              style={{
                display: "flex",
                marginTop: 22,
                maxWidth: 980,
                fontSize: 30,
                fontWeight: 500,
                lineHeight: 1.3,
                letterSpacing: "-0.012em",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              {description}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 52,
              paddingTop: 26,
              borderTop: "1.5px solid rgba(255,255,255,0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse draws a plain <img> */}
              <img src={markDataUri(40, "#ffffff")} width={40} height={40} alt="" />
              <div style={{ display: "flex", fontSize: 30, fontWeight: 600, letterSpacing: "-0.035em" }}>macbetter</div>
            </div>
            <div style={{ display: "flex", fontSize: 24, fontWeight: 500, letterSpacing: "-0.01em", color: "rgba(255,255,255,0.66)" }}>
              macbetter.dev
            </div>
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts }
  )
}

export { artFor, ogVariants, renderCard }
