import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { Button, ButtonSpinner } from "../src/components/button"

test("runs its action from a click and from the keyboard", async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()
  render(<Button onClick={onClick}>Save</Button>)

  const button = screen.getByRole("button", { name: "Save" })
  await user.click(button)
  button.focus()
  await user.keyboard("{Enter}")
  await user.keyboard(" ")

  expect(onClick).toHaveBeenCalledTimes(3)
  expect(button.getAttribute("aria-disabled")).toBeNull()
})

test("carries its variant, tone, size and shape for the stylesheet", () => {
  render(
    <Button variant="filled" tone="destructive" size="lg" shape="capsule" block>
      Delete
    </Button>
  )

  const button = screen.getByRole("button", { name: "Delete" })
  expect(button.className).toContain("sd-button")
  expect(button.dataset.variant).toBe("filled")
  expect(button.dataset.tone).toBe("destructive")
  expect(button.dataset.size).toBe("lg")
  expect(button.dataset.shape).toBe("capsule")
  expect(button.hasAttribute("data-block")).toBe(true)
})

test("keeps a caller's class, as a string or a function of state", () => {
  render(
    <>
      <Button className="mine">One</Button>
      <Button className={() => "computed"}>Two</Button>
    </>
  )

  expect(screen.getByRole("button", { name: "One" }).className).toBe("sd-button mine")
  expect(screen.getByRole("button", { name: "Two" }).className).toBe("sd-button computed")
})

test("a disabled button ignores presses", async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()
  render(
    <Button disabled onClick={onClick}>
      Save
    </Button>
  )

  await user.click(screen.getByRole("button", { name: "Save" }))
  expect(onClick).not.toHaveBeenCalled()
})

test("the spinner is hidden from assistive tech and keeps turning under Reduce Motion", () => {
  const { container } = render(
    <Button>
      <ButtonSpinner className="mine" />
      Sync Now
    </Button>
  )

  const spinner = container.querySelector(".sd-button-spinner") as HTMLElement
  expect(spinner.className).toBe("sd-button-spinner mine")
  expect(spinner.getAttribute("aria-hidden")).toBe("true")
  expect(spinner.dataset.show).toBe("pending")
  expect(spinner.dataset.motion).toBe("essential")
})
