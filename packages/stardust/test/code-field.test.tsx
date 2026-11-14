import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { CodeField } from "../src/components/code-field"

test("renders a cell per character, in runs with a dash between", () => {
  const { container } = render(<CodeField aria-label="Recovery key" length={8} groupSize={4} size="lg" />)
  expect(container.querySelectorAll(".sd-code-field-slot")).toHaveLength(8)
  expect(container.querySelectorAll(".sd-code-field-group")).toHaveLength(2)
  expect(container.querySelectorAll(".sd-code-field-separator")).toHaveLength(1)
  expect((container.querySelector(".sd-code-field") as HTMLElement).dataset.size).toBe("lg")
})

test("typing fills the cells and reports the whole code", async () => {
  const user = userEvent.setup()
  const onValueCommit = vi.fn()
  const { container } = render(<CodeField aria-label="Verification code" length={4} onValueCommit={onValueCommit} />)

  const input = screen.getByRole("textbox", { name: "Verification code" })
  input.focus()
  await user.keyboard("4829")
  const cells = [...container.querySelectorAll(".sd-code-field-slot")].map((cell) => cell.textContent)
  expect(cells).toEqual(["4", "8", "2", "9"])
  expect(onValueCommit).toHaveBeenCalledWith("4829", expect.anything())
})

test("an uneven groupSize leaves the remainder in the last run, and no groupSize makes one run", () => {
  const { container, rerender } = render(<CodeField aria-label="Code" length={7} groupSize={3} />)
  const runs = () => [...container.querySelectorAll(".sd-code-field-group")].map((g) => g.children.length)
  expect(runs()).toEqual([3, 3, 1])
  rerender(<CodeField aria-label="Code" length={6} />)
  expect(runs()).toEqual([6])
  expect(container.querySelector(".sd-code-field-separator")).toBeNull()
})

test("a Field label names the code input", async () => {
  const { Field, FieldLabel } = await import("../src/components/field")
  render(
    <Field name="code">
      <FieldLabel>Verification code</FieldLabel>
      <CodeField />
    </Field>
  )
  expect(screen.getByRole("textbox", { name: "Verification code" })).toBeTruthy()
})
