import { render } from "@testing-library/react"
import { expect, test } from "vitest"
import { DeviceFrame } from "../src/components/device-frame"

test("an iPhone nests the iOS platform and hides its hardware from assistive technology", () => {
  const { container } = render(
    <DeviceFrame time="10:24" scale={0.5}>
      <main>Inbox</main>
    </DeviceFrame>
  )

  const frame = container.querySelector(".sd-device-frame") as HTMLElement
  expect(frame.dataset.device).toBe("iphone")
  expect(frame.style.getPropertyValue("--sd-device-scale")).toBe("0.5")
  const screen = frame.querySelector(".sd-device-frame-screen") as HTMLElement
  expect(screen.dataset.platform).toBe("ios")
  expect(screen.querySelector("main")?.textContent).toBe("Inbox")
  expect(frame.querySelector(".sd-device-frame-status-bar")?.getAttribute("aria-hidden")).toBe("true")
  expect(frame.querySelector(".sd-device-frame-time")?.textContent).toBe("10:24")
  expect(frame.querySelector(".sd-device-frame-island")).not.toBeNull()
  expect(frame.querySelector(".sd-device-frame-home-indicator")).not.toBeNull()
})

test("an iPad nests iPadOS, shows the date and has no island", () => {
  const { container } = render(<DeviceFrame device="ipad" date="Tue Mar 3" homeIndicator={false} />)
  const frame = container.querySelector(".sd-device-frame") as HTMLElement
  expect(frame.dataset.orientation).toBe("landscape")
  expect((frame.querySelector(".sd-device-frame-screen") as HTMLElement).dataset.platform).toBe("ipados")
  expect(frame.querySelector(".sd-device-frame-date")?.textContent).toBe("Tue Mar 3")
  expect(frame.querySelector(".sd-device-frame-island")).toBeNull()
  expect(frame.querySelector(".sd-device-frame-home-indicator")).toBeNull()
})

test("merges the caller's class and style with the scale", () => {
  const { container } = render(<DeviceFrame className="preview" scale={0.8} style={{ margin: 4 }} aria-label="Mail on iPhone" role="group" />)
  const frame = container.querySelector(".sd-device-frame") as HTMLElement
  expect(frame.className).toBe("sd-device-frame preview")
  expect(frame.style.margin).toBe("4px")
  expect(frame.style.getPropertyValue("--sd-device-scale")).toBe("0.8")
  expect(frame.getAttribute("aria-label")).toBe("Mail on iPhone")
})
