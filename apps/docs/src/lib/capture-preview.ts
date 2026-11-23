// Turns a live preview into a PNG, entirely in the browser. SnapDOM clones the
// node with its computed styles (so light-dark(), color-mix(), @scope and the
// forced scheme arrive resolved), emulates backdrop-filter, and inlines canvases.

type CaptureOptions = {
  /** Corner radius of the picture, in CSS pixels. Outside the corners is transparent. */
  radius?: number
  /** Crops to this rectangle, in viewport coordinates. */
  crop?: DOMRect
  /** Leaves these out of the picture but keeps their space. */
  exclude?: string[]
  /** Device pixels per CSS pixel. */
  scale?: number
}

let library: Promise<typeof import("@zumer/snapdom")> | null = null

type SnapdomPlugin = import("@zumer/snapdom").SnapdomPlugin

/** Splits a computed box-shadow list into its shadows, keeping commas inside color functions. */
function insetShadows(value: string) {
  const shadows: string[] = []
  let depth = 0
  let start = 0
  for (let i = 0; i < value.length; i++) {
    if (value[i] === "(") depth++
    else if (value[i] === ")") depth--
    else if (value[i] === "," && depth === 0) {
      shadows.push(value.slice(start, i))
      start = i + 1
    }
  }
  shadows.push(value.slice(start))
  return shadows.filter((shadow) => /\binset\b/.test(shadow)).join(",")
}

/**
 * Patches what SnapDOM's clone gets wrong for macbetter. It redraws backdrop-filter as layers
 * stacked inside the element, which cover its inset box-shadows (a sidebar's hairline edge)
 * and round off its continuous corners, so those are restated above the layers.
 */
function cloneFixes(): SnapdomPlugin {
  let hosts: Array<{ clone: HTMLElement; insets: string }> = []
  return {
    name: "macbetter-clone-fixes",
    afterClone(context) {
      hosts = []
      const map = context.nodeMap as Map<Node, Node> | undefined
      if (!(map instanceof Map) || !(context.clone instanceof HTMLElement)) return
      for (const clone of context.clone.querySelectorAll<HTMLElement>("*")) {
        const original = map.get(clone)
        if (!(original instanceof Element)) continue
        const style = getComputedStyle(original)
        // Blend modes set from a stylesheet on shapes inside an SVG (Artwork's grain) don't make it across.
        if (original instanceof SVGElement && style.mixBlendMode !== "normal") {
          clone.style.setProperty("mix-blend-mode", style.mixBlendMode)
        }
        // The SVG image draws classic scrollbars; a picture reads better with overlay ones, which is none at rest.
        if (/auto|scroll/.test(style.overflowX + style.overflowY)) clone.style.setProperty("scrollbar-width", "none")
        const filter = style.getPropertyValue("backdrop-filter") || style.getPropertyValue("-webkit-backdrop-filter")
        if (!filter || filter === "none") continue
        hosts.push({ clone, insets: insetShadows(style.boxShadow) })
      }
    },
    beforeRender() {
      for (const { clone, insets } of hosts) {
        for (const layer of Array.from(clone.children).slice(0, 2)) {
          if (layer instanceof HTMLElement && /^-[12]$/.test(layer.style.zIndex)) {
            layer.style.setProperty("corner-shape", "inherit")
          }
        }
        if (!insets) continue
        const edge = document.createElement("div")
        edge.style.cssText = "position:absolute;inset:0;border-radius:inherit;corner-shape:inherit;pointer-events:none;z-index:-1"
        edge.style.boxShadow = insets
        clone.append(edge)
      }
      hosts = []
    },
  }
}

/** Starts loading the capture library, so the first capture doesn't wait for it. */
function preloadCapture() {
  library ??= import("@zumer/snapdom")
  return library
}

async function capturePreview(target: HTMLElement, { radius = 0, crop, exclude = [], scale = 2 }: CaptureOptions = {}) {
  const [{ snapdom }] = await Promise.all([preloadCapture(), document.fonts.ready])
  const box = target.getBoundingClientRect()
  const result = await snapdom(target, {
    dpr: scale,
    scale: 1,
    exclude: ["[data-capture-exclude]", ...exclude],
    excludeMode: "hide",
    // Hands the page a frame now and then, so the button's busy state keeps animating.
    fast: false,
    invalidate: true,
    backgroundColor: null,
    plugins: [cloneFixes()],
  })
  const source = await result.toCanvas()

  // The clone's canvas is in device pixels; work out the region to keep in the same units.
  const ratio = source.width / box.width
  const region = crop
    ? {
        x: Math.max(0, crop.left - box.left),
        y: Math.max(0, crop.top - box.top),
        width: Math.min(crop.width, box.right - crop.left),
        height: Math.min(crop.height, box.bottom - crop.top),
      }
    : { x: 0, y: 0, width: box.width, height: box.height }

  const output = document.createElement("canvas")
  output.width = Math.round(region.width * ratio)
  output.height = Math.round(region.height * ratio)
  const context = output.getContext("2d")
  if (!context) throw new Error("Canvas 2D isn't available")
  if (radius > 0) {
    context.beginPath()
    context.roundRect(0, 0, output.width, output.height, radius * ratio)
    context.clip()
  }
  context.drawImage(
    source,
    region.x * ratio,
    region.y * ratio,
    region.width * ratio,
    region.height * ratio,
    0,
    0,
    output.width,
    output.height
  )

  return new Promise<Blob>((resolve, reject) =>
    output.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Couldn't encode the PNG"))), "image/png")
  )
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

/** Whether this browser can put a PNG on the clipboard. */
function canCopyImages() {
  if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) return false
  return typeof ClipboardItem.supports === "function" ? ClipboardItem.supports("image/png") : true
}

/**
 * Copies a PNG that's still rendering. The write starts inside the click, with a promise
 * for the blob: Safari only allows clipboard writes that begin in a user gesture.
 */
function copyBlob(blob: Promise<Blob>) {
  return navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
}

export { canCopyImages, capturePreview, copyBlob, downloadBlob, preloadCapture }
export type { CaptureOptions }
