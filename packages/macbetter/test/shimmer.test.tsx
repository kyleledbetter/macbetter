import { render, screen } from "@testing-library/react"
import { expect, test } from "vitest"
import { Shimmer } from "../src/components/shimmer"

test("is plain text that carries its active state and duration", () => {
  render(
    <Shimmer duration={1.5} className="mine">
      Thinking…
    </Shimmer>
  )
  const text = screen.getByText("Thinking…")
  expect(text.tagName).toBe("SPAN")
  expect(text.className).toBe("mb-shimmer mine")
  expect(text.hasAttribute("data-active")).toBe(true)
  expect(text.style.getPropertyValue("--mb-shimmer-duration")).toBe("1.5s")
  // It stops under Reduce Motion, so it must not opt out of the reset.
  expect(text.dataset.motion).toBeUndefined()
})

test("inactive shimmer is plain secondary text; render changes the element", () => {
  render(
    <Shimmer active={false} render={<p />} duration="800ms">
      Searched the web
    </Shimmer>
  )
  const text = screen.getByText("Searched the web")
  expect(text.tagName).toBe("P")
  expect(text.hasAttribute("data-active")).toBe(false)
  expect(text.style.getPropertyValue("--mb-shimmer-duration")).toBe("800ms")
})
