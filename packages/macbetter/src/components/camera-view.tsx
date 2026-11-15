"use client"

import { Button as ButtonPrimitive } from "@ui-sdk/react/button"
import * as React from "react"
import { cx, join } from "../lib/cx"
import { ActivityIndicator } from "./activity-indicator"

type CameraState = "streaming" | "snapshot" | "connecting" | "offline"

type CameraFrameOptions = {
  name?: React.ReactNode
  room?: React.ReactNode
  /** Shows the Live badge while the stream plays. */
  live?: boolean
  /** When the picture was taken, already formatted: "9:41 AM". */
  timestamp?: string
  state?: CameraState
  /** What `offline` says, in the page's language. */
  offlineLabel?: string
  liveLabel?: string
  /** The picture. Defaults to a drawn porch. */
  children?: React.ReactNode
}

type CameraViewProps = Omit<React.ComponentProps<"figure">, "children"> &
  CameraFrameOptions & {
    /** Buttons along the bottom edge: talk, mute, full screen. Show a microphone only if the camera has a speaker. */
    controls?: React.ReactNode
  }

function frameParts(
  { name, room, live, timestamp, state = "streaming", offlineLabel = "Camera not available", liveLabel = "Live", children }: CameraFrameOptions,
  Tag: "div" | "span"
) {
  const showLive = live && state === "streaming"
  return (
    <>
      <Tag className="mb-camera-view-frame" aria-hidden={state === "offline" ? true : undefined}>
        {children ?? <CameraScene />}
      </Tag>
      {name || room ? (
        <Tag className="mb-camera-view-caption">
          {name ? <Tag className="mb-camera-view-name">{name}</Tag> : null}
          {room ? <Tag className="mb-camera-view-room">{room}</Tag> : null}
        </Tag>
      ) : null}
      {showLive || timestamp || state === "connecting" ? (
        <Tag className="mb-camera-view-badges">
          {state === "connecting" ? (
            <ActivityIndicator size="sm" aria-label="Connecting" className="mb-camera-view-spinner" />
          ) : null}
          {timestamp && !showLive ? <Tag className="mb-camera-view-time">{timestamp}</Tag> : null}
          {showLive ? (
            <Tag className="mb-camera-view-live">
              <Tag className="mb-camera-view-live-dot" aria-hidden="true" />
              {liveLabel}
            </Tag>
          ) : null}
        </Tag>
      ) : null}
      {state === "offline" ? <Tag className="mb-camera-view-offline">{offlineLabel}</Tag> : null}
    </>
  )
}

/** A camera's picture: the live stream or its most recent snapshot, with its name and state in the corners. */
function CameraView({
  name,
  room,
  live,
  timestamp,
  state = "streaming",
  offlineLabel,
  liveLabel,
  controls,
  className,
  children,
  ...props
}: CameraViewProps) {
  return (
    <figure data-state={state} className={join("mb-camera-view", className)} {...props}>
      {frameParts({ name, room, live, timestamp, state, offlineLabel, liveLabel, children }, "div")}
      {controls ? <div className="mb-camera-view-controls">{controls}</div> : null}
    </figure>
  )
}

type CameraTileProps = Omit<React.ComponentProps<typeof ButtonPrimitive>, "children"> & CameraFrameOptions

/** A camera in the Home tab's Cameras row. Pressing it opens the camera. */
function CameraTile({
  name,
  room,
  live,
  timestamp,
  state = "streaming",
  offlineLabel,
  liveLabel,
  className,
  children,
  ...props
}: CameraTileProps) {
  return (
    <ButtonPrimitive data-state={state} className={cx("mb-camera-view mb-camera-tile", className)} {...props}>
      {frameParts({ name, room, live, timestamp, state, offlineLabel, liveLabel, children }, "span")}
    </ButtonPrimitive>
  )
}

type CameraSceneProps = Omit<React.ComponentProps<"svg">, "children"> & {
  variant?: "porch" | "driveway" | "kitchen" | "backyard"
  /** `night` is the gray infrared picture a camera switches to in the dark. */
  time?: "day" | "night"
}

