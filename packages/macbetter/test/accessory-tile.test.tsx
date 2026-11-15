import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import {
  AccessoryGrid,
  AccessoryTile,
  AccessoryTileDetail,
  AccessoryTileName,
  AccessoryTileStatus,
  AccessoryTileToggle,
} from "../src/components/accessory-tile"

test("Space on the icon turns the accessory on, and Enter on the name opens its controls", async () => {
  const user = userEvent.setup()
  const onPressedChange = vi.fn()
  const onOpen = vi.fn()
  render(
    <AccessoryTile icon={<svg />} name="Pendant lights" status="Off" onPressedChange={onPressedChange} onOpen={onOpen} />
  )

  const toggle = screen.getByRole("button", { name: "Pendant lights" })
  expect(toggle.getAttribute("aria-pressed")).toBe("false")
  toggle.focus()
  await user.keyboard(" ")
  expect(onPressedChange).toHaveBeenCalledWith(true, expect.anything())
  expect(toggle.getAttribute("aria-pressed")).toBe("true")
  expect(toggle.className).toContain("mb-accessory-tile-toggle")

  const detail = screen.getByRole("button", { name: "Pendant lights Off" })
  detail.focus()
  await user.keyboard("{Enter}")
  expect(onOpen).toHaveBeenCalledTimes(1)
})

test("carries its tint, size and state, and says No Response when unreachable", () => {
  const { container } = render(
    <AccessoryTile tint="yellow" size="sm" state="unreachable" icon={<svg />} name="Floor lamp" className="mine" />
  )
  const tile = container.firstElementChild as HTMLElement
  expect(tile.className).toBe("mb-accessory-tile mine")
  expect(tile.dataset.tint).toBe("yellow")
  expect(tile.dataset.size).toBe("sm")
  expect(tile.dataset.state).toBe("unreachable")
  expect(screen.getByText("No Response")).toBeTruthy()
  expect(screen.getByRole("button", { name: "Floor lamp" }).getAttribute("aria-disabled")).toBe("true")
})

test("a tile without a toggle or onOpen has no buttons, and shows active and updating", () => {
  const { container } = render(
    <AccessoryTile toggleable={false} active state="updating" icon={<svg />} name="Back door" status="Open" />
  )
  const tile = container.firstElementChild as HTMLElement
  expect(screen.queryByRole("button")).toBeNull()
  expect(tile.hasAttribute("data-active")).toBe(true)
  expect(tile.getAttribute("aria-busy")).toBe("true")
  expect(screen.getByLabelText("Updating")).toBeTruthy()
})

test("the parts compose, and the grid is a plain container", () => {
  render(
    <AccessoryGrid data-testid="grid">
      <AccessoryTile tint="orange" partial>
        <AccessoryTileToggle aria-label="Ceiling fan" defaultPressed>
          <svg />
        </AccessoryTileToggle>
        <AccessoryTileDetail>
          <AccessoryTileName>Ceiling fan</AccessoryTileName>
          <AccessoryTileStatus>Speed 2</AccessoryTileStatus>
        </AccessoryTileDetail>
      </AccessoryTile>
    </AccessoryGrid>
  )
  expect(screen.getByTestId("grid").className).toBe("mb-accessory-grid")
  expect(screen.getByRole("button", { name: "Ceiling fan" }).getAttribute("aria-pressed")).toBe("true")
  expect(screen.getByRole("button", { name: "Ceiling fan Speed 2" }).className).toContain("mb-accessory-tile-detail")
})
