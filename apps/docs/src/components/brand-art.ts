/**
 * The macbetter dragon, as plain strings, for places that can't render React: the favicon,
 * app icons and social images drawn with ImageResponse. `logo.tsx` draws the same paths inline.
 */
const dragonPaths = [
  "m460.7 159.7-11.65-15.1-4.48 10.37c-7.936-4.032-16.06-8.32-23.23-12.61l-19.01-31.17c-1.344-1.536-2.944-2.816-4.736-3.776l-29.25-16.7c-26.5-24.13-57.28-51.2-79.94-67.46 4.8 15.42 11.52 30.98 18.62 43.78-35.2-11.14-73.6-22.66-105.8-31.42 14.4 12.8 30.72 27.01 45.38 38.27l43.78 20.1c-32.83 21.12-52.61 41.92-69.38 68.8l36.8-22.72c-22.72 24.38-38.46 54.34-38.46 79.23 0 48.45 65.22 72.58 99.78 90.88-10.37 10.37-33.66 22.46-56.83 39.87-33.6 17.86-52.03 51.14-52.03 73.92 0 7.04 1.856 13.38 5.44 18.69 14.02 21.31 49.54 41.6 72.26 46.14 26.88-6.4 75.52-24.32 94.59-41.41 27.6-24.8 55.4-68.2 58.8-96.2 3.8-31.2-13.4-67.6-33.1-88.6-24.2-25.8-60.6-49.8-85.57-58.56-10.24-7.68-16-14.72-16-21.82 0-11.58 14.46-26.56 26.3-34.37l3.648 15.04c3.968 0.704 7.936 0.96 11.97 0.96l44.67 0.448 33.02 15.68-14.02 20.22 30.08-8.832 24.13-11.58-5.824-29.44zm-89.15-24-20.8-24.51-6.464-7.104 45.76 24.51 8.896 11.65-27.39-4.544z",
  "m183.1 196.4c0-18.56 5.696-38.34 13.25-55.1 9.92-18.05 22.59-37.95 32.64-53.12-94.27 48.51-160.7 103-184.2 187.1 20.03 0.384 31.62 16.9 39.3 35.14 13.18-57.54 46.34-112.1 82.24-143.7-33.86 61.5-59.65 132-71.68 190.1 4.288-1.28 8.704-1.856 13.18-1.856 38.08 0 61.82 60.22 89.28 82.18-0.384-3.2-0.256-6.208-0.256-9.472 1.28-69.5 61.57-94.27 79.42-110.7-44.42-31.94-93.18-69.89-93.18-120.6z",
] as const

/** The source art is 512 units square; this square crops its margin so small marks read larger. */
const markViewBox = "16 16 480 480"

/** Ember: the default theme's orange, light to deep, and its green-black ground. */
const ember = { light: "#F8B16D", mid: "#F67F01", deep: "#EE5700", ink: "#0a1c13" } as const
const ink = ember.ink

const paths = (fill: string) => dragonPaths.map((d) => `<path d="${d}" fill="${fill}"/>`).join("")

/** The bare dragon in one color. */
function markSvg(size: number, color = "#0C0C0C") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${markViewBox}">${paths(color)}</svg>`
}

/**
 * The dragon on an Ember tile, like an app icon. `radius` is a fraction of the side (0 for a
 * full-bleed square that a platform masks itself); `scale` is the dragon's share of the tile.
 */
function tileSvg(size: number, { radius = 0.225, scale = 0.68, inset = 0 }: { radius?: number; scale?: number; inset?: number } = {}) {
  const side = 512 - inset * 2
  const art = 512 * scale
  const offset = (512 - art) / 2
  const k = art / 512
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512"><defs><linearGradient id="t" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="${ember.light}"/><stop offset="0.48" stop-color="${ember.mid}"/><stop offset="1" stop-color="${ember.deep}"/></linearGradient><radialGradient id="g" cx="0.3" cy="0.08" r="0.75"><stop offset="0" stop-color="#ffffff" stop-opacity="0.32"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient></defs><rect x="${inset}" y="${inset}" width="${side}" height="${side}" rx="${side * radius}" fill="url(#t)"/><rect x="${inset}" y="${inset}" width="${side}" height="${side}" rx="${side * radius}" fill="url(#g)"/><g transform="translate(${offset} ${offset}) scale(${k})">${paths(ember.ink)}</g></svg>`
}

const dataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`
const markDataUri = (size: number, color?: string) => dataUri(markSvg(size, color))
const tileDataUri = (size: number, options?: Parameters<typeof tileSvg>[1]) => dataUri(tileSvg(size, options))

export { dragonPaths, ember, ink, markDataUri, markSvg, markViewBox, tileDataUri, tileSvg }
