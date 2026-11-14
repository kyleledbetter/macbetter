import type * as React from "react"
import { join } from "../lib/cx"

type DeviceFrameProps = React.ComponentProps<"div"> & {
  device?: "iphone" | "ipad"
  /** The iPad's orientation. iPhone frames are portrait. */
  orientation?: "portrait" | "landscape"
  /** The status bar's clock. */
  time?: string
  /** The date beside the clock on iPad. */
  date?: string
  /** Shows the status bar's time, signal, Wi-Fi and battery. */
  statusBar?: boolean
  homeIndicator?: boolean
  /** Scales the whole device, for fitting a phone into a column. 1 is actual size in points. */
  scale?: number
}

function DeviceFrame({
  device = "iphone",
  orientation = device === "ipad" ? "landscape" : "portrait",
  time = "9:41",
  date = "Mon Jun 9",
  statusBar = true,
  homeIndicator = true,
  scale,
  className,
  style,
  children,
  ...props
}: DeviceFrameProps) {
  const platform = device === "ipad" ? "ipados" : "ios"
  return (
    <div
      data-device={device}
      data-orientation={orientation}
      className={join("sd-device-frame", className)}
      style={scale ? ({ "--sd-device-scale": scale, ...style } as React.CSSProperties) : style}
      {...props}
    >
      <div data-platform={platform} data-stardust="" className="sd-device-frame-screen">
        {children}
        {statusBar ? (
          <div aria-hidden="true" className="sd-device-frame-status-bar">
            <span className="sd-device-frame-time">{time}</span>
            {device === "ipad" ? <span className="sd-device-frame-date">{date}</span> : null}
            <span className="sd-device-frame-indicators">
              <SignalIcon />
              <WifiIcon />
              <BatteryIcon />
            </span>
          </div>
        ) : null}
        {device === "iphone" ? <div aria-hidden="true" className="sd-device-frame-island" /> : null}
        {homeIndicator ? <div aria-hidden="true" className="sd-device-frame-home-indicator" /> : null}
      </div>
    </div>
  )
}

function SignalIcon() {
  return (
    <svg viewBox="0 0 18 12" className="sd-device-frame-icon" data-icon="signal">
      <rect x="0" y="7.5" width="3" height="4.5" rx="0.9" />
      <rect x="5" y="5" width="3" height="7" rx="0.9" />
      <rect x="10" y="2.5" width="3" height="9.5" rx="0.9" />
      <rect x="15" y="0" width="3" height="12" rx="0.9" />
    </svg>
  )
}

function WifiIcon() {
  return (
    <svg viewBox="0 0 16 12" className="sd-device-frame-icon" data-icon="wifi">
      <path d="M8 2.3c2.3 0 4.4.9 6 2.4l1.2-1.2A10.2 10.2 0 0 0 8 .6C5.2.6 2.6 1.7.8 3.5L2 4.7a8.5 8.5 0 0 1 6-2.4z" />
      <path d="M8 5.7c1.4 0 2.6.5 3.6 1.4l1.2-1.2A6.9 6.9 0 0 0 8 4c-1.8 0-3.5.7-4.8 1.9l1.2 1.2c1-.9 2.2-1.4 3.6-1.4z" />
      <path d="M8 9.1c.5 0 .9.2 1.2.5L8 11.4 6.8 9.6c.3-.3.7-.5 1.2-.5z" />
      <path d="M8 7.4c.9 0 1.7.3 2.4.9L9.2 9.5A1.8 1.8 0 0 0 8 9.1c-.5 0-.9.2-1.2.4L5.6 8.3A3.6 3.6 0 0 1 8 7.4z" />
    </svg>
  )
}

function BatteryIcon() {
  return (
    <svg viewBox="0 0 27 13" className="sd-device-frame-icon" data-icon="battery">
      <rect x="0.5" y="0.5" width="23" height="12" rx="3.8" fill="none" stroke="currentColor" opacity="0.4" />
      <rect x="2" y="2" width="20" height="9" rx="2.5" />
      <path d="M25 4.5v4c.8-.3 1.4-1.1 1.4-2s-.6-1.7-1.4-2z" opacity="0.45" />
    </svg>
  )
}

export { DeviceFrame }
export type { DeviceFrameProps }
