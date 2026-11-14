/**
 * Apple's continuous corner as an SVG path.
 *
 * Each corner is a circular arc eased into both edges by a cubic Bézier, the
 * construction Figma calls "corner smoothing". `smoothing` stretches the ease:
 * the curve starts `(1 + smoothing) × radius` from the corner. At 0.77 it
 * traces iOS's continuous corner to within 0.15px on a 360px app icon
 * (measured against the UIBezierPath outline; Figma's "iOS" preset of 0.6 is
 * about twice as far off). When the box is too small for the full ease, the
 * smoothing gives way first and the radius second, so the largest radius
 * (half the shorter side) is a capsule, or a circle in a square.
 */

/** Corner smoothing that matches iOS: app icons, cards, sheets, buttons. */
const SQUIRCLE_SMOOTHING = 0.77

/** An app icon's corner radius as a fraction of its side. */
const SQUIRCLE_ICON_RATIO = 0.2237

function round(value: number): number {
  const rounded = Math.round(value * 1000) / 1000
  return Object.is(rounded, -0) ? 0 : rounded
}

/**
 * The outline of a `width` × `height` rectangle with continuous corners, as an
 * SVG path starting at the top edge and running clockwise, in user units with
 * the origin at the top-left corner.
 */
function squirclePath(width: number, height: number, radius: number, smoothing: number = SQUIRCLE_SMOOTHING): string {
  const w = Number.isFinite(width) && width > 0 ? width : 0
  const h = Number.isFinite(height) && height > 0 ? height : 0
  const budget = Math.min(w, h) / 2
  const r = Math.min(Number.isFinite(radius) && radius > 0 ? radius : 0, budget)
  let s = Math.min(Math.max(Number.isFinite(smoothing) ? smoothing : 0, 0), 1)

  if (r === 0) return `M0 0H${round(w)}V${round(h)}H0Z`

  // The ease can't reach past the middle of a side: shrink it before the radius.
  const p = Math.min((1 + s) * r, budget)
  s = Math.min(s, budget / r - 1)

  const rad = Math.PI / 180
  const arcAngle = 90 * (1 - s)
  const arc = Math.sin((arcAngle / 2) * rad) * r * Math.SQRT2
  const alpha = (90 - arcAngle) / 2
  const p3p4 = r * Math.tan((alpha / 2) * rad)
  const beta = 45 * s
  const c = p3p4 * Math.cos(beta * rad)
  const d = c * Math.tan(beta * rad)
  const b = (p - arc - c - d) / 3
  const a = 2 * b

  const n = round
  const A = `a${n(r)} ${n(r)} 0 0 1`
  return [
    `M${n(w - p)} 0`,
    `c${n(a)} 0 ${n(a + b)} 0 ${n(a + b + c)} ${n(d)}`,
    `${A} ${n(arc)} ${n(arc)}`,
    `c${n(d)} ${n(c)} ${n(d)} ${n(b + c)} ${n(d)} ${n(a + b + c)}`,
    `L${n(w)} ${n(h - p)}`,
    `c0 ${n(a)} 0 ${n(a + b)} ${n(-d)} ${n(a + b + c)}`,
    `${A} ${n(-arc)} ${n(arc)}`,
    `c${n(-c)} ${n(d)} ${n(-(b + c))} ${n(d)} ${n(-(a + b + c))} ${n(d)}`,
    `L${n(p)} ${n(h)}`,
    `c${n(-a)} 0 ${n(-(a + b))} 0 ${n(-(a + b + c))} ${n(-d)}`,
    `${A} ${n(-arc)} ${n(-arc)}`,
    `c${n(-d)} ${n(-c)} ${n(-d)} ${n(-(b + c))} ${n(-d)} ${n(-(a + b + c))}`,
    `L0 ${n(p)}`,
    `c0 ${n(-a)} 0 ${n(-(a + b))} ${n(d)} ${n(-(a + b + c))}`,
    `${A} ${n(arc)} ${n(-arc)}`,
    `c${n(c)} ${n(-d)} ${n(b + c)} ${n(-d)} ${n(a + b + c)} ${n(-d)}`,
    "Z",
  ].join("")
}

export { SQUIRCLE_ICON_RATIO, SQUIRCLE_SMOOTHING, squirclePath }
