import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { Switch, SwitchThumb } from "../src/components/switch"

test("renders its own thumb and carries its size", () => {
  render(<Switch aria-label="Wi-Fi" size="sm" className="mine" />)
  const control = screen.getByRole("switch", { name: "Wi-Fi" })
  expect(control.className).toBe("sd-switch mine")
  expect(control.dataset.size).toBe("sm")
  expect(control.querySelector(".sd-switch-thumb")).not.toBeNull()
})

test("Space turns it on and off; Enter doesn't", async () => {
  const user = userEvent.setup()
  render(<Switch aria-label="Bluetooth" />)
  const control = screen.getByRole("switch", { name: "Bluetooth" })
  control.focus()
  await user.keyboard(" ")
  expect(control.getAttribute("aria-checked")).toBe("true")
  await user.keyboard("{Enter}")
  expect(control.getAttribute("aria-checked")).toBe("true")
  await user.click(control)
  expect(control.getAttribute("aria-checked")).toBe("false")
})

test("a custom thumb keeps the Stardust class beside the caller's", () => {
  render(
    <Switch aria-label="Airplane Mode">
      <SwitchThumb className="plane" />
    </Switch>
  )
  const thumbs = screen.getByRole("switch", { name: "Airplane Mode" }).querySelectorAll(".sd-switch-thumb")
  expect(thumbs).toHaveLength(1)
  expect(thumbs[0]?.className).toBe("sd-switch-thumb plane")
})
