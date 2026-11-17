import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { Suggestion, Suggestions } from "../src/components/suggestion"

test("a list of suggestions sends each one's text, or its value, from a click or the keyboard", async () => {
  const user = userEvent.setup()
  const onSelect = vi.fn()
  const { container } = render(
    <Suggestions aria-label="Suggestions" onSelect={onSelect}>
      <Suggestion icon={<svg />}>Plan a weekend in Lisbon</Suggestion>
      <Suggestion value="Summarize the attached report in five bullet points">Summarize a report</Suggestion>
    </Suggestions>
  )

  const group = screen.getByRole("group", { name: "Suggestions" })
  expect(group.className).toBe("mb-suggestions")
  expect(group.dataset.layout).toBe("list")
  await user.click(screen.getByRole("button", { name: "Plan a weekend in Lisbon" }))
  expect(onSelect).toHaveBeenLastCalledWith("Plan a weekend in Lisbon")
  await user.tab()
  await user.keyboard("{Enter}")
  expect(onSelect).toHaveBeenLastCalledWith("Summarize the attached report in five bullet points")
  expect(container.querySelector(".mb-suggestion-icon")?.getAttribute("aria-hidden")).toBe("true")
})

test("chips carry their layout and overflow, and a caller's onClick can stop the select", async () => {
  const user = userEvent.setup()
  const onSelect = vi.fn()
  render(
    <Suggestions aria-label="Ideas" layout="chips" overflow="scroll" onSelect={onSelect}>
      <Suggestion className="mine" onClick={(event) => event.preventDefault()}>
        Write a toast
      </Suggestion>
    </Suggestions>
  )
  const group = screen.getByRole("group", { name: "Ideas" })
  expect(group.dataset.layout).toBe("chips")
  expect(group.dataset.overflow).toBe("scroll")
  const chip = screen.getByRole("button", { name: "Write a toast" })
  expect(chip.className).toBe("mb-suggestion mine")
  await user.click(chip)
  expect(onSelect).not.toHaveBeenCalled()
})
