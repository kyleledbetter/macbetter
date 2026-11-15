import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { AutomationRow } from "../src/components/automation-row"
import { List, ListSection } from "../src/components/list"

test("Space turns the automation off, and the row opens its editor", async () => {
  const user = userEvent.setup()
  const onEnabledChange = vi.fn()
  const onOpen = vi.fn()
  render(
    <List>
      <ListSection>
        <AutomationRow
          title="When I arrive home"
          detail="Unlock Front door and turn on 3 lights"
          defaultEnabled
          onEnabledChange={onEnabledChange}
          onOpen={onOpen}
        />
      </ListSection>
    </List>
  )
  const toggle = screen.getByRole("switch", { name: "When I arrive home" })
  expect(toggle.getAttribute("aria-checked")).toBe("true")
  toggle.focus()
  await user.keyboard(" ")
  expect(onEnabledChange).toHaveBeenCalledWith(false)
  expect(toggle.getAttribute("aria-checked")).toBe("false")

  await user.click(screen.getByRole("button", { name: "When I arrive home" }))
  expect(onOpen).toHaveBeenCalledTimes(1)
  expect(document.querySelector(".mb-automation-row")?.className).toContain("mb-list-row")
})
