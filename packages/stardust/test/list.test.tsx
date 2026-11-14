import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import {
  List,
  ListRow,
  ListRowAccessory,
  ListRowIcon,
  ListRowSubtitle,
  ListRowTitle,
  ListRowValue,
  ListSection,
} from "../src/components/list"
import { Switch } from "../src/components/switch"

test("lays out a Settings section with Stardust's classes", () => {
  const { container } = render(
    <List variant="grouped" className="mine">
      <ListSection header="Connectivity" footer="Wi-Fi joins known networks automatically.">
        <ListRow href="#wi-fi">
          <ListRowIcon color="blue">W</ListRowIcon>
          <ListRowTitle>Wi-Fi</ListRowTitle>
          <ListRowSubtitle>Secure network</ListRowSubtitle>
          <ListRowValue>Dreambase HQ</ListRowValue>
          <ListRowAccessory type="disclosure" />
        </ListRow>
      </ListSection>
    </List>
  )

  const list = container.firstElementChild as HTMLElement
  expect(list.className).toBe("sd-list mine")
  expect(list.dataset.variant).toBe("grouped")
  expect(screen.getByText("Connectivity").className).toBe("sd-list-section-header")
  expect(screen.getByText("Wi-Fi joins known networks automatically.").className).toBe("sd-list-section-footer")

  const icon = container.querySelector(".sd-list-row-icon") as HTMLElement
  expect(icon.dataset.color).toBe("blue")
  expect(icon.getAttribute("aria-hidden")).toBe("true")
  const chevron = container.querySelector(".sd-list-row-accessory") as HTMLElement
  expect(chevron.dataset.type).toBe("disclosure")
  expect(chevron.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true")
})

test("a row is a link with href, a button with onClick and static otherwise", async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()
  render(
    <List>
      <ListSection>
        <ListRow href="#bluetooth">
          <ListRowTitle>Bluetooth</ListRowTitle>
          <ListRowValue>On</ListRowValue>
        </ListRow>
        <ListRow onClick={onClick}>
          <ListRowTitle>Sign Out</ListRowTitle>
        </ListRow>
        <ListRow>
          <ListRowTitle>Airplane Mode</ListRowTitle>
          <ListRowAccessory>
            <Switch aria-label="Airplane Mode" />
          </ListRowAccessory>
        </ListRow>
      </ListSection>
    </List>
  )

  const link = screen.getByRole("link", { name: "Bluetooth On" })
  expect(link.getAttribute("href")).toBe("#bluetooth")
  expect(link.className).toBe("sd-list-row")
  expect(link.hasAttribute("data-interactive")).toBe(true)

  const button = screen.getByRole("button", { name: "Sign Out" })
  button.focus()
  await user.keyboard("{Enter}")
  await user.click(button)
  expect(onClick).toHaveBeenCalledTimes(2)

  const toggle = screen.getByRole("switch", { name: "Airplane Mode" })
  const staticRow = toggle.closest(".sd-list-row") as HTMLElement
  expect(staticRow.tagName).toBe("DIV")
  expect(staticRow.hasAttribute("data-interactive")).toBe(false)
  await user.click(toggle)
  expect(toggle.getAttribute("aria-checked")).toBe("true")
})

test("a disabled button row ignores presses", async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()
  render(
    <List>
      <ListSection>
        <ListRow disabled onClick={onClick}>
          <ListRowTitle>Erase iPhone</ListRowTitle>
        </ListRow>
      </ListSection>
    </List>
  )
  await user.click(screen.getByRole("button", { name: "Erase iPhone" }))
  expect(onClick).not.toHaveBeenCalled()
})
