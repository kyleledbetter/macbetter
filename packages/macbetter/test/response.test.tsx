import { render, screen } from "@testing-library/react"
import { expect, test } from "vitest"
import { Response, ResponseCaret } from "../src/components/response"

test("wraps the reply's elements, marks it streaming, and the caret is hidden from assistive tech", () => {
  const { container } = render(
    <Response streaming className="mine">
      <h2>Day one</h2>
      <p>
        Start in Alfama. <ResponseCaret />
      </p>
    </Response>
  )
  const response = container.querySelector(".mb-response") as HTMLElement
  expect(response.className).toBe("mb-response mine")
  expect(response.hasAttribute("data-streaming")).toBe(true)
  expect(response.getAttribute("aria-busy")).toBe("true")
  expect(screen.getByRole("heading", { name: "Day one" })).toBeTruthy()
  const caret = container.querySelector(".mb-response-caret") as HTMLElement
  expect(caret.getAttribute("aria-hidden")).toBe("true")
})

test("a finished reply isn't busy", () => {
  const { container } = render(<Response>Done.</Response>)
  const response = container.querySelector(".mb-response") as HTMLElement
  expect(response.hasAttribute("data-streaming")).toBe(false)
  expect(response.hasAttribute("aria-busy")).toBe(false)
})
