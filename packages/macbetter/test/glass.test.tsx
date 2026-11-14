import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { Glass, GlassGroup, Material } from "../src/components/glass"

test("a material carries its thickness and can render another element", () => {
  render(
    <>
      <Material material="thick" className="mine">
        Inspector
      </Material>
      <Material material="sidebar" render={<nav aria-label="Library" />} />
    </>
  )
  const pane = screen.getByText("Inspector")
  expect(pane.className).toBe("mb-material mine")
  expect(pane.dataset.material).toBe("thick")
  const nav = screen.getByRole("navigation", { name: "Library" })
  expect(nav.className).toBe("mb-material")
  expect(nav.dataset.material).toBe("sidebar")
})

test("glass carries its variant, shape and interactivity", () => {
  render(
    <Glass variant="clear" shape="capsule" interactive>
      Now Playing
    </Glass>
  )
  const glass = screen.getByText("Now Playing")
  expect(glass.className).toBe("mb-glass")
  expect(glass.dataset.variant).toBe("clear")
  expect(glass.dataset.shape).toBe("capsule")
  expect(glass.hasAttribute("data-interactive")).toBe(true)
})

test("a glass group is a named capsule of controls you can tab through", async () => {
  const user = userEvent.setup()
  const onZoom = vi.fn()
  render(
    <GlassGroup aria-label="Zoom" orientation="vertical">
      <button type="button" onClick={onZoom}>
        Zoom in
      </button>
      <button type="button">Zoom out</button>
    </GlassGroup>
  )
  const group = screen.getByRole("group", { name: "Zoom" })
  expect(group.className).toBe("mb-glass mb-glass-group")
  expect(group.dataset.shape).toBe("capsule")
  expect(group.dataset.orientation).toBe("vertical")
  await user.tab()
  await user.keyboard("{Enter}")
  expect(onZoom).toHaveBeenCalledTimes(1)
  await user.tab()
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Zoom out" }))
})
