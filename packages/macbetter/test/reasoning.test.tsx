import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { formatDuration, Reasoning, ReasoningContent, ReasoningTrigger } from "../src/components/reasoning"

test("formats durations the way people say them", () => {
  expect(formatDuration(12)).toBe("12s")
  expect(formatDuration(121)).toBe("2m 1s")
  expect(formatDuration(180)).toBe("3m")
  expect(formatDuration(3720)).toBe("1h 2m")
})

test("shimmers Thinking while running, then says how long it took", () => {
  const { rerender, container } = render(
    <Reasoning state="running" duration={121}>
      <ReasoningTrigger />
      <ReasoningContent>Checked the calendar.</ReasoningContent>
    </Reasoning>
  )
  const root = container.firstElementChild as HTMLElement
  expect(root.className).toBe("mb-reasoning")
  expect(root.dataset.state).toBe("running")
  expect(root.getAttribute("aria-busy")).toBe("true")
  const trigger = screen.getByRole("button", { name: "Thinking…" })
  expect(trigger.className).toBe("mb-reasoning-trigger")
  expect(trigger.querySelector(".mb-shimmer")?.hasAttribute("data-active")).toBe(true)
  expect(trigger.querySelector(".mb-reasoning-chevron")).not.toBeNull()

  rerender(
    <Reasoning state="done" duration={121}>
      <ReasoningTrigger />
      <ReasoningContent>Checked the calendar.</ReasoningContent>
    </Reasoning>
  )
  const done = screen.getByRole("button", { name: "Thought for 2m 1s" })
  expect(done.querySelector(".mb-shimmer")?.hasAttribute("data-active")).toBe(false)
  expect(root.hasAttribute("aria-busy")).toBe(false)
})

test("opens from the keyboard and shows the reasoning behind a hairline", async () => {
  const user = userEvent.setup()
  render(
    <Reasoning duration={12}>
      <ReasoningTrigger>Worked for 12s</ReasoningTrigger>
      <ReasoningContent>Compared three routes.</ReasoningContent>
    </Reasoning>
  )
  const trigger = screen.getByRole("button", { name: "Worked for 12s" })
  expect(trigger.getAttribute("aria-expanded")).toBe("false")
  trigger.focus()
  await user.keyboard("{Enter}")
  expect(trigger.getAttribute("aria-expanded")).toBe("true")
  expect(screen.getByText("Compared three routes.").className).toBe("mb-reasoning-content")
  await user.keyboard(" ")
  expect(trigger.getAttribute("aria-expanded")).toBe("false")
})

test("autoCollapse opens while running and closes when done", () => {
  const view = (state: "running" | "done") => (
    <Reasoning state={state} autoCollapse>
      <ReasoningTrigger />
      <ReasoningContent>Reading the brief.</ReasoningContent>
    </Reasoning>
  )
  const { rerender } = render(view("running"))
  expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true")
  rerender(view("done"))
  expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false")
})
