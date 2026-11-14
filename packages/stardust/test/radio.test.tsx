import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { Radio, RadioGroup } from "../src/components/radio"

test("titles name the radios, and the group carries its variant", () => {
  render(
    <RadioGroup variant="list" aria-label="Auto-Lock" defaultValue="60">
      <Radio value="30">30 seconds</Radio>
      <Radio value="60" description="Recommended">
        1 minute
      </Radio>
    </RadioGroup>
  )
  const group = screen.getByRole("radiogroup", { name: "Auto-Lock" })
  expect(group.className).toBe("sd-radio-group")
  expect(group.dataset.variant).toBe("list")
  const checked = screen.getByRole("radio", { name: /1 minute/ })
  expect(checked.className).toBe("sd-radio")
  expect(checked.getAttribute("aria-checked")).toBe("true")
  expect(checked.querySelector(".sd-radio-indicator")).not.toBeNull()
  expect(checked.querySelector(".sd-radio-check")).not.toBeNull()
})

test("arrow keys move and check, and a click on the title checks", async () => {
  const user = userEvent.setup()
  render(
    <RadioGroup aria-label="Appearance" defaultValue="light">
      <Radio value="light">Light</Radio>
      <Radio value="dark">Dark</Radio>
      <Radio value="auto">Automatic</Radio>
    </RadioGroup>
  )
  await user.tab()
  await user.keyboard("{ArrowDown}")
  expect(screen.getByRole("radio", { name: "Dark" }).getAttribute("aria-checked")).toBe("true")
  await user.click(screen.getByText("Automatic"))
  expect(screen.getByRole("radio", { name: "Automatic" }).getAttribute("aria-checked")).toBe("true")
})

test("an invalid field marks the group, whose empty radios the stylesheet edges in red", async () => {
  const { Field } = await import("../src/components/field")
  render(
    <Field invalid>
      <RadioGroup aria-label="Delivery">
        <Radio value="standard">Standard</Radio>
        <Radio value="express">Express</Radio>
      </RadioGroup>
    </Field>
  )
  expect(screen.getByRole("radiogroup", { name: "Delivery" }).hasAttribute("data-invalid")).toBe(true)
})
