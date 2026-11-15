import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { SetupCode, SetupCodeField, SetupCodeScanner } from "../src/components/setup-code"

test("groups a setup code as it's printed, and reads it digit by digit", () => {
  const { container, rerender } = render(<SetupCode code="482-91-376" />)
  expect(screen.getByRole("img", { name: "Setup code: 4 8 2 9 1 3 7 6" })).toBeTruthy()
  expect([...container.querySelectorAll(".mb-setup-code-group")].map((g) => g.textContent)).toEqual(["482", "91", "376"])

  rerender(<SetupCode code="34970112332" format="matter" />)
  expect([...container.querySelectorAll(".mb-setup-code-group")].map((g) => g.textContent)).toEqual(["3497", "011", "2332"])
})

test("the field takes eight digits in runs of three, two and three", async () => {
  const user = userEvent.setup()
  const onValueCommit = vi.fn()
  const { container } = render(<SetupCodeField aria-label="Setup code" onValueCommit={onValueCommit} />)
  expect(container.querySelectorAll(".mb-code-field-slot")).toHaveLength(8)
  expect(container.querySelectorAll(".mb-code-field-group")).toHaveLength(3)
  const input = screen.getByRole("textbox", { name: "Setup code" })
  input.focus()
  await user.keyboard("48a291376")
  expect(onValueCommit).toHaveBeenCalledWith("48291376", expect.anything())
})

test("the scanner draws its frame and instruction", () => {
  const { container } = render(<SetupCodeScanner />)
  expect(screen.getByText("Position the code in the frame.")).toBeTruthy()
  expect(container.querySelector(".mb-setup-code-scanner-frame")?.getAttribute("aria-hidden")).toBe("true")
})
