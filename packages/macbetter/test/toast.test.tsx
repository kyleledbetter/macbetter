import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { createToaster, Toaster } from "../src/components/toast"

test("shows a notification with its icon, title, time and description", async () => {
  const notify = createToaster()
  render(<Toaster toaster={notify} />)

  act(() => {
    notify.success("Export complete", { description: "Q3 Roadmap.pdf is in Downloads.", data: { time: "2m ago" } })
  })

  const region = await screen.findByRole("region", { name: "Notifications" })
  expect(region.className).toContain("mb-toaster")
  expect(region.dataset.side).toBe("top")
  const item = region.querySelector(".mb-toast")
  expect(item?.getAttribute("data-type")).toBe("success")
  expect(item?.querySelector(".mb-toast-icon")?.getAttribute("data-type")).toBe("success")
  expect(item?.querySelector(".mb-toast-title")?.textContent).toBe("Export complete")
  expect(item?.querySelector(".mb-toast-time")?.textContent).toBe("2m ago")
  expect(item?.querySelector(".mb-toast-description")?.textContent).toBe("Q3 Roadmap.pdf is in Downloads.")
  act(() => notify.dismiss())
})

test("sits at the top right on the Mac and centered on iPhone", async () => {
  const mac = createToaster()
  const phone = createToaster()
  render(
    <>
      <div data-platform="macos">
        <Toaster toaster={mac} aria-label="Mac" />
      </div>
      <div data-platform="ios">
        <Toaster toaster={phone} aria-label="Phone" />
      </div>
    </>
  )
  act(() => {
    mac("Hollis Grant")
    phone("Kofi Mensah")
  })

  expect((await screen.findByRole("region", { name: "Mac" })).dataset.align).toBe("end")
  expect((await screen.findByRole("region", { name: "Phone" })).dataset.align).toBe("center")
  act(() => {
    mac.dismiss()
    phone.dismiss()
  })
})

test("its action runs and the close button dismisses it from the keyboard", async () => {
  const user = userEvent.setup()
  const notify = createToaster()
  let undone = false
  render(<Toaster toaster={notify} />)
  act(() => {
    notify("Message archived", { action: { label: "Undo", onAction: () => void (undone = true) }, duration: Infinity })
  })

  await user.click(await screen.findByRole("button", { name: "Undo" }))
  expect(undone).toBe(true)

  act(() => {
    notify("Message restored", { duration: Infinity })
  })
  const close = await screen.findByRole("button", { name: "Close" })
  close.focus()
  await user.keyboard("{Enter}")
  await new Promise((resolve) => setTimeout(resolve, 20))
  expect(screen.queryByText("Message restored")).toBeNull()
})

test("inside a nested platform preview, it treats the preview as its screen", async () => {
  const phone = createToaster()
  render(
    <div data-platform="ios">
      <Toaster toaster={phone} aria-label="Phone" />
    </div>
  )
  act(() => {
    phone("Kofi Mensah")
  })
  const region = await screen.findByRole("region", { name: "Phone" })
  expect(region.style.getPropertyValue("--mb-toaster-top")).toBe("0px")
  expect(region.style.getPropertyValue("--mb-toaster-screen-width")).not.toBe("")
  act(() => phone.dismiss())
})
