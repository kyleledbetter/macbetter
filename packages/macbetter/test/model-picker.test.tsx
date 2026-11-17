import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { ModelPicker } from "../src/components/model-picker"

const models = [
  { value: "atlas-4", label: "Atlas 4", description: "Best for complex work" },
  { value: "atlas-4-mini", label: "Atlas 4 Mini", description: "Fastest for everyday tasks" },
]
const efforts = [
  { value: "low", label: "Low" },
  { value: "high", label: "High" },
]

test("the trigger shows the model and effort, and the menu changes both", async () => {
  const user = userEvent.setup()
  const onValueChange = vi.fn()
  const onEffortChange = vi.fn()
  render(
    <ModelPicker
      models={models}
      efforts={efforts}
      defaultEffort="high"
      onValueChange={onValueChange}
      onEffortChange={onEffortChange}
    />
  )

  const trigger = screen.getByRole("button", { name: /Atlas 4/ })
  expect(trigger.className).toContain("mb-model-picker")
  expect(trigger.dataset.variant).toBe("plain")
  expect(trigger.textContent).toContain("High")

  await user.click(trigger)
  const mini = screen.getByRole("menuitemradio", { name: /Atlas 4 Mini/ })
  expect(mini.textContent).toContain("Fastest for everyday tasks")
  expect(screen.getByRole("menuitemradio", { name: /Best for complex work/ }).getAttribute("aria-checked")).toBe("true")
  expect(screen.getByRole("group", { name: "Effort" })).toBeTruthy()

  await user.click(screen.getByRole("menuitemradio", { name: "Low" }))
  expect(onEffortChange).toHaveBeenCalledWith("low")
  expect(screen.getByRole("menu")).toBeTruthy()

  await user.click(mini)
  expect(onValueChange).toHaveBeenCalledWith("atlas-4-mini")
  await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  expect(trigger.textContent).toContain("Atlas 4 Mini")
  expect(trigger.textContent).toContain("Low")
})

test("opens from the keyboard and closes with Escape, and a controlled value wins", async () => {
  const user = userEvent.setup()
  const onValueChange = vi.fn()
  render(<ModelPicker models={models} value="atlas-4" onValueChange={onValueChange} />)

  const trigger = screen.getByRole("button", { name: "Atlas 4" })
  trigger.focus()
  await user.keyboard("{Enter}")
  expect(screen.getByRole("menu")).toBeTruthy()
  await user.keyboard("{ArrowDown}{Enter}")
  expect(onValueChange).toHaveBeenCalledWith("atlas-4-mini")
  await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  expect(trigger.textContent).toBe("Atlas 4")
  expect(document.activeElement).toBe(trigger)
})
