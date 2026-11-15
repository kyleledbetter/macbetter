import { render } from "@testing-library/react"
import { renderToStaticMarkup } from "react-dom/server"
import { expect, test } from "vitest"
import { HomeBackdrop } from "../src/components/home-backdrop"

test("paints a decorative wallpaper behind its children, with a dim level", () => {
  const { container, getByText } = render(
    <HomeBackdrop seed="Kitchen" palette="amber" variant="window" time="day" aspect={0.5} dim={0.4} className="room">
      <h1>Kitchen</h1>
    </HomeBackdrop>
  )
  const root = container.firstElementChild as HTMLElement
  expect(root.className).toBe("mb-home-backdrop room")
  expect(root.style.getPropertyValue("--mb-home-backdrop-dim")).toBe("0.4")
  const layer = root.querySelector(".mb-home-backdrop-layer") as HTMLElement
  expect(layer.getAttribute("aria-hidden")).toBe("true")
  const art = layer.querySelector(".mb-artwork") as HTMLElement
  expect(art.dataset).toMatchObject({ variant: "window", palette: "amber", time: "day", finish: "flat" })
  expect(art.style.getPropertyValue("--mb-artwork-aspect")).toBe("0.5")
  expect(getByText("Kitchen").parentElement).toBe(root)
})

test("shows a photo in place of art, and the same seed draws the same wallpaper", () => {
  const { container } = render(<HomeBackdrop seed="Lake House" src="/wallpaper.jpg" dim={7} />)
  const image = container.querySelector(".mb-home-backdrop-image") as HTMLImageElement
  expect(image.getAttribute("alt")).toBe("")
  expect(container.querySelector(".mb-artwork")).toBeNull()
  expect((container.firstElementChild as HTMLElement).style.getPropertyValue("--mb-home-backdrop-dim")).toBe("1")

  const strip = (html: string) => html.replace(/mb-art-[A-Za-z0-9_-]+?-(?=[a-z])/g, "")
  expect(strip(renderToStaticMarkup(<HomeBackdrop seed="Maple Street" />))).toBe(strip(renderToStaticMarkup(<HomeBackdrop seed="Maple Street" />)))
  expect(renderToStaticMarkup(<HomeBackdrop seed="Maple Street" />)).toContain('data-variant="wash"')
})
