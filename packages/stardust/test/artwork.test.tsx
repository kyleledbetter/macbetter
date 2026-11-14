import { render } from "@testing-library/react"
import * as React from "react"
import { hydrateRoot } from "react-dom/client"
import { renderToStaticMarkup, renderToString } from "react-dom/server"
import { act } from "react"
import { expect, test, vi } from "vitest"
import { Artwork, artworkPalettes, artworkVariants } from "../src/components/artwork"

test("the same seed draws the same picture, and a different seed a different one", () => {
  for (const variant of artworkVariants) {
    const a = renderToStaticMarkup(<Artwork seed="Golden Hour" variant={variant} palette="sunset" />)
    const b = renderToStaticMarkup(<Artwork seed="Golden Hour" variant={variant} palette="sunset" />)
    const c = renderToStaticMarkup(<Artwork seed="Low Tide" variant={variant} palette="sunset" />)
    expect(a).toBe(b)
    expect(a).not.toBe(c)
  }
  expect(renderToStaticMarkup(<Artwork seed={42} />)).toBe(renderToStaticMarkup(<Artwork seed="42" />))
})

test("every variant draws clean geometry at every aspect", () => {
  for (const variant of artworkVariants) {
    for (const aspect of [1, 16 / 9, 3 / 4]) {
      for (const seed of ["a", "b", 7, "Night Garden"]) {
        const html = renderToStaticMarkup(<Artwork seed={seed} variant={variant} aspect={aspect} finish="grain" />)
        expect(html, `${variant} ${seed} ${aspect}`).not.toMatch(/NaN|undefined|Infinity|null/)
        expect(html).toContain(`data-variant="${variant}"`)
        // Every url(#…) reference points at a gradient, pattern or filter drawn in the same picture.
        const ids = new Set(Array.from(html.matchAll(/ id="([^"]+)"/g), (match) => match[1]))
        for (const [, ref] of html.matchAll(/url\(#([^)]+)\)/g)) expect(ids.has(ref), `${variant} → ${ref}`).toBe(true)
      }
    }
  }
})

test("hydrates without a mismatch and renders the same markup on the server and in the browser", async () => {
  const errors = vi.spyOn(console, "error").mockImplementation(() => {})
  const onRecoverableError = vi.fn()
  const tree = (
    <div>
      {artworkVariants.map((variant) => (
        <Artwork key={variant} seed="Hydrate" variant={variant} finish="grain" />
      ))}
    </div>
  )
  const html = renderToString(tree)
  const container = document.createElement("div")
  container.innerHTML = html
  document.body.append(container)
  await act(async () => {
    hydrateRoot(container, tree, { onRecoverableError })
  })
  expect(onRecoverableError).not.toHaveBeenCalled()
  expect(errors).not.toHaveBeenCalled()
  expect(container.innerHTML).toBe(html)
  errors.mockRestore()
  container.remove()

  // A client-only render draws the same picture; only React's ids differ.
  const { container: client } = render(<Artwork seed="Hydrate" variant="ribbon" />)
  // jsdom re-serializes style attributes it built itself ("a: b;"), so compare them without whitespace.
  const strip = (markup: string) =>
    markup
      .replace(/sd-art-[A-Za-z0-9_-]+?-(?=[a-z])/g, "sd-art-ID-")
      .replace(/style="([^"]*)"/g, (_, css: string) => `style="${css.replace(/\s*([:;])\s*/g, "$1").replace(/;$/, "")}"`)
  expect(strip(client.innerHTML)).toBe(strip(renderToString(<Artwork seed="Hydrate" variant="ribbon" />)))
})

test("two pictures with the same seed don't share gradient ids", () => {
  const { container } = render(
    <>
      <Artwork seed="Twin" variant="aurora" />
      <Artwork seed="Twin" variant="aurora" />
    </>
  )
  const ids = Array.from(container.querySelectorAll("[id]"), (element) => element.id)
  expect(ids.length).toBeGreaterThan(0)
  expect(new Set(ids).size).toBe(ids.length)
})

test("is decorative by default and an image when named", () => {
  const { container, getByRole } = render(
    <>
      <Artwork seed="Decorative" />
      <Artwork seed="Named" title="Cover of Night Garden" />
      <Artwork seed="Labelled" aria-label="Playlist artwork" />
    </>
  )
  const [decorative] = Array.from(container.querySelectorAll("svg"))
  expect(decorative?.getAttribute("aria-hidden")).toBe("true")
  expect(decorative?.getAttribute("role")).toBeNull()
  const named = getByRole("img", { name: "Cover of Night Garden" })
  expect(named.querySelector("title")?.textContent).toBe("Cover of Night Garden")
  expect(getByRole("img", { name: "Playlist artwork" }).getAttribute("aria-hidden")).toBeNull()
  expect(container.querySelectorAll('[aria-label="Playlist artwork"]')).toHaveLength(1)
})

test("sets classes, data attributes and size variables, and merges the caller's", () => {
  const { container } = render(
    <Artwork
      seed="Props"
      variant="glyph"
      palette="ocean"
      shape="app"
      size={64}
      aspect={16 / 9}
      finish="flat"
      animated
      className="cover"
      style={{ marginTop: 4 }}
      data-testid="art"
    />
  )
  const root = container.querySelector(".sd-artwork") as HTMLElement
  expect(root.className).toBe("sd-artwork cover")
  expect(root.dataset).toMatchObject({ variant: "glyph", palette: "ocean", shape: "app", finish: "flat", animated: "", testid: "art" })
  expect(root.style.getPropertyValue("--sd-artwork-size")).toBe("64px")
  expect(root.style.getPropertyValue("--sd-artwork-aspect")).toBe("1.7778")
  expect(root.style.marginTop).toBe("4px")
  expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe("0 0 177.8 100")
  expect(container.querySelector(".sd-artwork-finish")).toBeNull()
})

test("auto picks a stable variant and palette, and colors replace the palette", () => {
  const first = render(<Artwork seed="Auto" />).container.querySelector(".sd-artwork") as HTMLElement
  const second = render(<Artwork seed="Auto" />).container.querySelector(".sd-artwork") as HTMLElement
  expect(artworkVariants).toContain(first.dataset.variant)
  expect(artworkPalettes).toContain(first.dataset.palette)
  expect(first.dataset.variant).toBe(second.dataset.variant)
  expect(first.dataset.palette).toBe(second.dataset.palette)

  const custom = render(<Artwork seed="Custom" colors={["red", "blue"]} radius={12} />).container.querySelector(".sd-artwork") as HTMLElement
  expect(custom.dataset.palette).toBe("custom")
  expect(custom.dataset.shape).toBeUndefined()
  expect(custom.style.getPropertyValue("--sd-artwork-1")).toBe("red")
  expect(custom.style.getPropertyValue("--sd-artwork-3")).toBe("red")
  expect(custom.style.getPropertyValue("--sd-artwork-4")).toBe("blue")
  expect(custom.style.getPropertyValue("--sd-artwork-radius")).toBe("12px")
})

test("lays children over the art", () => {
  const { getByText } = render(
    <Artwork seed="Card">
      <span>Yoga for Runners</span>
    </Artwork>
  )
  expect(getByText("Yoga for Runners").parentElement?.className).toBe("sd-artwork-content")
  void React
})
