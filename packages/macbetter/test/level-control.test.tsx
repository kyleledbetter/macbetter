import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { LevelControl, LevelControlValue } from "../src/components/level-control"

test("composes a vertical track, fill, icon and a named thumb", () => {
  const { container } = render(
    <LevelControl label="Pendant lights brightness" tone="light" size="md" defaultValue={40} icon={<svg />} steps={4} />
  )
  const root = container.querySelector(".mb-level-control") as HTMLElement
  expect(root.dataset.size).toBe("md")
  expect(root.dataset.tone).toBe("light")
  expect(root.dataset.orientation).toBe("vertical")
  expect(container.querySelector(".mb-level-control-track")).not.toBeNull()
  // One icon on the track and one inside the fill, both hidden from assistive tech.
  const icons = container.querySelectorAll(".mb-level-control-icon")
  expect(icons).toHaveLength(2)
  expect(icons[1].hasAttribute("data-on-fill")).toBe(true)
  expect([...icons].every((icon) => icon.getAttribute("aria-hidden") === "true")).toBe(true)
  expect(container.querySelectorAll(".mb-level-control-step")).toHaveLength(3)
  expect(screen.getByRole("slider", { name: "Pendant lights brightness" })).toBeTruthy()
})

test("ArrowUp raises the level and the value shows it", async () => {
  const user = userEvent.setup()
  render(
    <LevelControl label="Living room shades" defaultValue={40} step={10} format={{ style: "unit", unit: "percent" }}>
      <LevelControlValue />
    </LevelControl>
  )
  const thumb = screen.getByRole("slider", { name: "Living room shades" }) as HTMLInputElement
  thumb.focus()
  await user.keyboard("{ArrowUp}")
  expect(thumb.value).toBe("50")
  expect(document.querySelector(".mb-level-control-value")?.textContent).toBe("50%")
})

test("can run horizontally", () => {
  const { container } = render(<LevelControl label="Volume" orientation="horizontal" defaultValue={30} />)
  expect((container.querySelector(".mb-level-control") as HTMLElement).dataset.orientation).toBe("horizontal")
})
