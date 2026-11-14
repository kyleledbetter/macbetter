import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"
import { Squircle, SquircleShadow } from "../src/components/squircle"
import { squirclePath } from "../src/lib/squircle"

function numbers(path: string): number[] {
  return (path.match(/-?\d*\.?\d+(?:e-?\d+)?/g) ?? []).map(Number)
}

// Walks the path's commands and returns the absolute points it visits.
function points(path: string): Array<[number, number]> {
  const out: Array<[number, number]> = []
  let x = 0
  let y = 0
  for (const [, cmd, args] of path.matchAll(/([MLHVCcaZ])([^MLHVCcaZ]*)/g)) {
    const n = numbers(args)
    if (cmd === "M" || cmd === "L") [x, y] = n
    else if (cmd === "H") x = n[0]
    else if (cmd === "V") y = n[0]
    else if (cmd === "c") {
      x += n[4]
      y += n[5]
    } else if (cmd === "a") {
      x += n[5]
      y += n[6]
    }
    if (cmd !== "Z") out.push([x, y])
  }
  return out
}

describe("squirclePath", () => {
  test("is a closed path with no NaN whose last corner lands back on the top edge", () => {
    for (const [w, h, r, s] of [
      [120, 120, 27, 0.77],
      [320, 180, 16, 0.6],
      [44, 28, 6, 1],
      [10, 300, 80, 0.77],
    ]) {
      const path = squirclePath(w, h, r, s)
      expect(path.startsWith("M")).toBe(true)
      expect(path.endsWith("Z")).toBe(true)
      expect(path).not.toMatch(/NaN|Infinity/)
      const visited = points(path)
      const [first, last] = [visited[0], visited.at(-1)!]
      // Z closes the top edge: it starts at the top-right curve and ends at the top-left one.
      expect(first[1]).toBe(0)
      expect(last[1]).toBeCloseTo(0, 2)
      expect(last[0]).toBeCloseTo(w - first[0], 2)
      for (const [px, py] of visited) {
        expect(px).toBeGreaterThanOrEqual(-0.01)
        expect(px).toBeLessThanOrEqual(w + 0.01)
        expect(py).toBeGreaterThanOrEqual(-0.01)
        expect(py).toBeLessThanOrEqual(h + 0.01)
      }
    }
  })

  test("is symmetric about both axes", () => {
    const w = 200
    const h = 120
    const visited = points(squirclePath(w, h, 30))
    for (const [x, y] of visited) {
      expect(visited.some(([a, b]) => Math.abs(a - (w - x)) < 0.01 && Math.abs(b - y) < 0.01)).toBe(true)
      expect(visited.some(([a, b]) => Math.abs(a - x) < 0.01 && Math.abs(b - (h - y)) < 0.01)).toBe(true)
    }
  })

  test("is a plain rectangle at radius 0", () => {
    expect(squirclePath(40, 20, 0)).toBe("M0 0H40V20H0Z")
    expect(squirclePath(40, 20, -5)).toBe("M0 0H40V20H0Z")
  })

  test("becomes a circle at the largest radius, with the smoothing given up", () => {
    const path = squirclePath(100, 100, 500, 0.77)
    // Smoothing 0 leaves only quarter arcs of radius 50 between the edges' midpoints.
    expect(path).toContain("a50 50 0 0 1 50 50")
    const visited = points(path)
    for (const [x, y] of visited) expect(Math.hypot(x - 50, y - 50)).toBeCloseTo(50, 1)
  })

  test("starts the curve (1 + smoothing) × radius from the corner", () => {
    expect(squirclePath(300, 300, 50, 0.6).startsWith("M220 0")).toBe(true)
    expect(squirclePath(300, 300, 50, 0).startsWith("M250 0")).toBe(true)
  })

  test("treats bad input as zero", () => {
    expect(squirclePath(Number.NaN, 10, 4)).toBe("M0 0H0V10H0Z")
    expect(squirclePath(10, 10, Number.NaN)).toBe("M0 0H10V10H0Z")
  })
})

describe("Squircle", () => {
  test("carries its class and radius for the stylesheet", () => {
    render(<Squircle data-testid="icon" radius={12} className="mine" />)
    const el = screen.getByTestId("icon")
    expect(el.className).toBe("mb-squircle mine")
    expect(el.style.getPropertyValue("--mb-squircle-radius")).toBe("12px")
    expect(el.hasAttribute("data-exact")).toBe(false)
  })

  test("defaults to an app icon's proportion", () => {
    render(<Squircle data-testid="icon" />)
    expect(screen.getByTestId("icon").style.getPropertyValue("--mb-squircle-radius")).toBe(
      "var(--mb-squircle-radius-icon)"
    )
  })

  test("draws the exact outline as a clip-path when it knows its size", () => {
    render(<Squircle data-testid="icon" size={60} exact />)
    const el = screen.getByTestId("icon")
    expect(el.hasAttribute("data-exact")).toBe(true)
    expect(el.style.width).toBe("60px")
    expect(el.style.clipPath).toContain(squirclePath(60, 60, 60 * 0.2237).slice(0, 12))
  })

  test("falls back to corner-shape when exact has no size or a radius CSS must resolve", () => {
    render(
      <>
        <Squircle data-testid="a" exact />
        <Squircle data-testid="b" size={40} radius="var(--mb-radius-lg)" exact />
      </>
    )
    for (const id of ["a", "b"]) {
      const el = screen.getByTestId(id)
      expect(el.hasAttribute("data-exact")).toBe(false)
      expect(el.style.clipPath).toBe("")
    }
  })

  test("wraps an exact shape in a drop shadow, and shadows the box otherwise", () => {
    const { container } = render(
      <>
        <Squircle data-testid="exact" size={40} exact shadow />
        <Squircle data-testid="css" shadow />
      </>
    )
    expect(screen.getByTestId("exact").parentElement?.className).toBe("mb-squircle-shadow")
    expect(screen.getByTestId("css").hasAttribute("data-shadow")).toBe(true)
    expect(container.querySelectorAll(".mb-squircle-shadow")).toHaveLength(1)
  })

  test("maps a smoothing override onto the superellipse", () => {
    render(<Squircle data-testid="icon" smoothing={0} />)
    const el = screen.getByTestId("icon")
    expect(el.hasAttribute("data-smoothing")).toBe(true)
    expect(el.style.getPropertyValue("--mb-squircle-k")).toBe("1.000")
    expect(el.style.getPropertyValue("--mb-squircle-m")).toBe("1.000")
  })

  test("renders another element and keeps it working from the keyboard", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Squircle radius="icon" size={48} render={<button type="button" aria-label="Open Maps" onClick={onClick} />} />
    )
    const button = screen.getByRole("button", { name: "Open Maps" })
    expect(button.className).toBe("mb-squircle")
    button.focus()
    await user.keyboard("{Enter}")
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test("SquircleShadow merges its class", () => {
    render(<SquircleShadow data-testid="s" className="mine" />)
    expect(screen.getByTestId("s").className).toBe("mb-squircle-shadow mine")
  })
})
