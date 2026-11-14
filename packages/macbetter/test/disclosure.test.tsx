import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import {
  Disclosure,
  DisclosureButton,
  DisclosureContent,
  DisclosureGroup,
  DisclosureHeader,
  DisclosureItem,
  DisclosurePanel,
  DisclosureTrigger,
} from "../src/components/disclosure"

function Group() {
  return (
    <DisclosureGroup variant="plain" defaultValue={["backup"]}>
      <DisclosureItem value="backup">
        <DisclosureHeader>
          <DisclosureTrigger>iCloud Backup</DisclosureTrigger>
        </DisclosureHeader>
        <DisclosurePanel>Backs up every night.</DisclosurePanel>
      </DisclosureItem>
      <DisclosureItem value="relay">
        <DisclosureHeader>
          <DisclosureTrigger>Private Relay</DisclosureTrigger>
        </DisclosureHeader>
        <DisclosurePanel>Hides your IP address.</DisclosurePanel>
      </DisclosureItem>
    </DisclosureGroup>
  )
}

test("a group's triggers carry a chevron and open one panel at a time from the keyboard", async () => {
  const user = userEvent.setup()
  const { container } = render(<Group />)

  const group = container.firstElementChild as HTMLElement
  expect(group.className).toBe("mb-disclosure-group")
  expect(group.dataset.variant).toBe("plain")

  const backup = screen.getByRole("button", { name: "iCloud Backup" })
  const relay = screen.getByRole("button", { name: "Private Relay" })
  expect(backup.className).toBe("mb-disclosure-trigger")
  expect(backup.querySelector("svg.mb-disclosure-chevron")?.getAttribute("aria-hidden")).toBe("true")
  expect(backup.closest("h3")?.className).toBe("mb-disclosure-header")
  expect(backup.getAttribute("aria-expanded")).toBe("true")
  expect(screen.getByText("Backs up every night.").className).toBe("mb-disclosure-content")

  relay.focus()
  await user.keyboard("{Enter}")
  expect(relay.getAttribute("aria-expanded")).toBe("true")
  expect(relay.hasAttribute("data-open")).toBe(true)
  expect(backup.getAttribute("aria-expanded")).toBe("false")
})

test("a single disclosure opens with Space", async () => {
  const user = userEvent.setup()
  const { container } = render(
    <Disclosure variant="grouped">
      <DisclosureButton>Advanced</DisclosureButton>
      <DisclosureContent>Use hardware acceleration</DisclosureContent>
    </Disclosure>
  )

  expect((container.firstElementChild as HTMLElement).dataset.variant).toBe("grouped")
  const button = screen.getByRole("button", { name: "Advanced" })
  expect(button.getAttribute("aria-expanded")).toBe("false")
  button.focus()
  await user.keyboard(" ")
  expect(button.getAttribute("aria-expanded")).toBe("true")
  expect(screen.getByText("Use hardware acceleration").className).toBe("mb-disclosure-content")
})
