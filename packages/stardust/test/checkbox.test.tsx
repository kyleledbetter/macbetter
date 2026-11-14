import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { Checkbox, CheckboxGroup } from "../src/components/checkbox"

test("a titled checkbox is one label: the text names it and toggles it", async () => {
  const user = userEvent.setup()
  render(<Checkbox description="Shows dotfiles too.">Show hidden files</Checkbox>)

  const box = screen.getByRole("checkbox", { name: /Show hidden files/ })
  expect(box.className).toBe("sd-checkbox")
  expect(box.closest(".sd-checkbox-label")).not.toBeNull()
  await user.click(screen.getByText("Show hidden files"))
  expect(box.getAttribute("aria-checked")).toBe("true")
  expect(box.querySelector(".sd-checkbox-check")).not.toBeNull()
})

test("toggles with Space and shows the mixed state", async () => {
  const user = userEvent.setup()
  render(<Checkbox defaultChecked="indeterminate" aria-label="Select all" />)

  const box = screen.getByRole("checkbox", { name: "Select all" })
  expect(box.getAttribute("aria-checked")).toBe("mixed")
  expect(box.querySelector(".sd-checkbox-indicator")?.hasAttribute("data-indeterminate")).toBe(true)
  box.focus()
  await user.keyboard(" ")
  expect(box.getAttribute("aria-checked")).toBe("true")
})

test("renders the box alone without a title", () => {
  render(<Checkbox aria-label="Row 1" />)
  expect(screen.getByRole("checkbox", { name: "Row 1" }).closest("label")).toBeNull()
})

test("a parent checks the whole group", async () => {
  const user = userEvent.setup()
  render(
    <CheckboxGroup aria-label="Folders" defaultValue={["desktop"]} allValues={["desktop", "documents"]}>
      <Checkbox parent>All folders</Checkbox>
      <Checkbox value="desktop">Desktop</Checkbox>
      <Checkbox value="documents">Documents</Checkbox>
    </CheckboxGroup>
  )
  expect(screen.getByRole("group", { name: "Folders" }).className).toBe("sd-checkbox-group")
  const parent = screen.getByRole("checkbox", { name: "All folders" })
  expect(parent.getAttribute("aria-checked")).toBe("mixed")
  await user.click(parent)
  expect(screen.getByRole("checkbox", { name: "Documents" }).getAttribute("aria-checked")).toBe("true")
})

test("an invalid field marks the checkbox, which the stylesheet edges in red", async () => {
  const { Field } = await import("../src/components/field")
  render(
    <Field invalid>
      <Checkbox>Accept the terms</Checkbox>
    </Field>
  )
  expect(screen.getByRole("checkbox", { name: "Accept the terms" }).hasAttribute("data-invalid")).toBe(true)
})
