import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { SecureField } from "../src/components/secure-field"

test("hides the password, and the eye button shows it from the keyboard", async () => {
  const user = userEvent.setup()
  const { container } = render(<SecureField aria-label="Password" placeholder="Required" size="lg" />)

  const root = container.querySelector(".mb-secure-field") as HTMLElement
  expect(root.dataset.size).toBe("lg")
  expect(root.dataset.variant).toBe("auto")
  const input = container.querySelector(".mb-secure-field-input") as HTMLInputElement
  expect(input.type).toBe("password")
  expect(input.placeholder).toBe("Required")
  expect(input.getAttribute("aria-label")).toBe("Password")

  const toggle = screen.getByRole("button", { name: "Show password" })
  expect(toggle.className).toContain("mb-secure-field-toggle")
  toggle.focus()
  await user.keyboard(" ")
  expect(input.type).toBe("text")
  expect(toggle.getAttribute("aria-pressed")).toBe("true")
})

test("leaves the toggle out when asked", () => {
  render(<SecureField aria-label="PIN" toggle={false} />)
  expect(screen.queryByRole("button")).toBeNull()
})

test("a Field label names the input and clicking it focuses the input", async () => {
  const user = userEvent.setup()
  const { Field, FieldDescription, FieldLabel } = await import("../src/components/field")
  render(
    <Field name="password">
      <FieldLabel>Password</FieldLabel>
      <SecureField defaultValue="correct-horse" />
      <FieldDescription>Use at least 8 characters.</FieldDescription>
    </Field>
  )
  const input = screen.getByLabelText("Password") as HTMLInputElement
  expect(input.className).toContain("mb-secure-field-input")
  expect(input.name).toBe("password")
  expect(input.getAttribute("aria-describedby")).toBeTruthy()
  await user.click(screen.getByText("Password"))
  expect(document.activeElement).toBe(input)
})
