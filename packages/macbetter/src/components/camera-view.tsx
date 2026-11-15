"use client"

import { Button as ButtonPrimitive } from "@ui-sdk/react/button"
import * as React from "react"
import { cx, join } from "../lib/cx"
import { ActivityIndicator } from "./activity-indicator"
import { Artwork, type ArtworkPalette, type ArtworkProps } from "./artwork"

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
  /** The picture: a `<video>`, an `<img>` of the latest snapshot, or any element. Without it, an abstract placeholder seeded by `name`. */
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
        {children ?? <CameraPlaceholder name={name} room={room} />}
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

const placeholderPalettes: ArtworkPalette[] = ["slate", "water", "amber", "night", "forest"]

/** Stands in for a camera's picture when there's none: dim, out of focus, and the same for the same camera. Decorative. */
function CameraPlaceholder({ name, room }: { name?: React.ReactNode; room?: React.ReactNode }) {
  const seed = [name, room].filter((part) => typeof part === "string" || typeof part === "number").join(" ") || "Camera"
  let sum = 0
  for (let i = 0; i < seed.length; i++) sum = (Math.imul(sum, 31) + seed.charCodeAt(i)) >>> 0
  sum = Math.imul(sum ^ (sum >>> 15), 0x85ebca6b) >>> 0
  sum = (sum ^ (sum >>> 12)) >>> 0
  return (
    <Artwork
      seed={seed}
      variant="lens"
      palette={placeholderPalettes[sum % placeholderPalettes.length]}
      aspect={16 / 9}
      shape="square"
      className="mb-camera-view-placeholder"
    />
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

type CameraSceneProps = Omit<ArtworkProps, "seed" | "variant" | "time"> & {
  /** Seeds the picture. The names are kept from the drawn scenes this replaced. */
  variant?: "porch" | "driveway" | "kitchen" | "backyard"
  /** `night` drains the color, like the gray infrared picture a camera switches to in the dark. */
  time?: "day" | "night"
}

const scenePalettes: Record<NonNullable<CameraSceneProps["variant"]>, ArtworkPalette> = {
  porch: "amber",
  driveway: "slate",
  kitchen: "water",
  backyard: "forest",
}

/**
 * @deprecated Leave a camera's `children` out to get its placeholder, or pass your own picture. This now draws
 * the same abstract placeholder, seeded by `variant`, instead of an illustrated place.
 */
function CameraScene({ variant = "porch", time = "day", className, ...props }: CameraSceneProps) {
  return (
    <Artwork
      seed={variant}
      variant="lens"
      palette={scenePalettes[variant]}
      time={time}
      aspect={16 / 9}
      shape="square"
      className={join("mb-camera-scene", className)}
      {...props}
    />
  )
}

export { CameraScene, CameraTile, CameraView }
export type { CameraSceneProps, CameraState, CameraTileProps, CameraViewProps }