/** A drawn stand-in for a camera's picture, so a page needs no video or photos. Decorative. */
function CameraScene({ variant = "porch", time = "day", className, ...props }: CameraSceneProps) {
  const id = React.useId().replace(/:/g, "")
  return (
    <svg
      viewBox="0 0 160 90"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      data-variant={variant}
      data-time={time}
      className={join("mb-camera-scene", className)}
      {...props}
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="oklch(0.82 0.06 230)" />
          <stop offset="1" stopColor="oklch(0.93 0.03 90)" />
        </linearGradient>
        <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="oklch(1 0 0 / 0.16)" />
          <stop offset="1" stopColor="oklch(0 0 0 / 0.22)" />
        </linearGradient>
        <radialGradient id={`${id}-lens`} cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.6" stopColor="oklch(0 0 0 / 0)" />
          <stop offset="1" stopColor="oklch(0 0 0 / 0.38)" />
        </radialGradient>
      </defs>
      {variant === "porch" ? <Porch id={id} /> : null}
      {variant === "driveway" ? <Driveway id={id} /> : null}
      {variant === "kitchen" ? <Kitchen /> : null}
      {variant === "backyard" ? <Backyard id={id} /> : null}
      <rect width="160" height="90" fill={`url(#${id}-shade)`} />
      <rect width="160" height="90" fill={`url(#${id}-lens)`} />
    </svg>
  )
}

function Porch({ id }: { id: string }) {
  return (
    <>
      <rect width="160" height="90" fill="oklch(0.74 0.05 60)" />
      <rect x="0" y="0" width="160" height="14" fill={`url(#${id}-sky)`} />
      {/* Siding */}
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x="0" y={14 + i * 6} width="160" height="0.6" fill="oklch(0.6 0.04 60)" />
      ))}
      {/* Door and frame */}
      <rect x="62" y="16" width="36" height="58" rx="1" fill="oklch(0.93 0.01 90)" />
      <rect x="66" y="20" width="28" height="54" fill="oklch(0.42 0.09 30)" />
      <rect x="69" y="24" width="10" height="20" rx="0.8" fill="oklch(0.36 0.08 30)" />
      <rect x="81" y="24" width="10" height="20" rx="0.8" fill="oklch(0.36 0.08 30)" />
      <rect x="69" y="48" width="22" height="22" rx="0.8" fill="oklch(0.36 0.08 30)" />
      <circle cx="90" cy="47" r="1.3" fill="oklch(0.85 0.1 85)" />
      {/* Lamp */}
      <rect x="104" y="28" width="5" height="8" rx="1" fill="oklch(0.3 0.01 60)" />
      <rect x="105" y="30" width="3" height="5" fill="oklch(0.95 0.1 90)" />
      {/* Step and mat */}
      <rect x="0" y="74" width="160" height="16" fill="oklch(0.62 0.02 60)" />
      <rect x="50" y="74" width="60" height="5" fill="oklch(0.7 0.02 60)" />
      <rect x="68" y="80" width="24" height="6" rx="1" fill="oklch(0.45 0.05 50)" />
      {/* Planter */}
      <rect x="22" y="58" width="14" height="16" rx="1.5" fill="oklch(0.48 0.04 40)" />
      <circle cx="25" cy="54" r="6" fill="oklch(0.55 0.12 145)" />
      <circle cx="33" cy="52" r="7" fill="oklch(0.5 0.12 150)" />
      <circle cx="29" cy="47" r="6" fill="oklch(0.6 0.13 140)" />
      {/* A parcel by the door */}
      <rect x="104" y="64" width="16" height="11" fill="oklch(0.66 0.08 70)" />
      <rect x="104" y="64" width="16" height="2" fill="oklch(0.58 0.08 70)" />
      <rect x="111" y="64" width="2" height="11" fill="oklch(0.82 0.03 80)" />
    </>
  )
}

function Driveway({ id }: { id: string }) {
  return (
    <>
      <rect width="160" height="90" fill={`url(#${id}-sky)`} />
      <rect x="0" y="40" width="160" height="50" fill="oklch(0.6 0.1 140)" />
      {/* House and garage door */}
      <rect x="18" y="14" width="112" height="44" fill="oklch(0.86 0.02 80)" />
      <path d="M12 16 74 2l62 14Z" fill="oklch(0.42 0.02 40)" />
      <rect x="30" y="24" width="56" height="34" fill="oklch(0.95 0.005 90)" />
      {Array.from({ length: 4 }, (_, i) => (
        <rect key={i} x="30" y={24 + i * 8.5} width="56" height="0.8" fill="oklch(0.8 0.01 90)" />
      ))}
      <rect x="96" y="26" width="22" height="16" fill="oklch(0.5 0.05 230)" />
      <rect x="106.5" y="26" width="1" height="16" fill="oklch(0.9 0 0)" />
      {/* Driveway */}
      <path d="M30 58h56l30 32H0Z" fill="oklch(0.68 0.01 80)" />
      {/* Car */}
      <rect x="40" y="62" width="44" height="14" rx="5" fill="oklch(0.45 0.12 255)" />
      <path d="M48 62l6-7h20l6 7Z" fill="oklch(0.4 0.1 255)" />
      <path d="M55 61l3.5-4.5h7V61Z M67 61v-4.5h6l3.5 4.5Z" fill="oklch(0.75 0.04 230)" />
      <circle cx="50" cy="76" r="4" fill="oklch(0.2 0 0)" />
      <circle cx="74" cy="76" r="4" fill="oklch(0.2 0 0)" />
    </>
  )
}

