import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { SceneRow, SceneTile } from "../src/components/scene-tile"

test("runs the scene from the keyboard, and says when it's on", async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()
  render(
    <SceneRow aria-label="Scenes">
      <SceneTile icon={<svg />} name="Good Morning" active onClick={onClick} />
    </SceneRow>
  )
  const tile = screen.getByRole("button", { name: "Good Morning , On" })
  expect(tile.className).toContain("mb-scene-tile")
  expect(tile.hasAttribute("data-active")).toBe(true)
  tile.focus()
  await user.keyboard("{Enter}")
  expect(onClick).toHaveBeenCalledTimes(1)
  expect(screen.getByRole("group", { name: "Scenes" }).className).toBe("mb-scene-row")
})

test("a running scene is busy and shows a spinner", () => {
  render(<SceneTile name="Movie Time" running size="sm" />)
  const tile = screen.getByRole("button", { name: "Movie Time" })
  expect(tile.getAttribute("aria-busy")).toBe("true")
  expect(tile.dataset.size).toBe("sm")
  expect(tile.querySelector(".mb-activity-indicator")).toBeTruthy()
})
