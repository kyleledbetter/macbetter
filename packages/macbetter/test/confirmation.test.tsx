import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as React from "react"
import { expect, test } from "vitest"
import { Button } from "../src/components/button"
import {
  Confirmation,
  ConfirmationActions,
  ConfirmationDescription,
  ConfirmationIcon,
  ConfirmationTitle,
} from "../src/components/confirmation"

function Example() {
  const [state, setState] = React.useState<"pending" | "allowed" | "denied">("pending")
  return (
    <Confirmation state={state} outcome={state === "allowed" ? "Allowed once" : undefined}>
      <ConfirmationIcon>C</ConfirmationIcon>
      <ConfirmationTitle>Allow Calendar to create an event?</ConfirmationTitle>
      <ConfirmationDescription>Design review, Thursday at 10:00 AM.</ConfirmationDescription>
      <ConfirmationActions>
        <Button onClick={() => setState("denied")}>Deny</Button>
        <Button variant="filled" onClick={() => setState("allowed")}>
          Allow once
        </Button>
      </ConfirmationActions>
    </Confirmation>
  )
}

test("is a group named by its title, with its parts classed", () => {
  render(<Example />)
  const group = screen.getByRole("group", { name: "Allow Calendar to create an event?" })
  expect(group.className).toBe("mb-confirmation")
  expect(group.dataset.state).toBe("pending")
  expect(group.querySelector(".mb-confirmation-icon")?.getAttribute("aria-hidden")).toBe("true")
  expect(group.querySelector(".mb-confirmation-actions")).not.toBeNull()
})

test("answering from the keyboard folds it to one line and keeps focus in it", async () => {
  const user = userEvent.setup()
  render(<Example />)
  screen.getByRole("button", { name: "Allow once" }).focus()
  await user.keyboard("{Enter}")
  const group = screen.getByRole("group", { name: "Allowed once" })
  expect(group.dataset.state).toBe("allowed")
  expect(screen.queryByRole("button")).toBeNull()
  expect(document.activeElement).toBe(group)
})

test("a denial says Denied by default", async () => {
  const user = userEvent.setup()
  render(<Example />)
  await user.click(screen.getByRole("button", { name: "Deny" }))
  expect(screen.getByRole("group", { name: "Denied" }).dataset.state).toBe("denied")
})