function Kitchen() {
  return (
    <>
      <rect width="160" height="90" fill="oklch(0.9 0.015 80)" />
      {/* Window over the sink */}
      <rect x="58" y="10" width="44" height="28" fill="oklch(0.82 0.07 220)" />
      <rect x="79" y="10" width="2" height="28" fill="oklch(0.97 0 0)" />
      <rect x="56" y="8" width="48" height="32" fill="none" stroke="oklch(0.97 0 0)" strokeWidth="2" />
      {/* Upper cabinets */}
      <rect x="4" y="8" width="46" height="26" rx="1" fill="oklch(0.62 0.05 160)" />
      <rect x="110" y="8" width="46" height="26" rx="1" fill="oklch(0.62 0.05 160)" />
      <rect x="27" y="8" width="0.8" height="26" fill="oklch(0.5 0.05 160)" />
      <rect x="133" y="8" width="0.8" height="26" fill="oklch(0.5 0.05 160)" />
      {/* Pendant lights */}
      <rect x="38" y="0" width="0.8" height="14" fill="oklch(0.3 0 0)" />
      <path d="M33 14h11l-2 5h-7Z" fill="oklch(0.3 0 0)" />
      <rect x="121" y="0" width="0.8" height="14" fill="oklch(0.3 0 0)" />
      <path d="M116 14h11l-2 5h-7Z" fill="oklch(0.3 0 0)" />
      {/* Counter, sink and faucet */}
      <rect x="0" y="50" width="160" height="5" fill="oklch(0.96 0.005 90)" />
      <rect x="0" y="55" width="160" height="35" fill="oklch(0.62 0.05 160)" />
      {Array.from({ length: 5 }, (_, i) => (
        <rect key={i} x={i * 32 + 31} y="55" width="0.8" height="35" fill="oklch(0.5 0.05 160)" />
      ))}
      <rect x="66" y="49" width="28" height="3" rx="1" fill="oklch(0.75 0.01 250)" />
      <path d="M80 50V40q0-4 5-4h2" fill="none" stroke="oklch(0.7 0.01 250)" strokeWidth="1.8" strokeLinecap="round" />
      {/* Kettle and fruit */}
      <path d="M118 50l2-9h10l2 9Z" fill="oklch(0.55 0.15 25)" />
      <circle cx="30" cy="47" r="3" fill="oklch(0.72 0.17 60)" />
      <circle cx="36" cy="47.5" r="2.6" fill="oklch(0.68 0.18 40)" />
    </>
  )
}

function Backyard({ id }: { id: string }) {
  return (
    <>
      <rect width="160" height="90" fill={`url(#${id}-sky)`} />
      <rect x="0" y="48" width="160" height="42" fill="oklch(0.62 0.13 140)" />
      {/* Fence */}
      {Array.from({ length: 17 }, (_, i) => (
        <path key={i} d={`M${i * 10 - 1} 50V31l4.5-3 4.5 3v19Z`} fill="oklch(0.8 0.04 70)" />
      ))}
      <rect x="0" y="36" width="160" height="2" fill="oklch(0.72 0.04 70)" />
      {/* Tree */}
      <rect x="120" y="30" width="5" height="22" fill="oklch(0.45 0.05 50)" />
      <circle cx="122" cy="22" r="14" fill="oklch(0.52 0.12 145)" />
      <circle cx="112" cy="28" r="9" fill="oklch(0.56 0.13 140)" />
      {/* Patio and table */}
      <path d="M0 70h70l20 20H0Z" fill="oklch(0.72 0.02 60)" />
      <ellipse cx="34" cy="68" rx="14" ry="3" fill="oklch(0.35 0.02 60)" />
      <rect x="33" y="68" width="2" height="10" fill="oklch(0.35 0.02 60)" />
    </>
  )
}

export { CameraScene, CameraTile, CameraView }
export type { CameraSceneProps, CameraState, CameraTileProps, CameraViewProps }
