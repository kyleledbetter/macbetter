import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { TextField, TextFieldAdornment, TextFieldClear, TextFieldGroup } from "../src/components/text-field"

test("carries its size and variant", () => {
  render(<TextField aria-label="Title" size="lg" variant="filled" className="mine" />)
  const input = screen.getByRole("textbox", { name: "Title" })
  expect(input.className).toBe("mb-text-field mine")
  expect(input.dataset.size).toBe("lg")
  expect(input.dataset.variant).toBe("filled")
})

test("the clear button is named, empties the field and returns focus", async () => {
  const user = userEvent.setup()
  const onValueChange = vi.fn()
  render(
    <TextFieldGroup size="sm">
      <TextFieldAdornment>https://</TextFieldAdornment>
      <TextField aria-label="Website" defaultValue="macbetter.dev" onValueChange={onValueChange} />
      <TextFieldClear />
    </TextFieldGroup>
  )

  const clear = await screen.findByRole("button", { name: "Clear text" })
  expect(clear.className).toContain("mb-text-field-clear")
  expect(clear.querySelector("svg")).toBeTruthy()
  expect(screen.getByText("https://").className).toBe("mb-text-field-adornment")

  await user.click(clear)
  const input = screen.getByRole("textbox", { name: "Website" }) as HTMLInputElement
  expect(input.value).toBe("")
  expect(document.activeElement).toBe(input)
  expect(onValueChange).toHaveBeenLastCalledWith("", expect.objectContaining({ reason: "clear-press" }))
  expect(screen.queryByRole("button", { name: "Clear text" })).toBeNull()

  await user.keyboard("hi")
  expect(input.value).toBe("hi")
})
