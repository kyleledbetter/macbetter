import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { ScrollView } from "../src/components/scroll-view"

test("pre-composes a named viewport and a scrollbar for each axis", () => {
  const { container } = render(
    <ScrollView aria-label="Release notes" orientation="both" variant="bordered" className="mine">
      <p>Version 26.1</p>
    </ScrollView>
  )

  const root = container.firstElementChild as HTMLElement
  expect(root.className).toBe("mb-scroll-view mine")
  expect(root.dataset.orientation).toBe("both")
  expect(root.dataset.variant).toBe("bordered")
  expect(root.hasAttribute("data-fade")).toBe(true)
  expect(root.getAttribute("aria-label")).toBeNull()

  const region = screen.getByRole("region", { name: "Release notes" })
  expect(region.className).toBe("mb-scroll-view-viewport")
  expect(region.querySelector(".mb-scroll-view-content")?.textContent).toBe("Version 26.1")
  expect(container.querySelectorAll(".mb-scroll-view-scrollbar")).toHaveLength(2)
  expect(container.querySelector(".mb-scroll-view-corner")).not.toBeNull()
})

test("a vertical view has one scrollbar, and the viewport takes keyboard focus", async () => {
  const user = userEvent.setup()
  const { container } = render(
    <ScrollView aria-label="Notes" fade={false} viewportProps={{ tabIndex: 0 }}>
      <p>Long text</p>
    </ScrollView>
  )
  const root = container.firstElementChild as HTMLElement
  expect(root.hasAttribute("data-fade")).toBe(false)
  const bars = container.querySelectorAll(".mb-scroll-view-scrollbar")
  expect(bars).toHaveLength(1)
  expect((bars[0] as HTMLElement).dataset.orientation).toBe("vertical")

  await user.tab()
  expect(document.activeElement).toBe(screen.getByRole("region", { name: "Notes" }))
})
